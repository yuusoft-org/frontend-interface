import { createMyComponent, BaseComponent } from './framework.js'
import { createAutoMergeData } from './automerge/sample.js'

import app from './pages/app/app.js'
import projects from './pages/projects/projects.js'
import project from './pages/project/project.js'
import sidebar from './pages/sidebar/sidebar.js'
import resources from './pages/resources/resources.js'
import backgrounds from './pages/backgrounds/backgrounds.js'
import cgs from './pages/cgs/cgs.js'
import scenes from './pages/scenes/scenes.js';
import sceneEditor from './pages/sceneEditor/sceneEditor.js';

import fileExplorer from './components/fileExplorer/fileExplorer.js'

import { init } from 'snabbdom/build/init.js'
import { classModule } from 'snabbdom/build/modules/class.js'
import { propsModule } from 'snabbdom/build/modules/props.js'
import { attributesModule } from 'snabbdom/build/modules/attributes.js'
import { styleModule } from 'snabbdom/build/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/modules/eventlisteners.js'
import { CustomSubject, WebRouter } from './common.js'

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
  attributesModule,
]); // Reverted to default DOM API

const deps = {
  globalStore: {},
  subject: new CustomSubject(),
  httpClient: {},
  BaseComponent,
  router: new WebRouter(),
  localData: {
    backgrounds: createAutoMergeData()
  }
}

const createComponentFromPage = (page) => {
  console.log('page.view.propsSchema', page.view.propsSchema)
  return createMyComponent({
    createStore: page.createStore,
    template: page.view.template,
    refs: page.view.refs,
    propsSchema: page.view.propsSchema,
    patch,
    handlers: page.handlers,
  }, deps)
}

const ProjectsComponent = createComponentFromPage(projects)
const AppComponent = createComponentFromPage(app)
const ProjectComponent = createComponentFromPage(project)
const SidebarComponent = createComponentFromPage(sidebar)
const ResourcesComponent = createComponentFromPage(resources)
const BackgroundsComponent = createComponentFromPage(backgrounds)
const CgsComponent = createComponentFromPage(cgs)
const ScenesComponent = createComponentFromPage(scenes)
const SceneEditorComponent = createComponentFromPage(sceneEditor)

customElements.define('projects-component', ProjectsComponent);
customElements.define('app-component', AppComponent);
customElements.define('project-component', ProjectComponent);
customElements.define('sidebar-component', SidebarComponent);
customElements.define('resources-component', ResourcesComponent);
customElements.define('backgrounds-component', BackgroundsComponent);
customElements.define('cgs-component', CgsComponent);
customElements.define('scenes-component', ScenesComponent);
customElements.define('scene-editor-component', SceneEditorComponent);

const FileExplorerComponent = createComponentFromPage(fileExplorer)
customElements.define('file-explorer-component', FileExplorerComponent);

