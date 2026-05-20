# 学生成绩管理系统

## 项目简介

一个**企业级学生成绩管理系统**，采用现代后台管理设计语言，支持学生信息管理、成绩录入与查询、排名统计、数据可视化分析等功能。

### 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 2.7 + Maven |
| 持久层 | MyBatis |
| 数据库 | MySQL 8.4 |
| 认证 | JWT（JSON Web Token） |
| 前端 | Vue 3 + Element Plus + ECharts |
| 图标 | Font Awesome 6 |

### 功能模块

- **用户认证**：JWT 登录，管理员/学生角色权限分离
- **仪表盘**：KPI 统计卡片、成绩趋势图、分数分布饼图、Top 10 排名
- **学生管理**：CRUD 操作、分页浏览、模糊搜索、学号/姓名/班级筛选
- **成绩录入**：学生+课程双选、分数滑块联动、考试日期选择
- **成绩查询**：多条件筛选、分数可视化进度条、分页展示
- **排名统计**：Top 3 领奖台、单科/综合排名、平均分/总分/科目数
- **主题切换**：亮色/暗色双模式，一键切换，偏好持久化
- **数据可视化**：ECharts 柱状图 + 饼图，支持亮暗主题

---

## 快速启动

### 前置条件

- Java 17+
- MySQL 8.4（已安装并运行）
- Maven 3.9+

### 第一步：启动 MySQL

```powershell
net start MySQL84
```

### 第二步：初始化数据库

连接 MySQL 并执行建库脚本：

```powershell
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" --default-character-set=utf8mb4 -u root -p < src\main\resources\sql\init.sql
```

输入你的 MySQL root 密码后回车。

### 第三步：配置数据库连接

编辑 `src\main\resources\application.yml`，修改数据库密码：

```yaml
spring:
  datasource:
    username: root
    password: 你的MySQL密码
```

### 第四步：启动应用

```powershell
cd D:\STMS
mvn spring-boot:run
```

看到以下输出即启动成功：

```
========================================
  学生成绩管理系统启动成功！
  访问地址: http://localhost:8080
========================================
```

### 第五步：打开浏览器

访问 **http://localhost:8080**

---

## 测试账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | `admin123` | 管理员 | 全部功能可用 |
| `zhangsan` | `123456` | 学生 | 仅可查看本人成绩和排名 |
| `lisi` | `123456` | 学生 | 仅可查看本人成绩和排名 |
| `wangwu` | `123456` | 学生 | 仅可查看本人成绩和排名 |

---

## 项目结构

```
D:\STMS\
├── pom.xml                              # Maven 项目配置
├── README.md
├── .gitignore
├── CLAUDE.md                            # 项目开发规范
├── src/
│   ├── main/
│   │   ├── java/com/stms/
│   │   │   ├── StmsApplication.java     # 启动入口
│   │   │   ├── common/                  # Result、PageResult、异常处理
│   │   │   ├── config/                  # CORS 跨域、数据初始化
│   │   │   ├── security/                # JWT 工具、认证过滤器
│   │   │   ├── model/                   # 实体类
│   │   │   ├── dto/                     # 数据传输对象
│   │   │   ├── mapper/                  # MyBatis Mapper 接口
│   │   │   ├── service/                 # 业务逻辑
│   │   │   └── controller/              # REST 控制器
│   │   └── resources/
│   │       ├── application.yml          # 应用配置
│   │       ├── mapper/                  # MyBatis XML 映射
│   │       ├── sql/init.sql             # 建库建表+初始数据
│   │       └── static/                  # 前端
│   │           ├── index.html           # SPA 入口
│   │           ├── css/style.css        # 全局样式（双主题）
│   │           └── js/
│   │               ├── api.js           # API 请求封装
│   │               └── app.js           # Vue 应用逻辑
│   └── test/                            # 测试代码
└── target/                              # 编译输出（已 gitignore）
```

## API 接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/auth/login` | 用户登录 | 公开 |
| GET | `/api/students` | 学生列表（分页+搜索） | ADMIN |
| POST | `/api/students` | 新增学生 | ADMIN |
| PUT | `/api/students/{id}` | 修改学生 | ADMIN |
| DELETE | `/api/students/{id}` | 删除学生 | ADMIN |
| GET | `/api/courses` | 课程列表 | 登录用户 |
| POST | `/api/courses` | 新增课程 | ADMIN |
| GET | `/api/grades` | 成绩列表（分页+筛选） | 登录用户 |
| GET | `/api/grades/stats` | Dashboard 统计 | 登录用户 |
| POST | `/api/grades` | 录入成绩 | ADMIN |
| PUT | `/api/grades/{id}` | 修改成绩 | ADMIN |
| DELETE | `/api/grades/{id}` | 删除成绩 | ADMIN |
| GET | `/api/grades/ranking` | 排名统计 | 登录用户 |

## 数据库表

| 表名 | 说明 |
|------|------|
| `t_user` | 用户表（登录账号+角色） |
| `t_student` | 学生表（学号、姓名、班级、联系方式） |
| `t_course` | 课程表（课程编号、名称、学分、教师） |
| `t_grade` | 成绩表（关联学生和课程，唯一约束） |
