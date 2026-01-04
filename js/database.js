// Database Management JavaScript Module
const DatabaseManager = {
    // Validate data integrity
    validateData() {
        const issues = [];
        const data = DB.getAll();
        
        // Check required collections
        const requiredCollections = ['users', 'students', 'payments', 'expenses'];
        requiredCollections.forEach(collection => {
            if (!data[collection]) {
                issues.push(`مجموعة ${collection} غير موجودة`);
            }
        });
        
        // Check data relationships
        const payments = data.payments || [];
        const students = data.students || [];
        
        payments.forEach(payment => {
            if (!students.find(s => s.id === payment.studentId)) {
                issues.push(`دفعة ${payment.id} تشير إلى طالب غير موجود`);
            }
        });
        
        return issues;
    },
    
    // Compress database
    compress() {
        const data = DB.getAll();
        
        // Remove old logs (keep last 100)
        const logs = data.logs || [];
        const recentLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100);
        data.logs = recentLogs;
        
        // Remove invalid data
        Object.keys(data).forEach(collection => {
            if (Array.isArray(data[collection])) {
                data[collection] = data[collection].filter(item => item && item.id);
            }
        });
        
        DB.save(data);
        return true;
    },
    
    // Create backup
    createBackup() {
        const data = DB.getAll();
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: data
        };
        
        return JSON.stringify(backup, null, 2);
    },
    
    // Restore from backup
    restore(backupData) {
        try {
            const backup = JSON.parse(backupData);
            if (backup.data) {
                DB.save(backup.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Restore error:', error);
            return false;
        }
    },
    
    // Get database statistics
    getStats() {
        const data = DB.getAll();
        const stats = {};
        
        Object.keys(data).forEach(collection => {
            if (Array.isArray(data[collection])) {
                stats[collection] = data[collection].length;
            }
        });
        
        return stats;
    },
    
    // Clear old data
    clearOldData(daysOld = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const data = DB.getAll();
        
        // Clear old logs
        if (data.logs) {
            data.logs = data.logs.filter(log => new Date(log.timestamp) > cutoffDate);
        }
        
        // Clear old payments (optional - usually we keep all financial records)
        // This is just an example - you might want to keep all payment records
        
        DB.save(data);
        return true;
    }
};

// Make available globally
window.DatabaseManager = DatabaseManager;
