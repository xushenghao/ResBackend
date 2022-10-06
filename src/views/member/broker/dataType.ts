// 对象数据类型
export interface BrokerData {
    id: string;            // 渠道人员ID
    name: string;          // 渠道人员姓名
    nickname: string;      // 渠道人员昵称
    residentId: string;    // 身份证号
    channelId: string;     // 所属渠道ID
    mobile: string;        // 中国手机不带国家代码，国际手机号格式为：国家代码-手机号
    password: string;      // 登录密码
    salt: string;          // 加密盐
    status: number;        // 渠道人员状态，0禁用 1正常 2未验证
    gender: number;        // 渠道人员性别，0保密 1男 2女
    avatar: string;        // 渠道人员头像
    remark: string;        // 备注
    address: string;       // 联系地址
    lastLoginIp: string;   // 最后登录IP
    lastLoginTime: string; // 最后登录时间
    createdBy: string;     // 创建人员
    createdAt: string;     // 创建时间
}

export interface ChannelList {
    id: string;         // 渠道ID
    name: string;       // 渠道全称
    short: string;      // 渠道简称
}

// 列表视图数据类型
export interface BrokerList {
    ids: string[];
    channel: Array<ChannelList>;
    list: {
        data: Array<BrokerData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            name: string;                   // 渠道人员姓名
            nickname: string;               // 渠道人员昵称
            residentId: string;             // 身份证号
            channelId: string;              // 所属渠道ID
            mobile: string;                 // 中国手机不带国家代码，国际手机号格式为：国家代码-手机号
            status: number | undefined;     // 渠道人员状态，0禁用 1正常 2未验证
            gender: number | undefined;     // 渠道人员性别，0保密 1男 2女
            remark: string;                 // 备注
            address: string;                // 联系地址
            lastLoginIp: string;            // 最后登录IP
            lastLoginTime: string;          // 最后登录时间
            createdBy: string;              // 创建人员
            createdAt: string;              // 创建时间
        };
    };
}

// 编辑视图数据类型
export interface BrokerEditor {
    isShow: boolean;
    data: BrokerData;
    channel: Array<ChannelList>;
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
