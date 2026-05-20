package com.stms.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stms.common.Result;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JWT 认证过滤器
 * 拦截所有 /api/** 请求，验证 Token 有效性
 * 白名单路径直接放行（登录接口等）
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** 需要认证的路径前缀（只有 /api/ 开头的请求需要认证） */
    private static final String AUTH_PATH_PREFIX = "/api/";

    /** 认证白名单（/api/ 下的例外） */
    private static final String[] WHITE_LIST = {
            "/api/auth/login"
    };

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 非 /api/ 路径（静态资源等）直接放行
        if (!path.startsWith(AUTH_PATH_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        // 检查是否在 API 白名单中
        for (String white : WHITE_LIST) {
            if (path.startsWith(white)) {
                chain.doFilter(request, response);
                return;
            }
        }

        // 提取 Authorization 头中的 Token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeError(response, 401, "未登录或 Token 已过期");
            return;
        }

        String token = authHeader.substring(7);

        // 验证 Token
        if (!jwtUtil.validateToken(token)) {
            writeError(response, 401, "Token 无效或已过期");
            return;
        }

        // 将用户信息存入 request attribute，供后续 Controller 使用
        request.setAttribute("userId", jwtUtil.getUserId(token));
        request.setAttribute("role", jwtUtil.getRole(token));
        request.setAttribute("username", jwtUtil.getUsername(token));

        chain.doFilter(request, response);
    }

    /** 返回 JSON 格式的认证错误 */
    private void writeError(HttpServletResponse response, int code, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(Result.error(code, message)));
    }
}
