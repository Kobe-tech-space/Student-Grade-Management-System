/**
 * 学生成绩管理系统 - Vue 3 主应用
 * 包含路由、全局状态、页面组件逻辑
 */
const { createApp, ref, computed, reactive, watch, onMounted, nextTick } = Vue;

const App = {
    setup() {
        // ==================== 全局状态 ====================
        const isLoggedIn = ref(false);
        const userInfo = ref({ username: '', realName: '', role: '' });
        const currentRoute = ref('dashboard');
        const sidebarCollapsed = ref(false);

        // 菜单项配置
        const menuItems = ref([
            { path: 'dashboard',    label: '系统首页',     icon: 'fa-solid fa-house' },
            { path: 'students',     label: '学生管理',     icon: 'fa-solid fa-user-graduate' },
            { path: 'grades/entry', label: '成绩录入',     icon: 'fa-solid fa-pen-to-square' },
            { path: 'grades/query', label: '成绩查询',     icon: 'fa-solid fa-magnifying-glass-chart' },
            { path: 'ranking',      label: '排名统计',     icon: 'fa-solid fa-trophy' }
        ]);

        // 当前页面标题
        const currentTitle = computed(() => {
            const item = menuItems.value.find(m => m.path === currentRoute.value);
            return item ? item.label : '';
        });

        // 按时间段的欢迎语
        const greetingText = computed(() => {
            const h = new Date().getHours();
            if (h < 6) return '夜深了，注意休息 🌙';
            if (h < 9) return '早上好，新的一天开始了 ☀️';
            if (h < 12) return '上午好，精力充沛地工作吧 💪';
            if (h < 14) return '中午好，别忘了休息一下 🌤️';
            if (h < 18) return '下午好，继续加油 📚';
            return '晚上好，回顾一下今天的成果 ✨';
        });

        // 仪表盘统计数据
        const stats = reactive([
            { label: '学生总数', value: 0, icon: 'fa-solid fa-users', color: '#409EFF' },
            { label: '课程总数', value: 0, icon: 'fa-solid fa-book', color: '#67C23A' },
            { label: '成绩记录', value: 0, icon: 'fa-solid fa-chart-line', color: '#E6A23C' },
            { label: '平均分',   value: 0, icon: 'fa-solid fa-star', color: '#F56C6C' }
        ]);

        // ==================== 路由逻辑 ====================
        function parseRoute() {
            const hash = window.location.hash.slice(1) || '/dashboard';
            const route = hash.replace(/^#?\/?/, '');
            // 未登录只能访问 login
            if (!isLoggedIn.value && route !== 'login') {
                currentRoute.value = 'login';
                return;
            }
            // 学生不能访问学生管理（由后端控制，前端做基本拦截）
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
                // 登录后刷新统计数据
                await refreshDashboard();
            } catch (e) {
                ElementPlus.ElMessage.error(e.message || '登录失败，请检查用户名和密码');
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

        // ==================== 仪表盘 ====================
        async function refreshDashboard() {
            try {
                const [students, courses] = await Promise.all([
                    API.getStudents(1, 1, ''),
                    API.getCourses()
                ]);
                stats[0].value = students.total;
                stats[1].value = courses.length;
                // 成绩统计
                try {
                    const grades = await API.getGrades(1, 1, '', '');
                    stats[2].value = grades.total;
                } catch { stats[2].value = '—'; }
                // 平均分排名
                try {
                    const ranking = await API.getRanking('');
                    if (ranking && ranking.length) {
                        const total = ranking.reduce((s, r) => s + (parseFloat(r.avgScore) || 0), 0);
                        stats[3].value = (total / ranking.length).toFixed(1);
                    }
                } catch { stats[3].value = '—'; }
            } catch (e) {
                console.error('加载仪表盘数据失败', e);
            }
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
                    ElementPlus.ElMessage.success('学生信息修改成功');
                } else {
                    await API.addStudent({ ...studentForm });
                    ElementPlus.ElMessage.success('学生添加成功');
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
                    `确定要删除学生「${row.name}」吗？删除后该学生的成绩也将被删除。`,
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

        // ==================== 课程数据（全局共享） ====================
        const allCourses = ref([]);
        const allStudents = ref([]);

        async function loadCourses() {
            try { allCourses.value = await API.getCourses(); } catch {}
        }
        async function loadAllStudents() {
            try { allStudents.value = await API.getAllStudents(); } catch {}
        }

        // ==================== 成绩录入 ====================
        const gradeEntryForm = reactive({
            studentId: null, courseId: null, score: null, examDate: ''
        });
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
                    `确定要删除「${row.studentName}」的「${row.courseName}」成绩吗？`,
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

        // ==================== 排名统计 ====================
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
            // 尝试从 localStorage 恢复登录状态
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
            // 解析当前路由
            parseRoute();

            // 如果已登录，预加载全局数据
            if (isLoggedIn.value) {
                await Promise.all([refreshDashboard(), loadCourses(), loadAllStudents()]);
                // 根据当前路由加载对应数据
                if (currentRoute.value === 'students') await loadStudents();
                if (currentRoute.value === 'grades/query') await loadGrades();
                if (currentRoute.value === 'ranking') await loadRanking();
            }
        });

        // 监听路由变化，自动加载对应页面数据
        watch(currentRoute, async (route) => {
            if (!isLoggedIn.value) return;
            if (route === 'dashboard') await refreshDashboard();
            if (route === 'students') { await loadCourses(); await loadAllStudents(); await loadStudents(); }
            if (route === 'grades/entry') { await loadCourses(); await loadAllStudents(); }
            if (route === 'grades/query') { await loadCourses(); await loadGrades(); }
            if (route === 'ranking') { await loadCourses(); await loadRanking(); }
        });

        // ==================== 暴露给模板 ====================
        return {
            // 全局
            isLoggedIn, userInfo, currentRoute, currentTitle, sidebarCollapsed, menuItems, stats, greetingText,
            // 登录
            loginForm, loginRules, loginFormRef, loginLoading, handleLogin, handleLogout,
            // 路由
            navigateTo,
            // 学生管理
            studentList, studentTotal, studentPage, studentPageSize, studentLoading,
            studentSearch, studentDialogVisible, studentDialogTitle, studentSaving, studentForm,
            loadStudents, showStudentDialog, saveStudent, deleteStudent,
            // 课程
            allCourses, allStudents,
            // 成绩录入
            gradeEntryForm, gradeSubmitting, submitGrade, resetGradeForm,
            // 成绩查询
            gradeList, gradeTotal, gradePage, gradePageSize, gradeLoading, gradeQuery,
            loadGrades, scoreTagType,
            editGradeVisible, editGradeForm, gradeSaving,
            showEditGradeDialog, saveEditGrade, deleteGrade,
            // 排名
            rankingList, rankingLoading, rankingCourseId, loadRanking
        };
    }
};

// 启动应用
const app = createApp(App);
app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
app.mount('#app');
