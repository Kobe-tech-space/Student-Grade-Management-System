package com.stms.service;

import com.stms.dto.LoginRequest;

import java.util.Map;

public interface UserService {

    /**
     * 用户登录
     * 验证用户名和密码，验证通过后返回 JWT Token 和用户信息
     * @param request 登录请求（用户名 + 密码）
     * @return 包含 token 和 userInfo 的 Map
     */
    Map<String, Object> login(LoginRequest request);
}
