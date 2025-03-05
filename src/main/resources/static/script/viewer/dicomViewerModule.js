import {init as coreInit, RenderingEngine} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';
import {init as cornerstoneToolsInit, ToolGroupManager} from '@cornerstonejs/tools';
import {initializeLayout} from "./dicomViewer-layout";
import {initRender} from "./dicomViewer-render";
import {initializeTools} from "./dicomViewer-tools";

// 상태관리 객체
const state = {
    currentViewport: null,      // 현재 클릭된 뷰포트 스크린
    screens: ['screen1', 'screen2', 'screen3', 'screen4'],
    renderingEngine: null,      // 코어 렌더링 엔진
    toolGroup: null,            // 도구 그룹
    isSingleViewport: false,    // 현재 뷰포트 풀 스크린 상태인지 여부
    savedLayout: [],            // 풀 스크린 진입 전 레이아웃
    bindingTool: 'zoom'
};

async function initializeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();
    state.renderingEngine = new RenderingEngine('mediQuickEngine');
    state.toolGroup = ToolGroupManager.createToolGroup('toolGroup');
}

export async function initViewerModule() {
    await initializeCornerstone();
    initializeTools(state);
    initializeLayout(state);
    initRender(state);
}

