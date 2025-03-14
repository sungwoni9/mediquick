import {createState} from './core/state.js';
import {LayoutInitializer} from './modules/layout/layoutInitializer.js';
import {ViewerInitializer} from './modules/viewer/viewerInitializer.js';
import {RenderManager} from './modules/viewer/renderManager.js';
import {SidebarInitializer} from './modules/sidebar/sidebarInitializer.js';
import {ToolInitializer} from './modules/tools/toolInitializer.js';

const state = createState();
const viewerInitializer = new ViewerInitializer(state);
await viewerInitializer.initialize();

const sidebarInitializer = new SidebarInitializer();
sidebarInitializer.initialize();

const renderManager = new RenderManager(state);
renderManager.initialize();

const layoutInitializer = new LayoutInitializer(state, renderManager);
layoutInitializer.initialize();

const toolInitializer = new ToolInitializer(state);
toolInitializer.initialize();

