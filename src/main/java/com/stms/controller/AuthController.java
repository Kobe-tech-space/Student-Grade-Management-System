package com.stms.controller;

import com.stms.common.Result;
import com.stms.dto.LoginRequest;
import com.stms.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 认证控制器
 * 处理用户登录和身份验证相关请求
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 用户登录
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> data = userService.login(request);
        return Result.ok("登录成功", data);
    }

    /**
     * 获取当前登录用户信息
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public Result<Map<String, Object>> currentUser(HttpServletRequest request) {
        Map<String, Object> userInfo = Map.of(
                "username", request.getAttribute("username"),
                "role", request.getAttribute("role"),
                "userId", request.getAttribute("userId")
        );
        return Result.ok(userInfo);
    }
}
