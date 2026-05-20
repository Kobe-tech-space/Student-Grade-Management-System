package com.stms.service.impl;

import com.stms.common.PageResult;
import com.stms.dto.DashboardStats;
import com.stms.dto.RankingItem;
import com.stms.mapper.GradeMapper;
import com.stms.model.Grade;
import com.stms.service.GradeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    /**
     * 获取 Dashboard 所需全部真实统计数据
     * 包括：平均分、最高/最低分、及格率、分数分布、近 5 次考试趋势
     */
    @Override
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setAvgScore(gradeMapper.overallAvgScore());
        stats.setHighestScore(gradeMapper.highestScore());
        stats.setLowestScore(gradeMapper.lowestScore());
        stats.setPassRate(gradeMapper.passRate());

        // 分数分布 — MyBatis 返回 BigDecimal，需转整数
        Map<String, Object> distMap = gradeMapper.scoreDistribution();
        DashboardStats.ScoreDistribution dist = new DashboardStats.ScoreDistribution();
        dist.setExcellent(toInt(distMap.get("excellent")));
        dist.setGood(toInt(distMap.get("good")));
        dist.setPass(toInt(distMap.get("pass")));
        dist.setFail(toInt(distMap.get("fail")));
        stats.setDistribution(dist);

        // 考试趋势（反转顺序使时间线从早到晚）
        List<Map<String, Object>> rawTrend = gradeMapper.examTrend();
        List<DashboardStats.ExamTrend> trendList = new ArrayList<>();
        if (rawTrend != null) {
            for (int i = rawTrend.size() - 1; i >= 0; i--) {
                Map<String, Object> row = rawTrend.get(i);
                DashboardStats.ExamTrend et = new DashboardStats.ExamTrend();
                et.setExamName(String.valueOf(row.get("examName")));
                et.setAvgScore(new java.math.BigDecimal(String.valueOf(row.get("avgScore"))));
                trendList.add(et);
            }
        }
        stats.setTrend(trendList);

        return stats;
    }

    /** BigDecimal → int 安全转换 */
    private int toInt(Object val) {
        if (val == null) return 0;
        if (val instanceof Number) return ((Number) val).intValue();
        return Integer.parseInt(val.toString());
    }
}
