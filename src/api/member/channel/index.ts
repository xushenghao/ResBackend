import request from '/@/utils/request';


export function addChannel(data: any) {
    return request({
        url: '/api/v1/member/channel/add',
        method: 'post',
        data: data
    })
}

export function deleteChannel(ids: string[]) {
    return request({
        url: '/api/v1/member/channel/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateChannel(data: any) {
    return request({
        url: '/api/v1/member/channel/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/member/channel/status',
        method: 'put',
        data: {id, status}
    })
}

export function getChannel(id: string) {
    return request({
        url: '/api/v1/member/channel/get',
        method: 'get',
        params: {id}
    })
}

export function listChannel(query: Object) {
    return request({
        url: '/api/v1/member/channel/list',
        method: 'post',
        params: query
    })
}