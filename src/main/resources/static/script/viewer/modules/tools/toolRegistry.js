import {
    WindowLevelTool,
    ZoomTool,
    PanTool,
    LengthTool,
    RectangleROITool,
    StackScrollTool,
    LabelTool,
    EllipticalROITool,
} from '@cornerstonejs/tools';
import * as csToolsEnums from "@cornerstonejs/tools/enums";
import {CustomArrowAnnotateTool} from "./customArrowAnnotateTool";

export class ToolRegistry {
    static #tools = {
        zoom: { tool: ZoomTool, toolName: ZoomTool.toolName },
        windowLevel: { tool: WindowLevelTool, toolName: WindowLevelTool.toolName },
        annotation: { tool: CustomArrowAnnotateTool, toolName: CustomArrowAnnotateTool.toolName },
        length: { tool: LengthTool, toolName: LengthTool.toolName },
        circle: { tool: EllipticalROITool, toolName: EllipticalROITool.toolName },
        rectangle: { tool: RectangleROITool, toolName: RectangleROITool.toolName },
        pan: { tool: PanTool, toolName: PanTool.toolName },
        stackScroll: { tool: StackScrollTool, toolName: StackScrollTool.toolName },
        label: { tool: LabelTool, toolName: LabelTool.toolName },
    };

    static selectableToolIds = ['zoom', 'windowLevel', 'annotation', 'length', 'circle', 'rectangle'];

    static fixedTools = {
        zoom: { toolName: ToolRegistry.#tools.zoom.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Primary } },
        pan: { toolName: ToolRegistry.#tools.pan.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Secondary } },
        stackScroll: { toolName: ToolRegistry.#tools.stackScroll.toolName, binding: { mouseButton: csToolsEnums.MouseBindings.Wheel } },
    };

    static getTool(toolId) {
        return ToolRegistry.#tools[toolId];
    }

    static getTools() {
        return ToolRegistry.#tools;
    }

    static getSelectableToolIds() {
        return ToolRegistry.selectableToolIds;
    }

    static getFixedTools() {
        return ToolRegistry.fixedTools;
    }

}