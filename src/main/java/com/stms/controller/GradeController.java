package com.stms.controller;

import com.stms.common.PageResult;
import com.stms.common.Result;
import com.stms.dto.DashboardStats;
import com.stms.dto.RankingItem;
import com.stms.mapper.StudentMapper;
import com.stms.model.Grade;
import com.stms.model.Student;
import com.stms.service.GradeService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 成绩管理控制器
 * 处理成绩的录入、查询、修改、删除和排名统计
 */
@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;
    private final StudentMapper studentMapper;

    public GradeController(GradeService gradeService, StudentMapper studentMapper) {
        this.gradeService = gradeService;
        this.studentMapper = studentMapper;
    }

    /**
     * 分页查询成绩
     * 管理员可查看所有成绩，学生仅能查看自己的成绩
     */
    @GetMapping
    public Result<PageResult<Grade>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) String keyword,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Integer studentId = null;
        // 学生角色只能看自己的成绩：通过 userId 查找对应的 student 记录
        if ("STUDENT".equals(role)) {
            Integer userId = (Integer) request.getAttribute("userId");
            Student student = studentMapper.selectByUserId(userId);
            if (student != null) {
                studentId = student.getId();
            }
        }
        PageResult<Grade> page = gradeService.getGradePage(
                pageNum, pageSize, courseId, keyword, studentId);
        return Result.ok(page);
    }

    /** 录入成绩（仅管理员） */
    @PostMapping
    public Result<Void> add(@RequestBody Grade grade, HttpServletRequest request) {
        checkAdmin(request);
        gradeService.addGrade(grade);
        return Result.ok("录入成功", null);
    }

    /** 修改成绩（仅管理员） */
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Grade grade,
                                HttpServletRequest request) {
        checkAdmin(request);
        gradeService.updateGrade(id, grade);
        return Result.ok("修改成功", null);
    }

    /** 删除成绩（仅管理员） */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id, HttpServletRequest request) {
        checkAdmin(request);
        gradeService.deleteGrade(id);
        return Result.ok("删除成功", null);
    }

    /**
     * 成绩排名统计
     * 可选参数 courseId，指定则按单科排名，否则按全部科目平均分排名
     */
    @GetMapping("/ranking")
    public Result<List<RankingItem>> ranking(
            @RequestParam(required = false) Integer courseId) {
        List<RankingItem> ranking = gradeService.getRanking(courseId);
        return Result.ok(ranking);
    }

    /**
     * Dashboard 真实统计数据
     * GET /api/grades/stats
     */
    @GetMapping("/stats")
    public Result<DashboardStats> stats() {
        DashboardStats stats = gradeService.getDashboardStats();
        return Result.ok(stats);
    }

    private void checkAdmin(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("无权限，仅管理员可操作");
        }
    }
}
