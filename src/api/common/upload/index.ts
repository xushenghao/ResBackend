import request from '/@/utils/request';

// 上传单个图片
export function singleImg(data: any) {
    return request({
        url: '/api/v1/pub/upload/singleImg',
        method: 'post',
        data: data
    })
}

// 上传多个图片
export function multiImg(data: any) {
    return request({
        url: '/api/v1/pub/upload/multipleImg',
        method: 'post',
        data: data
    })
}

// 上传单个文件
export function singleFile(data: any) {
    return request({
        url: '/api/v1/pub/upload/singleFile',
        method: 'post',
        data: data
    })
}

// 上传多个文件
export function multiFile(data: any) {
    return request({
        url: '/api/v1/pub/upload/multipleFile',
        method: 'post',
        data: data
    })
}