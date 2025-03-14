import {Enums} from "@cornerstonejs/core";
import {DicomService} from '../../services/dicomService.js';

export class RenderManager {
    #state;
    #dicomService;

    constructor(state) {
        this.#state = state;
        this.#dicomService = new DicomService();
    }

    initialize() {
        document.addEventListener('imageSelected', async (e) => {
            if (!this.#state.currentViewport) return;
            const {studykey, serieskey} = e.detail;
            await this.#assignImageToViewport(studykey, serieskey);
        });

        document.addEventListener('layoutChanged', () => {
            this.resizeViewports();
        });
    }

    resizeViewports() {
        console.log("resize!");
        if (this.#state.renderingEngine) {
            this.#state.renderingEngine.resize(true, true); // 비율 유지하며 리사이즈
        }
    }

    async #assignImageToViewport(studykey, serieskey) {
        const viewportId = this.#state.currentViewport.id;
        const content = document.getElementById(viewportId);
        const viewport = await this.#ensureViewport(viewportId, content);
        const element = viewport.element;

        const loadingElement = this.#createLoadingElement();
        element.appendChild(loadingElement);

        try {
            const imageIds = await this.#dicomService.fetchDicomImages(studykey, serieskey);
            const overlayElements = await this.#getOverlayElements(studykey, serieskey);
            this.#renderViewport(viewport, imageIds, overlayElements);
        } catch (error) {
            alert('DICOM 이미지 로드 중 오류 발생');
        }
    }

    async #ensureViewport(viewportId, content) {
        let viewport = this.#state.renderingEngine.getViewport(viewportId);
        if (!viewport) {
            content.innerHTML = "";
            const element = this.#createViewportElement();
            content.appendChild(element);
            const viewportInput = {viewportId, element, type: Enums.ViewportType.STACK};
            this.#state.renderingEngine.enableElement(viewportInput);
            viewport = this.#state.renderingEngine.getViewport(viewportId);
        }
        return viewport;
    }

    #createViewportElement() {
        const element = document.createElement('div');
        element.style.width = "100%";
        element.style.height = "100%";
        return element;
    }

    #renderViewport(viewport, imageIds, overlayElements) {
        const existingOverlays = viewport.element.querySelectorAll('div[style*="position: absolute"]');
        existingOverlays.forEach(overlay => overlay.remove());

        overlayElements.forEach(overlay => viewport.element.appendChild(overlay));
        viewport.setStack(imageIds, 0);
        viewport.render();
    }

    async #getOverlayElements(studykey, serieskey) {
        const metadata = await this.#dicomService.fetchDicomOverlayMetadata(studykey, serieskey);

        const safeMetadata = {
            patientName: metadata.patientName || 'Unknown',
            patientID: metadata.patientID || 'N/A',
            studyDate: metadata.studyDate || 'N/A',
            studyDescription: metadata.studyDescription || 'No Description',
            seriesNumber: metadata.seriesNumber || 'N/A',
            bodyPart: metadata.bodyPart || 'Unknown',
            modality: metadata.modality || 'N/A',
            sliceThickness: metadata.sliceThickness || 'N/A',
            institutionName: metadata.institutionName || 'Unknown'
        };

        const baseStyle = {
            position: 'absolute',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
            zIndex: '10',
            fontSize: '12px'
        };

        return [
            this.#createOverlayElement({...baseStyle, top: '10px', left: '10px'},
                `Patient: ${safeMetadata.patientName}\nID: ${safeMetadata.patientID}\nStudy Date: ${safeMetadata.studyDate}\nStudy Description: ${safeMetadata.studyDescription}`),
            this.#createOverlayElement({...baseStyle, bottom: '10px', left: '10px'},
                `Series: ${safeMetadata.seriesNumber}\nBody Part: ${safeMetadata.bodyPart}\nModality: ${safeMetadata.modality}`),
            this.#createOverlayElement({...baseStyle, bottom: '10px', right: '10px', textAlign: 'right'},
                `Slice Thickness: ${safeMetadata.sliceThickness}(mm)\nInstitution Name: ${safeMetadata.institutionName}`)
        ];
    }

    #createOverlayElement(style, text) {
        const element = document.createElement('div');
        Object.assign(element.style, style);
        element.innerText = text;
        return element;
    }

    #createLoadingElement() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loader';
        Object.assign(loadingElement.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10'
        });
        return loadingElement;
    }
}