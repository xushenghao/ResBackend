import request from '/@/utils/request'

// 新增定时任务调度
export function addJob(data: object) {
    return request({
        url: '/api/v1/system/jobs/add',
        method: 'post',
        data: data
    })
}

// 删除定时任务调度
export function deleteJob(ids: number[]) {
    return request({
        url: '/api/v1/system/jobs/delete',
        method: 'delete',
        params: {ids}
    })
}

// 修改定时任务调度
export function updateJob(data: object) {
    return request({
        url: '/api/v1/system/jobs/update',
        method: 'put',
        data: data
    })
}

// 查询定时任务调度详细
export function getJob(jobId: number) {
    return request({
        url: '/api/v1/system/jobs/get?jobId=' + jobId,
        method: 'get'
    })
}

// 导出定时任务调度
export function exportJob(query: object) {
    return request({
        url: '/api/v1/system/jobs/export',
        method: 'get',
        params: query
    })
}

// 任务状态修改
export function changeStatus(jobId: number, status: number) {
    return request({
        url: '/api/v1/system/jobs/status',
        method: 'put',
        data: {jobId, status}
    })
}

export function startJob(jobId: number) {
    return request({
        url: '/api/v1/system/jobs/start?jobId=' + jobId,
        method: 'put',
    })
}

export function stopJob(jobId: number) {
    return request({
        url: '/api/v1/system/jobs/stop?jobId=' + jobId,
        method: 'put',
    })
}

// 定时任务立即执行一次
export function runJob(jobId: number) {
    return request({
        url: '/api/v1/system/jobs/run?jobId=' + jobId,
        method: 'put',
    })
}

// 查询定时任务调度列表
export function listJob(query: object) {
    return request({
        url: '/api/v1/system/jobs/list',
        method: 'get',
        params: query
    })
}