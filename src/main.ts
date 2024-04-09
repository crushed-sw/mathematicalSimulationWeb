import { createApp } from 'vue'
import { createPinia } from "pinia"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { MathfieldElement } from "mathlive"
import { plugin as Slicksort } from 'vue-slicksort';
import App from './App.vue'
import Primevue from 'primevue/config'
import Router from './route'
import BadgeDirective from 'primevue/badgedirective';
import Tooltip from 'primevue/tooltip';
import VueKonva from 'vue-konva';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

import Prism from 'prismjs';

VueMarkdownEditor.use(
    vuepressTheme,
    {Prism,}
);
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createKatexPlugin());
VueMarkdownEditor.use(createMermaidPlugin());
VueMarkdownEditor.use(createTodoListPlugin());


import 'katex/dist/katex.min.css'
import 'primeflex/primeflex.min.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css'
import "mathlive/fonts.css"
import './style.scss'

library.add(fas, far);

let app = createApp(App);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);

app.use(Primevue);
app.use(createPinia());
app.use(Router);
app.use(Slicksort);
app.use(VueKonva);
app.use(VueMarkdownEditor);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount('#app');

MathfieldElement.fontsDirectory = "../../../src/assets/mathlive-fonts";
