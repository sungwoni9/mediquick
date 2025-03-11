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
        this.#content.innerHTML = `
            <ul class="image-list">
                ${imageInfoList.map(data => `
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