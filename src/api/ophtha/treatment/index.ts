import request from '/@/utils/request';


export function addTreatment(data: any) {
    return request({
        url: '/api/v1/ophtha/treatment/add',
        method: 'post',
        data: data
    })
}

export function deleteTreatment(ids: string[]) {
    return request({
        url: '/api/v1/ophtha/treatment/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateTreatment(data: any) {
    return request({
        url: '/api/v1/ophtha/treatment/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/ophtha/treatment/status',
        method: 'put',
        data: {id, status}
    })
}

export function getTreatment(id: string) {
    return request({
        url: '/api/v1/ophtha/treatment/get',
        method: 'get',
        params: {id}
    })
}

export function listTreatment(query: Object) {
    return request({
        url: '/api/v1/ophtha/treatment/list',
        method: 'post',
        params: query
    })
}