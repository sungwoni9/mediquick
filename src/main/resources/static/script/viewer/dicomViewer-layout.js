// 전체 레이아웃을 초기화하고 이벤트 리스너를 설정
export function initializeLayout(state) {
    setupViewports(state);
    setupLayoutControls(state);
}

// viewport 요소들을 설정하고 이벤트 리스너를 추가
function setupViewports(state) {
    const viewportContainer = document.getElementById('render');
    viewportContainer.oncontextmenu = (e) => e.preventDefault();

    const viewportList = document.querySelectorAll('.screen');
    viewportList.forEach(viewport => {
        const viewportId = viewport.id;
        viewport.addEventListener('dblclick', () => toggleFullscreenMode(state, viewportId));
        viewport.addEventListener('click', () => handleViewportSelection(state, viewportList, viewport));
    });
}

// 레이아웃 변경 버튼들을 설정
function setupLayoutControls(state) {
    const layoutButtons = document.querySelectorAll(".layout-button");
    layoutButtons.forEach(button => {
        button.addEventListener("click", async () => {
            setActiveButton(state, button);
            const layout = extractLayoutFromButton(button);
            await updateGridLayout(state, layout.rows, layout.cols);
        });
    });
}

// 단일 viewport를 전체 화면으로 전환하거나 원래 레이아웃으로 복원
function toggleFullscreenMode(state, viewportId) {
    const viewportContainer = document.getElementById("render");
    const targetViewport = document.getElementById(viewportId);

    if (!state.isSingleViewport) {
        state.screens.forEach(id => {
            const viewport = document.getElementById(id);
            if (id !== viewportId) {
                viewport.style.display = 'none';
            }
        });

        viewportContainer.style.gridTemplateColumns = '1fr';
        viewportContainer.style.gridTemplateRows = '1fr';
        targetViewport.style.width = '100%';
        targetViewport.style.height = '100%';
        state.isSingleViewport = true;
    } else {
        if (state.savedLayout) {
            updateGridLayout(state, state.savedLayout.rows, state.savedLayout.cols);
        }
        state.isSingleViewport = false;
    }
}

// 선택된 버튼에 active 클래스를 적용
function setActiveButton(state, activeButton) {
    const layoutButtons = document.querySelectorAll(".layout-button-group .layout-button");
    layoutButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

// 버튼의 클래스 이름에서 레이아웃 정보를 추출
function extractLayoutFromButton(button) {
    if (button.classList.contains("btn-1x1")) return { rows: 1, cols: 1 };
    if (button.classList.contains("btn-1x2")) return { rows: 1, cols: 2 };
    if (button.classList.contains("btn-2x2")) return { rows: 2, cols: 2 };
}

// 그리드 레이아웃을 주어진 행과 열로 재구성
function updateGridLayout(state, rows, cols) {
    const viewportContainer = document.getElementById("render");
    viewportContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    viewportContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    state.currentViewport = null;
    state.savedLayout = { rows, cols };
    state.isFullscreen = false;

    state.screens.forEach(viewportId => {
        const viewport = document.getElementById(viewportId);
        if (viewport) viewport.style.display = 'block';
    });
}

// 클릭된 viewport를 강조 표시하고 현재 선택된 viewport를 업데이트
function handleViewportSelection(state, viewportList, selectedViewport) {
    viewportList.forEach(viewport => {
        if (viewport !== selectedViewport) {
            viewport.style.borderColor = "red";
            viewport.style.borderWidth = "1px";
        } else {
            viewport.style.borderColor = "#039752";
            viewport.style.borderWidth = "2px";
            state.currentViewport = viewport;
        }
    });
}