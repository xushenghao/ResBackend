// 对象数据类型
export interface ScheduleData {
    id: string;             // 专家ID
    name: string;           // 专家名称
    title: string;          // 专家称谓
    mobile: string;         // 手机号
    status: number;         // 展示状态，0 禁用 1启用
    avatar: string          // 形象照路径
    licence: string         // 执业照路径
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

export interface DayInfo {
    week: string;               // 星期几
    date: string;               // 日期
    past: boolean;              // 是否过去的日期
    today: boolean;             // 是否今天
    schedule: ScheduleData;     // 排班信息
}

// 列表视图数据类型
export interface ScheduleList {
    ids: string[];
    clinic: Array<ClinicData>;
    weekday: Array<DayInfo>;
    list: {
        data: Array<ScheduleData>;
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
