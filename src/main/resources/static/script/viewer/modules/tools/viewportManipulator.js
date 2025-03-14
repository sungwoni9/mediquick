import {annotation} from "@cornerstonejs/tools";

export class ViewportManipulator {
    resetViewport(viewport) {
        annotation.state.removeAllAnnotations();
        viewport.resetCamera();
        viewport.setProperties({invert: false, hflip: false, vflip: false});
        viewport.render();
    }

    rotateViewport(viewport) {
        viewport.setRotation(viewport.getRotation() + 90);
        viewport.render();
    }

}