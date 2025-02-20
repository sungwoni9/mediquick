import {init as coreInit, RenderingEngine, Enums} from '@cornerstonejs/core';
import {init as dicomImageLoaderInit} from '@cornerstonejs/dicom-image-loader';

export function initRender() {
    let currentViewport = null;

    initializeCornerstone();

    async function initializeCornerstone() {
        await coreInit();
        await dicomImageLoaderInit();
    }

    document.addEventListener('DOMContentLoaded', () => {

        const buttons = document.querySelectorAll(".layout-button-group .layout-button");
        buttons.forEach(button => {
            button.addEventListener("click", function () {
                buttons.forEach(btn => btn.classList.remove("active"));  // 모든 버튼의 active 클래스 제거
                this.classList.add("active");

                if (this.classList.contains("btn-1x1"))
                    setGrid(1, 1);
                else if (this.classList.contains("btn-1x2"))
                    setGrid(1, 2);
                else if (this.classList.contains("btn-2x2"))
                    setGrid(2, 2);
            });
        });

        const dcmViewer = document.getElementById('render');
        setGrid(1, 1);

        // input.addEventListener('change', () => {
        //     const file = input.files[0];
        //
        //     const reader = new FileReader();
        //     reader.onload = f => {
        //         const data = f.target.result;
        //         renderImage(data, element);
        //     }
        //
        //     reader.readAsArrayBuffer(file);
        // });
    });

    function renderImage(arrayBuffer, element) {
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);

        const viewportId = 'CT_AXIAL_STACK';

        const viewportInput = {
            viewportId,
            element,
            type: Enums.ViewportType.STACK,
        };

        renderingEngine.enableElement(viewportInput);

        const imageIds = [];
        const imageId = "dicomweb:" + URL.createObjectURL(
            new Blob([arrayBuffer], {
                type: 'application/dicom'
            })
        );
        imageIds.push(imageId);

        const viewport = renderingEngine.getViewport(viewportId);

        viewport.setStack(imageIds, 0);

        viewport.render();
    }

    function setGrid(rows, cols) {
        const element = document.getElementById("render");
        element.innerHTML = "";
        element.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        for (let i = 1; i <= rows * cols; i++) {
            const div = document.createElement("div");
            div.className = `viewport${i}`;
            div.addEventListener("click", function() {
                if (currentViewport) {
                    currentViewport.style.borderColor = "red";
                    currentViewport.style.borderWidth = "1px";
                }
                div.style.borderColor = "#039752";
                div.style.borderWidth = "2px";
                currentViewport = div;
            });
            element.appendChild(div);
        }
    }
}
