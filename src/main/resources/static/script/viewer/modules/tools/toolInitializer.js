import { addTool } from '@cornerstonejs/tools';
import { ToolRegistry } from './ToolRegistry';
import { ToolActivator } from './ToolActivator';
import { ViewportManipulator } from './ViewportManipulator';

export class ToolInitializer {
    #state;
    #toolActivator;
    #viewportManipulator;

    constructor(state) {
        this.#state = state;
        this.#toolActivator = new ToolActivator(this.#state);
        this.#viewportManipulator = new ViewportManipulator();
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
        Object.values(ToolRegistry.getTools()).forEach(config => addTool(config.tool));
    }

    #addToolsToGroup() {
        Object.values(ToolRegistry.getTools()).forEach(config => this.#state.toolGroup.addTool(config.toolName));
    }

    #setFixedToolsActive() {
        Object.values(ToolRegistry.getFixedTools()).forEach(({ toolName, binding }) =>
            this.#state.toolGroup.setToolActive(toolName, { bindings: [binding] })
        );
    }

    #setInitialSelectableTool(toolId) {
        this.#toolActivator.setSelectableToolActive(toolId);
        this.#state.bindingTool = toolId;
    }

    #setupToolButtonListeners() {
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', () => {
                const viewport = this.#state.renderingEngine.getViewport(this.#state.currentViewport.id);
                if (!viewport) return;
                const toolId = tool.id;

                if (ToolRegistry.getSelectableToolIds().includes(toolId)) {
                    this.#toolActivator.setSelectableToolActive(toolId);
                    this.#state.bindingTool = toolId;
                } else if (toolId === "reset") {
                    this.#viewportManipulator.resetViewport(viewport, this.#state.renderingEngine.getViewport);
                } else if (toolId === "rotate") {
                    this.#viewportManipulator.rotateViewport(viewport);
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