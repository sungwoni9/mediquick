export class LayoutManager {
    #state;

    constructor(state) {
        this.#state = state;
    }

    toggleFullscreenMode(viewportId) {
        const viewportContainer = document.getElementById('render');
        const targetViewport = document.getElementById(viewportId);

        if (!this.#state.isSingleViewport) {
            this.#enterFullscreenMode(viewportContainer, targetViewport, viewportId);
        } else {
            this.#exitFullscreenMode();
        }
    }

    #enterFullscreenMode(container, targetViewport, viewportId) {
        this.#state.screens.forEach(id => {
            const viewport = document.getElementById(id);
            viewport.style.display = id === viewportId ? 'flex' : 'none';
        });
        this.#applyGridLayout(container, 1, 1);
        targetViewport.style.width = '100%';
        targetViewport.style.height = '100%';
        this.#state.isSingleViewport = true;
    }

    #exitFullscreenMode() {
        if (this.#state.savedLayout) {
            this.updateGridLayout(this.#state.savedLayout.rows, this.#state.savedLayout.cols);
        }
        this.#state.isSingleViewport = false;
    }

    setActiveButton(activeButton) {
        const layoutButtons = document.querySelectorAll(".layout-button-group .layout-button");
        layoutButtons.forEach(btn => btn.classList.remove("active"));
        activeButton.classList.add("active");
    }

    extractLayoutFromButton(button) {
        const layoutMap = {
            "btn-1x1": { rows: 1, cols: 1 },
            "btn-1x2": { rows: 1, cols: 2 },
            "btn-2x2": { rows: 2, cols: 2 }
        };
        for (const [className, layout] of Object.entries(layoutMap)) {
            if (button.classList.contains(className)) return layout;
        }
        return { rows: 1, cols: 1 };
    }

    async updateGridLayout(rows, cols) {
        const viewportContainer = document.getElementById('render');
        this.#applyGridLayout(viewportContainer, rows, cols);
        this.#resetViewportState(rows, cols);
        this.#updateViewportVisibility(rows, cols);
    }

    #applyGridLayout(container, rows, cols) {
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    }

    #resetViewportState(rows, cols) {
        this.#state.currentViewport = null;
        this.#state.savedLayout = { rows, cols };
        this.#state.isFullscreen = false;
    }

    #updateViewportVisibility(rows, cols) {
        const maxVisible = rows * cols;
        this.#state.screens.forEach((viewportId, index) => {
            const viewport = document.getElementById(viewportId);
            viewport.style.display = index < maxVisible ? "flex" : "none";
        });
    }

    handleViewportSelection(viewportList, selectedViewport) {
        viewportList.forEach(viewport => {
            const isSelected = viewport === selectedViewport;
            viewport.style.borderColor = isSelected ? "#039752" : "#890000";
            viewport.style.borderWidth = isSelected ? "2px" : "1px";
            if (isSelected) this.#state.currentViewport = viewport;
        });
    }
}