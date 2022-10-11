import request from '/@/utils/request';


export function addClinic(data: any) {
    return request({
        url: '/api/v1/ophtha/clinic/add',
        method: 'post',
        data: data
    })
}

export function deleteClinic(ids: string[]) {
    return request({
        url: '/api/v1/ophtha/clinic/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateClinic(data: any) {
    return request({
        url: '/api/v1/ophtha/clinic/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/ophtha/clinic/status',
        method: 'put',
        data: {id, status}
    })
}

export function getClinic(id: string) {
    return request({
        url: '/api/v1/ophtha/clinic/get',
        method: 'get',
        params: {id}
    })
}

export function listClinic(query: Object) {
    return request({
        url: '/api/v1/ophtha/clinic/list',
        method: 'post',
        data: query
    })
}