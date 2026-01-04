// Reports JavaScript Module
const Reports = {
    // Export to CSV
    exportToCSV(data, filename) {
        let csv = '';
        
        // Get headers from first object
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            csv += headers.join(',') + '\n';
            
            // Add data rows
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' ? `"${value}"` : value;
                });
                csv += values.join(',') + '\n';
            });
        }
        
        this.downloadFile(csv, filename, 'text/csv');
    },
    
    // Export to PDF (placeholder for future implementation)
    exportToPDF(data, filename) {
        // This would require a PDF library like jsPDF
        console.log('PDF export not yet implemented');
    },
    
    // Download file
    downloadFile(content, filename, contentType) {
        const blob = new Blob(['\ufeff' + content], { type: `${contentType};charset=utf-8;` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },
    
    // Generate report summary
    generateSummary(payments, expenses) {
        const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const netBalance = totalIncome - totalExpenses;
        
        return {
            totalIncome,
            totalExpenses,
            netBalance,
            transactionCount: payments.length + expenses.length
        };
    }
};

// Make available globally
window.Reports = Reports;
