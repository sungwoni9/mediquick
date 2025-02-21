export function initSidebar() {
    document.addEventListener("DOMContentLoaded", async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const studyKey = urlParams.get('studyKey');

        document.getElementById('sidebar-toggle').addEventListener('click', function () {
            const sidebar = document.getElementById('sidebar');
            const content = document.getElementById('nav-content');
            sidebar.classList.toggle('sidebar-closed');
            content.classList.toggle('sidebar-closed');
        });

        const content = document.getElementById("nav-content");

        if (studyKey) {
            try {
                const imageInfoList = await getDicomMetadata(studyKey);

                // 리스트 HTML 생성
                if (imageInfoList.length > 0) {
                    content.innerHTML = `
                        <ul class="image-list">
                            ${imageInfoList.map(image => `
                                <li>${image.filename}</li>
                            `).join('')}
                        </ul>
                    `;
                } else {
                    content.innerHTML = '<p>No images found</p>';
                }
            } catch (error) {
                content.innerHTML = '<p>Error loading image list</p>';
            }
        } else {
            content.innerHTML = '<p>No studyKey provided</p>';
        }
    });
}

async function getDicomMetadata(studyKey) {
    try {
        const response = await fetch(`/api/dicom/${studyKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 204) {
                console.log('No content found for studyKey:', studyKey);
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // JSON 데이터 파싱
        const imageInfoList = await response.json();
        return imageInfoList;

    } catch (error) {
        console.error('Error fetching DICOM metadata:', error);
        throw error;
    }
}