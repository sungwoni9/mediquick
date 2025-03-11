document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('content-area');
    const pageUrls = {
        'study': '/list/studyList',
        'patient': '/list/patientList',
        'medical': '/list/medicalList'
    };

    fetch(pageUrls['study'], { method: 'GET' })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            const existingScript = document.querySelector('script[data-page-script="study"]');
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.setAttribute('data-page-script', 'study');
            script.defer = true;
            script.src = '/script/list/studyList.js';
            script.onload = () => console.log('studyList.js 로드 완료');
            script.onerror = () => console.error('study 스크립트 불러오기 실패');
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Error loading study content:', error);
            contentArea.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
        });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page') || 'study';
            const url = pageUrls[page] || pageUrls['study'];

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            fetch(url, { method: 'GET' })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    contentArea.innerHTML = html;
                    const existingScript = document.querySelector(`script[data-page-script="${page}"]`);
                    if (existingScript) existingScript.remove();

                    const script = document.createElement('script');
                    script.setAttribute('data-page-script', page);
                    script.defer = true;
                    script.src = `/script/list/${page}List.js`;
                    script.onload = () => console.log(`${page}List.js 로드 완료`);
                    script.onerror = () => console.error(`${page} 스크립트 불러오기 실패`);
                    document.body.appendChild(script);
                })
                .catch(error => {
                    console.error(`Error loading ${page} content:`, error);
                    contentArea.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
                });
        });
    });
});