import { init as coreInit, RenderingEngine, Enums } from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import {
    init as cornerstoneToolsInit,
    ToolGroupManager,
    WindowLevelTool,
    ZoomTool,
    Enums as csToolsEnums,
    addTool,
} from '@cornerstonejs/tools';

/**
async function initailizeCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();
}

export {
    initailizeCornerstone,
    RenderingEngine,
    Enums,
    ToolGroupManager,
    WindowLevelTool,
    ZoomTool,
    csToolsEnums,
    addTool
}
*/

document.addEventListener("DOMContentLoaded", async e => {
    await coreInit();
    await dicomImageLoaderInit();
    await cornerstoneToolsInit();

// 븊포트 생성
    const content = document.getElementById('content');
    const element = document.createElement('div');

    element.oncontextmenu = (e) => e.preventDefault();
    element.style.width = '500px';
    element.style.height = '500px';

    content.appendChild(element);

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportId = 'CT_AXIAL_STACK';

    const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(viewportId);

    const response = await fetch(`http://localhost:8080/api/wado?requestType=WADO&studykey=5&serieskey=1`);
    // 서버에서 받은 Base64 인코딩된 이미지 데이터
    const base64Images = await response.json();

    // 각 이미지에 대해 처리
    const imageIds = base64Images.map(base64String => {
        return `wadouri:data:application/dicom;base64,${base64String}`;
    });

    viewport.setStack(imageIds);

    viewport.render();

    // 뷰 포트 위에 랜더링 후, 툴 활성화
    addTool(ZoomTool);
    addTool(WindowLevelTool);

    const toolGroupId = 'myToolGroup';
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    toolGroup.addTool(ZoomTool.toolName);
    toolGroup.addTool(WindowLevelTool.toolName);

    toolGroup.addViewport(viewportId, renderingEngineId);

    // Set the windowLevel tool to be active when the mouse left button is pressed
    toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
            },
        ],
    });

    toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
            },
        ],
    });
});



