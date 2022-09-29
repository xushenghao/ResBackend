// 定义接口来定义对象的类型
export default interface TableDataRow {
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
    remark: string;     // 备注
    status: number;     // 运营状态，0 禁用 1启用
}