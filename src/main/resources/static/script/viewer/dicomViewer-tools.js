import {WindowLevelTool, ZoomTool, Enums as csToolsEnums, addTool} from '@cornerstonejs/tools';

export function setupTools(state) {
    document.addEventListener('DOMContentLoaded', () => {
        addTool(ZoomTool);
        addTool(WindowLevelTool);
        state.toolGroup.addTool(ZoomTool.toolName);
        state.toolGroup.addTool(WindowLevelTool.toolName);

        state.toolGroup.addViewport(state.currentViewport.className);

        state.toolGroup.setToolActive(WindowLevelTool.toolName, {
            bindings: [
                {
                    mouseButton: csToolsEnums.MouseBindings.Primary,
                },
            ],
        });

        state.toolGroup.setToolActive(ZoomTool.toolName, {
            bindings: [
                {
                    mouseButton: csToolsEnums.MouseBindings.Secondary,
                },
            ],
        });
        state.currentViewport.render();
    });
}
