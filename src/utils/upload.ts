import {uploadUrl} from "/@/utils/consts";
import {Session} from "/@/utils/storage";

export const uploader = {
    url: uploadUrl,
    headers: {Authorization: `Bearer ${Session.get('token')}`},
    isUploading: false,
}