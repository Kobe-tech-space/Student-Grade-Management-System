package com.stms.config;

import com.stms.mapper.UserMapper;
import com.stms.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 * 应用启动时自动检查并更新用户密码为正确的 BCrypt 加密值
 * 确保测试账号可以正常登录
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataInitializer(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void run(String... args) {
        // 重置管理员密码
        resetPassword("admin", "admin123");
        // 重置学生密码
        resetPassword("zhangsan", "123456");
        resetPassword("lisi", "123456");
        resetPassword("wangwu", "123456");

        System.out.println("测试账号密码已初始化完成：");
        System.out.println("  管理员: admin / admin123");
        System.out.println("  学生:   zhangsan / 123456");
        System.out.println("  学生:   lisi / 123456");
        System.out.println("  学生:   wangwu / 123456");
        System.out.println("========================================");
    }

    /**
     * 重置指定用户的密码为 BCrypt 加密后的新密码
     */
    private void resetPassword(String username, String newPassword) {
        User user = userMapper.selectByUsername(username);
        if (user != null) {
            String encodedPassword = encoder.encode(newPassword);
            // 直接更新密码，这里复用 update 方法
            // 此处通过 XML 不提供 update 方法，简化处理：
            // 更新密码为正确的 BCrypt 值
            user.setPassword(encodedPassword);
            userMapper.updatePassword(user);
        }
    }
}
