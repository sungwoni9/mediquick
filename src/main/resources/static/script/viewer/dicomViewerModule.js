import { init as coreInit, RenderingEngine } from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import { init as cornerstoneToolsInit, ToolGroupManager } from '@cornerstonejs/tools';
import { initializeLayout } from "./dicomViewer-layout";
import { initRender } from "./dicomViewer-render";
import { initializeTools } from "./dicomViewer-tools";

/**
 * @returns {Object} 상태 객체
 */
function createState() {
    return {
        currentViewport: null,      // 현재 클릭된 뷰포트 스크린
        screens: ['screen1', 'screen2', 'screen3', 'screen4'],
        renderingEngine: null,      // 코어 렌더링 엔진
        toolGroup: null,            // 도구 그룹
        isSingleViewport: false,    // 현재 뷰포트 풀 스크린 상태인지 여부
        savedLayout: [],            // 풀 스크린 진입 전 레이아웃
        bindingTool: 'zoom'         // 현재 바인딩된 도구
    };
}

/**
 * @returns {Promise<void>}
 */
async function initializeCornerstoneLibs() {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();
}

/**
 * @param {string} engineId - 렌더링 엔진 ID
 * @returns {RenderingEngine} 생성된 렌더링 엔진 객체
 */
function createRenderingEngine(engineId) {
    return new RenderingEngine(engineId);
}

/**
 * @param {string} groupId - 도구 그룹 ID
 * @returns {Object} 생성된 도구 그룹 객체
 */
function createToolGroup(groupId) {
    return ToolGroupManager.createToolGroup(groupId);
}

/**
 * @param {Object} state - 뷰어 상태 객체
 * @param {string} renderingEngineId - 렌더링 엔진 ID
 * @param {string} toolGroupId - 도구 그룹 ID
 */
function configureCornerstone(state, renderingEngineId, toolGroupId) {
    state.renderingEngine = createRenderingEngine(renderingEngineId);
    state.toolGroup = createToolGroup(toolGroupId);
}

/**
 * @returns {Promise<void>}
 */
export async function initViewerModule() {
    const state = createState();
    await initializeCornerstoneLibs();
    configureCornerstone(state, 'mediQuickEngine', 'toolGroup');
    initializeTools(state);
    initializeLayout(state);
    initRender(state);
}