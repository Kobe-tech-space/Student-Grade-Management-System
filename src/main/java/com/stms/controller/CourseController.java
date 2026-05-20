package com.stms.controller;

import com.stms.common.Result;
import com.stms.model.Course;
import com.stms.service.CourseService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 课程管理控制器
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /** 获取全部课程列表 */
    @GetMapping
    public Result<List<Course>> list() {
        return Result.ok(courseService.getAllCourses());
    }

    /** 新增课程（仅管理员） */
    @PostMapping
    public Result<Void> add(@RequestBody Course course, HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("无权限，仅管理员可操作");
        }
        courseService.addCourse(course);
        return Result.ok("新增成功", null);
    }
}
