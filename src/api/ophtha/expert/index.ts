import request from '/@/utils/request';


export function addExpert(data: any) {
    return request({
        url: '/api/v1/ophtha/expert/add',
        method: 'post',
        data: data
    })
}

export function deleteExpert(ids: string[]) {
    return request({
        url: '/api/v1/ophtha/expert/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateExpert(data: any) {
    return request({
        url: '/api/v1/ophtha/expert/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/ophtha/expert/status',
        method: 'put',
        data: {id, status}
    })
}

export function getExpert(id: string) {
    return request({
        url: '/api/v1/ophtha/expert/get',
        method: 'get',
        params: {id}
    })
}

export function listExpert(query: Object) {
    return request({
        url: '/api/v1/ophtha/expert/list',
        method: 'post',
        params: query
    })
}