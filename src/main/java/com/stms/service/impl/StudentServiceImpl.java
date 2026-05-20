package com.stms.service.impl;

import com.stms.common.PageResult;
import com.stms.mapper.StudentMapper;
import com.stms.mapper.UserMapper;
import com.stms.model.Student;
import com.stms.model.User;
import com.stms.service.StudentService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentMapper studentMapper;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public StudentServiceImpl(StudentMapper studentMapper, UserMapper userMapper) {
        this.studentMapper = studentMapper;
        this.userMapper = userMapper;
    }

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

    /**
     * 新增学生，同时创建登录账号
     * 学号自动生成（现有最大学号 + 1），密码默认为 123456
     */
    @Override
    @Transactional
    public void addStudent(Student student) {
        // 自动生成学号
        String maxNo = studentMapper.selectMaxStudentNo();
        int nextNo = 1;
        if (maxNo != null && !maxNo.isEmpty()) {
            nextNo = Integer.parseInt(maxNo) + 1;
        }
        // 没有已有时从 2024001 起
        if (nextNo < 2024001) nextNo = 2024001;
        student.setStudentNo(String.valueOf(nextNo));

        // 插入学生记录
        studentMapper.insert(student);

        // 创建登录账号：用户名为学号，密码 123456
        User user = new User();
        user.setUsername(student.getStudentNo());
        user.setPassword(encoder.encode("123456"));
        user.setRealName(student.getName());
        userMapper.insert(user);

        // 关联 student.user_id
        student.setUserId(user.getId());
        // 更新关联
        studentMapper.updateUserId(student);
    }

    @Override
    public void updateStudent(Integer id, Student student) {
        student.setId(id);
        studentMapper.update(student);
    }

    @Override
    @Transactional
    public void deleteStudent(Integer id) {
        studentMapper.deleteById(id);
    }

    /**
     * 学生自助修改个人信息：仅允许电话、邮箱、密码
     */
    @Override
    @Transactional
    public void updateProfile(Integer userId, Map<String, String> profile) {
        Student student = studentMapper.selectByUserId(userId);
        if (student == null) return;

        // 更新电话和邮箱
        if (profile.containsKey("phone")) student.setPhone(profile.get("phone"));
        if (profile.containsKey("email")) student.setEmail(profile.get("email"));
        studentMapper.update(student);

        // 更新密码
        if (profile.containsKey("password") && profile.get("password") != null
                && !profile.get("password").isEmpty()) {
            User user = new User();
            user.setId(userId);
            user.setPassword(encoder.encode(profile.get("password")));
            userMapper.updatePassword(user);
        }
    }
}
