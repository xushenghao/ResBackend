import request from '/@/utils/request';


export function addBroker(data: any) {
    return request({
        url: '/api/v1/member/broker/add',
        method: 'post',
        data: data
    })
}

export function deleteBroker(ids: string[]) {
    return request({
        url: '/api/v1/member/broker/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateBroker(data: any) {
    return request({
        url: '/api/v1/member/broker/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/member/broker/status',
        method: 'put',
        data: {id, status}
    })
}

export function getBroker(id: string) {
    return request({
        url: '/api/v1/member/broker/get',
        method: 'get',
        params: {id}
    })
}

export function listBroker(query: Object) {
    return request({
        url: '/api/v1/member/broker/list',
        method: 'post',
        params: query
    })
}