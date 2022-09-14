import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {store, key} from './store';
import {directive} from '/@/utils/directive';
import {i18n} from '/@/i18n';
import other from '/@/utils/other';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import {getUpFileUrl, handleTree, selectDictLabel} from "/@/utils/gfast";
import {useDict} from "/@/api/system/dict/data";
import pagination from '/@/components/pagination/index.vue'
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';

const app = createApp(App);

directive(app);
other.elSvg(app);

app.component('pagination', pagination)

app.use(router)
    .use(store, key)
    .use(ElementPlus, {locale: zhCn})
    .use(i18n)
    .use(VueGridLayout)
    .mount('#app');


// 全局挂载
app.config.globalProperties.getUpFileUrl = getUpFileUrl
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.useDict = useDict
app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.selectDictLabel = selectDictLabel
