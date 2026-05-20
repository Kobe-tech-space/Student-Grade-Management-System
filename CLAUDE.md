# Student Grade Management System

## Project Goal

开发一个：

```text
可运行、可演示、可部署
```

的学生成绩管理系统。

项目定位：

- 大学生学习项目
- Java 初学者项目
- 简历展示项目

---

# Technology Stack

后端：

- Java 21
- Spring Boot 3
- MyBatis
- Maven

数据库：

- MySQL 8.4

前端：

- Vue3 + Element Plus
或
- HTML + CSS + JavaScript

接口风格：

- RESTful API

---

# Global Development Principles

所有 Agent 必须遵守：

---

## Simplicity First

优先：

- 简单
- 易理解
- 易维护
- 易部署

禁止：

- 微服务
- Kubernetes
- Redis集群
- RabbitMQ
- 分布式架构

---

## Database First

任何功能开发前：

必须：

1. 先设计数据库
2. 再设计 API
3. 最后开发前端

禁止跳步骤。

---

## Small Step Development

必须：

一次只开发：

- 一个模块
或
- 一个功能

禁止：

一次生成整个项目。

---

## No Fake Code

禁止：

- 虚构依赖
- 虚构 API
- 虚构 Maven坐标
- 虚构数据库字段

如果不确定：

必须明确说明。

---

# Mandatory Workflow

所有任务必须严格按照：

```text
产品规划
→ UI设计
→ 后端开发
→ 前端开发
→ 测试验证
```

顺序执行。

禁止跳步骤。

---

# Mandatory File Reading Rules

任何 Agent 开始工作前：

必须先读取：

1. CLAUDE.md
2. 对应 agents/ 文件
禁止忽略规则文件。

---

# Agent System

项目包含以下 Agent：

---

## Product-Planning Agent

负责：

- 需求分析
- 模块规划
- 数据库设计
- API设计

必须读取：

```text
agents/product-agent.md
```

---

## UI Agent

负责：

- 页面布局
- UI设计
- 用户体验
- 响应式设计

必须读取：

```text
agents/ui-agent.md
```

---

## Engineer-Agent

负责：

- Spring Boot开发
- MySQL集成
- API实现
- 前端实现

必须读取：

```text
agents/engineer-agent.md
```

---

## Test-Agent

负责：

- 功能测试
- API测试
- Bug分析
- 安全测试

必须读取：

```text
agents/test-agent.md
```

---

# Output Rules

所有 Agent 输出时：

必须包含：

```text
[Agent]
[Current Stage]
[Skill]
[Task]
[Analysis]
[Output]
```

禁止直接输出最终代码。

---



---

# Backend Rules

后端必须：

- Controller / Service / Mapper 分层
- 使用 RESTful API
- 使用统一 JSON 返回格式
- 禁止业务逻辑写在 Controller

---

# Frontend Rules

前端必须：

- 页面现代化
- 接近真实后台管理系统
- 支持分页
- 支持搜索
- 支持响应式布局

禁止：

- 学生作业风格 UI
- 老旧 Bootstrap 风格

---

# Database Rules

数据库必须：

- 主键明确
- 字段命名统一
- 外键关系明确
- SQL可直接运行

---

# Testing Rules

测试必须：

- 验证 API
- 验证数据库
- 验证页面交互
- 验证异常输入

禁止：

```text
“理论上没问题”
```

必须实际验证。

---

# Final Goal

最终目标：

开发一个：

- 可运行
- 可维护
- UI现代化
- 结构清晰
- 适合展示

的学生成绩管理系统。

项目必须：

```text
看起来像真实产品
```

而不是：

```text
课堂作业
```
# Automatic Agent Dispatch Rules

Claude 必须根据当前任务：

自动选择最合适的 Agent。

禁止用户每次手动指定 Agent。

---

# Agent Dispatch Workflow

Claude 必须自动判断：

当前任务属于：

- 产品规划
- UI设计
- 工程开发
- 测试验证

然后自动切换对应 Agent。

---

# Dispatch Rules

## 涉及以下内容时：

- 功能分析
- 模块拆分
- 数据库设计
- API设计

自动调用：

Product Planning Agent

---

## 涉及以下内容时：

- 页面布局
- UI设计
- 用户体验
- 配色
- 响应式设计

自动调用：

UI Agent

---

## 涉及以下内容时：

- Java代码
- Spring Boot
- MySQL
- CRUD
- 前后端开发

自动调用：

Engineer Agent

---

## 涉及以下内容时：

- Bug修复
- API测试
- 数据验证
- 安全测试

自动调用：

Test Agent

---

# Mandatory Dispatch Rules

Claude 必须：

1. 自动识别当前阶段
2. 自动切换 Agent
3. 自动调用对应 Skills
4. 输出当前 Agent

禁止：

- 跳过阶段
- 混合多个 Agent 职责
- 未分析直接生成代码

---

# Mandatory Output Format

每次输出必须包含：

```text
[Current Agent]
[Current Stage]
[Current Skill]


# Global Skills System (全局技能系统)

Claude 在执行任何任务时：

必须将 Skills 作为“标准执行流程”。

Skills 不是可选项，而是：

👉 强制执行步骤模板

---

# Skills 调用规则（核心）

每个 Agent 在工作前：

必须选择并执行对应 Skills。

禁止跳过 Skills。

---

# Skills 执行机制

Claude 必须：

1. 判断任务类型
2. 选择 Skills
3. 按 Skills 顺序执行
4. 每个 Skill 必须有输出结果
5. 最终整合输出





Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.