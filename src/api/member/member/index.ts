import request from '/@/utils/request';


export function addMember(data: any) {
    return request({
        url: '/api/v1/member/member/add',
        method: 'post',
        data: data
    })
}

export function deleteMember(ids: string[]) {
    return request({
        url: '/api/v1/member/member/delete',
        method: 'delete',
        data: {ids}
    })
}

export function updateMember(data: any) {
    return request({
        url: '/api/v1/member/member/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id: string, status: number) {
    return request({
        url: '/api/v1/member/member/status',
        method: 'put',
        data: {id, status}
    })
}

export function changeClinic(id: string, clinic: string) {
    return request({
        url: '/api/v1/member/member/clinic',
        method: 'put',
        data: {id, clinic}
    })
}

export function getMember(id: string) {
    return request({
        url: '/api/v1/member/member/get',
        method: 'get',
        params: {id}
    })
}

export function listMember(query: Object) {
    return request({
        url: '/api/v1/member/member/list',
        method: 'post',
        data: query
    })
}