const DB = {
    key: 'school_system_db',
    
    // Initialize Database
    init() {
        if (!localStorage.getItem(this.key)) {
            const initialData = {
                users: [
                    { id: 1, name: 'المدير العام', username: 'owner', password: 'Libya@2025', role: 'owner', created_at: new Date().toISOString() },
                ],
                students: [],
                subscriptions: [],
                payments: [],
                expenses: [],
                logs: [],
                subjects: [
                    'الرياضيات',
                    'العلوم',
                    'اللغة الإنجليزية',
                    'اللغة العربية',
                    'التربية الإسلامية',
                    'الحاسب الآلي',
                    'الفيزياء',
                    'الكيمياء'
                ],
                settings: {
                    schoolName: 'ركن المعرفة',
                    logo: '',
                    phone: '0910000000',
                    locale: 'ar-LY',
                    currencySymbol: 'د.ل'
                }
            };
            this.save(initialData);
            console.log('Database initialized.');
        }
    },

    // Get all data
    getAll() {
        return JSON.parse(localStorage.getItem(this.key));
    },

    // Save all data
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    // Generic collection getter
    getCollection(collection) {
        const data = this.getAll();
        if (collection === 'subjects') {
            const canonical = this.getCanonicalSubjects();
            if (!data.subjects || JSON.stringify(data.subjects) !== JSON.stringify(canonical)) {
                data.subjects = canonical;
                this.save(data);
            }
        }

        return data[collection] || [];
    },

    getCanonicalSubjects() {
        return [
            'روضة',
            'KG1',
            'KG2',
            'تأسيس',
            'شنطة صف أول',
            'شنطة صف ثاني',
            'شنطة صف ثالث',
            'صف أول - عربي',
            'صف أول - رياضيات',
            'صف أول - إنجليزي',
            'صف أول - دين',
            'صف ثاني - عربي',
            'صف ثاني - رياضيات',
            'صف ثاني - إنجليزي',
            'صف ثاني - دين',
            'صف ثالث - عربي',
            'صف ثالث - رياضيات',
            'صف ثالث - إنجليزي',
            'صف ثالث - دين',
            'شنطة صف رابع',
            'شنطة صف خامس',
            'شنطة صف سادس',
            'شنطة صف سابع',
            'صف رابع - عربي',
            'صف رابع - رياضيات',
            'صف رابع - إنجليزي',
            'صف رابع - دين',
            'صف رابع - حاسوب',
            'صف رابع - جغرافيا',
            'صف خامس - عربي',
            'صف خامس - رياضيات',
            'صف خامس - إنجليزي',
            'صف خامس - دين',
            'صف خامس - حاسوب',
            'صف خامس - جغرافيا',
            'صف سادس - عربي',
            'صف سادس - رياضيات',
            'صف سادس - إنجليزي',
            'صف سادس - دين',
            'صف سادس - حاسوب',
            'صف سادس - جغرافيا',
            'صف سابع - عربي',
            'صف سابع - رياضيات',
            'صف سابع - إنجليزي',
            'صف سابع - دين',
            'صف سابع - حاسوب',
            'صف سابع - جغرافيا',
            'صف ثامن - عربي',
            'صف ثامن - رياضيات',
            'صف ثامن - إنجليزي',
            'صف ثامن - دين',
            'صف ثامن - حاسوب',
            'صف ثامن - جغرافيا',
            'صف تاسع - عربي',
            'صف تاسع - رياضيات',
            'صف تاسع - إنجليزي',
            'صف تاسع - دين',
            'صف تاسع - حاسوب',
            'صف تاسع - جغرافيا',
            'أول ثانوي - كيمياء',
            'أول ثانوي - رياضيات',
            'أول ثانوي - فيزياء',
            'أول ثانوي - إحصاء',
            'ثاني ثانوي - كيمياء',
            'ثاني ثانوي - رياضيات',
            'ثاني ثانوي - فيزياء',
            'ثاني ثانوي - إحصاء',
            'ثاني ثانوي - مكانيكا',
            'ثالث ثانوي - كيمياء',
            'ثالث ثانوي - رياضيات',
            'ثالث ثانوي - فيزياء',
            'ثالث ثانوي - إحصاء',
            'ثالث ثانوي - مكانيكا'
        ];
    },

    addLog(entry) {
        const data = this.getAll();
        if (!data.logs) data.logs = [];
        entry.id = Date.now();
        data.logs.push(entry);
        this.save(data);
        return entry;
    },
    
    // Find item by ID
    findById(collection, id) {
        const list = this.getCollection(collection);
        return list.find(item => item.id == id);
    },

    // Add item
    add(collection, item) {
        const data = this.getAll();
        if (!data[collection]) data[collection] = [];
        
        item.id = Date.now(); // Simple ID generation
        item.created_at = new Date().toISOString();
        
        data[collection].push(item);
        this.save(data);
        const user = (typeof Auth !== 'undefined' && Auth.getCurrentUser && Auth.getCurrentUser()) ? Auth.getCurrentUser().name : 'system';
        this.addLog({ time: new Date().toISOString(), user, op: 'add', collection, item_id: item.id, details: JSON.stringify(item).slice(0, 200) });
        return item;
    },

    // Update item
    update(collection, id, updates) {
        const data = this.getAll();
        const index = data[collection].findIndex(item => item.id == id);
        
        if (index !== -1) {
            data[collection][index] = { ...data[collection][index], ...updates };
            this.save(data);
            const user = (typeof Auth !== 'undefined' && Auth.getCurrentUser && Auth.getCurrentUser()) ? Auth.getCurrentUser().name : 'system';
            this.addLog({ time: new Date().toISOString(), user, op: 'update', collection, item_id: id, details: JSON.stringify(updates).slice(0, 200) });
            return data[collection][index];
        }
        return null;
    },

    // Delete item
    delete(collection, id) {
        const data = this.getAll();
        data[collection] = data[collection].filter(item => item.id != id);
        this.save(data);
        const user = (typeof Auth !== 'undefined' && Auth.getCurrentUser && Auth.getCurrentUser()) ? Auth.getCurrentUser().name : 'system';
        this.addLog({ time: new Date().toISOString(), user, op: 'delete', collection, item_id: id, details: '' });
    },

    // Query helper
    where(collection, conditionFn) {
        const list = this.getCollection(collection);
        return list.filter(conditionFn);
    },

    // Specific Helpers
    
    // Check if subscription is active
    isSubscriptionActive(sub) {
        if (!sub) return false;
        const today = new Date();
        const end = new Date(sub.end_date);
        return today <= end;
    },

    // Generate Invoice Number
    generateInvoiceNumber() {
        const payments = this.getCollection('payments');
        return `INV-${new Date().getFullYear()}-${(payments.length + 1).toString().padStart(4, '0')}`;
    },

    // Aliases for backward compatibility
    addDocument(collection, item) {
        return this.add(collection, item);
    },

    updateDocument(collection, id, updates) {
        return this.update(collection, id, updates);
    },

    deleteDocument(collection, id) {
        return this.delete(collection, id);
    },

    saveCollection(collection, data) {
        const allData = this.getAll();
        allData[collection] = data;
        this.save(allData);
    }
};

// Initialize on load
DB.init();
