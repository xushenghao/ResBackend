import {RouteRecordRaw} from 'vue-router';

/**
 * 定义静态路由
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('/@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/dbInit',
        name: 'dbInit',
        component: () => import('/@/views/dbInit/index.vue'),
        meta: {
            title: '系统初始化',
        },
    },
];
