import {
    WindowLevelTool,
    ZoomTool,
    addTool,
    PanTool,
    LengthTool,
    CircleROITool,
    RectangleROITool,
    StackScrollTool,
    LabelTool, ArrowAnnotateTool
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

const toolMap = {
    'zoom': ZoomTool.toolName,
    'windowLevel': WindowLevelTool.toolName,
    'annotation': ArrowAnnotateTool.toolName,
    'length': LengthTool.toolName,
    'circle': CircleROITool.toolName,
    'rectangle': RectangleROITool.toolName
};

export function initializeTools(state) {
    addTool(PanTool);
    addTool(ZoomTool);
    addTool(WindowLevelTool);
    addTool(ArrowAnnotateTool);
    addTool(LengthTool);
    addTool(LabelTool);
    addTool(CircleROITool);
    addTool(RectangleROITool);
    addTool(StackScrollTool);

    state.toolGroup.addTool(PanTool.toolName);
    state.toolGroup.addTool(ZoomTool.toolName);
    state.toolGroup.addTool(WindowLevelTool.toolName);
    state.toolGroup.addTool(ArrowAnnotateTool.toolName);
    state.toolGroup.addTool(LengthTool.toolName);
    state.toolGroup.addTool(LabelTool.toolName);
    state.toolGroup.addTool(CircleROITool.toolName);
    state.toolGroup.addTool(RectangleROITool.toolName);
    state.toolGroup.addTool(StackScrollTool.toolName);

    state.toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
    });

    state.toolGroup.setToolActive(PanTool.toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Secondary}],
    });

    state.toolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Wheel}],
    });

    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        state.toolGroup.addViewport(screen.id);
    })

    // 초기 상태 설정
    state.bindingTool = 'zoom';
    const initialToolButton = document.getElementById('zoom');
    if (initialToolButton) {
        initialToolButton.classList.add('active');
    }

    // 이벤트 리스너 설정
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            if (tool.id !== "rotate" && tool.id !== "reset")
                setActiveTool(state, tool.id);
            else(tool.id === "reset")
                reset(state);
        });
    });

}

function setActiveTool(state, toolId) {
    if (toolId !== state.bindingTool) {
        const previousToolButton = document.getElementById(state.bindingTool);
        if (previousToolButton) {
            previousToolButton.classList.remove('active');
        }
        const newToolButton = document.getElementById(toolId);
        if (newToolButton) {
            newToolButton.classList.add('active');
        }
        changeLeftButton(state, toolId);
        state.bindingTool = toolId;
    }
}

function changeLeftButton(state, tool) {
    state.toolGroup.setToolDisabled(toolMap[state.bindingTool]);

    state.toolGroup.setToolActive(toolMap[tool], {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
    });
}

function reset(state){
    const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
    viewport.reset();
}

