import { init as coreInit, RenderingEngine } from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import { init as cornerstoneToolsInit, ToolGroupManager } from '@cornerstonejs/tools';

export class ViewerInitializer {
    #state;

    constructor(state) {
        this.#state = state;
    }

    async initialize() {
        await this.#initializeCornerstoneLibs();
        this.#configureCornerstone('mediQuickEngine', 'toolGroup');
    }

    async #initializeCornerstoneLibs() {
        await coreInit();
        await dicomImageLoaderInit();
        await cornerstoneToolsInit();
    }

    #configureCornerstone(renderingEngineId, toolGroupId) {
        this.#state.renderingEngine = new RenderingEngine(renderingEngineId);
        this.#state.toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
    }
}