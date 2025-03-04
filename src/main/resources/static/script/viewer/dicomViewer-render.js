import { Enums } from '@cornerstonejs/core';

const API_BASE_URL = 'http://localhost:8080';

export function initRender(state) {
    handleImageSelection(state);
}

// 사이드 바에서 넘어온 선택 이벤트 처리
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
    if (existingViewport) {state.renderingEngine.disableElement(viewportId);}

    content.innerHTML = "";
    const element = document.createElement('div');
    element.style.width = "100%";
    element.style.height = "100%";
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

        viewport.setStack(imageIds, 0); // 첫 번째 이미지부터 렌더링
        viewport.render();
    } catch (error) {
        alert('DICOM 이미지 로드 중 오류 발생');
        console.error('DICOM 이미지 로드 중 오류 발생:', error);
    }
}