/**
 * API 请求封装层
 * 所有后端接口调用均通过此模块
 */
const API = {
    // 基础地址
    baseURL: '/api',

    /**
     * 获取存储的 JWT Token
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * 通用请求方法
     * @param {string} url - 接口路径
     * @param {string} method - HTTP 方法
     * @param {object} data - 请求体（仅 POST/PUT）
     * @param {object} params - URL 查询参数
     */
    async request(url, method = 'GET', data = null, params = null) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        // 附加 JWT Token 用于认证
        const token = this.getToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        // 拼接查询参数
        let fullUrl = this.baseURL + url;
        if (params) {
            const qs = new URLSearchParams();
            for (const [k, v] of Object.entries(params)) {
                if (v !== null && v !== undefined && v !== '') qs.append(k, v);
            }
            const qsStr = qs.toString();
            if (qsStr) fullUrl += '?' + qsStr;
        }

        // 附加请求体
        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(fullUrl, config);
        const result = await response.json();

        // 401 未授权 → 跳转登录
        if (result.code === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.hash = '#/login';
            window.location.reload();
            throw new Error('登录已过期，请重新登录');
        }

        if (result.code !== 200) {
            throw new Error(result.message || '请求失败');
        }

        return result.data;
    },

    // ========== 认证相关 ==========
    /** 登录 */
    login(username, password) {
        return this.request('/auth/login', 'POST', { username, password });
    },

    /** 获取当前用户信息 */
    getCurrentUser() {
        return this.request('/auth/me');
    },

    // ========== 学生管理 ==========
    /** 分页查询学生列表 */
    getStudents(pageNum, pageSize, keyword) {
        return this.request('/students', 'GET', null, { pageNum, pageSize, keyword });
    },

    /** 获取全部学生（不分页，用于下拉选择） */
    getAllStudents() {
        return this.request('/students/all');
    },

    /** 新增学生 */
    addStudent(data) {
        return this.request('/students', 'POST', data);
    },

    /** 修改学生 */
    updateStudent(id, data) {
        return this.request('/students/' + id, 'PUT', data);
    },

    /** 删除学生 */
    deleteStudent(id) {
        return this.request('/students/' + id, 'DELETE');
    },

    // ========== 课程管理 ==========
    /** 获取全部课程 */
    getCourses() {
        return this.request('/courses');
    },

    // ========== 成绩管理 ==========
    /** 分页查询成绩 */
    getGrades(pageNum, pageSize, courseId, keyword) {
        return this.request('/grades', 'GET', null, { pageNum, pageSize, courseId, keyword });
    },

    /** 录入成绩 */
    addGrade(data) {
        return this.request('/grades', 'POST', data);
    },

    /** 修改成绩 */
    updateGrade(id, data) {
        return this.request('/grades/' + id, 'PUT', data);
    },

    /** 删除成绩 */
    deleteGrade(id) {
        return this.request('/grades/' + id, 'DELETE');
    },

    // ========== 排名统计 ==========
    /** 获取排名数据 */
    getRanking(courseId) {
        return this.request('/grades/ranking', 'GET', null, { courseId });
    },

    // ========== Dashboard 真实统计 ==========
    /** 获取后端真实统计（平均分、分布、趋势） */
    getStats() {
        return this.request('/grades/stats');
    },

    /** 获取 Dashboard 所需全部数据（基础数量 + 真实统计） */
    async getDashboardStats() {
        const [students, courses, stats] = await Promise.all([
            this.getStudents(1, 1, ''),
            this.getCourses(),
            this.getStats()
        ]);
        return {
            studentCount: students.total,
            courseCount: courses.length,
            gradeCount: 0, // 由 stats 提供
            avgScore: parseFloat(stats.avgScore) || 0,
            distribution: stats.distribution,
            trend: stats.trend
        };
    }
};
