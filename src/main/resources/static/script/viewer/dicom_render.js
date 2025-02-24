import {init as coreInit, RenderingEngine, Enums} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';

// 상태 관리 객체로 분리
const state = {
    currentViewport: null,
    viewportImages: {},
    originalViewportImages: {},
    currentLayout: { rows: 1, cols: 1 },
    renderingEngine: null,
    renderingEngineId: 'myRenderingEngine',
    buttons: null // 초기화 시 설정
};

async function initializeCornerstone() {
    coreInit();
    await dicomImageLoaderInit();
    state.renderingEngine = new RenderingEngine(state.renderingEngineId);
}

function setupLayoutButtons() {
    state.buttons = document.querySelectorAll(".layout-button-group .layout-button");
    state.buttons.forEach(button => {
        button.addEventListener("click", async () => {
            activateButton(button);
            const layout = getLayoutFromButton(button);
            await configureGrid(layout.rows, layout.cols);
        });
    });
}

function activateButton(activeButton) {
    state.buttons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

// 버튼 클래스에서 레이아웃 정보 추출
function getLayoutFromButton(button) {
    if (button.classList.contains("btn-1x1")) return { rows: 1, cols: 1 };
    if (button.classList.contains("btn-1x2")) return { rows: 1, cols: 2 };
    if (button.classList.contains("btn-2x2")) return { rows: 2, cols: 2 };
}

// DICOM 단일 파일 정보 스트리밍 받아서 이미지 처리
function renderSingleImage(keys, element) {
    const viewportId = `viewport-${element.className}`;
    const imageId = `dicomweb://localhost:8080/api/wado?requestType=WADO&studykey=${keys.studykey}&serieskey=${keys.serieskey}&imagekey=${keys.imagekey}`;
    const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
    };

    state.renderingEngine.enableElement(viewportInput);
    const viewport = state.renderingEngine.getViewport(viewportId);
    viewport.setStack([imageId], 0).then(() => viewport.render());
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
    state.viewportImages[viewportClass] = { studykey, serieskey, imagekey };
    if (!state.originalViewportImages[viewportClass]) {
        state.originalViewportImages[viewportClass] = { studykey, serieskey, imagekey };
    }
}

// 더블클릭 이벤트 핸들러: 레이아웃을 더블클릭하면 1x1 큰화면으로 보여줌
function handleViewportDoubleClick(div) {
    div.addEventListener("dblclick", async function () {
        const viewportClass = this.className;
        if (state.viewportImages[viewportClass]) {
            const {studykey, serieskey, imagekey} = state.viewportImages[viewportClass];
            console.log(`더블클릭: ${viewportClass} - studykey: ${studykey}, serieskey: ${serieskey}, imagekey: ${imagekey}`);

            await configureGrid(1, 1);
            state.currentViewport = document.querySelector('.viewport1');
            const tempImages = {...state.viewportImages};
            state.viewportImages = {"viewport1": {studykey, serieskey, imagekey}};
            Object.keys(tempImages)
                .filter(key => key !== viewportClass)
                .forEach(key => state.viewportImages[key] = tempImages[key]);
            await renderAllViewports();

            activateButton(document.querySelector(".btn-1x1"));
        }
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

    if (rows !== 1 || cols !== 1) {
        state.viewportImages = {...state.originalViewportImages};
    }

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
    console.log(`현재 layout: ${state.currentLayout.rows}x${state.currentLayout.cols}`);
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