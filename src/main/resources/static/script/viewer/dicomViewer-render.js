import {
    WindowLevelTool,
    ZoomTool,
    addTool,
    PanTool,
    LengthTool,
    SegmentationIntersectionTool, AnnotationTool, CircleROITool, RectangleROITool
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

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

    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', ()=>{
            const toolId = tool.id;
            if(toolId !== state.bindingTool){
                tool.style.color = 'red';
                const before = document.getElementById(state.bindingTool);
                before.style.color = 'white';
                changeLeftButton(state, toolId);

                state.bindingTool = toolId;

                const viewport = state.renderingEngine.getViewport(state.currentViewport.id);
                state.toolGroup.addViewport(state.currentViewport.id);
                viewport.render();
            }
        });
    });
}

function changeLeftButton(state, tool){
    state.toolGroup.setToolDisabled(getToolName(state.bindingTool));

    state.toolGroup.setToolActive(getToolName(tool), {
        bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
    });
}

function getToolName(name){
    switch(name){
        case 'zoom': return ZoomTool.toolName;
        case 'windowLevel': return WindowLevelTool.toolName;
        case 'annotation': return AnnotationTool.toolName;
        case 'length': return LengthTool.toolName;
        case 'segmentation': return SegmentationIntersectionTool.toolName;
        case 'circle': return CircleROITool.toolName;
        case 'rectangle': return RectangleROITool.toolName;
        default: return null;
    }
}