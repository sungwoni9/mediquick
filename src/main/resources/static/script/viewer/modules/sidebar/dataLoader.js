export class SidebarDataLoader {
    #dicomService;

    constructor(dicomService) {
        this.#dicomService = dicomService;
    }

    async loadSidebarContent(studyKey) {
        if (!studyKey) return null;
        try {
            return await this.#dicomService.fetchDicomSidebarMetadata(studyKey);
        } catch (error) {
            console.error('사이드바 데이터 로딩 실패:', error);
            return null;
        }
    }
}