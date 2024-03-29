import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {store} from '/@/store/index.ts';
import {Session} from '/@/utils/storage';
import {NextLoading} from '/@/utils/loading';
import {dynamicRoutes} from '/@/router/route';
import {staticRoutes} from '/@/router/static';
import {initFrontEndControlRoutes} from '/@/router/frontEnd';
import {initBackEndControlRoutes} from '/@/router/backEnd';
import {isInit} from "/@/api/system/dbInit"

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRoutes,
});

/**
 * 定义404界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
const pathMatch = {
    path: '/:path(.*)*',
    redirect: '/404',
};

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
    if (arr.length <= 0) return false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
            arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
        }
    }
    return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
    if (arr.length <= 0) return false;
    const newArr: any = [];
    const cacheList: Array<string> = [];
    arr.forEach(async (v: any) => {
        if (v.path === '/') {
            newArr.push({component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: []});
        } else {
            // 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
            // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
            if (v.path.indexOf('/:') > -1) {
                v.meta['isDynamic'] = true;
                v.meta['isDynamicPath'] = v.path;
            }
            newArr[0].children.push({...v});
            // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
            // 路径：/@/layout/routerView/parent.vue
            if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
                cacheList.push(v.name);
                await store.dispatch('keepAliveNames/setCacheKeepAlive', cacheList);
            }
        }
    });
    return newArr;
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setCacheTagsViewRoutes() {
    // 获取有权限的路由，否则 tagsView、菜单搜索中无权限的路由也将显示
    // 添加到 vuex setTagsViewRoutes 中
    await store.dispatch('tagsViewRoutes/setTagsViewRoutes', formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);
}

/**
 * 判断路由 `meta.roles` 中是否包含当前登录用户权限字段
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @param route 当前循环时的路由项
 * @returns 返回对比后有权限的路由项
 */
export function hasRoles(roles: any, route: any) {
    if (route.meta && route.meta.roles) return roles.some((role: any) => route.meta.roles.includes(role));
    else return true;
}

/**
 * 获取当前用户权限标识去比对路由表，设置递归过滤有权限的路由
 * @param routes 当前路由 children
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @returns 返回有权限的路由数组 `meta.roles` 中控制
 */
export function setFilterHasRolesMenu(routes: any, roles: any) {
    const menu: any = [];
    routes.forEach((route: any) => {
        const item = {...route};
        if (hasRoles(roles, item)) {
            menu.push(item);
        }
    });
    return menu;
}

/**
 * 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes() {
    await store.dispatch('routesList/setRoutesList', dynamicRoutes[0].children);
    await setCacheTagsViewRoutes();
}

/**
 * 获取当前用户权限标识去比对路由表（未处理成多级嵌套路由）
 * @description 这里主要用于动态路由的添加，router.addRoute
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 * @param children dynamicRoutes（/@/router/route）第一个顶级 children 的下路由集合
 * @returns 返回有当前用户权限标识的路由数组
 */
export function setFilterRoute(children: any) {
    let filterRoute: any = [];
    children.forEach((route: any) => {
        if (route.meta.roles) {
            route.meta.roles.forEach((metaRoles: any) => {
                store.state.userInfos.userInfos.roles.forEach((roles: any) => {
                    if (metaRoles === roles) filterRoute.push({...route});
                });
            });
        }
    });
    return filterRoute;
}

/**
 * 获取有当前用户权限标识的路由数组，进行对原路由的替换
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
    let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
    filterRouteEnd[0].children = [...filterRouteEnd[0].children, {...pathMatch}];
    return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
    await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
        const routeName: any = route.name;
        if (!router.hasRoute(routeName)) router.addRoute(route);
    });
}

/**
 * 删除/重置路由
 * @method router.removeRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#push
 */
export async function resetRoute() {
    await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
        const routeName: any = route.name;
        router.hasRoute(routeName) && router.removeRoute(routeName);
    });
}

// isRequestRoutes 为 true，则开启后端控制路由，路径：`/src/store/modules/themeConfig.ts`
const {isRequestRoutes} = store.state.themeConfig.themeConfig;
// 前端控制路由：初始化方法，防止刷新时路由丢失
if (!isRequestRoutes) await initFrontEndControlRoutes();


// 路由加载前
router.beforeEach(async (to, from, next) => {
    NProgress.configure({showSpinner: false});
    if (to.meta.title) NProgress.start();

    //  系统初始化
    if (to.path === '/dbInit') {
        next();
        NProgress.done();
    }

    if (Session.get("isInit") !== true) {
        try {
            const res: any = await isInit()
            let {code, data} = res
            if (code === 0) {
                if (data === false) {
                    next('/dbInit');
                    NProgress.done();
                    return
                } else {
                    Session.set("isInit", true)
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    }

    // 正常流程
    const token = Session.get('token');
    if (to.path === '/login' && !token) {
        next();
        NProgress.done();
    } else {
        if (!token) {
            next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
            Session.clear();
            await resetRoute();
            NProgress.done();
        } else if (token && to.path === '/login') {
            next('/home');
            NProgress.done();
        } else {
            if (store.state.routesList.routesList.length === 0) {
                if (isRequestRoutes) {
                    await initBackEndControlRoutes();
                    next({...to, replace: true});
                }
            } else {
                next();
            }
        }
    }
});

// 路由加载后
router.afterEach(async () => {
    NProgress.done();
    await NextLoading.done();
});

// 导出路由
export default router;
