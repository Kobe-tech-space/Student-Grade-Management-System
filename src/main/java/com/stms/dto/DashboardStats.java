package com.stms.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Dashboard 真实统计数据
 */
public class DashboardStats {

    /** 全校平均分 */
    private BigDecimal avgScore;

    /** 最高分 */
    private BigDecimal highestScore;

    /** 最低分 */
    private BigDecimal lowestScore;

    /** 及格率（百分比，如 85.0 表示 85%） */
    private BigDecimal passRate;

    /** 分数分布：优秀/良好/及格/不及格 各段人数 */
    private ScoreDistribution distribution;

    /** 近 5 次考试趋势 */
    private List<ExamTrend> trend;

    public static class ScoreDistribution {
        private int excellent;  // >= 90
        private int good;       // 80-89
        private int pass;       // 60-79
        private int fail;       // < 60

        public int getExcellent() { return excellent; }
        public void setExcellent(int excellent) { this.excellent = excellent; }
        public int getGood() { return good; }
        public void setGood(int good) { this.good = good; }
        public int getPass() { return pass; }
        public void setPass(int pass) { this.pass = pass; }
        public int getFail() { return fail; }
        public void setFail(int fail) { this.fail = fail; }
    }

    public static class ExamTrend {
        private String examName;
        private BigDecimal avgScore;

        public String getExamName() { return examName; }
        public void setExamName(String examName) { this.examName = examName; }
        public BigDecimal getAvgScore() { return avgScore; }
        public void setAvgScore(BigDecimal avgScore) { this.avgScore = avgScore; }
    }

    public BigDecimal getAvgScore() { return avgScore; }
    public void setAvgScore(BigDecimal avgScore) { this.avgScore = avgScore; }
    public BigDecimal getHighestScore() { return highestScore; }
    public void setHighestScore(BigDecimal highestScore) { this.highestScore = highestScore; }
    public BigDecimal getLowestScore() { return lowestScore; }
    public void setLowestScore(BigDecimal lowestScore) { this.lowestScore = lowestScore; }
    public BigDecimal getPassRate() { return passRate; }
    public void setPassRate(BigDecimal passRate) { this.passRate = passRate; }
    public ScoreDistribution getDistribution() { return distribution; }
    public void setDistribution(ScoreDistribution distribution) { this.distribution = distribution; }
    public List<ExamTrend> getTrend() { return trend; }
    public void setTrend(List<ExamTrend> trend) { this.trend = trend; }
}
