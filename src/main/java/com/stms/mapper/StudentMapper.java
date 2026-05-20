package com.stms.mapper;

import com.stms.model.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {

    /** 分页查询学生列表，支持姓名/学号模糊搜索 */
    List<Student> selectPage(@Param("offset") int offset,
                             @Param("pageSize") int pageSize,
                             @Param("keyword") String keyword);

    /** 统计学生总数 */
    long count(@Param("keyword") String keyword);

    /** 查询全部学生（用于下拉选择） */
    List<Student> selectAll();

    /** 根据 ID 查询 */
    Student selectById(@Param("id") Integer id);

    /** 新增学生 */
    int insert(Student student);

    /** 修改学生 */
    int update(Student student);

    /** 删除学生（同时删除关联成绩） */
    int deleteById(@Param("id") Integer id);

    /** 根据用户 ID 查询对应的学生记录 */
    Student selectByUserId(@Param("userId") Integer userId);

    String selectMaxStudentNo();

    int updateUserId(Student student);
}
