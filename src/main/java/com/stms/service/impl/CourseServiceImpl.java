package com.stms.service.impl;

import com.stms.mapper.CourseMapper;
import com.stms.model.Course;
import com.stms.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 课程管理业务逻辑实现
 */
@Service
public class CourseServiceImpl implements CourseService {

    private final CourseMapper courseMapper;

    public CourseServiceImpl(CourseMapper courseMapper) {
        this.courseMapper = courseMapper;
    }

    @Override
    public List<Course> getAllCourses() {
        return courseMapper.selectAll();
    }

    @Override
    public void addCourse(Course course) {
        courseMapper.insert(course);
    }
}
