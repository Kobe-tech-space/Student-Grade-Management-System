package com.stms.service;

import com.stms.common.PageResult;
import com.stms.model.Student;

import java.util.List;
import java.util.Map;

public interface StudentService {

    PageResult<Student> getStudentPage(int pageNum, int pageSize, String keyword);
    List<Student> getAllStudents();
    Student getStudentById(Integer id);

    /** 新增学生（自动生成学号 + 创建登录账号） */
    void addStudent(Student student);

    void updateStudent(Integer id, Student student);
    void deleteStudent(Integer id);

    /** 学生自助修改：电话、邮箱、密码，传入 userId 用于改密码 */
    void updateProfile(Integer userId, Map<String, String> profile);
}
