import {init as coreInit, RenderingEngine, Enums} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';

// 상태 관리 객체로 분리
const state = {
    currentViewport: null,
    viewportImages: {}, // 현재 뷰포트에 할당된 이미지
    originalViewportImages: {}, // 보고있던 이미지 상태 저장
    currentLayout: { rows: 1, cols: 1 },
    originalLayout: { rows: 1, cols: 1 }, // 사용중이던 레이아웃 크기 저장
    renderingEngine: null,
    renderingEngineId: 'myRenderingEngine',
    buttons: null, // 초기화 시 설정
    isSingleView: false // 1x1 확대 모드 여부
};

async function initializeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    state.renderingEngine = new RenderingEngine(state.renderingEngineId);
}

// 레이아웃 버튼 클릭시 상태 변경
function setupLayoutButtons() {
    state.buttons = document.querySelectorAll(".layout-button-group .layout-button");
    state.buttons.forEach(button => {
        button.addEventListener("click", async () => {
            activateButton(button);
            const layout = getLayoutFromButton(button);
            state.originalLayout = { ...layout }; // 버튼으로 변경 시 원래 레이아웃 갱신
            state.isSingleView = false;           // 싱글뷰 모드 해제
            await configureGrid(layout.rows, layout.cols);
        });
    });
}

// 현재 선택된 버튼 activate 클래스 추가
function activateButton(activeButton) {
    state.buttons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

// 버튼 className 에서 레이아웃 정보 추출
function getLayoutFromButton(button) {
    if (button.classList.contains("btn-1x1")) return { rows: 1, cols: 1 };
    if (button.classList.contains("btn-1x2")) return { rows: 1, cols: 2 };
    if (button.classList.contains("btn-2x2")) return { rows: 2, cols: 2 };
}

// DICOM 단일 파일 정보 스트리밍 받아서 이미지 처리
async function renderSingleImage(keys, element) {
    const viewportId = `viewport-${element.className}`;
    const imageId = `dicomweb://localhost:8080/api/wado?requestType=WADO&studykey=${keys.studykey}&serieskey=${keys.serieskey}&imagekey=${keys.imagekey}`;
    const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
    };

    state.renderingEngine.enableElement(viewportInput);
    const viewport = state.renderingEngine.getViewport(viewportId);
    try {
        await viewport.setStack([imageId], 0);
        viewport.render();
    } catch (error) {
        console.error(`이미지를 렌더링하는데 실패했습니다. : ${imageId}:`, error);
    }
}

// 모든 뷰포트 이미지 렌더링
async function renderAllViewports() {
    const renderContainer = document.getElementById('render');
    const viewports = renderContainer.querySelectorAll('div[class^="viewport"]');
    const renderPromises = Array.from(viewports).map(viewport => {
        const viewportClass = viewport.className;
        if (state.viewportImages[viewportClass]) {
            return new Promise(resolve => {
                renderSingleImage(state.viewportImages[viewportClass], viewport);
                resolve();
            });
        }
        return Promise.resolve();
    });
    await Promise.all(renderPromises);
}

// 뷰포트에 이미지 할당
async function assignImageToViewport(studykey, serieskey, imagekey) {
    const viewportClass = state.currentViewport.className;
    const imageData = { studykey, serieskey, imagekey };
    state.viewportImages[viewportClass] = imageData;
    if (!state.isSingleView) {
        state.originalViewportImages[viewportClass] = { ...imageData }; // 싱글뷰가 아닌 경우에만 원본 갱신
    }
    await renderAllViewports();
}

// 더블클릭 이벤트 핸들러: 레이아웃을 더블클릭하면 1x1 큰화면으로 보여줌
function handleViewportDoubleClick(div) {
    div.addEventListener("dblclick", async function () {
        const viewportClass = this.className;
        const imageData = state.viewportImages[viewportClass];

        if (!imageData) return; // 이미지가 없는 경우 무시

        if (!state.isSingleView) {
            // 현재 레이아웃(1x1, 1x2, 2x2) -> 1x1로 전환
            state.originalViewportImages = { ...state.viewportImages }; // 원래 이미지 저장
            state.originalLayout = { ...state.currentLayout };         // 원래 레이아웃 저장
            await configureGrid(1, 1);
            state.viewportImages = { "viewport1": imageData };
            state.currentViewport = document.querySelector('.viewport1');
            state.isSingleView = true;
            activateButton(document.querySelector(".btn-1x1"));
        } else {
            // 1x1 -> 원래 레이아웃(1x2 또는 2x2)으로 복원
            await configureGrid(state.originalLayout.rows, state.originalLayout.cols);
            state.viewportImages = { ...state.originalViewportImages }; // 원래 이미지 복원
            state.currentViewport = null;
            state.isSingleView = false;
            const buttonClass = `.btn-${state.originalLayout.rows}x${state.originalLayout.cols}`;
            activateButton(document.querySelector(buttonClass));
        }

        await renderAllViewports();
    });
}

// 클릭 이벤트 핸들러: 레이아웃 선택 후 이미지 조작
function handleViewportClick(div) {
    div.addEventListener("click", function () {
        if (state.currentViewport) {
            state.currentViewport.style.borderColor = "red";
            state.currentViewport.style.borderWidth = "1px";
        }
        div.style.borderColor = "#039752";
        div.style.borderWidth = "2px";
        state.currentViewport = div;
    });
}

// 그리드 구성
async function configureGrid(rows, cols) {
    const element = document.getElementById("render");
    element.innerHTML = "";
    element.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    state.currentViewport = null;

    for (let i = 1; i <= rows * cols; i++) {
        const div = document.createElement("div");
        div.className = `viewport${i}`;
        handleViewportClick(div);
        handleViewportDoubleClick(div);
        element.appendChild(div);
    }

    state.currentLayout = {rows, cols};
    await renderAllViewports();
}

function handleImageSelection(){
    document.addEventListener('imageSelected', async (e) => {
        const studykey = e.detail.studykey;
        const serieskey = e.detail.serieskey;
        const imagekey = e.detail.imagekey;
        console.log(`studykey: ${studykey}, serieskey: ${serieskey}, imagekey: ${imagekey}`);
        console.log(`현재 뷰포트: ${state.currentViewport?.className ?? "선택안됨"}`);

        if (state.currentViewport) {
            await assignImageToViewport(studykey, serieskey, imagekey);
            await renderAllViewports();
        }
    });
}

// INIT RENDER
export function initRender() {
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeCornerstone();
        setupLayoutButtons();
        handleImageSelection();
        await configureGrid(1, 1);
    });
}