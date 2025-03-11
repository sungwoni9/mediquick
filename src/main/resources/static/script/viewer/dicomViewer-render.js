import { Enums } from "@cornerstonejs/core";

/** @param {Object} state - 뷰어 상태 객체 */
export function initRender(state) {
    handleImageSelection(state);
}

/** @param {Object} state - 뷰어 상태 객체 */
function handleImageSelection(state) {
    document.addEventListener('imageSelected', async (e) => {
        const { studykey, serieskey } = e.detail;
        if (state.currentViewport) {
            await assignImageToViewport(state, studykey, serieskey);
        }
    });
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {number} studykey - 스터디 키
 * @param {number} serieskey - 시리즈 키
 */
async function assignImageToViewport(state, studykey, serieskey) {
    const viewportId = state.currentViewport.id;
    const content = document.getElementById(viewportId);
    const viewport = await ensureViewport(state, viewportId, content);
    const element = viewport.element;

    const loadingElement = createLoadingElement();
    element.appendChild(loadingElement);

    try {
        const imageIds = await fetchDicomImages(studykey, serieskey);
        const overlayElements = await getOverlayElements(studykey, serieskey);
        renderViewport(viewport, imageIds, overlayElements);
    } catch (error) {
        handleError(error);
    } finally {
        element.removeChild(loadingElement);
    }
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {string} viewportId - 뷰포트 ID
 * @param {HTMLElement} content - 뷰포트 컨테이너 요소
 * @returns {Object} 뷰포트 객체
 */
async function ensureViewport(state, viewportId, content) {
    let viewport = state.renderingEngine.getViewport(viewportId);
    if (!viewport) {
        content.innerHTML = "";
        const element = createViewportElement();
        content.appendChild(element);

        const viewportInput = {
            viewportId,
            element,
            type: Enums.ViewportType.STACK,
        };
        state.renderingEngine.enableElement(viewportInput);
        viewport = state.renderingEngine.getViewport(viewportId);
    }
    return viewport;
}

/** @returns {HTMLElement} 생성된 DOM 요소 */
function createViewportElement() {
    const element = document.createElement('div');
    element.style.width = "100%";
    element.style.height = "100%";
    return element;
}

/**
 * @param {number} studykey - 스터디 키
 * @param {number} serieskey - 시리즈 키
 * @returns {string[]} 이미지 ID 배열
 */
async function fetchDicomImages(studykey, serieskey) {
    const response = await fetch(`/api/wado?requestType=WADO&studykey=${studykey}&serieskey=${serieskey}`);
    if (!response.ok) {
        throw new Error(`HTTP 오류 상태 코드: ${response.status}`);
    }

    const base64Images = await response.json();
    if (!Array.isArray(base64Images) || base64Images.length === 0) {
        throw new Error('유효한 이미지를 받지 못했습니다.');
    }

    return base64Images.map(base64String => `wadouri:data:application/dicom;base64,${base64String}`);
}

/**
 * @param {Object} viewport - 뷰포트 객체
 * @param {string[]} imageIds - 이미지 ID 배열
 * @param {HTMLElement[]} overlayElements - 오버레이 요소 배열
 */
function renderViewport(viewport, imageIds, overlayElements) {
    overlayElements.forEach(overlay => viewport.element.appendChild(overlay));
    viewport.setStack(imageIds, 0);
    viewport.render();
}

/**
 * @param {number} studykey - 스터디 키
 * @param {number} serieskey - 시리즈 키
 * @returns {HTMLElement[]} 오버레이 요소 배열
 */
async function getOverlayElements(studykey, serieskey) {
    const response = await fetch(`/api/dicom/${studykey}/${serieskey}`);
    const metadata = await response.json();

    const baseStyle = {
        position: 'absolute',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        zIndex: '10',
        fontSize: '12px',
    };

    return [
        createOverlayElement({ ...baseStyle, top: '10px', left: '10px' },
            `Patient: ${metadata.patientName}\nID: ${metadata.patientID}\nStudy Date: ${metadata.studyDate}\nStudy Description: ${metadata.studyDescription}`),
        createOverlayElement({ ...baseStyle, bottom: '10px', left: '10px' },
            `Series: ${metadata.seriesNumber}\nBody Part: ${metadata.bodyPart}\nModality: ${metadata.modality}`),
        createOverlayElement({ ...baseStyle, bottom: '10px', right: '10px', textAlign: 'right' },
            `Slice Thickness: ${metadata.sliceThickness}(mm)\nInstitution Name: ${metadata.institutionName}`)
    ];
}

/**
 * @param {Object} style - CSS 스타일 객체
 * @param {string} text - 오버레이에 표시할 텍스트
 * @returns {HTMLElement} 오버레이 DOM 요소
 */
function createOverlayElement(style, text) {
    const element = document.createElement('div');
    Object.assign(element.style, style);
    element.innerText = text;
    return element;
}

/** @returns {HTMLElement} 로딩 DOM 요소 */
function createLoadingElement() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loader';
    Object.assign(loadingElement.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '10',
    });
    return loadingElement;
}

/** @param {Error} error - 발생한 오류 객체 */
function handleError(error) {
    alert('DICOM 이미지 로드 중 오류 발생');
    console.error('DICOM 이미지 로드 중 오류 발생:', error);
}