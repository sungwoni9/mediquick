export class SidebarEventHandler {
    #content;

    constructor(contentElement) {
        this.#content = contentElement;
    }

    addListItemListeners() {
        const listItems = this.#content.querySelectorAll('.image-list li');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                listItems.forEach(li => li.classList.remove('selected'));
                item.classList.add('selected');
                this.#dispatchImageSelectedEvent(item.dataset.studykey, item.dataset.serieskey);
            });
        });
    }

    #dispatchImageSelectedEvent(studyKey, seriesKey) {
        document.dispatchEvent(new CustomEvent('imageSelected', {
            detail: { studykey: studyKey, serieskey: seriesKey }
        }));
    }
}