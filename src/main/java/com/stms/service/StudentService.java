package com.stms.service;

import com.stms.common.PageResult;
import com.stms.model.Student;

import java.util.List;

public interface StudentService {

    /**
     * 分页查询学生列表，支持姓名/学号模糊搜索
     */
    PageResult<Student> getStudentPage(int pageNum, int pageSize, String keyword);

    /** 查询全部学生（用于下拉选择） */
    List<Student> getAllStudents();

    /** 根据 ID 查询学生 */
    Student getStudentById(Integer id);

    /** 新增学生 */
    void addStudent(Student student);

    /** 修改学生信息 */
    void updateStudent(Integer id, Student student);

    /** 删除学生（同时删除关联成绩） */
    void deleteStudent(Integer id);
}
