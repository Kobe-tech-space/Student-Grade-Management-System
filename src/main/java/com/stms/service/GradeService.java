package com.stms.service;

import com.stms.common.PageResult;
import com.stms.dto.RankingItem;
import com.stms.model.Grade;

import java.util.List;

public interface GradeService {

    /**
     * 分页查询成绩，支持按课程、关键词筛选
     * 学生角色只能查询自己的成绩
     */
    PageResult<Grade> getGradePage(int pageNum, int pageSize,
                                   Integer courseId, String keyword, Integer studentId);

    /** 录入新成绩 */
    void addGrade(Grade grade);

    /** 修改成绩 */
    void updateGrade(Integer id, Grade grade);

    /** 删除成绩 */
    void deleteGrade(Integer id);

    /**
     * 成绩排名统计
     * 如指定 courseId 则按该课程排名，否则按全部课程汇总排名
     * 排名按平均分降序
     */
    List<RankingItem> getRanking(Integer courseId);
}
