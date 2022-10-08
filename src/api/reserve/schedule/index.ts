import request from '/@/utils/request';


export function addSchedule(data: any) {
    return request({
        url: '/api/v1/ophtha/schedule/add',
        method: 'post',
        data: data
    })
}

export function deleteSchedule(ids: string[]) {
    return request({
        url: '/api/v1/ophtha/schedule/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateSchedule(data: any) {
    return request({
        url: '/api/v1/ophtha/schedule/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/ophtha/schedule/status',
        method: 'put',
        data: {id, status}
    })
}

export function getSchedule(id: string) {
    return request({
        url: '/api/v1/ophtha/schedule/get',
        method: 'get',
        params: {id}
    })
}

export function listSchedule(query: Object) {
    return request({
        url: '/api/v1/ophtha/schedule/list',
        method: 'post',
        params: query
    })
}