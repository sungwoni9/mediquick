import {
    WindowLevelTool,
    ZoomTool,
    addTool,
    PanTool,
    LengthTool,
    SegmentationIntersectionTool, AnnotationTool, CircleROITool, RectangleROITool
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

const toolMap = {
    'zoom': ZoomTool.toolName,
    'windowLevel': WindowLevelTool.toolName,
    'annotation': AnnotationTool.toolName,
    'length': LengthTool.toolName,
    'segmentation': SegmentationIntersectionTool.toolName,
    'circle': CircleROITool.toolName,
    'rectangle': RectangleROITool.toolName
};

export function initializeTools(state) {
    addTool(PanTool);
    addTool(ZoomTool);
    addTool(WindowLevelTool);
    addTool(AnnotationTool);
    addTool(LengthTool);
    addTool(SegmentationIntersectionTool);
    addTool(CircleROITool);
    addTool(RectangleROITool);

    state.toolGroup.addTool(PanTool.toolName);
    state.toolGroup.addTool(ZoomTool.toolName);
    state.toolGroup.addTool(WindowLevelTool.toolName);
    state.toolGroup.addTool(AnnotationTool.toolName);
    state.toolGroup.addTool(LengthTool.toolName);
    state.toolGroup.addTool(SegmentationIntersectionTool.toolName);
    state.toolGroup.addTool(CircleROITool.toolName);
    state.toolGroup.addTool(RectangleROITool.toolName);

    state.toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
    });

    state.toolGroup.setToolActive(PanTool.toolName, {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Secondary}],
    });

    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        const viewport = state.renderingEngine.getViewport(screen.id);
        state.toolGroup.addViewport(screen.id);
        viewport.render();
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
            const toolId = tool.id;
            setActiveTool(state, toolId);
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

function changeLeftButton(state, tool){
    state.toolGroup.setToolDisabled(toolMap[state.bindingTool]);

    state.toolGroup.setToolActive(toolMap[tool], {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
    });
}

