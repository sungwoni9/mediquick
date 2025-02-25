export function initSidebar() {
    document.addEventListener("DOMContentLoaded", async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const studyKey = urlParams.get('studyKey');
        const content = document.getElementById("nav-content");
        const sidebar = document.getElementById('sidebar');

        document.getElementById('sidebar-toggle').addEventListener('click', function () {
            sidebar.classList.toggle('sidebar-closed');
            content.classList.toggle('sidebar-closed');
        });

        if (studyKey) {
            try {
                const imageInfoList = await getDicomMetadata(studyKey);

                // 리스트 HTML 생성
                if (imageInfoList.length > 0) {
                    content.innerHTML = `
                        <ul class="image-list">
                            ${imageInfoList.map(image => `
                                <li data-studykey="${image.studykey}" 
                                    data-serieskey="${image.serieskey}" 
                                    data-imagekey="${image.imagekey}">
                                    ${image.filename}
                                </li>
                            `).join('')}
                        </ul>
                    `;

                    // 리스트 아이템에 클릭 이벤트 추가
                    const listItems = content.querySelectorAll('.image-list li');
                    listItems.forEach(item => {
                        item.addEventListener('click', function () {
                            listItems.forEach(li => li.classList.remove('selected'));
                            this.classList.add('selected');
                            const studykey = this.dataset.studykey;
                            const serieskey = this.dataset.serieskey;
                            const imagekey = this.dataset.imagekey;
                            const event = new CustomEvent('imageSelected',
                                { detail: {
                                    "studykey": studykey,
                                    "serieskey":serieskey,
                                    "imagekey":imagekey}
                                });
                            document.dispatchEvent(event);
                        });
                    });
                } else {
                    content.innerHTML = '<p>이미지를 찾지 못했습니다.</p>';
                }
            } catch (error) {
                content.innerHTML = '<p>검사 이미지 로딩에 실패했습니다.</p>';
            }
        } else {
            content.innerHTML = '<p>검사 키가 누락되었습니다.</p>';
        }
    });
}

async function getDicomMetadata(studyKey) {
    try {
        const response = await fetch(`/api/dicom/${studyKey}`, {
            method: 'GET', headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            if (response.status === 204) return [];
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching DICOM metadata:', error);
        throw error;
    }
}