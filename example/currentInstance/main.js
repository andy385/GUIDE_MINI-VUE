import { createApp } from '../../lib/guide-mini-vue.esm.js';
import { App } from '../currentInstance/App.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer);