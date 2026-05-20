package com.stms.service.impl;

import com.stms.common.PageResult;
import com.stms.mapper.StudentMapper;
import com.stms.model.Student;
import com.stms.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 学生管理业务逻辑实现
 */
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentMapper studentMapper;

    public StudentServiceImpl(StudentMapper studentMapper) {
        this.studentMapper = studentMapper;
    }

    /**
     * 分页查询学生列表
     * 计算 offset = (pageNum - 1) * pageSize，调用 Mapper 分页查询
     */
    @Override
    public PageResult<Student> getStudentPage(int pageNum, int pageSize, String keyword) {
        int offset = (pageNum - 1) * pageSize;
        List<Student> records = studentMapper.selectPage(offset, pageSize, keyword);
        long total = studentMapper.count(keyword);
        return new PageResult<>(total, records, pageNum, pageSize);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentMapper.selectAll();
    }

    @Override
    public Student getStudentById(Integer id) {
        return studentMapper.selectById(id);
    }

    @Override
    public void addStudent(Student student) {
        studentMapper.insert(student);
    }

    @Override
    public void updateStudent(Integer id, Student student) {
        student.setId(id);
        studentMapper.update(student);
    }

    /**
     * 删除学生及其所有关联成绩
     * Mapper XML 中使用了多条 DELETE 语句保证数据一致性
     */
    @Override
    @Transactional
    public void deleteStudent(Integer id) {
        studentMapper.deleteById(id);
    }
}
