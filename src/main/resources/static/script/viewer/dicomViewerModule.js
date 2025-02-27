import {init as coreInit, RenderingEngine} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';
import {init as cornerstoneToolsInit, ToolGroupManager} from '@cornerstonejs/tools';
import {configureGrid, handleImageSelection,setupLayoutButtons} from './dicomViewer-render'

// 상태관리 객체
const state = {
    currentViewport: null,
    viewportImages: {},                     // 현재 뷰포트에 할당된 이미지
    originalViewportImages: {},             // 보고있던 이미지 상태 저장
    currentLayout: { rows: 1, cols: 1 },
    originalLayout: { rows: 1, cols: 1 },   // 사용중이던 레이아웃 크기 저장
    renderingEngineId: 'mediQuickEngine',
    toolGroupId:'mediQuickToolGroup',
    renderingEngine: null,
    toolGroup: null,
    buttons: null,                          // 초기화 시 설정
    isSingleView: false                     // 1x1 확대 모드 여부
};

async function initializeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();
    state.renderingEngine = new RenderingEngine(state.renderingEngineId);
    state.toolGroup = ToolGroupManager.createToolGroup(state.toolGroupId);
}

// INIT RENDER
export function initViewerModule() {
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeCornerstone(); // 코너스톤 기능 초기화
        setupLayoutButtons(state); // 레이아웃 변경 버튼 기능 초기화
        await handleImageSelection(state); // 이미지 선택 기능 초기화
        await configureGrid(state,1, 1); // 레이아웃 1x1로 설정
    });
}