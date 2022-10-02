// 专家对象数据类型
export interface ExpertData {
    id: string;             // 专家ID
    name: string;           // 专家名称
    title: string;          // 专家称谓
    mobile: string;         // 手机号
    status: number;         // 展示状态，0 禁用 1启用
    Avatar: string          // 形象照路径
    Licence: string         // 执业照路径
    brief: string;          // 专家介绍
    tags: string;           // 专家标签
    ability: string;        // 技术专长
    clinicId: string;       // 所属诊所ID
    clinicName: string;     // 所属诊所名称
}

export interface ClinicData {
    id: string;         // 诊所ID
    name: string;       // 诊所名称
    short: string;      // 诊所简称
}

// 列表视图数据类型
export interface ExpertList {
    ids: string[];
    clinic: Array<ClinicData>;
    list: {
        data: Array<ExpertData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            status: number | undefined;
            name: string;
            title: string;
            mobile: string;
            clinicName: string;
        };
    };
}

// 编辑视图数据类型
export interface ClinicEditor {
    isShow: boolean;
    data: ExpertData;
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
