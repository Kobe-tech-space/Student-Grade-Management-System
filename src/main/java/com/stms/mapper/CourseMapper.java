package com.stms.mapper;

import com.stms.model.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CourseMapper {

    /** 查询全部课程 */
    List<Course> selectAll();

    /** 根据 ID 查询 */
    Course selectById(@Param("id") Integer id);

    /** 新增课程 */
    int insert(Course course);
}
