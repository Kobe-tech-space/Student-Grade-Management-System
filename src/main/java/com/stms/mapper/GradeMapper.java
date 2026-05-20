package com.stms.mapper;

import com.stms.dto.RankingItem;
import com.stms.model.Grade;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface GradeMapper {

    /**
     * 分页查询成绩列表（联表查询学生名、课程名）
     */
    List<Grade> selectPage(@Param("offset") int offset,
                           @Param("pageSize") int pageSize,
                           @Param("courseId") Integer courseId,
                           @Param("keyword") String keyword,
                           @Param("studentId") Integer studentId);

    /** 统计成绩总数 */
    long count(@Param("courseId") Integer courseId,
               @Param("keyword") String keyword,
               @Param("studentId") Integer studentId);

    /** 根据 ID 查询 */
    Grade selectById(@Param("id") Integer id);

    /** 新增成绩 */
    int insert(Grade grade);

    /** 修改成绩 */
    int update(Grade grade);

    /** 删除成绩 */
    int deleteById(@Param("id") Integer id);

    /**
     * 排名统计 - 按课程筛选
     * 计算每个学生的平均分、总分、考试门数，按平均分降序排列
     */
    List<RankingItem> rankingByCourse(@Param("courseId") Integer courseId);

    /** 排名统计 - 全部课程汇总 */
    List<RankingItem> rankingAll();
}
