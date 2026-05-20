/**
 * 学生成绩管理系统 - Vue 3 主应用 v3
 * 企业级后台：ECharts 图表 · 主题切换 · count-up 动画 · 骨架屏
 */
const { createApp, ref, computed, reactive, watch, onMounted, nextTick } = Vue;

const App = {
    setup() {
        // ==================== 全局状态 ====================
        const isLoggedIn = ref(false);
        const userInfo = ref({ username: '', realName: '', role: '' });
        const currentRoute = ref('dashboard');
        const sidebarCollapsed = ref(false);
        const dashboardLoading = ref(true);

        // 主题
        const isDark = ref(false);
        const themeLabel = computed(() => isDark.value ? '暗色模式' : '亮色模式');

        /** 主题切换 */
        function toggleTheme() {
            isDark.value = !isDark.value;
            document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '');
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
            // 重新渲染图表以适应主题
            nextTick(() => { renderCharts(); });
        }

        function initTheme() {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                isDark.value = true;
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }

        // 菜单
        const menuItems = ref([
            { path: 'dashboard',    label: '系统首页',   icon: 'fa-solid fa-house' },
            { path: 'students',     label: '学生管理',   icon: 'fa-solid fa-user-graduate' },
            { path: 'grades/entry', label: '成绩录入',   icon: 'fa-solid fa-pen-to-square' },
            { path: 'grades/query', label: '成绩查询',   icon: 'fa-solid fa-magnifying-glass-chart' },
            { path: 'ranking',      label: '排名统计',   icon: 'fa-solid fa-trophy' }
        ]);

        const currentTitle = computed(() => {
            const item = menuItems.value.find(m => m.path === currentRoute.value);
            return item ? item.label : '';
        });

        // 时间段欢迎语
        const greetingText = computed(() => {
            const h = new Date().getHours();
            if (h < 6) return '夜深了，注意休息';
            if (h < 9) return '早上好，新的一天';
            if (h < 12) return '上午好';
            if (h < 14) return '中午好';
            if (h < 18) return '下午好';
            return '晚上好';
        });

        // KPI 统计
        const stats = reactive([
            { label: '学生总数', value: 0, displayValue: 0, icon: 'fa-solid fa-users', color: '#2563EB', sub: '' },
            { label: '课程总数', value: 0, displayValue: 0, icon: 'fa-solid fa-book', color: '#10B981', sub: '' },
            { label: '成绩记录', value: 0, displayValue: 0, icon: 'fa-solid fa-chart-line', color: '#F59E0B', sub: '' },
            { label: '全校平均分', value: 0, displayValue: 0, icon: 'fa-solid fa-star', color: '#6366F1', sub: '' }
        ]);

        /** count-up 数字增长动画 */
        function countUp(statObj, duration = 800) {
            const target = parseFloat(statObj.value) || 0;
            const start = 0;
            const startTime = performance.now();

            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad 缓动
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = start + (target - start) * eased;

                if (typeof statObj.value === 'number' && statObj.value % 1 !== 0) {
                    statObj.displayValue = current.toFixed(1);
                } else {
                    statObj.displayValue = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    statObj.displayValue = target;
                }
            }
            requestAnimationFrame(step);
        }

        // Top 10 排名
        const topRanking = ref([]);

        async function refreshDashboard() {
            dashboardLoading.value = true;
            try {
                const data = await API.getDashboardStats();
                stats[0].value = parseInt(data.studentCount) || 0;
                stats[1].value = parseInt(data.courseCount) || 0;
                stats[2].value = parseInt(data.gradeCount) || 0;
                stats[3].value = data.avgScore;
                // count-up
                stats.forEach(s => countUp(s, 800));

                // Top 10 排名
                const ranking = await API.getRanking('');
                topRanking.value = (ranking || []).slice(0, 10);
            } catch (e) {
                console.error('Dashboard load error:', e);
            }
            dashboardLoading.value = false;
            // 渲染图表
            await nextTick();
            renderCharts();
        }

        // ==================== ECharts 图表 ====================
        let chartTrendInstance = null;
        let chartDistInstance = null;

        function getChartTheme() {
            return isDark.value ? {
                textColor: '#94A3B8',
                axisColor: '#334155',
                splitColor: '#1E293B'
            } : {
                textColor: '#64748B',
                axisColor: '#E2E8F0',
                splitColor: '#F1F5F9'
            };
        }

        function renderCharts() {
            // 销毁旧实例——v-if 切换页面时 DOM 已被重建，旧实例指向无效节点
            if (chartTrendInstance) {
                chartTrendInstance.dispose();
                chartTrendInstance = null;
            }
            if (chartDistInstance) {
                chartDistInstance.dispose();
                chartDistInstance = null;
            }

            const theme = getChartTheme();

            // 趋势柱状图
            const trendDom = document.getElementById('chartTrend');
            if (trendDom) {
                chartTrendInstance = echarts.init(trendDom);
                chartTrendInstance.setOption({
                    tooltip: { trigger: 'axis' },
                    grid: { left: 40, right: 20, top: 10, bottom: 30 },
                    xAxis: {
                        type: 'category',
                        data: ['考试一', '考试二', '考试三', '考试四', '考试五'],
                        axisLine: { lineStyle: { color: theme.axisColor } },
                        axisLabel: { color: theme.textColor, fontSize: 11 }
                    },
                    yAxis: {
                        type: 'value', min: 0, max: 100,
                        splitLine: { lineStyle: { color: theme.splitColor } },
                        axisLabel: { color: theme.textColor, fontSize: 11 }
                    },
                    series: [{
                        data: [72, 75, 78, 80, parseFloat(stats[3].value) || 75],
                        type: 'bar',
                        barWidth: 32,
                        itemStyle: {
                            borderRadius: [6, 6, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#3B82F6' },
                                { offset: 1, color: '#2563EB' }
                            ])
                        },
                        emphasis: {
                            itemStyle: { color: '#60A5FA' }
                        }
                    }]
                });
                chartTrendInstance.resize();
            }

            // 成绩分布饼图
            const distDom = document.getElementById('chartDist');
            if (distDom) {
                chartDistInstance = echarts.init(distDom);
                // 从成绩数据计算分布（用排名数据模拟）
                const ranking = topRanking.value;
                let excellent = 0, good = 0, pass = 0, fail = 0;
                ranking.forEach(r => {
                    const s = parseFloat(r.avgScore) || 0;
                    if (s >= 90) excellent++;
                    else if (s >= 80) good++;
                    else if (s >= 60) pass++;
                    else fail++;
                });
                if (excellent + good + pass + fail === 0) { excellent = 3; good = 4; pass = 2; fail = 1; }

                chartDistInstance.setOption({
                    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
                    legend: { bottom: 0, textStyle: { color: theme.textColor, fontSize: 11 } },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '78%'],
                        center: ['50%', '48%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 4, borderColor: isDark.value ? '#1E293B' : '#fff', borderWidth: 3 },
                        label: { show: false },
                        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
                        data: [
                            { value: excellent, name: '优秀(90+)',  itemStyle: { color: '#10B981' } },
                            { value: good,      name: '良好(80-89)', itemStyle: { color: '#2563EB' } },
                            { value: pass,      name: '及格(60-79)', itemStyle: { color: '#F59E0B' } },
                            { value: fail,      name: '不及格(<60)', itemStyle: { color: '#EF4444' } }
                        ]
                    }]
                });
                chartDistInstance.resize();
            }
        }

        window.addEventListener('resize', () => {
            if (chartTrendInstance) chartTrendInstance.resize();
            if (chartDistInstance) chartDistInstance.resize();
        });

        // ==================== 路由 ====================
        function parseRoute() {
            const hash = window.location.hash.slice(1) || '/dashboard';
            const route = hash.replace(/^#?\/?/, '');
            if (!isLoggedIn.value && route !== 'login') {
                currentRoute.value = 'login';
                return;
            }
            currentRoute.value = route || 'dashboard';
        }

        function navigateTo(item) {
            window.location.hash = '#/' + item.path;
        }

        window.addEventListener('hashchange', parseRoute);

        // ==================== 登录 ====================
        const loginForm = reactive({ username: '', password: '' });
        const loginLoading = ref(false);
        const loginFormRef = ref(null);
        const loginRules = {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        };

        async function handleLogin() {
            loginLoading.value = true;
            try {
                const data = await API.login(loginForm.username, loginForm.password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                userInfo.value = data.userInfo;
                isLoggedIn.value = true;
                window.location.hash = '#/dashboard';
                await refreshDashboard();
            } catch (e) {
                ElementPlus.ElMessage.error(e.message || '登录失败');
            } finally {
                loginLoading.value = false;
            }
        }

        function handleLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            isLoggedIn.value = false;
            window.location.hash = '#/login';
        }

        // ==================== 学生管理 ====================
        const studentList = ref([]);
        const studentTotal = ref(0);
        const studentPage = ref(1);
        const studentPageSize = ref(10);
        const studentLoading = ref(false);
        const studentSearch = reactive({ keyword: '' });

        const studentDialogVisible = ref(false);
        const studentDialogTitle = computed(() => studentForm.id ? '编辑学生' : '新增学生');
        const studentSaving = ref(false);
        const studentForm = reactive({
            id: null, studentNo: '', name: '', gender: '男',
            className: '', phone: '', email: ''
        });

        async function loadStudents() {
            studentLoading.value = true;
            try {
                const data = await API.getStudents(studentPage.value, studentPageSize.value, studentSearch.keyword);
                studentList.value = data.records;
                studentTotal.value = data.total;
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                studentLoading.value = false;
            }
        }

        function showStudentDialog(row) {
            if (row) {
                Object.assign(studentForm, {
                    id: row.id, studentNo: row.studentNo, name: row.name,
                    gender: row.gender, className: row.className,
                    phone: row.phone || '', email: row.email || ''
                });
            } else {
                Object.assign(studentForm, {
                    id: null, studentNo: '', name: '', gender: '男',
                    className: '', phone: '', email: ''
                });
            }
            studentDialogVisible.value = true;
        }

        async function saveStudent() {
            if (!studentForm.studentNo || !studentForm.name) {
                ElementPlus.ElMessage.warning('学号和姓名为必填项');
                return;
            }
            studentSaving.value = true;
            try {
                if (studentForm.id) {
                    await API.updateStudent(studentForm.id, { ...studentForm });
                    ElementPlus.ElMessage.success('修改成功');
                } else {
                    await API.addStudent({ ...studentForm });
                    ElementPlus.ElMessage.success('添加成功');
                }
                studentDialogVisible.value = false;
                await loadStudents();
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                studentSaving.value = false;
            }
        }

        async function deleteStudent(row) {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定删除学生「${row.name}」？相关成绩也将被删除。`,
                    '确认删除',
                    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
                );
                await API.deleteStudent(row.id);
                ElementPlus.ElMessage.success('删除成功');
                await loadStudents();
            } catch (e) {
                if (e !== 'cancel') ElementPlus.ElMessage.error(e.message || '删除失败');
            }
        }

        // ==================== 课程 & 成绩 ====================
        const allCourses = ref([]);
        const allStudents = ref([]);

        async function loadCourses() { try { allCourses.value = await API.getCourses(); } catch {} }
        async function loadAllStudents() { try { allStudents.value = await API.getAllStudents(); } catch {} }

        const gradeEntryForm = reactive({ studentId: null, courseId: null, score: null, examDate: '' });
        const gradeSubmitting = ref(false);

        async function submitGrade() {
            if (!gradeEntryForm.studentId || !gradeEntryForm.courseId || gradeEntryForm.score === null) {
                ElementPlus.ElMessage.warning('请完整填写学生、课程和分数');
                return;
            }
            gradeSubmitting.value = true;
            try {
                await API.addGrade({ ...gradeEntryForm });
                ElementPlus.ElMessage.success('成绩录入成功');
                resetGradeForm();
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                gradeSubmitting.value = false;
            }
        }

        function resetGradeForm() {
            Object.assign(gradeEntryForm, { studentId: null, courseId: null, score: null, examDate: '' });
        }

        // ==================== 成绩查询 ====================
        const gradeList = ref([]);
        const gradeTotal = ref(0);
        const gradePage = ref(1);
        const gradePageSize = ref(10);
        const gradeLoading = ref(false);
        const gradeQuery = reactive({ courseId: '', keyword: '' });

        async function loadGrades() {
            gradeLoading.value = true;
            try {
                const data = await API.getGrades(gradePage.value, gradePageSize.value,
                    gradeQuery.courseId || '', gradeQuery.keyword);
                gradeList.value = data.records;
                gradeTotal.value = data.total;
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                gradeLoading.value = false;
            }
        }

        function scoreTagType(score) {
            const s = parseFloat(score);
            if (s >= 90) return 'success';
            if (s >= 80) return 'primary';
            if (s >= 60) return 'warning';
            return 'danger';
        }

        // 成绩修改弹窗
        const editGradeVisible = ref(false);
        const editGradeForm = reactive({ id: null, studentName: '', courseName: '', score: 0 });
        const gradeSaving = ref(false);

        function showEditGradeDialog(row) {
            Object.assign(editGradeForm, {
                id: row.id, studentName: row.studentName,
                courseName: row.courseName, score: parseFloat(row.score)
            });
            editGradeVisible.value = true;
        }

        async function saveEditGrade() {
            gradeSaving.value = true;
            try {
                await API.updateGrade(editGradeForm.id, { score: editGradeForm.score });
                ElementPlus.ElMessage.success('成绩修改成功');
                editGradeVisible.value = false;
                await loadGrades();
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                gradeSaving.value = false;
            }
        }

        async function deleteGrade(row) {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定删除「${row.studentName}」的「${row.courseName}」成绩？`,
                    '确认删除',
                    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
                );
                await API.deleteGrade(row.id);
                ElementPlus.ElMessage.success('删除成功');
                await loadGrades();
            } catch (e) {
                if (e !== 'cancel') ElementPlus.ElMessage.error(e.message || '删除失败');
            }
        }

        // ==================== 排名 ====================
        const rankingList = ref([]);
        const rankingLoading = ref(false);
        const rankingCourseId = ref('');

        async function loadRanking() {
            rankingLoading.value = true;
            try {
                rankingList.value = await API.getRanking(rankingCourseId.value || '');
            } catch (e) {
                ElementPlus.ElMessage.error(e.message);
            } finally {
                rankingLoading.value = false;
            }
        }

        // ==================== 初始化 ====================
        onMounted(async () => {
            initTheme();
            const token = localStorage.getItem('token');
            const savedUserInfo = localStorage.getItem('userInfo');
            if (token && savedUserInfo) {
                try {
                    userInfo.value = JSON.parse(savedUserInfo);
                    isLoggedIn.value = true;
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            }
            parseRoute();

            if (isLoggedIn.value) {
                await Promise.all([refreshDashboard(), loadCourses(), loadAllStudents()]);
                if (currentRoute.value === 'students') await loadStudents();
                if (currentRoute.value === 'grades/query') await loadGrades();
                if (currentRoute.value === 'ranking') await loadRanking();
            }
        });

        // 路由切换数据加载
        watch(currentRoute, async (route) => {
            if (!isLoggedIn.value) return;
            if (route === 'dashboard') await refreshDashboard();
            if (route === 'students') { await loadCourses(); await loadAllStudents(); await loadStudents(); }
            if (route === 'grades/entry') { await loadCourses(); await loadAllStudents(); }
            if (route === 'grades/query') { await loadCourses(); await loadGrades(); }
            if (route === 'ranking') { await loadCourses(); await loadRanking(); }
        });

        // ==================== 暴露 ====================
        return {
            isLoggedIn, userInfo, currentRoute, currentTitle, sidebarCollapsed, menuItems,
            stats, dashboardLoading, topRanking, greetingText,
            isDark, themeLabel, toggleTheme,
            loginForm, loginRules, loginFormRef, loginLoading, handleLogin, handleLogout,
            navigateTo,
            studentList, studentTotal, studentPage, studentPageSize, studentLoading,
            studentSearch, studentDialogVisible, studentDialogTitle, studentSaving, studentForm,
            loadStudents, showStudentDialog, saveStudent, deleteStudent,
            allCourses, allStudents,
            gradeEntryForm, gradeSubmitting, submitGrade, resetGradeForm,
            gradeList, gradeTotal, gradePage, gradePageSize, gradeLoading, gradeQuery,
            loadGrades, scoreTagType,
            editGradeVisible, editGradeForm, gradeSaving,
            showEditGradeDialog, saveEditGrade, deleteGrade,
            rankingList, rankingLoading, rankingCourseId, loadRanking
        };
    }
};

const app = createApp(App);
app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
app.mount('#app');
