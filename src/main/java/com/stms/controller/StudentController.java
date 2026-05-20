package com.stms.controller;

import com.stms.common.PageResult;
import com.stms.common.Result;
import com.stms.mapper.StudentMapper;
import com.stms.model.Student;
import com.stms.service.StudentService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * 学生管理控制器
 * 处理学生信息的增删改查，仅管理员可操作
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final StudentMapper studentMapper;

    public StudentController(StudentService studentService, StudentMapper studentMapper) {
        this.studentService = studentService;
        this.studentMapper = studentMapper;
    }

    /**
     * 分页查询学生列表（支持搜索）
     * GET /api/students?pageNum=1&pageSize=10&keyword=张三
     */
    @GetMapping
    public Result<PageResult<Student>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            HttpServletRequest request) {
        // 权限检查：仅管理员可查看全部学生
        checkAdmin(request);
        PageResult<Student> page = studentService.getStudentPage(pageNum, pageSize, keyword);
        return Result.ok(page);
    }

    /**
     * 查询全部学生（不分页，用于下拉选择）
     * GET /api/students/all
     */
    @GetMapping("/all")
    public Result<List<Student>> all(HttpServletRequest request) {
        checkAdmin(request);
        List<Student> students = studentService.getAllStudents();
        return Result.ok(students);
    }

    /** 根据 ID 获取学生详情 */
    @GetMapping("/{id}")
    public Result<Student> getById(@PathVariable Integer id, HttpServletRequest request) {
        checkAdmin(request);
        Student student = studentService.getStudentById(id);
        return Result.ok(student);
    }

    /** 获取下一学号 */
    @GetMapping("/nextNo")
    public Result<String> nextNo(HttpServletRequest request) {
        checkAdmin(request);
        String maxNo = studentMapper.selectMaxStudentNo();
        int nextNo = 1;
        if (maxNo != null && !maxNo.isEmpty()) {
            nextNo = Integer.parseInt(maxNo) + 1;
        }
        if (nextNo < 2024001) nextNo = 2024001;
        return Result.ok(String.valueOf(nextNo));
    }

    /** 新增学生 */
    @PostMapping
    public Result<Void> add(@RequestBody Student student, HttpServletRequest request) {
        checkAdmin(request);
        studentService.addStudent(student);
        return Result.ok("新增成功", null);
    }

    /** 修改学生信息 */
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Student student,
                                HttpServletRequest request) {
        checkAdmin(request);
        studentService.updateStudent(id, student);
        return Result.ok("修改成功", null);
    }

    /** 删除学生 */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id, HttpServletRequest request) {
        checkAdmin(request);
        studentService.deleteStudent(id);
        return Result.ok("删除成功", null);
    }

    /** 获取自己的学生信息 */
    @GetMapping("/profile")
    public Result<Student> getProfile(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        Student student = studentMapper.selectByUserId(userId);
        return Result.ok(student);
    }

    /**
     * 学生自助修改个人信息：电话、邮箱、密码
     * PUT /api/students/profile
     */
    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestBody Map<String, String> profile,
                                       HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        studentService.updateProfile(userId, profile);
        return Result.ok("修改成功", null);
    }

    private void checkAdmin(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("无权限，仅管理员可操作");
        }
    }
}
