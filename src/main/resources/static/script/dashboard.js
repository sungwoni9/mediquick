document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('content-area');

    loadContent('study');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            loadContent(page);
        });
    });

    function loadContent(page) {
        let url;
        switch (page) {
            case 'study':
                url = '/list/studyList';
                break;
            case 'patient':
                url = '/list/patientList';
                break;
            case 'medical':
                url = '/list/medicalList';
                break;
            default:
                url = '/list/studyList';
        }

        fetch(url, {method: 'GET'})
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;
                loadPageScript(page);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentArea.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
            });
    }

    function loadPageScript(page) {
        const existingScript = document.querySelector(`script[data-page-script="${page}"]`);
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.setAttribute('data-page-script', page);
        script.defer = true;
        script.src = `/script/list/${page}List.js`;
        script.onload = () => {
            // 페이지별 초기화 함수 호출
            switch (page) {
                case 'study':
                    if (typeof initializeStudyContent === 'function')
                        initializeStudyContent();
                    break;
                case 'patient':
                    if (typeof initializePatientContent === 'function')
                        initializePatientContent();
                    break;
                case 'medical':
                    if (typeof initializePatientContent === 'function')
                        initializePatientContent();
                    break;
            }
        };
        script.onerror = () => console.error(`${page} 스크립트 불러오기 실패`);
        document.body.appendChild(script);
    }
});