package com.stms.service;

import com.stms.model.Course;

import java.util.List;

public interface CourseService {

    /** 查询全部课程 */
    List<Course> getAllCourses();

    /** 新增课程 */
    void addCourse(Course course);
}
