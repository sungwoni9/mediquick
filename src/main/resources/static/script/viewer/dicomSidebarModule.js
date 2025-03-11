/**
 * DICOM 이미지 메타데이터 객체
 * @typedef {Object} DicomImageInfo
 * @property {string} studykey - 검사 키
 * @property {string} serieskey - 시리즈 키
 * @property {number} imageCount - 이미지 개수
 * @property {string} modality - 모달리티
 * @property {string} bodyPart - 신체 부위
 */

class DicomMetadataService {
    /**
     * @param {string} studyKey - 검사 키
     * @returns {Promise<DicomImageInfo[]>} DICOM 메타데이터 배열
     * @throws {Error} 메타데이터 가져오기 실패 시 에러
     */
    async fetchDicomMetadata(studyKey) {
        const response = await fetch(`/api/dicom/${studyKey}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            if (response.status === 204 || response.status === 500) return [];
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    }
}

class SidebarInitializer {
    #sidebar;
    #content;
    #dicomService;

    constructor() {
        this.#sidebar = document.getElementById('sidebar');
        this.#content = document.getElementById('nav-content');
        this.#dicomService = new DicomMetadataService();
    }

    initialize() {
        document.addEventListener("DOMContentLoaded", () => this.#setupSidebar());
    }

    async #setupSidebar() {
        this.#addToggleListener();
        await this.#loadSidebarContent();
    }

    async #loadSidebarContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const studyKey = urlParams.get('studyKey');

        if (!studyKey) {
            this.#content.innerHTML = '<p>검사 키가 누락되었습니다.</p>';
            return;
        }

        try {
            const imageInfoList = await this.#dicomService.fetchDicomMetadata(studyKey);
            this.#renderImageList(imageInfoList);
        } catch (error) {
            this.#content.innerHTML = '<p>검사 이미지 로딩에 실패했습니다.</p>';
            console.error('사이드바 콘텐츠 로딩 실패:', error);
        }
    }

    /** @param {DicomImageInfo[]} imageInfoList - DICOM 이미지 정보 배열 */
    #renderImageList(imageInfoList) {
        if (imageInfoList.length === 0) {
            this.#content.innerHTML = '<p>이미지를 찾지 못했습니다.</p>';
            return;
        }

        this.#content.innerHTML = `
            <ul class="image-list">
                ${imageInfoList.map(data => `
                    <li data-studykey="${data.studykey}" 
                        data-serieskey="${data.serieskey}">
                        Study:${data.studykey} / Series:${data.serieskey} (images ${data.imageCount}) ${data.modality} ${data.bodyPart}
                    </li>
                `).join('')}
            </ul>
        `;

        this.#addListItemListeners();
    }

    #addListItemListeners() {
        const listItems = this.#content.querySelectorAll('.image-list li');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                listItems.forEach(li => li.classList.remove('selected'));
                item.classList.add('selected');
                this.#dispatchImageSelectedEvent(item.dataset.studykey, item.dataset.serieskey);
            });
        });
    }

    #dispatchImageSelectedEvent(studyKey, seriesKey) {
        const event = new CustomEvent('imageSelected', {
            detail: { studykey: studyKey, serieskey: seriesKey }
        });
        document.dispatchEvent(event);
    }

    #addToggleListener() {
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.#sidebar.classList.toggle('sidebar-closed');
            this.#content.classList.toggle('sidebar-closed');
        });
    }
}

export function initSidebarModule() {
    const sidebarInitializer = new SidebarInitializer();
    sidebarInitializer.initialize();
}