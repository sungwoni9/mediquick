export class SidebarRenderer {
    #content;

    constructor(contentElement) {
        this.#content = contentElement;
    }

    renderImageList(imageInfoList) {
        if (!imageInfoList || imageInfoList.length === 0) {
            this.#content.innerHTML = '<p>이미지를 찾지 못했습니다.</p>';
            return;
        }

        const safeImageList = imageInfoList.map(data => ({
            studykey: data.studykey || 'Unknown',
            serieskey: data.serieskey || 'Unknown',
            imageCount: data.imageCount !== undefined ? data.imageCount : 'N/A',
            modality: data.modality || 'N/A',
            bodyPart: data.bodyPart || 'Unknown'
        }));

        this.#content.innerHTML = `
            <ul class="image-list">
                ${safeImageList.map(data => `
                    <li data-studykey="${data.studykey}" data-serieskey="${data.serieskey}">
                        Study:${data.studykey} / Series:${data.serieskey} (images ${data.imageCount}) ${data.modality} ${data.bodyPart}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    renderError(message) {
        this.#content.innerHTML = `<p>${message}</p>`;
    }
}