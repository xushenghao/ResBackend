// 对象数据类型
export interface ScheduleData {
    id: string;                 // 班表ID
    status: string;             // 班表状态，0草稿 1发布 2锁定
    synced: string;             // 同步来源，0手工创建 1钉钉同步 2企微同步
    dateAt: string;             // 所在日期
    expertId: string;           // 专家编号
    expertName: string;         // 专家名称
    shiftId: string;            // 班次编号
    shiftName: string;          // 班次名称
    treatId: string;            // 科目编号
    treatName: string;          // 科目名称
    clinicId: string;           // 所属诊所ID
    clinicName: string;         // 诊所名称
    serviceCount: string;       // 号源数量
    remainCount: string;        // 余号数量
    consultingRoomId: string;   // 诊室编号
    consultingRoomName: string; // 诊室名称
    createdAt: string;          // 创建时间
    updatedAt: string;          // 更新时间
}

export interface ExpertData {
    id: string;             // 专家ID
    name: string;           // 专家名称
    title: string;          // 专家称谓
}

export interface ClinicData {
    id: string;         // 诊所ID
    name: string;       // 诊所名称
    short: string;      // 诊所简称
}

export interface DayInfo {
    week: string;                               // 星期几
    date: string;                               // 日期
    past: boolean;                              // 是否过去的日期
    today: boolean;                             // 是否今天
    schedule: Array<ScheduleData> | undefined;  // 排班信息
}

// 列表视图数据类型
export interface ScheduleList {
    expert: Array<ExpertData>;
    clinic: Array<ClinicData>;
    weekday: Array<DayInfo>;
    ids: string[];
    list: {
        data: Array<ScheduleData>;
        loading: boolean;
        total: number;
        param: {
            paging: {
                dateRange: string[];
                pageSize: number;
                pageNum: number;
                orderBy: string;
            }
            status: number | undefined;
            name: string | undefined;
            clinicName: string | undefined;
        };
    };
}
