// Launcher.js
class Launcher {
    constructor() {
        this.projects = [];
        this.storageKey = 'vertex_launcher_data';
        this.editorPath = '../index.html';  // ← ТОЧНО index.html
        this.loadData();
        this.init();
    }
    
    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            this.projects = data.projects || [];
            this.editorPath = data.editorPath || '../index.html';
        }
    }
    
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            projects: this.projects,
            editorPath: this.editorPath
        }));
    }
    
    init() {
        this.renderProjects();
        this.setupEventListeners();
        this.loadNews();
    }
    
    renderProjects() {
        const container = document.getElementById('projects-list');
        if (!container) return;
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📂 Нет недавних проектов</p>
                    <p class="empty-hint">Создайте новый проект или откройте существующий</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.projects.map(project => `
            <div class="project-item" data-path="${project.path}">
                <div class="project-info">
                    <div class="project-name">${this.escapeHtml(project.name)}</div>
                    <div class="project-path">${this.escapeHtml(project.path)}</div>
                    <div class="project-date">${project.lastOpened || '—'}</div>
                </div>
                <div class="project-actions">
                    <button class="project-action-btn open-project" data-path="${project.path}">Открыть</button>
                    <button class="project-action-btn remove-project" data-path="${project.path}">🗑</button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.open-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const path = btn.getAttribute('data-path');
                this.openProject(path);
            });
        });
        
        document.querySelectorAll('.remove-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const path = btn.getAttribute('data-path');
                this.removeProject(path);
            });
        });
        
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('project-action-btn')) return;
                const path = item.getAttribute('data-path');
                this.openProject(path);
            });
        });
    }
    
    addProject(name, path, template = 'empty') {
        const existing = this.projects.find(p => p.path === path);
        if (existing) {
            this.openProject(path);
            return;
        }
        
        const project = {
            name: name,
            path: path,
            template: template,
            createdAt: new Date().toISOString(),
            lastOpened: new Date().toLocaleString()
        };
        
        this.projects.unshift(project);
        this.saveData();
        this.renderProjects();
        this.createProjectFile(path, name, template);
        
        return project;
    }
    
    createProjectFile(projectPath, projectName, template) {
        const projectData = {
            name: projectName,
            version: '1.0',
            created: new Date().toISOString(),
            template: template,
            scenes: ['main'],
            currentScene: 'main'
        };
        
        const projectKey = `vertex_project_${projectPath.replace(/[^a-zA-Z0-9]/g, '_')}`;
        localStorage.setItem(projectKey, JSON.stringify(projectData));
        
        console.log(`✅ Создан проект: ${projectName} по пути ${projectPath}`);
    }
    
    openProject(projectPath) {
        const project = this.projects.find(p => p.path === projectPath);
        if (project) {
            project.lastOpened = new Date().toLocaleString();
            this.saveData();
            this.renderProjects();
        }
        
        localStorage.setItem('vertex_current_project', JSON.stringify({
            path: projectPath,
            name: project?.name || 'Unknown'
        }));
        
        // ПРЯМОЙ ПЕРЕХОД НА index.html
        const editorUrl = `../index.html?project=${encodeURIComponent(projectPath)}`;
        console.log(`🚀 Открываем редактор: ${editorUrl}`);
        window.location.href = editorUrl;
    }
    
    removeProject(projectPath) {
        if (confirm('Удалить проект из списка недавних? Файлы проекта останутся на диске.')) {
            this.projects = this.projects.filter(p => p.path !== projectPath);
            this.saveData();
            this.renderProjects();
        }
    }
    
    createNewProject() {
        const modal = document.getElementById('new-project-modal');
        const nameInput = document.getElementById('project-name');
        const pathInput = document.getElementById('project-path');
        const templateSelect = document.getElementById('project-template');
        
        nameInput.value = '';
        pathInput.value = '';
        templateSelect.value = 'empty';
        
        modal.style.display = 'flex';
        
        const browseBtn = document.getElementById('browse-path-btn');
        const handleBrowse = () => {
            const suggestedPath = nameInput.value ? 
                `${nameInput.value.toLowerCase().replace(/[^a-z0-9]/g, '_')}_project` : 
                'my_vertex_project';
            pathInput.value = suggestedPath;
        };
        browseBtn.onclick = handleBrowse;
        
        const confirmBtn = document.getElementById('confirm-create-btn');
        const handleConfirm = () => {
            const name = nameInput.value.trim();
            let path = pathInput.value.trim();
            const template = templateSelect.value;
            
            if (!name) {
                alert('Введите название проекта');
                return;
            }
            
            if (!path) {
                path = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
            
            this.addProject(name, path, template);
            modal.style.display = 'none';
            
            confirmBtn.removeEventListener('click', handleConfirm);
            browseBtn.removeEventListener('click', handleBrowse);
        };
        confirmBtn.onclick = handleConfirm;
        
        const closeModal = () => {
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', handleConfirm);
            browseBtn.removeEventListener('click', handleBrowse);
        };
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = closeModal;
        
        const cancelBtn = document.getElementById('cancel-project-btn');
        cancelBtn.onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }
    
    openExistingProject() {
        const projectName = prompt('Введите название проекта для открытия:', 'Мой проект');
        if (projectName) {
            const projectPath = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const existing = this.projects.find(p => p.path === projectPath);
            
            if (existing) {
                this.openProject(projectPath);
            } else {
                if (confirm(`Проект "${projectName}" не найден. Создать новый?`)) {
                    this.addProject(projectName, projectPath, 'empty');
                }
            }
        }
    }
    
    openSettings() {
        const modal = document.getElementById('settings-modal');
        const editorPathInput = document.getElementById('editor-path');
        
        editorPathInput.value = this.editorPath;
        
        modal.style.display = 'flex';
        
        const saveBtn = document.getElementById('save-settings-btn');
        const handleSave = () => {
            this.editorPath = editorPathInput.value || '../index.html';
            this.saveData();
            modal.style.display = 'none';
            saveBtn.removeEventListener('click', handleSave);
        };
        saveBtn.onclick = handleSave;
        
        const closeModal = () => {
            modal.style.display = 'none';
            saveBtn.removeEventListener('click', handleSave);
        };
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }
    
    loadNews() {
        const newsContainer = document.getElementById('news-list');
        if (!newsContainer) return;
        
        const news = [
            {
                date: 'Сегодня',
                title: 'Vertex Engine v1.0.0',
                content: 'Первый релиз! Включает редактор сцен, систему блюпринтов и экспорт в игру.',
                tag: 'Обновление'
            },
            {
                date: 'В разработке',
                title: 'Система анимаций',
                content: 'Скоро появится визуальный редактор анимаций и контроллер состояний.',
                tag: 'Анонс'
            },
            {
                date: 'Планируется',
                title: 'Мультиплеер',
                content: 'Поддержка сетевой игры и выделенных серверов.',
                tag: 'Дорожная карта'
            }
        ];
        
        this.renderNews(news);
    }
    
    renderNews(news) {
        const container = document.getElementById('news-list');
        if (!container) return;
        
        container.innerHTML = news.map(item => `
            <div class="news-item">
                <div class="news-date">${this.escapeHtml(item.date)}</div>
                <div class="news-title">${this.escapeHtml(item.title)}</div>
                <div class="news-content">${this.escapeHtml(item.content)}</div>
                <div class="news-tag">${this.escapeHtml(item.tag)}</div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        const newBtn = document.getElementById('new-project-btn');
        if (newBtn) newBtn.onclick = () => this.createNewProject();
        
        const openBtn = document.getElementById('open-project-btn');
        if (openBtn) openBtn.onclick = () => this.openExistingProject();
        
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) settingsBtn.onclick = () => this.openSettings();
        
        const docsBtn = document.getElementById('docs-btn');
        if (docsBtn) docsBtn.onclick = () => window.open('#', '_blank');
        
        const tutorialsLink = document.getElementById('tutorials-link');
        const forumLink = document.getElementById('forum-link');
        const assetsLink = document.getElementById('assets-link');
        const githubLink = document.getElementById('github-link');
        
        if (tutorialsLink) tutorialsLink.onclick = () => window.open('#', '_blank');
        if (forumLink) forumLink.onclick = () => window.open('#', '_blank');
        if (assetsLink) assetsLink.onclick = () => window.open('#', '_blank');
        if (githubLink) githubLink.onclick = () => window.open('#', '_blank');
        
        document.querySelectorAll('.template-card').forEach(card => {
            card.onclick = () => {
                const template = card.getAttribute('data-template');
                const modal = document.getElementById('new-project-modal');
                const templateSelect = document.getElementById('project-template');
                if (templateSelect) templateSelect.value = template;
                modal.style.display = 'flex';
            };
        });
    }
    
    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// Запуск лаунчера
document.addEventListener('DOMContentLoaded', () => {
    window.launcher = new Launcher();
    console.log('🚀 Vertex Launcher запущен!');
});