// ==================== AUTH CHECK ====================
function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    window.location.href = 'index.html';
}

// ==================== PROJECT DATA MANAGEMENT ====================
function getProjects() {
    const projects = localStorage.getItem('adminProjects');
    return projects ? JSON.parse(projects) : [];
}

function saveProjects(projects) {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
}

function addProject(project) {
    const projects = getProjects();
    project.id = Date.now().toString();
    project.createdAt = new Date().toISOString();
    projects.push(project);
    saveProjects(projects);
    return project;
}

function updateProject(id, updatedProject) {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedProject };
        saveProjects(projects);
        return projects[index];
    }
    return null;
}

function deleteProject(id) {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveProjects(filtered);
}

function getProjectById(id) {
    const projects = getProjects();
    return projects.find(p => p.id === id);
}

// ==================== PARTNERS MANAGEMENT ====================
function getPartners() {
    const partners = localStorage.getItem('adminPartners');
    return partners ? JSON.parse(partners) : [];
}

function savePartners(partners) {
    localStorage.setItem('adminPartners', JSON.stringify(partners));
}

function addPartner(partner) {
    const partners = getPartners();
    partner.id = Date.now().toString();
    partner.createdAt = new Date().toISOString();
    partners.push(partner);
    savePartners(partners);
    return partner;
}

function updatePartner(id, updatedPartner) {
    const partners = getPartners();
    const index = partners.findIndex(p => p.id === id);
    if (index !== -1) {
        partners[index] = { ...partners[index], ...updatedPartner };
        savePartners(partners);
        return partners[index];
    }
    return null;
}

function deletePartner(id) {
    const partners = getPartners();
    const filtered = partners.filter(p => p.id !== id);
    savePartners(filtered);
}

function getPartnerById(id) {
    const partners = getPartners();
    return partners.find(p => p.id === id);
}

// ==================== CONTACT MESSAGES MANAGEMENT ====================
function getMessages() {
    const messages = localStorage.getItem('adminMessages');
    return messages ? JSON.parse(messages) : [];
}

function saveMessages(messages) {
    localStorage.setItem('adminMessages', JSON.stringify(messages));
}

function addMessage(message) {
    const messages = getMessages();
    message.id = Date.now().toString();
    message.createdAt = new Date().toISOString();
    message.status = 'new';
    messages.unshift(message); // Add to beginning
    saveMessages(messages);
    return message;
}

function deleteMessage(id) {
    const messages = getMessages();
    const filtered = messages.filter(m => m.id !== id);
    saveMessages(filtered);
}

function markAsRead(id) {
    const messages = getMessages();
    const message = messages.find(m => m.id === id);
    if (message) {
        message.status = 'read';
        saveMessages(messages);
    }
}

function getUnreadCount() {
    const messages = getMessages();
    return messages.filter(m => m.status === 'new').length;
}

// ==================== STATISTICS ====================
function getStats() {
    const projects = getProjects();

    return {
        totalProjects: projects.length,
        erpProjects: projects.filter(p => p.category === 'erp').length,
        crmProjects: projects.filter(p => p.category === 'crm').length,
        mobileProjects: projects.filter(p => p.category === 'mobile').length,
        webProjects: projects.filter(p => p.category === 'web').length
    };
}

// ==================== INITIALIZE DEMO DATA ====================
function initializeDemoData() {
    const projects = getProjects();

    // If no projects, add demo data
    if (projects.length === 0) {
        const demoProjects = [
            {
                id: '1',
                title: 'FinTech ERP System',
                category: 'erp',
                client: 'FinanceHub LLC',
                date: '2023-12',
                tech: ['Laravel', 'Vue.js', 'PostgreSQL'],
                description: 'Moliya sektorida to\'liq avtomatlashtirish tizimi',
                features: ['Buxgalteriya', 'Ombor', 'HR moduli'],
                results: ['70% tezlashdi', '85% xatolar kamaydi'],
                status: 'completed',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Sales CRM Platform',
                category: 'crm',
                client: 'SalesBoost Inc',
                date: '2024-01',
                tech: ['Django', 'React', 'MySQL'],
                description: 'Sotuv bo\'limi uchun CRM platformasi',
                features: ['Lid boshqaruvi', 'Mijozlar bazasi'],
                results: ['45% sotuv oshdi', '60% konversiya'],
                status: 'completed',
                createdAt: new Date().toISOString()
            }
        ];

        saveProjects(demoProjects);
    }

    // Initialize Partners Demo Data
    const partners = getPartners();
    if (partners.length === 0) {
        const demoPartners = [
            { id: '1', name: 'TechCorp', logo: 'fas fa-building', color: '#0071E3', createdAt: new Date().toISOString() },
            { id: '2', name: 'InnovateLab', logo: 'fas fa-rocket', color: '#10B981', createdAt: new Date().toISOString() },
            { id: '3', name: 'DataFlow', logo: 'fas fa-chart-line', color: '#F59E0B', createdAt: new Date().toISOString() },
            { id: '4', name: 'GlobalTech', logo: 'fas fa-globe', color: '#8B5CF6', createdAt: new Date().toISOString() },
            { id: '5', name: 'CloudSystems', logo: 'fas fa-cloud', color: '#06B6D4', createdAt: new Date().toISOString() },
            { id: '6', name: 'SecureNet', logo: 'fas fa-shield-alt', color: '#EF4444', createdAt: new Date().toISOString() }
        ];
        savePartners(demoPartners);
    }
}

