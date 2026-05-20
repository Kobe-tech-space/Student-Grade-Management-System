package com.stms.service.impl;

import com.stms.common.PageResult;
import com.stms.dto.RankingItem;
import com.stms.mapper.GradeMapper;
import com.stms.model.Grade;
import com.stms.service.GradeService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 成绩管理业务逻辑实现
 */
@Service
public class GradeServiceImpl implements GradeService {

    private final GradeMapper gradeMapper;

    public GradeServiceImpl(GradeMapper gradeMapper) {
        this.gradeMapper = gradeMapper;
    }

    /**
     * 分页查询成绩列表
     * 支持按课程 ID、学生姓名关键词、指定学生 ID 三种筛选条件
     */
    @Override
    public PageResult<Grade> getGradePage(int pageNum, int pageSize,
                                          Integer courseId, String keyword, Integer studentId) {
        int offset = (pageNum - 1) * pageSize;
        List<Grade> records = gradeMapper.selectPage(offset, pageSize, courseId, keyword, studentId);
        long total = gradeMapper.count(courseId, keyword, studentId);
        return new PageResult<>(total, records, pageNum, pageSize);
    }

    @Override
    public void addGrade(Grade grade) {
        gradeMapper.insert(grade);
    }

    @Override
    public void updateGrade(Integer id, Grade grade) {
        grade.setId(id);
        gradeMapper.update(grade);
    }

    @Override
    public void deleteGrade(Integer id) {
        gradeMapper.deleteById(id);
    }

    /**
     * 获取成绩排名
     * 若指定课程 ID 则返回该课程的单科排名，
     * 否则返回全部课程的平均分排名
     */
    @Override
    public List<RankingItem> getRanking(Integer courseId) {
        if (courseId != null) {
            return gradeMapper.rankingByCourse(courseId);
        }
        return gradeMapper.rankingAll();
    }
}
