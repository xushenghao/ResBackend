<template>
  <div class="system-dept-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="system-dept-search mb15">
                <el-form :inline="true">
                  <el-form-item label="机构名称">
                    <el-input  v-model="tableData.param.deptName" placeholder="请输入机构名称" class="w-50 m-2" clearable/>
                  </el-form-item>
                  <el-form-item label="机构类型">
                    <el-select  placeholder="请选择机构类型" class="w-50 m-2" v-model="tableData.param.deptType" clearable>
                      <el-option
                          v-for="dict in sys_dept_type"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="机构状态">
                    <el-select  placeholder="请选择机构状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
                      <el-option label="启用" value="1"/>
                      <el-option label="禁用" value="0"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="deptList">
                      <el-icon>
                        <ele-Search/>
                      </el-icon>
                      查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="right-button">
            <el-button type="success" class="ml10" @click="onOpenAddDept">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增机构
            </el-button>
          </div>
        </div>
      </template>
      <el-table
          stripe
          :data="tableData.data"
          style="width: 100%"
          row-key="deptId"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="deptName" min-width="120" label="机构名称" show-overflow-tooltip/>
        <el-table-column prop="deptType" width="100" label="机构类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success">
              {{ sys_dept_type[scope.row.deptType].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" width="60" label="排序" show-overflow-tooltip/>
        <el-table-column prop="createdAt" width="180" label="创建时间" show-overflow-tooltip/>
        <el-table-column prop="status" width="100" label="机构状态" align="center" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status===1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" show-overflow-tooltip width="160">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenAddDept(scope.row)">新增</el-button>
            <el-button size="small" link type="primary" @click="onOpenEditDept(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="onTableRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditDept ref="editDeptRef" @deptList="deptList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import EditDept from '/@/views/system/dept/component/editDept.vue';
import {deleteDept, getDeptList} from "/@/api/system/dept";

// 定义接口来定义对象的类型
interface TableDataRow {
  deptId: number;
  parentId: number;
  deptName: string;
  deptType: number;
  status: number;
  orderNum: number;
  createdAt: string;
  children?: TableDataRow[];
}

interface TableDataState {
  tableData: {
    data: Array<TableDataRow>;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      deptType: number | undefined;
      deptName: string;
      status: string;
    };
  };
}

export default defineComponent({
  name: 'systemDept',
  components: {EditDept},
  setup() {
    const editDeptRef = ref();
    const {proxy} = getCurrentInstance() as any;
    const {sys_dept_type} = proxy.useDict('sys_dept_type')
    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          deptType: undefined,
          deptName: '',
          status: ''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      deptList();
    };
    const deptList = () => {
      getDeptList(state.tableData.param).then((res: any) => {
        state.tableData.data = proxy.handleTree(res.data.deptList ?? [], "deptId", "parentId");
      });
    };
    // 打开新增菜单弹窗
    const onOpenAddDept = (row?: TableDataRow) => {
      editDeptRef.value.openDialog(row?.deptId);
    };
    // 打开编辑菜单弹窗
    const onOpenEditDept = (row: TableDataRow) => {
      editDeptRef.value.openDialog(row);
    };
    // 删除当前行
    const onTableRowDel = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将永久删除机构：${row.deptName}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteDept(row.deptId).then(() => {
              ElMessage.success('删除成功');
              deptList();
            })
          })
          .catch(() => {
          });
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      editDeptRef,
      deptList,
      onOpenAddDept,
      onOpenEditDept,
      onTableRowDel,
      sys_dept_type,
      ...toRefs(state),
    };
  },
});
</script>
