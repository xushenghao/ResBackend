<template>
  <div class="system-role-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="system-user-search mb15">
                <el-form :inline="true">
                  <el-form-item label="角色名称">
                    <el-input size="default" v-model="tableData.param.roleName" placeholder="请输入角色名称" class="w-50 m-2" clearable/>
                  </el-form-item>
                  <el-form-item label="角色状态">
                    <el-select size="default" placeholder="请选择角色状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
                      <el-option label="启用" value="1"/>
                      <el-option label="禁用" value="0"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="roleList">
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
            <el-button type="success" class="ml10" @click="onOpenAddRole">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增角色
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="tableData.data" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="60"/>
        <el-table-column sortable prop="listOrder" align="center" width="80" label="排序" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="name" align="center" width="140" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="remark" label="角色描述" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="createdAt" width="180" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="status" align="center" width="120" label="角色状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status===1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="110" align="center">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenEditRole(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="roleList"
      />
    </el-card>
    <EditRole ref="editRoleRef" @getRoleList="roleList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import EditRole from '/@/views/system/role/component/editRole.vue';
import {deleteRole, getRoleList} from "/@/api/system/role";

// 定义接口来定义对象的类型
interface TableData {
  id: number;
  status: number;
  listOrder: number;
  name: string;
  remark: string;
  dataScope: number;
  createdAt: string;
}

interface TableDataState {
  tableData: {
    data: Array<TableData>;
    total: number;
    loading: boolean;
    param: {
      roleName: string;
      status: string;
      pageNum: number;
      pageSize: number;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemRoleList',
  components: {EditRole},
  setup() {
    const addRoleRef = ref();
    const editRoleRef = ref();
    const {proxy} = getCurrentInstance() as any;
    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          roleName: '',
          status: '',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      roleList()
    };
    const roleList = () => {
      const data: Array<TableData> = [];
      getRoleList(state.tableData.param).then(res => {
        const list = res.data.list ?? []
        list.map((item: TableData) => {
          data.push({
            id: item.id,
            status: item.status,
            listOrder: item.listOrder,
            name: item.name,
            remark: item.remark,
            dataScope: item.dataScope,
            createdAt: item.createdAt,
          });
        })
        state.tableData.data = data;
        state.tableData.total = res.data.total;
      })
    };
    // 打开新增角色弹窗
    const onOpenAddRole = () => {
      editRoleRef.value.openDialog();
    };
    // 打开修改角色弹窗
    const onOpenEditRole = (row: Object) => {
      editRoleRef.value.openDialog(toRaw(row));
    };
    // 删除角色
    const onRowDel = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除角色：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteRole(row.id).then(() => {
              ElMessage.success('删除成功');
              proxy.$refs['editRoleRef'].resetMenuSession();
              roleList();
            })
          })
          .catch(() => {
          });
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      addRoleRef,
      editRoleRef,
      onOpenAddRole,
      onOpenEditRole,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      roleList,
      ...toRefs(state),
    };
  },
});
</script>
