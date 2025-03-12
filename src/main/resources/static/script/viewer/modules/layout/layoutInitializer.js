import {LayoutManager} from './layoutManager.js';

export class LayoutInitializer {
    #state;
    #layoutManager;
    #renderManager;

    constructor(state, renderManager) {
        this.#state = state;
        this.#layoutManager = new LayoutManager(state);
        this.#renderManager = renderManager;
    }

    initialize() {
        this.#setupViewports();
        this.#setupLayoutControls();
        this.#initViewportSelection();
        this.#renderDefaultSeries(); // 첫 번째 시리즈 불러오기
    }

    #setupViewports() {
        const viewportContainer = document.getElementById('render');
        viewportContainer.oncontextmenu = (e) => e.preventDefault();

        const viewportList = document.querySelectorAll('.screen');
        viewportList.forEach(viewport => {
            const viewportId = viewport.id;
            viewport.addEventListener('dblclick', () => this.#layoutManager.toggleFullscreenMode(viewportId));
            viewport.addEventListener('click', () => this.#layoutManager.handleViewportSelection(viewportList, viewport));
        });
    }

    #setupLayoutControls() {
        const layoutButtons = document.querySelectorAll(".layout-button");
        layoutButtons.forEach(button => {
            button.addEventListener("click", async () => {
                this.#layoutManager.setActiveButton(button);
                const layout = this.#layoutManager.extractLayoutFromButton(button);
                await this.#layoutManager.updateGridLayout(layout.rows, layout.cols);
            });
        });
    }

    #initViewportSelection() {
        const viewportList = document.querySelectorAll('.screen');
        if (viewportList.length > 0) {
            this.#layoutManager.handleViewportSelection(viewportList, viewportList[0]);
        }
    }

    #renderDefaultSeries() {
        const urlParams = new URLSearchParams(window.location.search);
        const studyKey = urlParams.get('studyKey');
        if (studyKey && this.#state.currentViewport) {
            const event = new CustomEvent('imageSelected', {
                detail: {studykey: studyKey, serieskey: '1'}
            });
            document.dispatchEvent(event);
        } else {
            console.warn('studykey 가 없거나 뷰포트가 선택되지 않았습니다.');
        }
    }
}
