import {Enums} from '@cornerstonejs/core';
import {setupTools} from "./dicomViewer-tools";

export function setupLayoutButtons(state) {
    state.buttons = document.querySelectorAll(".layout-button-group .layout-button");
    state.buttons.forEach(button => {
        button.addEventListener("click", async () => {
            activateButton(state, button);
            const layout = getLayoutFromButton(button);
            state.originalLayout = {...layout}; // 버튼으로 변경 시 원래 레이아웃 갱신
            state.isSingleView = false;           // 싱글뷰 모드 해제
            await configureGrid(state, layout.rows, layout.cols);
        });
    });
}

// 현재 선택된 버튼 activate 클래스 추가
function activateButton(state, activeButton) {
    state.buttons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

// 버튼 className 에서 레이아웃 정보 추출
function getLayoutFromButton(button) {
    if (button.classList.contains("btn-1x1")) return {rows: 1, cols: 1};
    if (button.classList.contains("btn-1x2")) return {rows: 1, cols: 2};
    if (button.classList.contains("btn-2x2")) return {rows: 2, cols: 2};
}

export async function configureGrid(state, rows, cols) {
    const element = document.getElementById("render");
    element.innerHTML = "";
    element.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    state.currentViewport = null;

    for (let i = 1; i <= rows * cols; i++) {
        const div = document.createElement("div");
        div.className = `viewport${i}`;
        handleViewportClick(state, div);
        handleViewportDoubleClick(state, div);
        element.appendChild(div);
        element.oncontextmenu = (e) => e.preventDefault();
    }

    state.currentLayout = {rows, cols};
    await renderAllViewports(state);
}

// 더블클릭 이벤트 핸들러: 레이아웃을 더블클릭하면 1x1 큰화면으로 보여줌
function handleViewportDoubleClick(state, div) {
    div.addEventListener("dblclick", async function () {
        const viewportClass = this.className;
        const imageData = state.viewportImages[viewportClass];

        if (!imageData) return; // 이미지가 없는 경우 무시

        if (!state.isSingleView) {
            // 현재 레이아웃(1x1, 1x2, 2x2) -> 1x1로 전환
            state.originalViewportImages = {...state.viewportImages};    // 원래 이미지 저장
            state.originalLayout = {...state.currentLayout};             // 원래 레이아웃 저장
            await configureGrid(state,1, 1);
            state.viewportImages = {"viewport1": imageData};
            state.currentViewport = document.querySelector('.viewport1');
            state.isSingleView = true;
            activateButton(state, document.querySelector(".btn-1x1"));
        } else {
            // 1x1 -> 원래 레이아웃(1x2 또는 2x2)으로 복원
            await configureGrid(state, state.originalLayout.rows, state.originalLayout.cols);
            state.viewportImages = {...state.originalViewportImages}; // 원래 이미지 복원
            state.currentViewport = null;
            state.isSingleView = false;
            const buttonClass = `.btn-${state.originalLayout.rows}x${state.originalLayout.cols}`;
            activateButton(state, document.querySelector(buttonClass));
        }

        await renderAllViewports(state);
    });
}

// 클릭 이벤트 핸들러: 클릭시 해당 뷰포트를 currentViewport로 설정, 보더 설정
function handleViewportClick(state, div) {
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

// 모든 뷰포트 이미지 렌더링
async function renderAllViewports(state) {
    const renderContainer = document.getElementById('render');
    const viewports = renderContainer.querySelectorAll('div[class^="viewport"]');
    const renderPromises = Array.from(viewports).map(viewport => {
        const viewportClass = viewport.className;
        if (state.viewportImages[viewportClass]) {
            return new Promise(resolve => {
                renderSingleImage(state, state.viewportImages[viewportClass], viewport);
                resolve();
            });
        }
        return Promise.resolve();
    });
    await Promise.all(renderPromises);
}

// DICOM 단일 파일 정보 스트리밍 받아서 이미지 처리
async function renderSingleImage(state, keys, element) {
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

// 사이드 바에서 넘어온 선택 이벤트 처리
export async function handleImageSelection(state) {
    document.addEventListener('imageSelected', async (e) => {
        const studykey = e.detail.studykey;
        const serieskey = e.detail.serieskey;
        const imagekey = e.detail.imagekey;

        if (state.currentViewport) {
            await assignImageToViewport(state, studykey, serieskey, imagekey);
        }
    });
}

// 뷰포트에 이미지 할당
async function assignImageToViewport(state, studykey, serieskey, imagekey) {
    const viewportClass = state.currentViewport.className;
    const imageData = {studykey, serieskey, imagekey};
    state.viewportImages[viewportClass] = imageData;
    if (!state.isSingleView) {
        state.originalViewportImages[viewportClass] = {...imageData}; // 싱글뷰가 아닌 경우에만 원본 갱신
    }
    await renderAllViewports(state);
}