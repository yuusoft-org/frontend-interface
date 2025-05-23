import { createMyComponent, BaseComponent } from './framework.js'

import app from './pages/app/app.js'
import projects from './pages/projects/projects.js'
import project from './pages/project/project.js'
import sidebar from './pages/sidebar/sidebar.js'
import resources from './pages/resources/resources.js'

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
}

const ProjectsComponent = createMyComponent({
  createStore: projects.createStore,
  template: projects.view.template,
  refs: projects.view.refs,
  patch,
  handlers: projects.handlers,
}, deps)

const AppComponent = createMyComponent({
  createStore: app.createStore,
  template: app.view.template,
  refs: app.view.refs,
  patch,
  handlers: app.handlers,
}, deps)

const ProjectComponent = createMyComponent({
  createStore: project.createStore,
  template: project.view.template,
  refs: project.view.refs,
  patch,
  handlers: project.handlers,
}, deps)

const SidebarComponent = createMyComponent({
  createStore: sidebar.createStore,
  template: sidebar.view.template,
  refs: sidebar.view.refs,
  patch,
  handlers: sidebar.handlers,
}, deps)

const ResourcesComponent = createMyComponent({
  createStore: resources.createStore,
  template: resources.view.template,
  refs: resources.view.refs,
  patch,
  handlers: resources.handlers,
}, deps)

customElements.define('projects-component', ProjectsComponent);
customElements.define('app-component', AppComponent);
customElements.define('project-component', ProjectComponent);
customElements.define('sidebar-component', SidebarComponent);
customElements.define('resources-component', ResourcesComponent);
