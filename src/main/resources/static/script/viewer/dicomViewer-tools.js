import {
    WindowLevelTool,
    ZoomTool,
    addTool,
    PanTool,
    LengthTool,
    RectangleROITool,
    StackScrollTool,
    LabelTool,
    ArrowAnnotateTool,
    EllipticalROITool,
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

/**
 * @typedef {Object} ToolConfigItem
 * @property {Function} tool - 도구 생성자 함수
 * @property {string} toolName - 도구의 이름
 */

/** @type {Object.<string, ToolConfigItem>} */
const toolConfig = {
    zoom: { tool: ZoomTool, toolName: ZoomTool.toolName },
    windowLevel: { tool: WindowLevelTool, toolName: WindowLevelTool.toolName },
    annotation: { tool: ArrowAnnotateTool, toolName: ArrowAnnotateTool.toolName },
    length: { tool: LengthTool, toolName: LengthTool.toolName },
    circle: { tool: EllipticalROITool, toolName: EllipticalROITool.toolName },
    rectangle: { tool: RectangleROITool, toolName: RectangleROITool.toolName },
    pan: { tool: PanTool, toolName: PanTool.toolName },
    stackScroll: { tool: StackScrollTool, toolName: StackScrollTool.toolName },
    label: { tool: LabelTool, toolName: LabelTool.toolName },
};

/** @type {string[]} */
const selectableToolIds = ['zoom', 'windowLevel', 'annotation', 'length', 'circle', 'rectangle'];

/**
 * @typedef {Object} FixedToolConfig
 * @property {string} toolName - 도구의 이름
 * @property {Object} binding - 바인딩 설정
 */

/** @type {Object.<string, FixedToolConfig>} */
const fixedTools = {
    zoom: { toolName: toolConfig.zoom.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Primary } },
    pan: { toolName: toolConfig.pan.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Secondary } },
    stackScroll: { toolName: toolConfig.stackScroll.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Wheel } },
};

/**
 * @typedef {Object} ToolState
 * @property {Object} toolGroup - 도구 그룹 인스턴스
 * @property {Object} renderingEngine - 렌더링 엔진 인스턴스
 * @property {Object} currentViewport - 현재 뷰포트
 * @property {string} bindingTool - 현재 활성화된 도구 ID
 */

/** @param {ToolState} state - 도구 상태 객체 */
export function initializeTools(state) {
    const toolInitializer = new ToolInitializer(state);
    toolInitializer.initialize();
}

class ToolInitializer {
    /** @type {ToolState} */
    #state;

    /** @param {ToolState} state - 도구 상태 객체 */
    constructor(state) {
        this.#state = state;
    }

    initialize() {
        this.#addTools();
        this.#addToolsToGroup();
        this.#setFixedToolsActive();
        this.#setInitialSelectableTool('zoom');
        this.#setupToolButtonListeners();
        this.#addViewports();
    }

    #addTools() {
        Object.values(toolConfig).forEach(config => addTool(config.tool));
    }

    #addToolsToGroup() {
        Object.values(toolConfig).forEach(config => this.#state.toolGroup.addTool(config.toolName));
    }

    #setFixedToolsActive() {
        Object.values(fixedTools).forEach(({ toolName, binding }) =>
            this.#state.toolGroup.setToolActive(toolName, { bindings: [binding] })
        );
    }

    /** @param {string} toolId - 활성화할 도구 ID*/
    #setInitialSelectableTool(toolId) {
        const toolActivator = new ToolActivator(this.#state);
        toolActivator.setSelectableToolActive(toolId);
    }

    #setupToolButtonListeners() {
        const toolActivator = new ToolActivator(this.#state);
        const viewportManipulator = new ViewportManipulator(this.#state);
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', () => {
                const viewport = this.#state.renderingEngine.getViewport(this.#state.currentViewport.id);
                if (!viewport) return;
                const toolId = tool.id;

                if (selectableToolIds.includes(toolId)) {
                    toolActivator.setSelectableToolActive(toolId);
                } else if (toolId === "reset") {
                    viewportManipulator.resetViewport(viewport);
                } else if (toolId === "rotate") {
                    viewportManipulator.rotateViewport(viewport);
                }
            });
        });
    }

    #addViewports() {
        document.querySelectorAll('.screen').forEach(screen =>
            this.#state.toolGroup.addViewport(screen.id)
        );
    }
}

class ToolActivator {
    /** @type {ToolState} */
    #state;

    /** @param {ToolState} state - 도구 상태 객체 */
    constructor(state) {
        this.#state = state;
    }

    /** @param {string} toolId - 활성화할 도구 ID */
    setSelectableToolActive(toolId) {
        if (toolId === this.#state.bindingTool) return;

        if (this.#state.bindingTool) {
            const previousToolName = toolConfig[this.#state.bindingTool].toolName;
            this.#state.toolGroup.setToolDisabled(previousToolName);
            this.#updateButtonState(this.#state.bindingTool, false);
        }

        const newToolName = toolConfig[toolId].toolName;
        this.#state.toolGroup.setToolActive(newToolName, {
            bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }]
        });
        this.#updateButtonState(toolId, true);
        this.#state.bindingTool = toolId;
    }

    /**
     * @param {string} toolId - 도구 ID
     * @param {boolean} isActive - 버튼 활성화 여부
     */
    #updateButtonState(toolId, isActive) {
        const button = document.getElementById(toolId);
        if (button) {
            button.classList.toggle('active', isActive);
        }
    }
}

class ViewportManipulator {
    /** @type {ToolState} */
    #state;

    /** @param {ToolState} state - 도구 상태 객체 */
    constructor(state) {
        this.#state = state;
    }

    /** @param {Object} viewport - 뷰포트 인스턴스 */
    resetViewport(viewport) {
        viewport.resetCamera();
        viewport.setProperties({ invert: false, hflip: false, vflip: false });
        viewport.render();
    }

    /** @param {Object} viewport - 뷰포트 인스턴스 */
    rotateViewport(viewport) {
        viewport.setRotation(viewport.getRotation() + 90);
        viewport.render();
    }
}