package com.stms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 学生成绩管理系统 - Spring Boot 启动类
 */
@SpringBootApplication
public class StmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(StmsApplication.class, args);
        System.out.println("========================================");
        System.out.println("  学生成绩管理系统启动成功！");
        System.out.println("  访问地址: http://localhost:8080");
        System.out.println("========================================");
    }
}
