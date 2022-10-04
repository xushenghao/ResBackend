// 科目对象数据类型
export interface TreatmentData {
    id: string;             // 科目ID
    name: string;           // 科目名称
    code: string;           // 科目代码
    clinicId: string;       // 所属诊所ID
    clinicName: string;     // 所属诊所名称
    category: string;       // 科目分类
    status: number;         // 科目状态，0禁用 1启用
    photos: string;         // 参考照片
    remark: string;         // 备注
}

export interface ClinicData {
    id: string;         // 诊所ID
    name: string;       // 诊所名称
    short: string;      // 诊所简称
}

// 列表视图数据类型
export interface TreatmentList {
    ids: string[];
    clinic: Array<ClinicData>;
    list: {
        data: Array<TreatmentData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            status: number | undefined;
            name: string;
            code: string;
            category: string;
            clinicName: string;
        };
    };
}

// 编辑视图数据类型
export interface TreatmentEditor {
    isShow: boolean;
    data: TreatmentData;
    clinic: Array<ClinicData>
    rules: {};
    upload: {
        url: string;
        headers: {};
        isUploading: boolean;
    };
}

// 上传返回数据类型
export interface UploadResult {
    "code": number,
    "message": string,
    "data": {
        "size": number,
        "path": string,
        "name": string,
        "type": string,
        "full_path": string
    }
}
