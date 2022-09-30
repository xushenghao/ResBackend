import request from '/@/utils/request';

// 上传单个图片
export function uploadSingleImg(data: any) {
    return request({
        url: '/api/v1/pub/upload/singleImg',
        method: 'post',
        data: data
    })
}

// 上传多个图片
export function uploadMultiImg(data: any) {
    return request({
        url: '/api/v1/pub/upload/multipleImg',
        method: 'post',
        data: data
    })
}

// 上传单个文件
export function uploadSingleFile(data: any) {
    return request({
        url: '/api/v1/pub/upload/singleFile',
        method: 'post',
        data: data
    })
}

// 上传多个文件
export function uploadMultiFile(data: any) {
    return request({
        url: '/api/v1/pub/upload/multipleFile',
        method: 'post',
        data: data
    })
}