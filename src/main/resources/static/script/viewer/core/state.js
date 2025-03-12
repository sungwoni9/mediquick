export function createState() {
    return {
        currentViewport: null,
        screens: ['screen1', 'screen2', 'screen3', 'screen4'],
        renderingEngine: null,
        toolGroup: null,
        isSingleViewport: false,
        savedLayout: {rows: 2, cols: 2},
        bindingTool: 'zoom'
    };
}