<template>
  <div class="system-user-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card shadow="hover">
          <el-aside>
            <el-scrollbar>
              <el-input :prefix-icon="search" v-model="filterText" placeholder="请输入机构名称" clearable />
              <el-tree
                  ref="treeRef"
                  class="filter-tree"
                  :data="deptData"
                  :props="deptProps"
                  :filter-node-method="deptFilterNode"
                  :expand-on-click-node="false"
                  :default-expand-all="true"
                  @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </el-aside>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover" class="card-table">
          <template #header>
            <div class="card-header">
              <el-collapse>
                <el-collapse-item name="finder">
                  <template #title>
                    <el-link type="primary" :underline="false">搜索</el-link>
                  </template>
                  <div class="system-user-search mb15">
                    <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
                      <el-form-item label="关键字" prop="keyWords">
                        <el-input
                            v-model="tableData.param.keyWords"
                            placeholder="请输入用户账号或姓名"
                            clearable

                            style="width: 240px"
                            @keyup.enter.native="userList"
                        />
                      </el-form-item>
                      <el-form-item label="手机号码" prop="mobile">
                        <el-input
                            v-model="tableData.param.mobile"
                            placeholder="请输入手机号码"
                            clearable

                            style="width: 240px"
                            @keyup.enter.native="userList"
                        />
                      </el-form-item>
                      <el-form-item label="用户状态" prop="status">
                        <el-select
                            v-model="tableData.param.status"
                            placeholder="请选择用户状态"
                            clearable

                            style="width: 240px"
                        >
                          <el-option label="启用" :value="1"/>
                          <el-option label="禁用" :value="0"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建时间" prop="dateRange">
                        <el-date-picker
                            v-model="tableData.param.dateRange"

                            style="width: 240px"
                            value-format="YYYY-MM-DD"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" class="ml10" @click="userList">
                          <el-icon>
                            <ele-Search/>
                          </el-icon>
                          查询
                        </el-button>
                        <el-button @click="resetQuery(queryRef)">
                          <el-icon>
                            <ele-Refresh/>
                          </el-icon>
                          重置
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div class="right-button">
                <el-button type="success" class="ml10" @click="onOpenAddUser">
                  <el-icon>
                    <ele-FolderAdd/>
                  </el-icon>
                  新增用户
                </el-button>
                <el-button plain type="danger" @click="onRowDel(null)">
                  <el-icon>
                    <ele-Delete/>
                  </el-icon>
                  删除用户
                </el-button>
              </div>
            </div>
          </template>
          <el-table stripe :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column type="index" label="序号" width="60" align="center"/>
            <el-table-column sortable min-width="120" prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
            <el-table-column sortable min-width="120" prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
            <el-table-column sortable min-width="120" prop="dept.deptName" label="所属机构" show-overflow-tooltip></el-table-column>
            <el-table-column sortable min-width="120" prop="roleInfo" label="角色" align="center" :show-overflow-tooltip="true">
              <template #default="scope">
                <span v-for="(item,index) of scope.row.roleInfo" :key="'role-'+index"> {{ item.name + ' ' }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable min-width="120" prop="mobile" label="手机号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="userStatus" label="用户状态" align="center" width="120" show-overflow-tooltip>
              <template #default="scope">
                <el-switch
                    v-model="scope.row.userStatus"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="启"
                    inactive-text="禁"
                    @change="handleStatusChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button size="small" link type="primary" @click="onOpenEditUser(scope.row)">修改</el-button>
                <el-button size="small" link type="danger" @click="onRowDel(scope.row)">删除</el-button>
                <el-button size="small" link type="danger" @click="handleResetPwd(scope.row)">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
              v-show="tableData.total>0"
              :total="tableData.total"
              v-model:page="tableData.param.pageNum"
              v-model:limit="tableData.param.pageSize"
              @pagination="userList"
          />
        </el-card>
      </el-col>
    </el-row>
    <EditUser ref="editUserRef" :dept-data="deptData" :gender-data="sys_user_sex" @getUserList="userList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, watch} from 'vue';
import {ElMessage, ElMessageBox, ElTree, FormInstance} from 'element-plus';
import {Search} from '@element-plus/icons-vue'
import EditUser from '/@/views/system/user/component/editUser.vue';
import {changeUserStatus, deleteUser, getDeptTree, getUserList, resetUserPwd} from '/@/api/system/user';

interface TableDataState {
  ids: number[];
  deptProps: {};
  deptData: any[];
  tableData: {
    data: any[];
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      deptId: string;
      mobile: string;
      status: string;
      keyWords: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'systemUser',
  components: {EditUser},
  setup() {
    const {proxy} = <any>getCurrentInstance();
    const {sys_user_sex} = proxy.useDict('sys_user_sex')
    const editUserRef = ref();
    const queryRef = ref();
    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const search = Search
    const state = reactive<TableDataState>({
      ids: [],
      deptProps: {
        id: "deptId",
        children: "children",
        label: "deptName"
      },
      deptData: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          deptId: '',
          mobile: '',
          status: '',
          keyWords: '',
          dateRange: []
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      getDeptTree().then((res: any) => {
        state.deptData = res.data.deps
      })
      userList();
    };
    const userList = () => {
      getUserList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.userList ?? [];
        state.tableData.total = res.data.total;
      });
    };
    // 打开新增用户弹窗
    const onOpenAddUser = () => {
      editUserRef.value.openDialog();
    };
    // 打开修改用户弹窗
    const onOpenEditUser = (row: any) => {
      editUserRef.value.openDialog(row);
    };
    // 删除用户
    const onRowDel = (row: any) => {
      let msg = '你确定要删除所选用户？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除用户：${row.userName}，是否继续？`
        ids = [row.id]
      } else {
        ids = state.ids
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要删除的数据。');
        return
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteUser(ids).then(() => {
              ElMessage.success('删除成功');
              userList();
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
    watch(filterText, (val) => {
      treeRef.value!.filter(val)
    });
    const deptFilterNode = (value: string, data: any) => {
      if (!value) return true;
      return data.label.includes(value)
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: any[]) => {
      state.ids = selection.map(item => item.id)
    };
    // 节点单击事件
    const handleNodeClick = (data: any) => {
      state.tableData.param.deptId = data.deptId;
      userList();
    };
    /** 重置密码按钮操作 */
    const handleResetPwd = (row: any) => {
      ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({value}) => {
        if (!value || value == '') {
          ElMessage.success('密码不能为空');
          return
        }
        resetUserPwd(row.id, value).then(() => {
          ElMessage.success("修改成功，新密码是：" + value);
        });
      }).catch(() => {
      });
    };
    // 用户状态修改
    const handleStatusChange = (row: any) => {
      let text = row.userStatus === 1 ? "启用" : "停用";
      ElMessageBox.confirm('确认要"' + text + '"："' + row.userName + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeUserStatus(row.id, row.userStatus);
      }).then(() => {
        ElMessage.success(text + "成功");
      }).catch(function () {
        row.userStatus = row.userStatus === 0 ? 1 : 0;
      });
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      userList()
    };
    return {
      queryRef,
      editUserRef,
      onOpenAddUser,
      onOpenEditUser,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      deptFilterNode,
      filterText,
      treeRef,
      search,
      sys_user_sex,
      userList,
      handleSelectionChange,
      handleNodeClick,
      handleResetPwd,
      handleStatusChange,
      resetQuery,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.el-aside {
  width: var(--el-aside-width, 100%);

  .filter-tree {
    margin-top: 10px;
  }

  .el-tree-node__content {
    height: 32px;
  }
}
</style>