import {Module} from 'vuex';
import {RootStateTypes, ThemeConfigState} from '/@/store/interface';
import {Local} from '/@/utils/storage';

// 进行判断是否全局配置数据是否发生改变 true 没有改变  false 改变了 需要重新更新下 缓存的数据 并且 优先以代码文件数据
import {ThemeChangeFlag} from '/@/utils/theme';

/**
 * 2020.05.28 by lyt 优化
 * 修改一下配置时，需要每次都清理 `window.localStorage` 浏览器永久缓存，配置才会生效
 * 哪个大佬有解决办法，欢迎pr，感谢💕！
 */

/**
 * 补充说明： 此处解决这个问题 有两个方案
 * 分析：目前只有在App.vue 页面加载完成后 才会出发 Local.set('themeConfig',数据源);
 * 方案1： 直接修改 App.vue 在此处拿取到数据后 进行判断 本地设置的初始化值 和 缓存的  Local.get('themeConfig'); 是否不一样
 * 方案2： 在 当前文件的  action 下的 setThemeConfig 函数中 设置数据中 进行判断
 * 结论： 不管哪种方案都需要 一个判断是否改变数据的 函数，此处把这个函数封装在 /utils/theme => ThemeChangeFlag 函数中
 */

    // 把值进行初始化 单独提出一个变量 方便后面做参数判断
const initDefaultThemeConfig: ThemeConfigState = {
        themeConfig: {
            isDrawer: false,        // 是否开启布局配置抽屉
            primary: '#409eff',     // 默认 primary 主题颜色

            /**
             * 菜单 / 顶栏
             * 注意：v1.0.17 版本去除设置布局切换，重置主题样式（initSetLayoutChange），
             * 切换布局需手动设置样式，设置的样式自动同步各布局，
             * 代码位置：/@/layout/navBars/breadcrumb/settings.vue
             */
            topBar: '#ffffff',                   // 默认顶栏导航背景颜色
            topBarColor: '#606266',              // 默认顶栏导航字体颜色
            isTopBarColorGradual: false,         // 是否开启顶栏背景颜色渐变
            menuBar: '#123B60',                  // 默认菜单导航背景颜色
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
            isFixedHeader: true,                 // 是否开启固定 Header
            isFixedHeaderChange: true,           // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
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
            globalComponentSize: 'default',
            globalI18n: 'zh-cn',
        }
    }

const themeConfigModule: Module<ThemeConfigState, RootStateTypes> = {
    namespaced: true,
    state: {
        themeConfig: initDefaultThemeConfig.themeConfig,
    },
    mutations: {
        getThemeConfig(state: any, data: object) {
            state.themeConfig = data;
        },
    },
    actions: {
        // 设置布局配置
        // 进行判断当前传递的 data 和 自己初始化设置的是否一致 如果是 false 表示需要重新更新并设置初始化的
        setThemeConfig({commit}, data: object) {
            const flag = ThemeChangeFlag(data, initDefaultThemeConfig.themeConfig)
            if (!flag) {
                Local.set('themeConfig', initDefaultThemeConfig.themeConfig);
            }
            commit('getThemeConfig', flag ? data : initDefaultThemeConfig.themeConfig);
        },
    },
};

export default themeConfigModule;
