// 专家对象数据类型
export interface ChannelData {
    id: string;                     // 渠道ID
    account: string;                // 账户名称
    name: string;                   // 渠道全称
    short: string;                  // 渠道简称
    address: string;                // 联系地址
    contact: string;                // 渠道主管
    mobile: string;                 // 联系电话
    status: number | undefined;     // 账户状态，0禁用 1正常
    remark: string;                 // 备注
    createdBy: string;              // 创建用户
    createdAt: string;              // 创建时间
}

// 列表视图数据类型
export interface ChannelList {
    ids: string[];
    list: {
        data: Array<ChannelData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            id: string;                     // 渠道ID
            account: string;                // 账户名称
            name: string;                   // 渠道全称
            short: string;                  // 渠道简称
            address: string;                // 联系地址
            contact: string;                // 渠道主管
            mobile: string;                 // 联系电话
            status: number | undefined;     // 账户状态，0禁用 1正常
            createdBy: string;              // 创建用户
            createdAt: string;              // 创建时间
        };
    };
}

// 编辑视图数据类型
export interface ChannelEditor {
    isShow: boolean;
    data: ChannelData;
    rules: {};
}
