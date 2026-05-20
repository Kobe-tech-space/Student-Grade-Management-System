package com.stms.common;

import java.util.List;

/**
 * 分页查询结果封装
 * @param <T> 数据列表的元素类型
 */
public class PageResult<T> {

    /** 总记录数 */
    private long total;

    /** 当前页数据列表 */
    private List<T> records;

    /** 当前页码 */
    private int pageNum;

    /** 每页大小 */
    private int pageSize;

    public PageResult() {}

    public PageResult(long total, List<T> records, int pageNum, int pageSize) {
        this.total = total;
        this.records = records;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    // Getters & Setters
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    public List<T> getRecords() { return records; }
    public void setRecords(List<T> records) { this.records = records; }
    public int getPageNum() { return pageNum; }
    public void setPageNum(int pageNum) { this.pageNum = pageNum; }
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
}
