const Auth = {
    userKey: 'school_system_user',

    // Login
    login(username, password) {
        const users = DB.getCollection('users');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Prevent teacher login as per new requirement
            if (user.role === 'teacher') {
                 return { success: false, message: 'عذراً، الدخول مخصص للإدارة والموظفين فقط' };
            }

            localStorage.setItem(this.userKey, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    },

    // Logout
    logout() {
        localStorage.removeItem(this.userKey);
        window.location.reload();
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if logged in
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // Check permission
    // owner: all
    // reception: students (read/write), finance (read/write limited), no delete sensitive
    // teacher: read only specific
    hasPermission(action) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (user.role === 'owner') return true;

        switch (action) {
            case 'manage_students': // Create/Edit students
                return user.role === 'reception';
            case 'view_students':
                return user.role === 'reception' || user.role === 'teacher';
            case 'manage_finance': // Add payments/expenses
                return user.role === 'reception';
            case 'view_finance':
                return user.role === 'reception' || user.role === 'owner'; // Teacher cannot see finance
            case 'delete_data':
                return false; // Only owner (handled by top check)
            case 'manage_users':
                return false; // Only owner
            default:
                return false;
        }
    }
};

 window.Auth = Auth;
