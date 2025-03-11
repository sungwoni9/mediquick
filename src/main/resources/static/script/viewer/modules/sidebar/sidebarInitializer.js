import { SidebarDataLoader } from './dataLoader.js';
import { SidebarRenderer } from './renderer.js';
import { SidebarEventHandler } from './eventHandler.js';
import { DicomService } from '../../services/dicomService.js';

export class SidebarInitializer {
    #sidebar;
    #content;
    #dataLoader;
    #renderer;
    #eventHandler;

    constructor() {
        this.#sidebar = document.getElementById('sidebar');
        this.#content = document.getElementById('nav-content');
        this.#dataLoader = new SidebarDataLoader(new DicomService());
        this.#renderer = new SidebarRenderer(this.#content);
        this.#eventHandler = new SidebarEventHandler(this.#content);
    }

    initialize() {
        document.addEventListener("DOMContentLoaded", async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const studyKey = urlParams.get('studyKey');
            const imageInfoList = await this.#dataLoader.loadSidebarContent(studyKey);
            if (!imageInfoList) {
                this.#renderer.renderError('검사 키가 누락되었거나 로딩에 실패했습니다.');
                return;
            }
            this.#renderer.renderImageList(imageInfoList);
            this.#eventHandler.addListItemListeners();
            this.#addToggleListener();
        });
    }

    #addToggleListener() {
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.#sidebar.classList.toggle('sidebar-closed');
            this.#content.classList.toggle('sidebar-closed');
        });
    }
}