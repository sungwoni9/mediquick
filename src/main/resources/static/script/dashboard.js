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
            case 'patients':
                url = '/list/patientList';
                break;
            case 'medical':
                url = '/list/medicalList';
                break;
            default:
                url = '/list/studyList';
        }

        fetch(url, { method: 'GET' })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;
                loadPageScript(page);
                initializeDynamicContent();
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

        script.src = `/script/${page}List.js`;
        script.onload = () => console.log(`${page} script loaded successfully`);
        script.onerror = () => console.error(`${page} script failed to load`);

        document.body.appendChild(script);
    }

    function initializeDynamicContent() {
        const searchForm = document.querySelector('#searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                filterStudies();
            });

            const resetButton = searchForm.querySelector('button[type="button"]');
            if (resetButton)
                resetButton.addEventListener('click', resetForm);

        }

        const pacsButtons = document.querySelectorAll('.pacs-button');
        if (pacsButtons.length > 0) {
            pacsButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const studyId = button.closest('.list-element').querySelector('.study-id').textContent;
                    window.location.href = `/viewer?studykey=${studyId}`;
                });
            });
        }

        // 페이지네이션 버튼 (현재 HTML에 없음, 필요 시 추가)
        const paginationButtons = document.querySelectorAll('.pagination-btn');
        if (paginationButtons.length > 0) {
            paginationButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = btn.getAttribute('data-page');
                    loadContent('study', page);
                });
            });
        }
    }

    function filterStudies() {
        const patientName = document.querySelector('#patientName')?.value.toLowerCase() || '';
        const studyTime = document.querySelector('#studyTime')?.value.toLowerCase() || '';
        const modality = document.querySelector('#modality')?.value.toLowerCase() || '';
        const bodyPart = document.querySelector('#bodyPart')?.value.toLowerCase() || '';

        const studies = document.getElementsByClassName('list-element');
        for (let i = 1; i < studies.length; i++) {
            const study = studies[i];
            const pName = study.querySelector('.patients-name')?.textContent.toLowerCase() || '';
            const sTime = study.querySelector('.study-time')?.textContent.toLowerCase() || '';
            const mod = study.querySelector('.modality')?.textContent.toLowerCase() || '';
            const bPart = study.querySelector('.body-part')?.textContent.toLowerCase() || '';

            const matches = (!patientName || pName.includes(patientName)) &&
                (!studyTime || sTime.includes(studyTime)) &&
                (!modality || mod.includes(modality)) &&
                (!bodyPart || bPart.includes(bodyPart));

            study.style.display = matches ? '' : 'none';
        }
    }

    function resetForm() {
        const searchForm = document.querySelector('#searchForm');
        if (searchForm) {
            searchForm.reset();
            const studies = document.getElementsByClassName('list-element');
            for (let i = 1; i < studies.length; i++)
                studies[i].style.display = '';

        }
    }
});