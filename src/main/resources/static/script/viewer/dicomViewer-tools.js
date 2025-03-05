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

const toolConfig = {
    zoom: {
        tool: ZoomTool,
        toolName: ZoomTool.toolName
    },
    windowLevel: {
        tool: WindowLevelTool,
        toolName: WindowLevelTool.toolName
    },
    annotation: {
        tool: ArrowAnnotateTool,
        toolName: ArrowAnnotateTool.toolName
    },
    length: {
        tool: LengthTool,
        toolName: LengthTool.toolName
    },
    circle: {
        tool: EllipticalROITool,
        toolName: EllipticalROITool.toolName
    },
    rectangle: {
        tool: RectangleROITool,
        toolName: RectangleROITool.toolName
    },
    pan: {
        tool: PanTool,
        toolName: PanTool.toolName
    },
    stackScroll: {
        tool: StackScrollTool,
        toolName: StackScrollTool.toolName
    },
    label: {
        tool: LabelTool,
        toolName: LabelTool.toolName
    },
};

const selectableToolIds = ['zoom', 'windowLevel', 'annotation', 'length', 'circle', 'rectangle'];

// 초기 도구와 바인딩될 키 정의
const fixedTools = {
    zoom: {
        toolName: toolConfig.zoom.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Primary}
    },
    pan: {
        toolName: toolConfig.pan.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Secondary}
    },
    stackScroll: {
        toolName: toolConfig.stackScroll.toolName,
        binding: {mouseButton: csToolsEnums.MouseBindings.Wheel}
    }
};

export function initializeTools(state) {
    addTools();
    addToolsToGroup(state.toolGroup);
    setFixedToolsActive(state.toolGroup, fixedTools);
    setSelectableToolActive(state, 'zoom');
    setupToolButtonListeners(state);
    addViewports(state);
}

// toolConfig 에 정의된 모든 도구를 addTool 함수를 사용하여 추가
function addTools() {
    for (const key in toolConfig) {
        addTool(toolConfig[key].tool);
    }
}

// toolConfig 의 모든 도구를 *도구그룹* 에 추가
function addToolsToGroup(toolGroup) {
    for (const key in toolConfig) {
        toolGroup.addTool(toolConfig[key].toolName);
    }
}

// 기본 펜, 줌, 휠을 활성화 >> fixedTools
function setFixedToolsActive(toolGroup, fixedTools) {
    for (const toolKey in fixedTools) {
        const toolName = fixedTools[toolKey].toolName;
        const binding = fixedTools[toolKey].binding;
        toolGroup.setToolActive(toolName, {bindings: [binding]});
    }
}

// 지정된 선택 가능 도구를 기본 마우스 버튼 바인딩으로 활성화하고, 상태와 UI를 업데이트
function setSelectableToolActive(state, toolId) {
    const toolName = toolConfig[toolId].toolName;
    state.toolGroup.setToolActive(toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}]
    });
    state.bindingTool = toolId;
    const toolButton = document.getElementById(toolId);
    if (toolButton) {
        toolButton.classList.add('active');
    }
}

// 도구 버튼에 이벤트 리스너를 설정
function setupToolButtonListeners(state) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
            if (!viewport) return;
            const toolId = tool.id;
            if (selectableToolIds.includes(toolId)) {
                setActiveTool(state, toolId);
            } else if (toolId === "reset") {
                reset(state);
            } else if (toolId === "rotate") {
                rotate(state);
            }
        });
    });
}

// toolId로 전환하며, 이전 도구를 비활성화하고 새 도구를 기본 마우스 버튼 바인딩으로 활성화
function setActiveTool(state, toolId) {
    if (toolId === state.bindingTool) return;

    const previousToolName = toolConfig[state.bindingTool].toolName;
    state.toolGroup.setToolDisabled(previousToolName);

    const newToolName = toolConfig[toolId].toolName;
    state.toolGroup.setToolActive(newToolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}]
    });

    const previousToolButton = document.getElementById(state.bindingTool);
    if (previousToolButton) {
        previousToolButton.classList.remove('active');
    }
    const newToolButton = document.getElementById(toolId);
    if (newToolButton) {
        newToolButton.classList.add('active');
    }

    state.bindingTool = toolId;
}

// .screen 클래스를 가진 각 요소에 대해 뷰포트를 추가
function addViewports(state) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        state.toolGroup.addViewport(screen.id);
    });
}

// 현재 뷰포트를 초기 상태로 재설정 (현재 도구가 안지워지는 문제 있음)
function reset(state) {
    const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
    viewport.resetCamera(); // 카메라 초기화
    viewport.setProperties({invert: false, hflip: false, vflip: false}); // 추가 속성 초기화
    viewport.render();
    viewport.render();
}

// 회전 90도
function rotate(state) {
    const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
    viewport.setRotation(viewport.getRotation() + 90);
    viewport.render();
}