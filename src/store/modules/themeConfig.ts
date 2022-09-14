import {Module} from 'vuex';
import {ThemeConfigState, RootStateTypes} from '/@/store/interface';

/**
 * 2020.05.28 by lyt 优化
 * 修改一下配置时，需要每次都清理 `window.localStorage` 浏览器永久缓存，配置才会生效
 * 哪个大佬有解决办法，欢迎pr，感谢💕！
 */
const themeConfigModule: Module<ThemeConfigState, RootStateTypes> = {
    namespaced: true,
    state: {
        themeConfig: {
            isDrawer: true,                      // 是否开启布局配置抽屉
            primary: '#E49612',                  // 默认主题颜色

            /**
             * 菜单 / 顶栏
             * 注意：v1.0.17 版本去除设置布局切换，重置主题样式（initSetLayoutChange），
             * 切换布局需手动设置样式，设置的样式自动同步各布局，
             * 代码位置：/@/layout/navBars/breadcrumb/settings.vue
             */
            topBar: '#ffffff',                   // 默认顶栏导航背景颜色
            topBarColor: '#606266',              // 默认顶栏导航字体颜色
            isTopBarColorGradual: false,         // 是否开启顶栏背景颜色渐变
            menuBar: '#646667',                  // 默认菜单导航背景颜色
            menuBarColor: '#EEEFF0',             // 默认菜单导航字体颜色
            isMenuBarColorGradual: false,        // 是否开启菜单背景颜色渐变
            columnsMenuBar: '#545c64',           // 默认分栏菜单背景颜色
            columnsMenuBarColor: '#e6e6e6',      // 默认分栏菜单字体颜色
            isColumnsMenuBarColorGradual: false, // 是否开启分栏菜单背景颜色渐变

            /**
             * 界面设置
             */
            isCollapse: false,                   // 是否开启菜单水平折叠效果
            isUniqueOpened: true,                // 是否开启菜单手风琴效果
            isFixedHeader: false,                // 是否开启固定 Header
            isFixedHeaderChange: false,          // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
            isClassicSplitMenu: false,           // 是否开启经典布局分割菜单（仅经典布局生效）
            isLockScreen: false,                 // 是否开启自动锁屏
            lockScreenTime: 30,                  // 开启自动锁屏倒计时(秒)

            /**
             * 界面显示
             */
            isShowLogo: true,                    // 是否开启侧边栏 Logo
            isShowLogoChange: false,             // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
            isBreadcrumb: true,                  // 是否开启 Breadcrumb，强制经典、横向布局不显示
            isTagsview: true,                    // 是否开启 Tagsview 模式
            isBreadcrumbIcon: false,             // 是否开启 Breadcrumb 图标
            isTagsviewIcon: true,                // 是否开启 Tagsview 图标
            isCacheTagsView: false,              // 是否开启 TagsView 缓存
            isSortableTagsView: true,            // 是否开启 TagsView 拖拽
            isShareTagsView: false,              // 是否开启 TagsView 共用
            isFooter: true,                      // 是否开启 Footer 底部版权信息
            isGrayscale: false,                  // 是否开启灰色模式
            isInvert: false,                     // 是否开启色弱模式
            isIsDark: false,                     // 是否开启深色模式
            isWartermark: false,                 // 是否开启水印
            wartermarkText: 'Joyful',            // 水印文案

            /**
             * 其它设置
             */
            tagsStyle: 'tags-style-five',
            animation: 'slide-right',
            columnsAsideStyle: 'columns-round',
            columnsAsideLayout: 'columns-vertical',

            /**
             * 布局切换
             * 注意：为了演示，切换布局时，颜色会被还原成默认，代码位置：/@/layout/navBars/breadcrumb/settings.vue
             * 中的 `initSetLayoutChange(设置布局切换，重置主题样式)` 方法
             */
            layout: 'defaults',

            /**
             * 后端控制路由
             */
            isRequestRoutes: true,                  // 是否开启后端控制路由

            /**
             * 全局网站标题 / 副标题
             */
            globalTitle: '炯炯眼科',
            globalViceTitle: '业务管理系统',
            globalComponentSize: 'large',
            globalI18n: 'zh-cn',
        },
    },
    mutations: {
        getThemeConfig(state: any, data: object) {
            state.themeConfig = data;
        },
    },
    actions: {
        setThemeConfig({commit}, data: object) {
            commit('getThemeConfig', data);
        },
    },
};

export default themeConfigModule;
