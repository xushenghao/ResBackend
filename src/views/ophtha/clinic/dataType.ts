// 诊所对象数据类型
export interface ClinicData {
    id: string;         // 诊所ID
    name: string;       // 诊所全称
    short: string;      // 诊所简称
    DeptId: string;     // 关联机构ID
    DeptName: string;   // 关联机构名称
    photos: string;     // 诊所照片
    logo: string;       // 诊所标志
    address: string;    // 诊所地址
    phoneMain: string;  // 联系电话 1
    phoneOther: string; // 联系电话 2
    status: number;     // 运营状态，0 禁用 1启用
}

// 列表视图数据类型
export interface ListState {
    ids: string[];
    list: {
        data: Array<ClinicData>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            dateRange: string[];
            status: number | undefined;
            name: string;
            address: string;
            deptName: string;
        };
    };
}

// 编辑视图数据类型
export interface EditorState {
    isShow: boolean;
    data: ClinicData;
    rules: {}
}
