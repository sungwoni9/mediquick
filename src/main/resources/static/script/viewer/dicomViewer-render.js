import {Enums} from "@cornerstonejs/core";

const API_BASE_URL = 'http://localhost:8080';

export function initRender(state) {
    handleImageSelection(state);
}

function handleImageSelection(state) {
    document.addEventListener('imageSelected', async (e) => {
        const studykey = e.detail.studykey;
        const serieskey = e.detail.serieskey;

        if (state.currentViewport) {
            await assignImageToViewport(state, studykey, serieskey);
        }
    });
}

async function assignImageToViewport(state, studykey, serieskey) {
    const viewportId = state.currentViewport.id;
    const content = document.getElementById(viewportId);
    const existingViewport = state.renderingEngine.getViewport(viewportId);

    // 기존 뷰포트가 있으면 비활성화
    if (existingViewport) {
        state.renderingEngine.disableElement(viewportId);
    }

    // 기존 콘텐츠 초기화
    content.innerHTML = "";

    // 뷰포트 요소 생성
    const element = document.createElement('div');
    element.style.width = "100%";
    element.style.height = "100%";

    // 로딩 요소
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loader';
    loadingElement.style.position = 'absolute';                 // 뷰포트 중앙에 표시
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';   // 중앙 정렬
    loadingElement.style.zIndex = '10';                         // 이미지 위에 표시되도록

    element.appendChild(loadingElement);
    content.appendChild(element);

    const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
    };

    // 새 뷰포트 활성화
    state.renderingEngine.enableElement(viewportInput);
    const viewport = state.renderingEngine.getViewport(viewportId);

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/wado?requestType=WADO&studykey=${studykey}&serieskey=${serieskey}`
        );

        if (!response.ok) {
            alert(`HTTP 오류! 상태 코드: ${response.status}`);
            throw new Error(`HTTP 오류 상태 코드: ${response.status}`);
        }

        const base64Images = await response.json();
        if (!Array.isArray(base64Images) || base64Images.length === 0) {
            alert(`유효한 이미지를 받지 못했습니다.`);
            console.warn('유효한 이미지를 받지 못했습니다.');
            return;
        }

        const imageIds = base64Images.map(base64String =>
            `wadouri:data:application/dicom;base64,${base64String}`
        );

        viewport.setStack(imageIds, 0);
        viewport.render();
        element.removeChild(loadingElement);
    } catch (error) {
        alert('DICOM 이미지 로드 중 오류 발생');
        console.error('DICOM 이미지 로드 중 오류 발생:', error);
        content.removeChild(loadingElement); // 오류 발생 시 로딩 제거
    }
}