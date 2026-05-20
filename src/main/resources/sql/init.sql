-- =====================================================
-- 学生成绩管理系统 - 数据库初始化脚本
-- MySQL 8.4
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS stms_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE stms_db;

-- =====================================================
-- 1. 用户表
-- =====================================================
DROP TABLE IF EXISTS t_grade;
DROP TABLE IF EXISTS t_student;
DROP TABLE IF EXISTS t_course;
DROP TABLE IF EXISTS t_user;

CREATE TABLE t_user (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' COMMENT '角色：ADMIN-管理员，STUDENT-学生',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- =====================================================
-- 2. 学生表
-- =====================================================
CREATE TABLE t_student (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '学生ID',
    student_no VARCHAR(20) NOT NULL COMMENT '学号',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender VARCHAR(10) DEFAULT '男' COMMENT '性别',
    class_name VARCHAR(100) COMMENT '班级',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '电子邮箱',
    user_id INT COMMENT '关联用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_student_no (student_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';

-- =====================================================
-- 3. 课程表
-- =====================================================
CREATE TABLE t_course (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '课程ID',
    course_no VARCHAR(20) NOT NULL COMMENT '课程编号',
    course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
    credit DECIMAL(3,1) DEFAULT 0 COMMENT '学分',
    teacher VARCHAR(50) COMMENT '授课教师',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_course_no (course_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- =====================================================
-- 4. 成绩表
-- =====================================================
CREATE TABLE t_grade (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '成绩ID',
    student_id INT NOT NULL COMMENT '学生ID',
    course_id INT NOT NULL COMMENT '课程ID',
    score DECIMAL(5,1) NOT NULL COMMENT '分数',
    exam_date DATE COMMENT '考试日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_student_course (student_id, course_id),
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成绩表';

-- =====================================================
-- 初始数据：用户
-- 密码均为 BCrypt 加密后的 "123456"
-- =====================================================
-- BCrypt($2a$10$...) 对应明文: admin123 / 123456
INSERT INTO t_user (username, password, real_name, role) VALUES
('admin',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 'ADMIN'),
('zhangsan', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '张三', 'STUDENT'),
('lisi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '李四', 'STUDENT'),
('wangwu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '王五', 'STUDENT');

-- =====================================================
-- 初始数据：课程
-- =====================================================
INSERT INTO t_course (course_no, course_name, credit, teacher) VALUES
('C001', '高等数学', 5.0, '赵老师'),
('C002', '大学英语', 4.0, '钱老师'),
('C003', 'Java程序设计', 4.0, '孙老师'),
('C004', '数据结构', 4.0, '李老师'),
('C005', '数据库原理', 3.0, '周老师');

-- =====================================================
-- 初始数据：学生（20名）
-- =====================================================
INSERT INTO t_student (student_no, name, gender, class_name, phone, email) VALUES
('2024001', '张三', '男', '计算机科学2024-1班', '13800001001', 'zhangsan@stu.edu.cn'),
('2024002', '李四', '女', '计算机科学2024-1班', '13800001002', 'lisi@stu.edu.cn'),
('2024003', '王五', '男', '计算机科学2024-1班', '13800001003', 'wangwu@stu.edu.cn'),
('2024004', '赵六', '女', '计算机科学2024-2班', '13800001004', 'zhaoliu@stu.edu.cn'),
('2024005', '孙七', '男', '计算机科学2024-2班', '13800001005', 'sunqi@stu.edu.cn'),
('2024006', '周八', '女', '软件工程2024-1班', '13800001006', 'zhouba@stu.edu.cn'),
('2024007', '吴九', '男', '软件工程2024-1班', '13800001007', 'wujiu@stu.edu.cn'),
('2024008', '郑十', '女', '软件工程2024-2班', '13800001008', 'zhengshi@stu.edu.cn'),
('2024009', '陈一', '男', '软件工程2024-2班', '13800001009', 'chenyi@stu.edu.cn'),
('2024010', '林二', '女', '数据科学2024-1班', '13800001010', 'liner@stu.edu.cn'),
('2024011', '黄三', '男', '数据科学2024-1班', '13800001011', 'huangsan@stu.edu.cn'),
('2024012', '杨四', '女', '数据科学2024-2班', '13800001012', 'yangsi@stu.edu.cn'),
('2024013', '刘五', '男', '人工智能2024-1班', '13800001013', 'liuwu@stu.edu.cn'),
('2024014', '马六', '女', '人工智能2024-1班', '13800001014', 'maliu@stu.edu.cn'),
('2024015', '朱七', '男', '人工智能2024-2班', '13800001015', 'zhuqi@stu.edu.cn'),
('2024016', '胡八', '女', '网络工程2024-1班', '13800001016', 'huba@stu.edu.cn'),
('2024017', '何九', '男', '网络工程2024-1班', '13800001017', 'hejiu@stu.edu.cn'),
('2024018', '高十', '女', '网络工程2024-2班', '13800001018', 'gaoshi@stu.edu.cn'),
('2024019', '罗一', '男', '信息安全2024-1班', '13800001019', 'luoyi@stu.edu.cn'),
('2024020', '梁二', '女', '信息安全2024-1班', '13800001020', 'lianger@stu.edu.cn');

-- =====================================================
-- 初始数据：成绩（部分示例）
-- =====================================================
INSERT INTO t_grade (student_id, course_id, score, exam_date) VALUES
(1, 1, 85.5, '2024-06-15'),
(1, 2, 78.0, '2024-06-16'),
(1, 3, 92.0, '2024-06-17'),
(2, 1, 90.0, '2024-06-15'),
(2, 2, 88.5, '2024-06-16'),
(2, 3, 76.0, '2024-06-17'),
(3, 1, 65.0, '2024-06-15'),
(3, 2, 72.5, '2024-06-16'),
(3, 3, 80.0, '2024-06-17'),
(4, 1, 95.0, '2024-06-15'),
(4, 2, 82.0, '2024-06-16'),
(4, 4, 88.0, '2024-06-18'),
(5, 1, 70.0, '2024-06-15'),
(5, 3, 85.0, '2024-06-17'),
(5, 5, 91.0, '2024-06-19'),
(6, 2, 88.0, '2024-06-16'),
(6, 4, 79.0, '2024-06-18'),
(6, 5, 83.0, '2024-06-19'),
(7, 1, 62.0, '2024-06-15'),
(7, 3, 75.0, '2024-06-17'),
(8, 2, 93.0, '2024-06-16'),
(8, 4, 86.0, '2024-06-18'),
(9, 1, 77.0, '2024-06-15'),
(9, 5, 89.0, '2024-06-19'),
(10, 3, 94.0, '2024-06-17'),
(10, 4, 81.0, '2024-06-18');
