import request from '/@/utils/request';


export function logList(query: object) {
    return request({
        url: '/api/v1/system/logs/list',
        method: 'post',
        params: query
    })
}


export function deleteLog(ids: number[]) {
    return request({
        url: '/api/v1/system/logs/delete',
        method: 'delete',
        params: {ids}
    })
}


export function clearLog() {
    return request({
        url: '/api/v1/system/logs/clear',
        method: 'delete',
    })
}
