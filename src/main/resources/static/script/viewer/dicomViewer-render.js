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
    let viewport = state.renderingEngine.getViewport(viewportId);
    let element;

    if (!viewport) { // 뷰포트가 없으면 새로 생성
        content.innerHTML = "";

        element = document.createElement('div');
        element.style.width = "100%";
        element.style.height = "100%";
        content.appendChild(element);

        const viewportInput = {
            viewportId,
            element,
            type: Enums.ViewportType.STACK,
        };

        state.renderingEngine.enableElement(viewportInput);
        viewport = state.renderingEngine.getViewport(viewportId);
    } else {
        element = viewport.element;
    }

    // 로딩 요소
    const loadingElement = createLoadingElement();                         // 이미지 위에 표시되도록
    element.appendChild(loadingElement);
    content.appendChild(element);

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

        const imageIds = base64Images.map(base64String => `wadouri:data:application/dicom;base64,${base64String}`);

        const overlayElements = await getOverlayElement(studykey, serieskey);
        overlayElements.forEach(overlay => element.appendChild(overlay));

        viewport.setStack(imageIds, 0);
        viewport.render();
        element.removeChild(loadingElement);
    } catch (error) {
        alert('DICOM 이미지 로드 중 오류 발생');
        console.error('DICOM 이미지 로드 중 오류 발생:', error);
        content.removeChild(loadingElement); // 오류 발생 시 로딩 제거
    }
}

async function getOverlayElement(studykey, serieskey) {
    const response = await fetch(`${API_BASE_URL}/api/dicom/${studykey}/${serieskey}`);
    const metadata = await response.json();

    // 공통 스타일 객체
    const baseStyle = {
        position: 'absolute',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        zIndex: '10',
        fontSize: '12px',
    };
    const overlays = [];

    // 왼쪽 상단: 환자 정보, 검사 정보
    const topLeft = document.createElement('div');
    Object.assign(topLeft.style, baseStyle, {top: '10px', left: '10px'});
    topLeft.innerText = `Patient: ${metadata.patientName}\nID: ${metadata.patientID}\nStudy Date: ${metadata.studyDate}\nStudy Description: ${metadata.studyDescription}`;
    overlays.push(topLeft);

    // 왼쪽 하단: 시리즈 정보
    const bottomLeft = document.createElement('div');
    Object.assign(bottomLeft.style, baseStyle, {bottom: '10px', left: '10px'});
    bottomLeft.innerText = `Series: ${metadata.seriesNumber}\nBody Part: ${metadata.bodyPart}\nModality: ${metadata.modality}`;
    overlays.push(bottomLeft);

    // 오른쪽 하단: 이미지 정보
    const bottomRight = document.createElement('div');
    Object.assign(bottomRight.style, baseStyle, {bottom: '10px', right: '10px', textAlign: 'right'});
    bottomRight.innerText = `Slice Thickness: ${metadata.sliceThickness}(mm)\ninstitution Name: ${metadata.institutionName}`;
    overlays.push(bottomRight);

    return overlays;
}

function createLoadingElement() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loader';
    loadingElement.style.position = 'absolute';                 // 뷰포트 중앙에 표시
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';   // 중앙 정렬
    loadingElement.style.zIndex = '10';
    return loadingElement;
}