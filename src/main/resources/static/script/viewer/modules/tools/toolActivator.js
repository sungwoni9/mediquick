import {ToolRegistry} from './ToolRegistry';
import * as csToolsEnums from "@cornerstonejs/tools/enums";

export class ToolActivator {
    #state;

    constructor(state) {
        this.#state = state;
    }

    setSelectableToolActive(toolId) {
        const currentBindingTool = this.#state.bindingTool;
        if (toolId === currentBindingTool) return;

        if (currentBindingTool) {
            const previousToolName = ToolRegistry.getTool(currentBindingTool).toolName;
            this.#state.toolGroup.setToolPassive(previousToolName);
            this.#updateButtonState(currentBindingTool, false);
        }

        const newToolName = ToolRegistry.getTool(toolId).toolName;
        this.#state.toolGroup.setToolActive(newToolName, {
            bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}]
        });
        this.#updateButtonState(toolId, true);
        this.#state.bindingTool = toolId;
    }

    #updateButtonState(toolId, isActive) {
        const button = document.getElementById(toolId);
        if (button) {
            button.classList.toggle('active', isActive);
        }
    }

}