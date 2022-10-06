// 专家对象数据类型
export interface MemberData {
    id: string;             // 用户ID
    name: string;           // 用户名
    mail: string;           // 用户登录邮箱
    mobile: string;         // 中国手机不带国家代码
    status: number;         // 用户状态，0禁用 1正常 2未验证
    gender: number;         // 性别，0保密 1男 2女
    birthday: string;       // 生日
    nickname: string;       // 用户昵称
    password: string;       // 登录密码
    salt: string;           // 加密盐，最大长度为 10
    introduce: string;      // 推荐信息，渠道对接自定义用
    channelId: string;      // 来源渠道ID
    brokerId: string;       // 渠道人员ID
    clinicId: string;       // 初始门店ID
    avatar: string;         // 用户头像
    address: string;        // 联系地址
    describe: string;       // 描述信息
    createdBy: string;      // 创建用户
    lastLoginTime: string;  // 最后登录时间
}

export interface ClinicList {
    id: string;         // 诊所ID
    name: string;       // 诊所名称
    short: string;      // 诊所简称
}

export interface ChannelList {
    id: string;         // 渠道ID
    name: string;       // 渠道全称
    short: string;      // 渠道简称
}

export interface BrokerList {
    id: string;         // 渠道人员ID
    name: string;       // 渠道人员姓名
    channelId: string;  // 所属渠道ID
}

// 列表视图数据类型
export interface MemberList {
    ids: string[];
    clinic: Array<ClinicList>;
    broker: Array<BrokerList>;
    channel: Array<ChannelList>;
    list: {
        data: Array<MemberData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            name: string;                // 用户名
            mail: string;                // 用户登录邮箱
            mobile: string;              // 中国手机不带国家代码
            status: number|undefined;    // 用户状态，0禁用 1正常 2未验证
            gender: number|undefined;    // 性别，0保密 1男 2女
            birthday: string;            // 生日
            nickname: string;            // 用户昵称
            password: string;            // 登录密码
            salt: string;                // 加密盐，最大长度为 10
            introduce: string;           // 推荐信息，渠道对接自定义用
            channelId: string;           // 来源渠道ID
            brokerId: string;            // 来源渠道人员ID
            clinicId: string;            // 初始门店ID
            avatar: string;              // 用户头像
            address: string;             // 联系地址
            describe: string;            // 描述信息
            createdBy: string;           // 创建用户
        };
    };
}

// 编辑视图数据类型
export interface MemberEditor {
    isShow: boolean;
    data: MemberData;
    clinic: Array<ClinicList>
    broker: Array<BrokerList>;
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
