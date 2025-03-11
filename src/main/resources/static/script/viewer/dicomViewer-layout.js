/** @param {Object} state - 뷰어 상태 객체 */
export function initializeLayout(state) {
    setupViewports(state);
    setupLayoutControls(state);
}

/** @param {Object} state - 뷰어 상태 객체 */
function setupViewports(state) {
    const viewportContainer = getViewportContainer();
    disableContextMenu(viewportContainer);

    const viewportList = getViewportElements();
    viewportList.forEach(viewport => {
        const viewportId = viewport.id;
        addViewportEventListeners(state, viewport, viewportId, viewportList);
    });
}

/** @returns {HTMLElement} 뷰포트 컨테이너 DOM 요소 */
function getViewportContainer() {
    return document.getElementById('render');
}

/** @returns {NodeList} 뷰포트 DOM 요소 리스트 */
function getViewportElements() {
    return document.querySelectorAll('.screen');
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {HTMLElement} viewport - 뷰포트 DOM 요소
 * @param {string} viewportId - 뷰포트 ID
 * @param {NodeList} viewportList - 모든 뷰포트 요소 리스트
 */
function addViewportEventListeners(state, viewport, viewportId, viewportList) {
    viewport.addEventListener('dblclick', () => toggleFullscreenMode(state, viewportId));
    viewport.addEventListener('click', () => handleViewportSelection(state, viewportList, viewport));
}

/** @param {HTMLElement} element - 대상 DOM 요소 */
function disableContextMenu(element) {
    element.oncontextmenu = (e) => e.preventDefault();
}

/** @param {Object} state - 뷰어 상태 객체 */
function setupLayoutControls(state) {
    const layoutButtons = document.querySelectorAll(".layout-button");
    layoutButtons.forEach(button => {
        button.addEventListener("click", async () => {
            setActiveButton(button);
            const layout = extractLayoutFromButton(button);
            await updateGridLayout(state, layout.rows, layout.cols);
        });
    });
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {string} viewportId - 대상 뷰포트 ID
 */
function toggleFullscreenMode(state, viewportId) {
    const viewportContainer = getViewportContainer();
    const targetViewport = document.getElementById(viewportId);

    if (!state.isSingleViewport) {
        enterFullscreenMode(state, viewportContainer, targetViewport, viewportId);
    } else {
        exitFullscreenMode(state);
    }
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {HTMLElement} container - 뷰포트 컨테이너
 * @param {HTMLElement} targetViewport - 대상 뷰포트
 * @param {string} viewportId - 대상 뷰포트 ID
 */
function enterFullscreenMode(state, container, targetViewport, viewportId) {
    state.screens.forEach(id => {
        const viewport = document.getElementById(id);
        viewport.style.display = id === viewportId ? 'flex' : 'none';
    });
    applyGridLayout(container, 1, 1);
    targetViewport.style.width = '100%';
    targetViewport.style.height = '100%';
    state.isSingleViewport = true;
}

/** @param {Object} state - 뷰어 상태 객체 */
function exitFullscreenMode(state) {
    if (state.savedLayout) {
        updateGridLayout(state, state.savedLayout.rows, state.savedLayout.cols);
    }
    state.isSingleViewport = false;
}

/** @param {HTMLElement} activeButton - 활성화할 버튼 요소 */
function setActiveButton(activeButton) {
    const layoutButtons = document.querySelectorAll(".layout-button-group .layout-button");
    layoutButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

/**
 * @param {HTMLElement} button - 레이아웃 버튼 요소
 * @returns {{rows: number, cols: number}} 행과 열 정보 객체
 */
function extractLayoutFromButton(button) {
    const layoutMap = {
        "btn-1x1": { rows: 1, cols: 1 },
        "btn-1x2": { rows: 1, cols: 2 },
        "btn-2x2": { rows: 2, cols: 2 }
    };
    for (const [className, layout] of Object.entries(layoutMap)) {
        if (button.classList.contains(className)) return layout;
    }
    return { rows: 1, cols: 1 }; // 기본값
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {number} rows - 행 수 (정수형)
 * @param {number} cols - 열 수 (정수형)
 */
function updateGridLayout(state, rows, cols) {
    const viewportContainer = getViewportContainer();
    applyGridLayout(viewportContainer, rows, cols);
    resetViewportState(state, rows, cols);
    updateViewportVisibility(state, rows, cols);
}

/**
 * @param {HTMLElement} container - 뷰포트 컨테이너
 * @param {number} rows - 행 수
 * @param {number} cols - 열 수
 */
function applyGridLayout(container, rows, cols) {
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {number} rows - 행 수
 * @param {number} cols - 열 수
 */
function resetViewportState(state, rows, cols) {
    state.currentViewport = null;
    state.savedLayout = { rows, cols };
    state.isFullscreen = false;
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {number} rows - 행 수
 * @param {number} cols - 열 수
 */
function updateViewportVisibility(state, rows, cols) {
    const maxVisible = rows * cols;
    state.screens.forEach((viewportId, index) => {
        const viewport = document.getElementById(viewportId);
        viewport.style.display = index < maxVisible ? "flex" : "none";
    });
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {NodeList} viewportList - 모든 뷰포트 요소 리스트
 * @param {HTMLElement} selectedViewport - 선택된 뷰포트 요소
 */
function handleViewportSelection(state, viewportList, selectedViewport) {
    viewportList.forEach(viewport => {
        const isSelected = viewport === selectedViewport;
        applyViewportStyle(viewport, isSelected);
        if (isSelected) state.currentViewport = viewport;
    });
}

/**
 * @param {HTMLElement} viewport - 뷰포트 DOM 요소
 * @param {boolean} isSelected - 선택 여부
 */
function applyViewportStyle(viewport, isSelected) {
    viewport.style.borderColor = isSelected ? "#039752" : "#890000";
    viewport.style.borderWidth = isSelected ? "2px" : "1px";
}