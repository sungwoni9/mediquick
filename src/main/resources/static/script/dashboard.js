const pageConfig = {
    urls: {
        study: '/list/studyList',
        patient: '/list/patientList',
        medical: '/list/medicalList'
    },
    scriptPaths: {
        study: '/script/list/studyList.js',
        patient: '/script/list/patientList.js',
        medical: '/script/list/medicalList.js',
        medicalReportLoader: '/script/list/medicalReportLoader.js'
    }
};

class ContentFetcher {
    static async fetchContent(url) {
        try {
            const response = await fetch(url, {method: 'GET'});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            throw error;
        }
    }
}

class ContentRenderer {
    constructor(contentArea) {
        this.contentArea = contentArea;
    }

    renderContent(html) {
        this.contentArea.innerHTML = html;
    }

    renderError(message) {
        this.contentArea.innerHTML = `<p>${message}</p>`;
    }
}

class ScriptLoader {
    static loadScript(src, identifier) {
        const existingScript = document.querySelector(`script[data-page-script="${identifier}"]`);
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.setAttribute('data-page-script', identifier);
        script.defer = true;
        script.src = src;
        document.body.appendChild(script);
    }
}

class NavigationManager {
    constructor(navItems, contentRenderer, fetcher, scriptLoader) {
        this.navItems = navItems;
        this.contentRenderer = contentRenderer;
        this.fetcher = fetcher;
        this.scriptLoader = scriptLoader;
    }

    initialize() {
        this.navItems.forEach(item => {
            item.addEventListener('click', this.handleNavClick.bind(this));
        });
    }

    async handleNavClick(e) {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page') || 'study';
        const url = pageConfig.urls[page] || pageConfig.urls['study'];

        this.updateActiveNav(e.currentTarget);
        await this.loadPage(page, url);
    }

    updateActiveNav(activeItem) {
        this.navItems.forEach(nav => nav.classList.remove('active'));
        activeItem.classList.add('active');
    }

    async loadPage(page, url) {
        try {
            const html = await this.fetcher.fetchContent(url);
            this.contentRenderer.renderContent(html);
            this.scriptLoader.loadScript(pageConfig.scriptPaths[page], page);
        } catch (error) {
            console.error(`Error loading ${page} content:`, error);
            this.contentRenderer.renderError('콘텐츠를 불러오는 데 실패했습니다.');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('content-area');

    const fetcher = ContentFetcher;
    const renderer = new ContentRenderer(contentArea);
    const scriptLoader = ScriptLoader;
    const navManager = new NavigationManager(navItems, renderer, fetcher, scriptLoader);

    const loadDefaultPage = async () => {
        try {
            const html = await fetcher.fetchContent(pageConfig.urls['study']);
            renderer.renderContent(html);
            scriptLoader.loadScript(pageConfig.scriptPaths['study'], 'study');
            scriptLoader.loadScript(pageConfig.scriptPaths['medicalReportLoader'], 'medicalReportLoader');
        } catch (error) {
            console.error('Error loading study content:', error);
            renderer.renderError('콘텐츠를 불러오는 데 실패했습니다.');
        }
    };

    await loadDefaultPage();
    navManager.initialize();
});
