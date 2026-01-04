const App = {
    init() {
        this.checkAuth();
    },

    checkAuth() {
        const user = Auth.getCurrentUser();
        if (user) {
            // Show layout for all authenticated users (SPA)
            this.renderLayout(user);
            this.router('dashboard');
        } else {
            this.renderLogin();
        }
    },

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
                <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div class="text-center mb-6">
                        <h1 class="text-2xl font-bold text-primary mb-2">نظام إدارة مؤسسة ركن المعرفة</h1>
                        <p class="text-gray-500">تسجيل الدخول للموظفين</p>
                    </div>
                    <form id="loginForm" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-1">اسم المستخدم</label>
                            <input type="text" id="username" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-1">كلمة المرور</label>
                            <input type="password" id="password" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition">دخول</button>
                    </form>
                    <div class="mt-4 text-sm text-gray-400 text-center">
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const result = Auth.login(username, password);
            
            if (result.success) {
                this.checkAuth();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: result.message
                });
            }
        });
    },

    renderLayout(user) {
        const app = document.getElementById('app');
        // Sidebar items based on role
        let menuItems = `
            <a href="#" onclick="App.router('dashboard')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                <i class="fas fa-home ml-3"></i> لوحة التحكم
            </a>
        `;

        if (Auth.hasPermission('view_students')) {
            menuItems += `
                <a href="#" onclick="App.router('students')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-user-graduate ml-3"></i> الطلاب
                </a>
            `;
        }

        if (Auth.hasPermission('view_finance')) {
            menuItems += `
                <a href="#" onclick="App.router('finance')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-money-bill-wave ml-3"></i> الحسابات والاشتراكات
                </a>
            `;
        }

        if (user.role === 'owner') {
            menuItems += `
                <a href="#" onclick="App.router('users')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-users-cog ml-3"></i> المستخدمين
                </a>
                <a href="#" onclick="App.router('reports')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-chart-line ml-3"></i> تقارير الإيرادات
                </a>
                <a href="#" onclick="App.router('database')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-database ml-3"></i> إدارة قاعدة البيانات
                </a>
                <a href="#" onclick="App.router('settings')" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white flex items-center">
                    <i class="fas fa-cogs ml-3"></i> الإعدادات
                </a>
            `;
        }

        app.innerHTML = `
            <div class="flex h-screen overflow-hidden">
                <!-- Sidebar -->
                <div class="bg-secondary text-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 right-0 transform translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out z-20 flex flex-col" id="sidebar">
                    <div class="text-white flex items-center space-x-2 px-4 space-x-reverse">
                        <i class="fas fa-school text-2xl"></i>
                        <span class="text-2xl font-extrabold">ركن المعرفة</span>
                    </div>
                    
                    <div class="px-4 mb-2">
                        <div class="bg-gray-700 p-3 rounded-lg flex items-center">
                            <div class="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold ml-3">
                                ${user.name[0]}
                            </div>
                            <div>
                                <p class="text-sm font-semibold">${user.name}</p>
                                <p class="text-xs text-gray-400">${this.getRoleName(user.role)}</p>
                            </div>
                        </div>
                    </div>

                    <nav class="flex-1 px-2 space-y-2">
                        ${menuItems}
                    </nav>

                    <div class="px-4">
                        <button onclick="Auth.logout()" class="flex items-center text-red-400 hover:text-red-300 transition">
                            <i class="fas fa-sign-out-alt ml-2"></i> تسجيل الخروج
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 flex flex-col overflow-hidden bg-gray-100 relative w-full">
                    <!-- Mobile Header -->
                    <header class="md:hidden flex justify-between items-center p-4 bg-white shadow z-10">
                        <div class="flex items-center">
                             <span class="text-xl font-bold text-gray-800">إدارتي</span>
                        </div>
                        <button onclick="document.getElementById('sidebar').classList.toggle('translate-x-full'); document.getElementById('sidebar').classList.toggle('translate-x-0')" class="text-gray-500 focus:outline-none">
                            <i class="fas fa-bars fa-lg"></i>
                        </button>
                    </header>

                    <!-- Content Body -->
                    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6" id="main-content">
                        <!-- Views injected here -->
                    </main>
                </div>
            </div>
        `;
    },

    getRoleName(role) {
        const roles = {
            'owner': 'المدير العام',
            'reception': 'الاستقبال',
            'teacher': 'معلم (موظف)'
        };
        return roles[role] || role;
    },
    
    formatDate(dateStr) {
        try {
            const settings = DB.getCollection('settings') || {};
            const locale = settings.locale || 'ar-LY';
            const d = new Date(dateStr);
            if (isNaN(d)) return '-';
            return d.toLocaleDateString(locale);
        } catch (_) {
            return '-';
        }
    },
    
    formatCurrency(amount) {
        const settings = DB.getCollection('settings') || {};
        const symbol = settings.currencySymbol || 'د.ل';
        try {
            const locale = settings.locale || 'ar-LY';
            const num = Number(amount);
            return `${num.toLocaleString(locale)} ${symbol}`;
        } catch (_) {
            return `${amount} ${symbol}`;
        }
    },

    router(viewName) {
        const main = document.getElementById('main-content');
        if (!main) return;
        main.innerHTML = ''; // Clear current view

        const viewFn = this.views[viewName] || this.views.dashboard;
        viewFn(main);
    },

    views: {
        dashboard(container) {
            const students = DB.getCollection('students');
            const payments = DB.getCollection('payments');
            const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);
            const activeStudents = students.filter(s => s.status === 'active').length;
            const currentUser = Auth.getCurrentUser();

            container.innerHTML = `
                <h2 class="text-3xl font-bold text-gray-800 mb-6">لوحة التحكم</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Stat Card 1 -->
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-blue-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">إجمالي الطلاب</p>
                                <h3 class="text-2xl font-bold text-gray-800">${students.length}</h3>
                            </div>
                            <div class="text-blue-500 bg-blue-100 p-3 rounded-full">
                                <i class="fas fa-user-graduate fa-lg"></i>
                            </div>
                        </div>
                    </div>
                    <!-- Stat Card 2 -->
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-green-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">الطلاب النشطين</p>
                                <h3 class="text-2xl font-bold text-gray-800">${activeStudents}</h3>
                            </div>
                            <div class="text-green-500 bg-green-100 p-3 rounded-full">
                                <i class="fas fa-check-circle fa-lg"></i>
                            </div>
                        </div>
                    </div>
                     <!-- Stat Card 3 -->
                    ${currentUser.role === 'owner' ? `
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-yellow-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">إجمالي الدخل</p>
                                <h3 class="text-2xl font-bold text-gray-800">${App.formatCurrency(totalIncome)}</h3>
                            </div>
                            <div class="text-yellow-500 bg-yellow-100 p-3 rounded-full">
                                <i class="fas fa-coins fa-lg"></i>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Recent Activities (Placeholder) -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-bold mb-4">آخر المسجلين</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الاسم</th>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">تاريخ التسجيل</th>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الموظف المسجل</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${students.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map(s => `
                                    <tr>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p class="text-gray-900 whitespace-no-wrap">${s.name}</p>
                                        </td>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p class="text-gray-900 whitespace-no-wrap">${App.formatDate(s.created_at)}</p>
                                        </td>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p class="text-gray-900 whitespace-no-wrap">${s.created_by || '-'}</p>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${students.length === 0 ? '<tr><td colspan="3" class="text-center py-4">لا يوجد بيانات</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },
        
        renderReports(container) {
            const payments = DB.getCollection('payments');
            const users = DB.getCollection('users');
            const subjects = DB.getCollection('subjects') || [];
            const staffOptions = users.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
            const typeOptions = `
                <option value="">الكل</option>
                <option value="monthly">شهري</option>
                <option value="term">فصلي</option>
                <option value="yearly">سنوي</option>
            `;
            
            const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);
            
            container.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">تقارير الإيرادات</h2>
                    <div class="space-x-2 space-x-reverse">
                        <button onclick="Views.exportPaymentsCSV()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">تصدير CSV</button>
                        <button onclick="Views.exportPaymentsPDF()" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow">تصدير PDF</button>
                        <button onclick="Views.printPaymentsReport()" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded shadow">طباعة التقرير</button>
                    </div>
                </div>
                
                <div class="bg-white p-4 rounded shadow mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                            <label class="block text-sm font-bold mb-1">من تاريخ</label>
                            <input type="date" id="rep_from" class="border rounded w-full p-2" onchange="Views.applyReportsFilter()">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">إلى تاريخ</label>
                            <input type="date" id="rep_to" class="border rounded w-full p-2" onchange="Views.applyReportsFilter()">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">الموظف</label>
                            <select id="rep_staff" class="border rounded w-full p-2" onchange="Views.applyReportsFilter()">
                                <option value="">الكل</option>
                                ${staffOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">المادة</label>
                            <select id="rep_subject" class="border rounded w-full p-2" onchange="Views.applyReportsFilter()">
                                <option value="">الكل</option>
                                ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">نوع الاشتراك</label>
                            <select id="rep_type" class="border rounded w-full p-2" onchange="Views.applyReportsFilter()">
                                ${typeOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">رقم/بحث الفاتورة</label>
                            <input type="text" id="rep_invoice" class="border rounded w-full p-2" placeholder="INV-..." onkeyup="Views.applyReportsFilter()">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label class="block text-sm font-bold mb-1">المبلغ الأدنى</label>
                            <input type="number" id="rep_min" class="border rounded w-full p-2" placeholder="0" onkeyup="Views.applyReportsFilter()" onchange="Views.applyReportsFilter()">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">المبلغ الأعلى</label>
                            <input type="number" id="rep_max" class="border rounded w-full p-2" placeholder="0" onkeyup="Views.applyReportsFilter()" onchange="Views.applyReportsFilter()">
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-green-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">إجمالي الدخل (محدد)</p>
                                <h3 id="rep_total" class="text-2xl font-bold text-gray-800">${App.formatCurrency(totalIncome)}</h3>
                            </div>
                            <div class="text-green-500 bg-green-100 p-3 rounded-full">
                                <i class="fas fa-money-bill-wave fa-lg"></i>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-blue-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">عدد الفواتير</p>
                                <h3 id="rep_count" class="text-2xl font-bold text-gray-800">${payments.length}</h3>
                            </div>
                            <div class="text-blue-500 bg-blue-100 p-3 rounded-full">
                                <i class="fas fa-file-invoice fa-lg"></i>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-5 border-r-4 border-yellow-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-gray-500 text-sm">متوسط الفاتورة</p>
                                <h3 id="rep_avg" class="text-2xl font-bold text-gray-800">${(payments.length ? (totalIncome / payments.length) : 0).toFixed(2)}</h3>
                            </div>
                            <div class="text-yellow-500 bg-yellow-100 p-3 rounded-full">
                                <i class="fas fa-chart-bar fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white shadow-md rounded overflow-hidden">
                    <h3 class="p-4 text-lg font-bold border-b text-green-700 bg-green-50">تفاصيل الفواتير</h3>
                    <div class="overflow-x-auto max-h-96">
                        <table class="min-w-full table-auto">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-right">رقم الفاتورة</th>
                                    <th class="py-2 px-4 text-right">الطالب</th>
                                    <th class="py-2 px-4 text-right">المبلغ</th>
                                    <th class="py-2 px-4 text-right">التاريخ</th>
                                    <th class="py-2 px-4 text-right">النوع</th>
                                    <th class="py-2 px-4 text-right">المواد</th>
                                    <th class="py-2 px-4 text-right">الموظف</th>
                                    <th class="py-2 px-4 text-right">أيام متبقية</th>
                                    <th class="py-2 px-4 text-center">طباعة</th>
                                </tr>
                            </thead>
                            <tbody id="payments_table_body">
                                ${Views.generatePaymentRows(payments)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            Views.lastFilteredPayments = payments;
        },
        
        applyReportsFilter() {
            const payments = DB.getCollection('payments');
            const from = document.getElementById('rep_from').value;
            const to = document.getElementById('rep_to').value;
            const staff = document.getElementById('rep_staff').value;
            const subject = document.getElementById('rep_subject').value;
            const type = document.getElementById('rep_type').value;
            const invoice = document.getElementById('rep_invoice').value.toLowerCase();
            const min = document.getElementById('rep_min').value;
            const max = document.getElementById('rep_max').value;
            
            const filtered = payments.filter(p => {
                const d = new Date(p.date);
                const passFrom = from ? d >= new Date(from) : true;
                const passTo = to ? d <= new Date(to) : true;
                const passStaff = staff ? p.staff_name === staff : true;
                const passType = type ? p.type === type : true;
                const passSubject = subject ? (p.subjects && p.subjects.includes(subject)) : true;
                const passInvoice = invoice ? (p.invoice_number && p.invoice_number.toLowerCase().includes(invoice)) : true;
                const amt = Number(p.amount);
                const passMin = min ? amt >= Number(min) : true;
                const passMax = max ? amt <= Number(max) : true;
                return passFrom && passTo && passStaff && passType && passSubject && passInvoice && passMin && passMax;
            });
            
            const total = filtered.reduce((sum, p) => sum + Number(p.amount), 0);
            document.getElementById('rep_total').innerText = `${App.formatCurrency(total)}`;
            document.getElementById('rep_count').innerText = `${filtered.length}`;
            document.getElementById('rep_avg').innerText = `${(filtered.length ? (total / filtered.length) : 0).toFixed(2)}`;
            document.getElementById('payments_table_body').innerHTML = Views.generatePaymentRows(filtered);
            Views.lastFilteredPayments = filtered;
        },
        
        exportPaymentsCSV() {
            const list = Views.lastFilteredPayments || DB.getCollection('payments');
            const rows = [['رقم الفاتورة','اسم الطالب','المبلغ','التاريخ','النوع','المواد','الموظف','أيام متبقية']];
            list.forEach(p => {
                const student = DB.findById('students', p.student_id);
                const name = student ? student.name : 'محذوف';
                const rawAmount = Number(p.amount);
                const date = App.formatDate(p.date);
                const type = p.type || '-';
                const subjects = p.subjects && p.subjects.length ? p.subjects.join('، ') : '-';
                const staff = p.staff_name || '-';
                let days = '';
                try {
                    const subs = DB.where('subscriptions', s => s.student_id == p.student_id);
                    const activeSub = subs.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
                    if (activeSub) {
                        const today = new Date();
                        const endDate = new Date(activeSub.end_date);
                        const diffTime = endDate - today;
                        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                } catch(_) {}
                rows.push([p.invoice_number, name, rawAmount, date, type, subjects, staff, days]);
            });
            const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'payments_report.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        
        printPaymentsReport() {
            const list = Views.lastFilteredPayments || DB.getCollection('payments');
            const htmlRows = list.slice().reverse().map(p => {
                const student = DB.findById('students', p.student_id);
                const subjects = p.subjects && p.subjects.length ? p.subjects.join('، ') : '-';
                let daysText = '-';
                try {
                    const subs = DB.where('subscriptions', s => s.student_id == p.student_id);
                    const activeSub = subs.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
                    if (activeSub) {
                        const today = new Date();
                        const endDate = new Date(activeSub.end_date);
                        const diffTime = endDate - today;
                        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        daysText = days < 0 ? `منتهي منذ ${Math.abs(days)} يوم` : `${days} يوم`;
                    }
                } catch(_) {}
                return `
                    <tr>
                        <td>${p.invoice_number}</td>
                        <td>${student ? student.name : 'محذوف'}</td>
                        <td>${App.formatCurrency(p.amount)}</td>
                        <td>${App.formatDate(p.date)}</td>
                        <td>${p.type || '-'}</td>
                        <td>${subjects}</td>
                        <td>${p.staff_name || '-'}</td>
                        <td>${daysText}</td>
                    </tr>
                `;
            }).join('');
            const total = list.reduce((sum, p) => sum + Number(p.amount), 0);
            const win = window.open('', '_blank');
            win.document.write(`
                <html dir="rtl" lang="ar">
                <head>
                    <title>تقرير الإيرادات</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; }
                        h1 { text-align: center; margin-bottom: 16px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                        .total { margin-top: 12px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>تقرير الإيرادات</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>الطالب</th>
                                <th>المبلغ</th>
                                <th>التاريخ</th>
                                <th>النوع</th>
                                <th>المواد</th>
                                <th>الموظف</th>
                                <th>أيام متبقية</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlRows}
                        </tbody>
                    </table>
                    <div class="total">الإجمالي: ${App.formatCurrency(total)}</div>
                    <script>window.onload = function(){ window.print(); }</script>
                </body>
                </html>
            `);
            win.document.close();
        },
        
        exportPaymentsPDF() {
            Views.printPaymentsReport();
        },
        
        generatePaymentRows(payments) {
            return payments.slice().reverse().map(p => {
                const student = DB.findById('students', p.student_id);
                const subjects = p.subjects && p.subjects.length ? p.subjects.join('، ') : '-';
                let dateCell = '-';
                try {
                    if (p.date) {
                        const d = new Date(p.date);
                        if (!isNaN(d.getTime())) {
                            dateCell = d.toLocaleDateString(DB.getCollection('settings').locale || 'ar-LY');
                        }
                    }
                } catch (_) { dateCell = '-'; }
                let daysHtml = '<span class="text-gray-400">-</span>';
                try {
                    const subs = DB.where('subscriptions', s => s.student_id == p.student_id);
                    const activeSub = subs.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
                    if (activeSub) {
                        const today = new Date();
                        const endDate = new Date(activeSub.end_date);
                        const diffTime = endDate - today;
                        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (days < 0) {
                            daysHtml = `<span class="text-red-600 font-bold text-xs">منتهي منذ ${Math.abs(days)} يوم</span>`;
                        } else {
                            const color = days <= 5 ? 'red' : days <= 10 ? 'yellow' : 'green';
                            daysHtml = `<span class="text-${color}-600 font-bold text-sm">${days} يوم</span>`;
                        }
                    }
                } catch(_) {}
                return `
                    <tr class="border-b hover:bg-gray-50 text-sm">
                        <td class="py-2 px-4">${p.invoice_number}</td>
                        <td class="py-2 px-4">${student ? student.name : 'محذوف'}</td>
                        <td class="py-2 px-4 font-bold text-green-600">${App.formatCurrency(p.amount)}</td>
                        <td class="py-2 px-4">${dateCell}</td>
                        <td class="py-2 px-4">${p.type || '-'}</td>
                        <td class="py-2 px-4">${subjects}</td>
                        <td class="py-2 px-4">${p.staff_name || '-'}</td>
                        <td class="py-2 px-4">${daysHtml}</td>
                        <td class="py-2 px-4 text-center">
                            <button onclick="Views.printInvoice('${p.invoice_number}')" class="text-blue-500">
                                <i class="fas fa-print"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        },
        
        renderDatabase(container) {
            const logs = DB.getCollection('logs') || [];
            const data = DB.getAll();
            const collections = Object.keys(data);
            const nameMap = {
                payments: 'الفواتير المقبوضة',
                subscriptions: 'الاشتراكات',
                students: 'الطلاب',
                users: 'المستخدمون',
                logs: 'السجلات',
                subjects: 'المواد والفئات',
                settings: 'الإعدادات',
                expenses: 'المصروفات'
            };
            const statsHtml = collections.map(c => {
                const val = data[c];
                const count = Array.isArray(val) ? val.length : (val && typeof val === 'object' ? Object.keys(val).length : 0);
                const ar = nameMap[c] || c;
                return `
                <div class="bg-white rounded shadow p-4">
                    <p class="text-sm text-gray-500">${ar}</p>
                    <p class="text-2xl font-bold">${count}</p>
                </div>`;
            }).join('');
            
            container.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">إدارة قاعدة البيانات</h2>
                    <div class="space-x-2 space-x-reverse">
                        <button onclick="Views.clearLogs()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow">
                            مسح سجلات العمليات
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    ${statsHtml}
                </div>
                
                <div class="bg-white shadow-md rounded overflow-hidden">
                    <h3 class="p-4 text-lg font-bold border-b text-gray-700 bg-gray-50">سجلات العمليات</h3>
                    <div class="overflow-x-auto max-h-96">
                        <table class="min-w-full table-auto">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-right">الوقت</th>
                                    <th class="py-2 px-4 text-right">الموظف</th>
                                    <th class="py-2 px-4 text-right">العملية</th>
                                    <th class="py-2 px-4 text-right">المجموعة</th>
                                    <th class="py-2 px-4 text-right">المعرف</th>
                                    <th class="py-2 px-4 text-right">تفاصيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${logs.slice().reverse().map(l => `
                                    <tr class="border-b hover:bg-gray-50 text-sm">
                                        <td class="py-2 px-4">${(function(){ try { const d = new Date(l.time); const locale = (DB.getCollection('settings').locale || 'ar-LY'); return isNaN(d) ? '-' : d.toLocaleString(locale); } catch(_) { return '-'; } })()}</td>
                                        <td class="py-2 px-4">${l.user || '-'}</td>
                                        <td class="py-2 px-4">${({'add':'إضافة','update':'تعديل','delete':'حذف'}[l.op]||l.op)}</td>
                                        <td class="py-2 px-4">${({payments:'الفواتير المقبوضة',subscriptions:'الاشتراكات',students:'الطلاب',users:'المستخدمون',logs:'السجلات',subjects:'المواد والفئات',settings:'الإعدادات',expenses:'المصروفات'}[l.collection]||l.collection)}</td>
                                        <td class="py-2 px-4">${l.item_id || '-'}</td>
                                        <td class="py-2 px-4">${l.details || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },
        
        clearLogs() {
            Swal.fire({
                title: 'تأكيد',
                text: 'هل تريد مسح جميع سجلات العمليات؟',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'نعم',
                cancelButtonText: 'إلغاء'
            }).then((res) => {
                if (res.isConfirmed) {
                    DB.saveCollection('logs', []);
                    Swal.fire('تم', '', 'success');
                    const main = document.getElementById('main-content');
                    if (main) {
                        Views.renderDatabase(main);
                    } else {
                        App.router('database');
                    }
                }
            });
        },



        students(container) {
            // To be implemented in next steps
            container.innerHTML = '<h1>جاري تحميل صفحة الطلاب...</h1>';
            setTimeout(() => Views.renderStudents(container), 100);
        },

        finance(container) {
            // To be implemented in next steps
            container.innerHTML = '<h1>جاري تحميل صفحة الحسابات...</h1>';
            setTimeout(() => Views.renderFinance(container), 100);
        },
        
        reports(container) {
            const user = Auth.getCurrentUser();
            if (!user || user.role !== 'owner') {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">غير مصرح</h2></div>';
                return;
            }
            container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold">جاري تحميل تقارير الإيرادات...</h2></div>';
            try {
                App.views.renderReports(container);
            } catch (e) {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">حدث خطأ أثناء تحميل التقارير</h2></div>';
                console.error(e);
            }
        },
        
        database(container) {
            const user = Auth.getCurrentUser();
            if (!user || user.role !== 'owner') {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">غير مصرح</h2></div>';
                return;
            }
            container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold">جاري تحميل إدارة قاعدة البيانات...</h2></div>';
            try {
                App.views.renderDatabase(container);
            } catch (e) {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">حدث خطأ أثناء تحميل الصفحة</h2></div>';
                console.error(e);
            }
        },

        settings(container) {
            const user = Auth.getCurrentUser();
            if (!user || user.role !== 'owner') {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">غير مصرح</h2></div>';
                return;
            }
            container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold">جاري تحميل الإعدادات...</h2></div>';
            try {
                Views.renderSettings(container);
            } catch (e) {
                container.innerHTML = '<div class="p-6 bg-white rounded shadow"><h2 class="text-xl font-bold text-red-600">حدث خطأ أثناء تحميل الإعدادات</h2></div>';
                console.error(e);
            }
        },

        users(container) {
            // To be implemented
             container.innerHTML = '<h1>جاري تحميل صفحة المستخدمين...</h1>';
             setTimeout(() => Views.renderUsers(container), 100);
        }
    }
};

// Separate View Logic to keep things clean
const Views = {
    renderStudents(container) {
        let students = DB.getCollection('students');
        const currentUser = Auth.getCurrentUser();
        const canManage = Auth.hasPermission('manage_students');
        const subjects = DB.getCollection('subjects') || [];

        let html = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">إدارة الطلاب</h2>
                ${canManage ? `
                <button onclick="Views.openStudentModal()" class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
                    <i class="fas fa-plus ml-2"></i> تسجيل طالب جديد
                </button>
                ` : ''}
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white p-4 rounded shadow mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                         <label class="block text-gray-700 text-sm font-bold mb-2">بحث (الاسم أو رقم الهاتف)</label>
                        <div class="relative">
                            <input type="text" id="student_search" onkeyup="Views.filterStudents()" placeholder="ابحث عن اسم الطالب أو رقم ولي الأمر..." class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-search text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">تصفية حسب المادة</label>
                        <select id="student_subject_filter" onchange="Views.filterStudents()" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="">جميع المواد</option>
                            ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-right">ID</th>
                            <th class="py-3 px-6 text-right">الاسم</th>
                            <th class="py-3 px-6 text-right">رقم الهاتف</th>
                            <th class="py-3 px-6 text-center">المواد المشترك بها</th>
                            <th class="py-3 px-6 text-center">الاشتراك (الأيام المتبقية)</th>
                            <th class="py-3 px-6 text-center">الحالة</th>
                            <th class="py-3 px-6 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="students_table_body" class="text-gray-600 text-sm font-light">
                        ${this.generateStudentRows(students)}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    buildGroupedSubjectsHtml(list, selected, inputName) {
        const g = {
            'مرحلة الروضة': [],
            'باقات الصفوف (شنطة)': [],
            'صف أول': [],
            'صف ثاني': [],
            'صف ثالث': [],
            'صف رابع': [],
            'صف خامس': [],
            'صف سادس': [],
            'صف سابع': [],
            'صف ثامن': [],
            'صف تاسع': [],
            'أول ثانوي': [],
            'ثاني ثانوي': [],
            'ثالث ثانوي': []
        };
        const nursery = new Set(['روضة', 'KG1', 'KG2', 'تأسيس']);
        list.forEach(s => {
            if (nursery.has(s)) g['مرحلة الروضة'].push(s);
            else if (s.includes('شنطة')) g['باقات الصفوف (شنطة)'].push(s);
            else if (s.startsWith('صف أول -')) g['صف أول'].push(s);
            else if (s.startsWith('صف ثاني -')) g['صف ثاني'].push(s);
            else if (s.startsWith('صف ثالث -')) g['صف ثالث'].push(s);
            else if (s.startsWith('صف رابع -')) g['صف رابع'].push(s);
            else if (s.startsWith('صف خامس -')) g['صف خامس'].push(s);
            else if (s.startsWith('صف سادس -')) g['صف سادس'].push(s);
            else if (s.startsWith('صف سابع -')) g['صف سابع'].push(s);
            else if (s.startsWith('صف ثامن -')) g['صف ثامن'].push(s);
            else if (s.startsWith('صف تاسع -')) g['صف تاسع'].push(s);
            else if (s.startsWith('أول ثانوي -')) g['أول ثانوي'].push(s);
            else if (s.startsWith('ثاني ثانوي -')) g['ثاني ثانوي'].push(s);
            else if (s.startsWith('ثالث ثانوي -')) g['ثالث ثانوي'].push(s);
        });
        const order = ['مرحلة الروضة','باقات الصفوف (شنطة)','صف أول','صف ثاني','صف ثالث','صف رابع','صف خامس','صف سادس','صف سابع','صف ثامن','صف تاسع','أول ثانوي','ثاني ثانوي','ثالث ثانوي'];
        let html = '';
        order.forEach(groupName => {
            const items = g[groupName];
            if (!items || items.length === 0) return;
            html += `<div class="col-span-2"><div class="text-xs font-bold bg-gray-200 rounded px-2 py-1">${groupName}</div></div>`;
            items.forEach(item => {
                const checked = selected && selected.includes(item) ? 'checked' : '';
                html += `
                <label class="flex items-center space-x-2 space-x-reverse cursor-pointer">
                    <input type="checkbox" name="${inputName}" value="${item}" class="form-checkbox h-4 w-4 text-primary" ${checked}>
                    <span class="text-sm">${item}</span>
                </label>`;
            });
        });
        return html;
    },

    applyReportsFilter() {
        return App.views.applyReportsFilter();
    },

    exportPaymentsCSV() {
        return App.views.exportPaymentsCSV();
    },

    exportPaymentsPDF() {
        return App.views.exportPaymentsPDF();
    },

    printPaymentsReport() {
        return App.views.printPaymentsReport();
    },

    generatePaymentRows(payments) {
        return App.views.generatePaymentRows(payments);
    },

    renderSettings(container) {
        container.innerHTML = `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">الإعدادات</h1>
                <p class="text-gray-600">إدارة النسخ الاحتياطي والنظام</p>
            </div>

            <div class="bg-white rounded-lg shadow">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button onclick="Views.settingsSwitchTab('backup')" id="backupTab" class="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm">النسخ الاحتياطي</button>
                        <button onclick="Views.settingsSwitchTab('system')" id="systemTab" class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">النظام</button>
                    </nav>
                </div>

                <div id="backupContent" class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">النسخ الاحتياطي</h3>
                    <div class="flex gap-2 mb-4">
                        <button onclick="Views.createBackup()" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                            <i class="fas fa-download ml-2"></i> إنشاء نسخة احتياطية
                        </button>
                    </div>
                    <div class="bg-gray-50 rounded p-4">
                        <p class="text-sm text-gray-600">آخر نسخة احتياطية: <span id="lastBackupDate">-</span></p>
                        <p class="text-sm text-gray-600">حجم البيانات: <span id="backupSize">-</span></p>
                    </div>
                </div>

                <div id="systemContent" class="p-6 hidden">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">النظام</h3>
                    <div class="flex flex-col gap-3">
                        <button onclick="Views.changeAccountCode()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">تغيير رمز الحساب</button>
                        <button onclick="Views.clearCache()" class="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded">مسح الكاش</button>
                        <button onclick="Views.resetSystem()" class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">إعادة تعيين النظام</button>
                    </div>
                </div>
            </div>
        `;

        Views.settingsUpdateBackupInfo();
        Views.settingsSwitchTab('backup');
    },

    settingsSwitchTab(tab) {
        const tabs = ['backup', 'system'];
        tabs.forEach(t => {
            const content = document.getElementById(`${t}Content`);
            const tabBtn = document.getElementById(`${t}Tab`);
            if (content) content.classList.add('hidden');
            if (tabBtn) {
                tabBtn.classList.remove('border-primary', 'text-primary');
                tabBtn.classList.add('border-transparent', 'text-gray-500');
            }
        });

        const activeContent = document.getElementById(`${tab}Content`);
        const activeBtn = document.getElementById(`${tab}Tab`);
        if (activeContent) activeContent.classList.remove('hidden');
        if (activeBtn) {
            activeBtn.classList.add('border-primary', 'text-primary');
            activeBtn.classList.remove('border-transparent', 'text-gray-500');
        }
    },

    settingsLoadSettings() {
        const settings = DB.getCollection('settings') || {};

        const institution = settings.institution || {};

        const defaultLanguage = document.getElementById('defaultLanguage');
        const timezone = document.getElementById('timezone');
        const dateFormat = document.getElementById('dateFormat');
        const currency = document.getElementById('currency');
        const emailNotifications = document.getElementById('emailNotifications');
        const darkMode = document.getElementById('darkMode');
        const autoBackup = document.getElementById('autoBackup');

        if (defaultLanguage) defaultLanguage.value = settings.language || 'ar';
        if (timezone) timezone.value = settings.timezone || 'Africa/Tripoli';
        if (dateFormat) dateFormat.value = settings.dateFormat || 'dd/mm/yyyy';
        if (currency) currency.value = settings.currency || 'د.ل';
        if (emailNotifications) emailNotifications.checked = !!settings.emailNotifications;
        if (darkMode) darkMode.checked = !!settings.darkMode;
        if (autoBackup) autoBackup.checked = !!settings.autoBackup;

        const institutionName = document.getElementById('institutionName');
        const institutionLogo = document.getElementById('institutionLogo');
        const institutionPhone = document.getElementById('institutionPhone');
        const institutionEmail = document.getElementById('institutionEmail');
        const institutionAddress = document.getElementById('institutionAddress');
        const institutionDescription = document.getElementById('institutionDescription');

        if (institutionName) institutionName.value = institution.name || 'ركن المعرفة';
        if (institutionLogo) institutionLogo.value = institution.logo || '';
        if (institutionPhone) institutionPhone.value = institution.phone || '';
        if (institutionEmail) institutionEmail.value = institution.email || '';
        if (institutionAddress) institutionAddress.value = institution.address || '';
        if (institutionDescription) institutionDescription.value = institution.description || '';
    },

    saveGeneralSettings() {
        const settings = DB.getCollection('settings') || {};
        settings.language = document.getElementById('defaultLanguage')?.value || 'ar';
        settings.timezone = document.getElementById('timezone')?.value || 'Africa/Tripoli';
        settings.dateFormat = document.getElementById('dateFormat')?.value || 'dd/mm/yyyy';
        settings.currency = document.getElementById('currency')?.value || 'د.ل';
        settings.emailNotifications = !!document.getElementById('emailNotifications')?.checked;
        settings.darkMode = !!document.getElementById('darkMode')?.checked;
        settings.autoBackup = !!document.getElementById('autoBackup')?.checked;

        DB.saveCollection('settings', settings);
        Swal.fire('تم!', 'تم حفظ الإعدادات العامة بنجاح', 'success');
    },

    saveInstitutionSettings() {
        const settings = DB.getCollection('settings') || {};
        settings.institution = {
            name: document.getElementById('institutionName')?.value || 'ركن المعرفة',
            logo: document.getElementById('institutionLogo')?.value || '',
            phone: document.getElementById('institutionPhone')?.value || '',
            email: document.getElementById('institutionEmail')?.value || '',
            address: document.getElementById('institutionAddress')?.value || '',
            description: document.getElementById('institutionDescription')?.value || ''
        };
        DB.saveCollection('settings', settings);
        Swal.fire('تم!', 'تم حفظ معلومات المؤسسة بنجاح', 'success');
    },

    resetGeneralSettings() {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'سيتم إعادة تعيين الإعدادات العامة إلى القيم الافتراضية',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'إعادة تعيين',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                const settings = DB.getCollection('settings') || {};
                delete settings.language;
                delete settings.timezone;
                delete settings.dateFormat;
                delete settings.currency;
                delete settings.emailNotifications;
                delete settings.darkMode;
                delete settings.autoBackup;
                DB.saveCollection('settings', settings);
                Views.settingsLoadSettings();
                Swal.fire('تم!', 'تم إعادة تعيين الإعدادات بنجاح', 'success');
            }
        });
    },

    resetInstitutionSettings() {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'سيتم إعادة تعيين معلومات المؤسسة',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'إعادة تعيين',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                const settings = DB.getCollection('settings') || {};
                delete settings.institution;
                DB.saveCollection('settings', settings);
                Views.settingsLoadSettings();
                Swal.fire('تم!', 'تم إعادة تعيين معلومات المؤسسة بنجاح', 'success');
            }
        });
    },

    settingsUpdateBackupInfo() {
        const lastBackupDate = document.getElementById('lastBackupDate');
        const backupSize = document.getElementById('backupSize');

        if (!lastBackupDate || !backupSize) return;

        try {
            const data = DB.getAll();
            const size = new Blob([JSON.stringify(data)]).size;
            backupSize.textContent = Views.settingsFormatBytes(size);
        } catch (_) {
            backupSize.textContent = '-';
        }

        lastBackupDate.textContent = '-';
    },

    settingsFormatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    createBackup() {
        try {
            const data = DB.getAll();
            const backup = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                data: data
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Swal.fire('تم!', 'تم إنشاء نسخة احتياطية بنجاح', 'success');
            Views.settingsUpdateBackupInfo();
        } catch (error) {
            Swal.fire('خطأ', 'فشل في إنشاء نسخة احتياطية', 'error');
        }
    },

    clearCache() {
        const askCode = () => Swal.fire({
            title: 'رمز الحساب',
            input: 'password',
            inputPlaceholder: 'أدخل رمز الحساب',
            showCancelButton: true,
            confirmButtonText: 'تأكيد',
            cancelButtonText: 'إلغاء'
        });
        askCode().then(r => {
            if (!r.isConfirmed) return;
            const user = Auth.getCurrentUser();
            if (!user || r.value !== user.password) {
                Swal.fire('خطأ', 'رمز الحساب غير صحيح', 'error');
                return;
            }
            Swal.fire({
                title: 'هل أنت متأكد؟',
                text: 'سيتم مسح جميع البيانات المؤقتة',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'مسح',
                cancelButtonText: 'إلغاء'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    location.reload();
                }
            });
        });
    },

    resetSystem() {
        const askCode = () => Swal.fire({
            title: 'رمز الحساب',
            input: 'password',
            inputPlaceholder: 'أدخل رمز الحساب',
            showCancelButton: true,
            confirmButtonText: 'تأكيد',
            cancelButtonText: 'إلغاء'
        });
        askCode().then(r => {
            if (!r.isConfirmed) return;
            const user = Auth.getCurrentUser();
            if (!user || r.value !== user.password) {
                Swal.fire('خطأ', 'رمز الحساب غير صحيح', 'error');
                return;
            }
            Swal.fire({
                title: 'هل أنت متأكد؟',
                text: 'سيتم إعادة تعيين النظام بالكامل إلى الإعدادات الافتراضية',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'إعادة تعيين',
                cancelButtonText: 'إلغاء'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    DB.init();
                    location.reload();
                }
            });
        });
    },
    
    changeAccountCode() {
        const user = Auth.getCurrentUser();
        if (!user || user.role !== 'owner') {
            Swal.fire('تنبيه', 'هذه العملية متاحة للمالك فقط', 'info');
            return;
        }
        Swal.fire({
            title: 'تغيير رمز الحساب',
            html: `
                <form class="text-right space-y-3">
                    <input type="password" id="curr_code" class="swal2-input" placeholder="الرمز الحالي">
                    <input type="password" id="new_code" class="swal2-input" placeholder="الرمز الجديد">
                    <input type="password" id="confirm_code" class="swal2-input" placeholder="تأكيد الرمز الجديد">
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'تغيير',
            preConfirm: () => {
                const curr = document.getElementById('curr_code').value;
                const next = document.getElementById('new_code').value;
                const conf = document.getElementById('confirm_code').value;
                if (!curr || !next || !conf) {
                    Swal.showValidationMessage('جميع الحقول مطلوبة');
                    return false;
                }
                if (curr !== user.password) {
                    Swal.showValidationMessage('الرمز الحالي غير صحيح');
                    return false;
                }
                if (next !== conf) {
                    Swal.showValidationMessage('تأكيد الرمز لا يطابق الجديد');
                    return false;
                }
                return { next };
            }
        }).then((res) => {
            if (res.isConfirmed) {
                const updated = DB.update('users', user.id, { password: res.value.next });
                if (updated) {
                    localStorage.setItem(Auth.userKey, JSON.stringify(updated));
                    Swal.fire('تم', 'تم تغيير رمز الحساب بنجاح', 'success');
                } else {
                    Swal.fire('خطأ', 'تعذر تحديث الرمز', 'error');
                }
            }
        });
    },

    filterStudents() {
        const searchText = document.getElementById('student_search').value.toLowerCase();
        const subjectFilter = document.getElementById('student_subject_filter').value;
        
        let students = DB.getCollection('students');
        
        const filteredStudents = students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchText) || 
                                  (s.parent_phone && s.parent_phone.includes(searchText));
            
            const matchesSubject = subjectFilter === "" || (s.subjects && s.subjects.includes(subjectFilter));
            
            return matchesSearch && matchesSubject;
        });
        
        document.getElementById('students_table_body').innerHTML = this.generateStudentRows(filteredStudents);
    },

    generateStudentRows(students) {
        if (students.length === 0) {
            return '<tr><td colspan="7" class="text-center py-4">لا يوجد طلاب مطابقين للبحث</td></tr>';
        }

        const canManage = Auth.hasPermission('manage_students');

        return students.map(s => {
            // Get Active Subscription
            const subs = DB.where('subscriptions', sub => sub.student_id == s.id);
            const activeSub = subs.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0]; // Get latest
            
            let daysRemaining = 0;
            let subStatusHtml = '<span class="text-gray-400 text-xs">لا يوجد اشتراك</span>';
            
            if (activeSub) {
                const today = new Date();
                const endDate = new Date(activeSub.end_date);
                const diffTime = endDate - today;
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (daysRemaining < 0) {
                    subStatusHtml = `<span class="text-red-600 font-bold text-xs">منتهي منذ ${Math.abs(daysRemaining)} يوم</span>`;
                } else {
                    const color = daysRemaining <= 5 ? 'red' : daysRemaining <= 10 ? 'yellow' : 'green';
                    subStatusHtml = `<span class="text-${color}-600 font-bold text-sm">${daysRemaining} يوم</span>`;
                }
            }

            const subjectsDisplay = s.subjects && s.subjects.length > 0 
                ? s.subjects.map(sub => `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1 inline-block">${sub}</span>`).join('') 
                : '<span class="text-gray-400">-</span>';

            return `
        <tr class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-right whitespace-nowrap font-medium">${s.id}</td>
            <td class="py-3 px-6 text-right">
                <p class="font-bold">${s.name}</p>
                <p class="text-xs text-gray-500">${s.parent_name || ''}</p>
            </td>
            <td class="py-3 px-6 text-right">${s.parent_phone || '-'}</td>
            <td class="py-3 px-6 text-center max-w-xs flex-wrap">${subjectsDisplay}</td>
            <td class="py-3 px-6 text-center">
                ${subStatusHtml}
            </td>
            <td class="py-3 px-6 text-center">
                <span class="bg-${s.status === 'active' ? 'green' : 'red'}-200 text-${s.status === 'active' ? 'green' : 'red'}-600 py-1 px-3 rounded-full text-xs">
                    ${s.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
            </td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center space-x-2 space-x-reverse">
                    <button onclick="Views.viewStudentDetails(${s.id})" class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${canManage ? `
                    <button onclick="Views.renewSubscription(${s.id})" class="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-600" title="تجديد الاشتراك">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button onclick="Views.openStudentModal(${s.id})" class="w-8 h-8 rounded-full hover:bg-purple-100 flex items-center justify-center text-purple-600" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="Views.deleteStudent(${s.id})" class="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-red-600" title="حذف">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
            `;
        }).join('');
    },

    openStudentModal(id = null) {
        const student = id ? DB.findById('students', id) : null;
        const isEdit = !!student;
        
        // Get Subjects from DB
        const subjectsList = DB.getCollection('subjects') || [];
        const subjectsHtml = Views.buildGroupedSubjectsHtml(subjectsList, student && student.subjects ? student.subjects : [], 'subjects');

        let htmlContent = `
            <form id="studentForm" class="text-right space-y-3">
                <h3 class="text-lg font-bold border-b pb-2 text-primary">بيانات الطالب</h3>
                <input type="text" id="s_name" class="swal2-input" placeholder="اسم الطالب" value="${student ? student.name : ''}" required>
                <input type="text" id="s_parent" class="swal2-input" placeholder="اسم ولي الأمر" value="${student ? student.parent_name : ''}">
                <input type="text" id="s_phone" class="swal2-input" placeholder="رقم الهاتف" value="${student ? student.parent_phone : ''}">
                
                <label class="block text-right text-gray-700 text-sm font-bold mb-2 mt-4">المواد / الفئات المشترك بها:</label>
                <div id="subjects_container" class="text-right grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                    ${subjectsHtml}
                </div>
        `;

        // Add Subscription Fields ONLY for New Students
        if (!isEdit) {
            htmlContent += `
                <div class="mt-4 pt-4 border-t">
                    <h3 class="text-lg font-bold border-b pb-2 text-green-700 mb-3">بيانات الاشتراك (أول مرة)</h3>
                    <label class="block text-sm font-bold text-gray-700">نوع الاشتراك</label>
                    <select id="sub_type" class="swal2-input mt-1">
                        <option value="monthly">شهري (30 يوم)</option>
                        <option value="term">فصلي (3 شهور)</option>
                        <option value="yearly">سنوي (سنة دراسية)</option>
                    </select>
                    <label class="block text-sm font-bold text-gray-700 mt-2">مبلغ الاشتراك</label>
                    <input type="number" id="sub_amount" class="swal2-input mt-1" placeholder="المبلغ المدفوع">
                </div>
            `;
        } else {
             htmlContent += `
                <select id="s_status" class="swal2-input">
                    <option value="active" ${student && student.status === 'active' ? 'selected' : ''}>نشط</option>
                    <option value="inactive" ${student && student.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                </select>
            `;
        }

        htmlContent += `</form>`;

        Swal.fire({
            title: isEdit ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد',
            html: htmlContent,
            width: isEdit ? '32em' : '40em',
            showCancelButton: true,
            confirmButtonText: isEdit ? 'حفظ التعديلات' : 'تسجيل وإصدار فاتورة',
            cancelButtonText: 'إلغاء',
            preConfirm: () => {
                const name = document.getElementById('s_name').value;
                const parent_name = document.getElementById('s_parent').value;
                const parent_phone = document.getElementById('s_phone').value;
                
                // Get checked subjects
                const checkboxes = document.querySelectorAll('input[name="subjects"]:checked');
                const subjects = Array.from(checkboxes).map(cb => cb.value);

                if (!name) {
                    Swal.showValidationMessage('اسم الطالب مطلوب');
                    return false;
                }

                if (subjects.length === 0) {
                     Swal.showValidationMessage('يرجى اختيار مادة/فئة واحدة على الأقل');
                     return false;
                }

                if (isEdit) {
                    const status = document.getElementById('s_status').value;
                    return { isEdit: true, data: { name, parent_name, parent_phone, subjects, status } };
                } else {
                    const sub_type = document.getElementById('sub_type').value;
                    const sub_amount = document.getElementById('sub_amount').value;
                    
                    if (!sub_amount) {
                         Swal.showValidationMessage('يرجى تحديد مبلغ الاشتراك');
                         return false;
                    }
                    
                    return { isEdit: false, data: { name, parent_name, parent_phone, subjects, status: 'active' }, sub: { type: sub_type, amount: sub_amount } };
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value.isEdit) {
                    DB.update('students', id, result.value.data);
                    Swal.fire('تم التعديل!', '', 'success');
                    App.router('students');
                } else {
                    // 1. Create Student
                    const currentUser = Auth.getCurrentUser();
                    const studentData = { ...result.value.data, created_by: currentUser.name };
                    const newStudent = DB.add('students', studentData);
                    
                    // 2. Create Subscription & Payment
                    Views.processSubscription(newStudent.id, result.value.sub.type, result.value.sub.amount);
                }
            }
        });
    },

    renewSubscription(studentId) {
        const student = DB.findById('students', studentId);
        
        // Get Subjects from DB
        const subjectsList = DB.getCollection('subjects') || [];
        const subjectsHtml = Views.buildGroupedSubjectsHtml(subjectsList, student && student.subjects ? student.subjects : [], 'ren_subjects');

        Swal.fire({
            title: `تجديد اشتراك: ${student.name}`,
            html: `
                <form class="text-right space-y-3">
                    <label class="block text-sm font-bold mt-2">نوع التجديد</label>
                    <select id="ren_type" class="swal2-input mt-1">
                        <option value="monthly">شهري (30 يوم)</option>
                        <option value="term">فصلي (3 شهور)</option>
                        <option value="yearly">سنوي</option>
                    </select>

                    <label class="block text-right text-gray-700 text-sm font-bold mb-2 mt-4">تجديد للمواد:</label>
                    <div id="ren_subjects_container" class="text-right grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                        ${subjectsHtml}
                    </div>

                    <label class="block text-sm font-bold mt-2">المبلغ</label>
                    <input type="number" id="ren_amount" class="swal2-input mt-1" placeholder="المبلغ" value="0">
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'تجديد وطباعة الفاتورة',
            preConfirm: () => {
                const type = document.getElementById('ren_type').value;
                const amount = document.getElementById('ren_amount').value;
                
                // Get checked subjects
                const checkboxes = document.querySelectorAll('input[name="ren_subjects"]:checked');
                const subjects = Array.from(checkboxes).map(cb => cb.value);

                if (subjects.length === 0) {
                     Swal.showValidationMessage('يرجى اختيار مادة واحدة على الأقل');
                     return false;
                }

                if (!amount || amount <= 0) {
                    Swal.showValidationMessage('الرجاء إدخال مبلغ صحيح');
                    return false;
                }
                return { type, amount, subjects };
            }
        }).then((res) => {
            if (res.isConfirmed) {
                Views.processSubscription(studentId, res.value.type, res.value.amount, res.value.subjects);
            }
        });
    },

    processSubscription(studentId, type, amount, subjects = null) {
        const startDate = new Date();
        const endDate = new Date();
        
        if (type === 'monthly') endDate.setDate(endDate.getDate() + 30);
        else if (type === 'term') endDate.setMonth(endDate.getMonth() + 3);
        else if (type === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);

        // Update Student Subjects if provided (e.g. during renewal or initial creation)
        if (subjects) {
            DB.update('students', studentId, { subjects: subjects });
        }

        // Create Subscription
        DB.add('subscriptions', {
            student_id: studentId,
            type,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            active: true
        });

        // Create Payment
        const currentUser = Auth.getCurrentUser();
        const invNum = DB.generateInvoiceNumber();
        
        // Get current student subjects if not provided (fallback)
        if (!subjects) {
             const student = DB.findById('students', studentId);
             subjects = student.subjects || [];
        }

        DB.add('payments', {
            student_id: studentId,
            amount: amount,
            date: new Date().toISOString(),
            staff_name: currentUser.name,
            invoice_number: invNum,
            type: type,
            subjects: subjects // Store specific subjects for this invoice
        });

        // Activate student if inactive
        const student = DB.findById('students', studentId);
        if (student.status !== 'active') {
            DB.update('students', studentId, { status: 'active' });
        }

        Swal.fire({
            icon: 'success',
            title: 'تمت العملية بنجاح',
            text: `تم تسجيل الاشتراك ورقم الفاتورة: ${invNum}`,
            confirmButtonText: 'طباعة الفاتورة',
            showCancelButton: true,
            cancelButtonText: 'إغلاق'
        }).then((res) => {
            App.router('students'); // Refresh View
            if (res.isConfirmed) {
                Views.printInvoice(invNum);
            }
        });
    },

    deleteStudent(id) {
        // Only Owner can delete sensitive data check
        if (!Auth.hasPermission('delete_data') && Auth.getCurrentUser().role !== 'owner') {
             Swal.fire('غير مصرح', 'لا تملك صلاحية الحذف', 'error');
             return;
        }

        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من التراجع عن هذا!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذف!',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                DB.delete('students', id);
                Swal.fire('تم الحذف!', 'تم حذف ملف الطالب.', 'success');
                App.router('students');
            }
        })
    },

    viewStudentDetails(id) {
        const student = DB.findById('students', id);
        // Show details + Subscriptions history
        const subs = DB.where('subscriptions', s => s.student_id == id);
        
        let subHtml = subs.map(s => `
            <li class="border-b py-2 flex justify-between">
                <span>${s.type === 'monthly' ? 'شهري' : 'سنوي'}</span>
                <span>${s.start_date} - ${s.end_date}</span>
                <span class="${s.active ? 'text-green-600' : 'text-red-600'}">${s.active ? 'ساري' : 'منتهي'}</span>
            </li>
        `).join('');

        Swal.fire({
            title: student.name,
            html: `
                <div class="text-right">
                    <p><strong>ولي الأمر:</strong> ${student.parent_name}</p>
                    <p><strong>الهاتف:</strong> ${student.parent_phone}</p>
                    <hr class="my-3">
                    <h4 class="font-bold mb-2">سجل الاشتراكات</h4>
                    <ul class="text-sm">
                        ${subHtml || 'لا يوجد اشتراكات'}
                    </ul>
                </div>
            `,
            width: '600px'
        });
    },

    // FINANCE VIEWS
    renderFinance(container) {
        const canManage = Auth.hasPermission('manage_finance');
        const payments = DB.getCollection('payments');
        const expenses = DB.getCollection('expenses') || [];
        
        container.innerHTML = `
             <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">الحسابات والاشتراكات</h2>
                ${canManage ? `
                <div class="space-x-2 space-x-reverse">
                    <button onclick="Views.openNewSubscriptionModal()" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow">
                        <i class="fas fa-plus ml-2"></i> سند قبض (اشتراك)
                    </button>
                    <button onclick="Views.openNewExpenseModal()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow">
                        <i class="fas fa-minus ml-2"></i> تسجيل مصروف
                    </button>
                </div>
                ` : ''}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Income Section -->
                <div class="bg-white shadow-md rounded overflow-hidden">
                    <h3 class="p-4 text-lg font-bold border-b text-green-700 bg-green-50">سجل الفواتير المقبوضة (الدخل)</h3>
                    <div class="overflow-x-auto max-h-96">
                        <table class="min-w-full table-auto">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-right">رقم الفاتورة</th>
                                    <th class="py-2 px-4 text-right">الطالب</th>
                                    <th class="py-2 px-4 text-right">المبلغ</th>
                                    <th class="py-2 px-4 text-center">طباعة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${payments.slice().reverse().map(p => {
                                    const student = DB.findById('students', p.student_id);
                                    return `
                                    <tr class="border-b hover:bg-gray-50 text-sm">
                                        <td class="py-2 px-4">${p.invoice_number}</td>
                                        <td class="py-2 px-4">${student ? student.name : 'محذوف'}</td>
                        <td class="py-2 px-4 font-bold text-green-600">${App.formatCurrency(p.amount)}</td>
                                        <td class="py-2 px-4 text-center">
                                            <button onclick="Views.printInvoice('${p.invoice_number}')" class="text-blue-500">
                                                <i class="fas fa-print"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Expenses Section -->
                <div class="bg-white shadow-md rounded overflow-hidden">
                    <h3 class="p-4 text-lg font-bold border-b text-red-700 bg-red-50">سجل المصروفات</h3>
                    <div class="overflow-x-auto max-h-96">
                        <table class="min-w-full table-auto">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-right">البند</th>
                                    <th class="py-2 px-4 text-right">المبلغ</th>
                                    <th class="py-2 px-4 text-right">التاريخ</th>
                                    <th class="py-2 px-4 text-right">بواسطة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${expenses.slice().reverse().map(e => `
                                    <tr class="border-b hover:bg-gray-50 text-sm">
                                        <td class="py-2 px-4">${e.title}</td>
                        <td class="py-2 px-4 font-bold text-red-600">${App.formatCurrency(e.amount)}</td>
                        <td class="py-2 px-4">${App.formatDate(e.date)}</td>
                                        <td class="py-2 px-4">${e.added_by}</td>
                                    </tr>
                                `).join('')}
                                ${expenses.length === 0 ? '<tr><td colspan="4" class="text-center py-4">لا يوجد مصروفات</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    openNewExpenseModal() {
        Swal.fire({
            title: 'تسجيل مصروف جديد',
            html: `
                <form class="text-right space-y-3">
                    <input type="text" id="ex_title" class="swal2-input" placeholder="وصف المصروف (كهرباء، صيانة، ...)">
                    <input type="number" id="ex_amount" class="swal2-input" placeholder="المبلغ">
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'حفظ',
            focusConfirm: false,
            didOpen: (el) => {
                const title = el.querySelector('#ex_title');
                if (title) {
                    title.removeAttribute('readonly');
                    title.focus();
                }
                const amount = el.querySelector('#ex_amount');
                if (amount) {
                    amount.removeAttribute('readonly');
                }
            },
            preConfirm: () => {
                const title = document.getElementById('ex_title').value;
                const amount = document.getElementById('ex_amount').value;
                if (!title || !amount) {
                    Swal.showValidationMessage('جميع الحقول مطلوبة');
                    return false;
                }
                return { title, amount };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const currentUser = Auth.getCurrentUser();
                DB.add('expenses', {
                    title: result.value.title,
                    amount: result.value.amount,
                    date: new Date().toISOString(),
                    added_by: currentUser.name
                });
                Swal.fire('تم الحفظ', '', 'success');
                App.router('finance');
            }
        });
    },

    openNewSubscriptionModal() {
        // Need to select student first
        const students = DB.where('students', s => s.status === 'active'); // Only active students can subscribe? Or allow inactive to re-subscribe? Let's allow all.
        const allStudents = DB.getCollection('students');

        if (allStudents.length === 0) {
            Swal.fire('تنبيه', 'يجب إضافة طلاب أولاً', 'info');
            return;
        }

        let studentOptions = allStudents.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

        Swal.fire({
            title: 'تجديد اشتراك / فاتورة جديدة',
            html: `
                <form class="text-right space-y-3">
                    <label class="block text-sm font-bold">الطالب</label>
                    <select id="inv_student" class="swal2-input mt-1">${studentOptions}</select>
                    
                    <label class="block text-sm font-bold mt-2">نوع الاشتراك</label>
                    <select id="inv_type" class="swal2-input mt-1">
                        <option value="monthly">شهري</option>
                        <option value="term">فصلي (3 شهور)</option>
                        <option value="yearly">سنوي</option>
                    </select>

                    <label class="block text-sm font-bold mt-2">المبلغ</label>
                    <input type="number" id="inv_amount" class="swal2-input mt-1" placeholder="المبلغ" value="0">
                </form>
            `,
            confirmButtonText: 'إصدار الفاتورة',
            showCancelButton: true,
            preConfirm: () => {
                const studentId = document.getElementById('inv_student').value;
                const type = document.getElementById('inv_type').value;
                const amount = document.getElementById('inv_amount').value;
                
                if (!amount || amount <= 0) {
                    Swal.showValidationMessage('الرجاء إدخال مبلغ صحيح');
                    return false;
                }
                return { studentId, type, amount };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { studentId, type, amount } = result.value;
                const startDate = new Date();
                const endDate = new Date();
                
                if (type === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
                else if (type === 'term') endDate.setMonth(endDate.getMonth() + 3);
                else if (type === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);

                // Create Subscription
                DB.add('subscriptions', {
                    student_id: studentId,
                    type,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    active: true
                });

                // Create Payment
                const currentUser = Auth.getCurrentUser();
                const invNum = DB.generateInvoiceNumber();
                
                const payment = DB.add('payments', {
                    student_id: studentId,
                    amount: amount,
                    date: new Date().toISOString(),
                    staff_name: currentUser.name,
                    invoice_number: invNum,
                    type: type
                });

                Swal.fire({
                    icon: 'success',
                    title: 'تمت العملية بنجاح',
                    text: `رقم الفاتورة: ${invNum}`,
                    confirmButtonText: 'طباعة',
                    showCancelButton: true,
                    cancelButtonText: 'إغلاق'
                }).then((res) => {
                    App.router('finance'); // Refresh
                    if (res.isConfirmed) {
                        Views.printInvoice(invNum);
                    }
                });
            }
        });
    },

    printInvoice(invoiceNum) {
        const payments = DB.getCollection('payments');
        const payment = payments.find(p => p.invoice_number === invoiceNum);
        if (!payment) return;

        const student = DB.findById('students', payment.student_id);

        // Create a printable window/iframe or just replace body content temporarily
        // For SPA without PDF library complexity, opening a new window is best.
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html dir="rtl" lang="ar">
            <head>
                <title>فاتورة ${invoiceNum}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .info { margin-bottom: 30px; }
                    .info p { margin: 5px 0; font-size: 18px; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table th, .table td { border: 1px solid #ccc; padding: 10px; text-align: center; }
                    .total { text-align: left; margin-top: 20px; font-size: 24px; font-weight: bold; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ركن المعرفة</h1>
                    <p>سند قبض / فاتورة ضريبية مبسطة</p>
                </div>
                
                <div class="info">
                    <p><strong>رقم الفاتورة:</strong> ${payment.invoice_number}</p>
                    <p><strong>التاريخ:</strong> ${App.formatDate(payment.date)}</p>
                    <p><strong>استلمنا من السيد/ة:</strong> ${student.name}</p>
                    <p><strong>الموظف المسؤول:</strong> ${payment.staff_name}</p>
                    <p><strong>المواد/الفئات:</strong> ${payment.subjects && payment.subjects.length > 0 ? payment.subjects.join('، ') : (student.subjects && student.subjects.length > 0 ? student.subjects.join('، ') : '-')}</p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>الوصف</th>
                            <th>المبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>رسوم اشتراك (${payment.type === 'monthly' ? 'شهري' : payment.type === 'term' ? 'فصلي' : 'سنوي'})</td>
                            <td>${App.formatCurrency(payment.amount)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="total">
                    الإجمالي: ${App.formatCurrency(payment.amount)}
                </div>

                <div class="footer">
                    تم إصدار هذه الفاتورة إلكترونياً
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    renderUsers(container) {
        // Only Owner
        if (Auth.getCurrentUser().role !== 'owner') {
            container.innerHTML = '<p class="text-red-500">غير مصرح لك بالوصول لهذه الصفحة</p>';
            return;
        }

        const users = DB.getCollection('users');

        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">إدارة المستخدمين</h2>
                <button onclick="Views.openUserModal()" class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
                    <i class="fas fa-plus ml-2"></i> مستخدم جديد
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${users.map(u => `
                    <div class="bg-white rounded shadow p-6 border-t-4 border-${u.role === 'owner' ? 'red' : u.role === 'reception' ? 'green' : 'blue'}-500">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-lg">${u.name}</h3>
                            <span class="bg-gray-200 text-xs px-2 py-1 rounded">${App.getRoleName(u.role)}</span>
                        </div>
                        <p class="text-gray-600 mb-2"><i class="fas fa-user ml-2"></i> ${u.username}</p>
                        ${u.id !== 1 ? `
                        <button onclick="Views.deleteUser(${u.id})" class="text-red-500 hover:text-red-700 text-sm mt-2">
                            <i class="fas fa-trash"></i> حذف المستخدم
                        </button>
                        ` : '<span class="text-xs text-gray-400">حساب رئيسي</span>'}
                    </div>
                `).join('')}
            </div>
        `;
    },

    openUserModal() {
        Swal.fire({
            title: 'إضافة مستخدم جديد',
            html: `
                <form class="text-right space-y-3">
                    <input type="text" id="u_name" class="swal2-input" placeholder="الاسم الكامل">
                    <input type="text" id="u_username" class="swal2-input" placeholder="اسم المستخدم">
                    <input type="password" id="u_password" class="swal2-input" placeholder="كلمة المرور">
                    <select id="u_role" class="swal2-input">
                        <option value="reception">موظف استقبال</option>
                        <option value="owner">مدير (Owner)</option>
                    </select>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'إضافة',
            preConfirm: () => {
                const name = document.getElementById('u_name').value;
                const username = document.getElementById('u_username').value;
                const password = document.getElementById('u_password').value;
                const role = document.getElementById('u_role').value;

                if (!name || !username || !password) {
                    Swal.showValidationMessage('جميع الحقول مطلوبة');
                    return false;
                }
                return { name, username, password, role };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                DB.add('users', result.value);
                Swal.fire('تم!', 'تم إضافة المستخدم بنجاح', 'success');
                App.router('users');
            }
        });
    },

    deleteUser(id) {
        Swal.fire({
            title: 'حذف المستخدم؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'حذف'
        }).then((res) => {
            if (res.isConfirmed) {
                DB.delete('users', id);
                App.router('users');
                Swal.fire('تم الحذف', '', 'success');
            }
        });
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

 window.App = App;
 window.Views = Views;
