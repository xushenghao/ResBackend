<template>
  <div class="ophtha-clinic-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="ophtha-clinic-search mb15">
                <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item label="诊所名称" prop="name">
                    <el-input
                        v-model="state.list.param.name"
                        placeholder="请输入诊所名称"
                        clearable
                        size="default"
                        @keyup.enter.native="clinicList"
                    />
                  </el-form-item>
                  <el-form-item label="诊所状态" prop="status">
                    <el-select v-model="state.list.param.status" placeholder="请选择诊所状态" class="w100">
                      <el-option key="0" value="0" label="停诊"/>
                      <el-option key="1" value="1" label="接诊"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属机构" prop="deptName">
                    <el-select v-model="state.list.param.deptName" placeholder="请选择所属机构" class="w100">
                      <el-option
                          v-for="dept in state.dept"
                          :key="dept.deptId"
                          :value="dept.deptName"
                          :label="dept.deptName"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="clinicList">
                      <el-icon>
                        <ele-Search/>
                      </el-icon>
                      查询
                    </el-button>
                    <el-button @click="onReset(queryRef)">
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
            <el-button type="primary" class="ml10" @click="onOpenAddEditor">
              <el-icon>
                <ele-Plus/>
              </el-icon>
              新增诊所
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除诊所
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="state.list.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="诊所标志" width="100" alian="center" prop="logo">
          <template #default="scope">
            <el-avatar shape="square" size="large" :src="scope.row.logo"/>
          </template>
        </el-table-column>
        <el-table-column sortable label="诊所简称" width="120" prop="short" show-overflow-tooltip/>
        <el-table-column sortable label="诊所全称" prop="name" show-overflow-tooltip/>
        <el-table-column sortable label="所属机构" width="120" prop="deptName"/>
        <el-table-column sortable label="诊所地址" prop="address" show-overflow-tooltip/>
        <el-table-column sortable label="联系电话" width="120" prop="phoneMain"/>
        <el-table-column sortable label="备用电话" width="120" prop="phoneOther"/>
        <el-table-column sortable label="营业状态" width="120" prop="status" align="center">
          <template #default="scope">
            <el-switch
                @change="onStatusChange(scope.row)"
                v-model="scope.row.status"
                inline-prompt
                :active-value=1
                active-text="接"
                :inactive-value=0
                inactive-text="停"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenEditor(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="state.list.total>0"
          :total="state.list.total"
          v-model:page="state.list.param.pageNum"
          v-model:limit="state.list.param.pageSize"
          @pagination="clinicList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="clinicList"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteClinic, listClinic} from '/@/api/ophtha/clinic';
import {ClinicData, ClinicList} from "/@/views/ophtha/clinic/dataType";
import Editor from "/@/views/ophtha/clinic/editor.vue";
import {getDeptList} from "/@/api/system/dept";

const queryRef = ref();
const editorRef = ref();
const state = reactive<ClinicList>({
  ids: [],
  dept: [],
  list: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
      dateRange: [],
      status: undefined,
      name: '',
      address: '',
      deptName: '',
    },
  },
});

// 初始数据
const initTableData = () => {
  clinicList()
  deptList()
};
const clinicList = () => {
  listClinic(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
  });
};
const deptList = () => {
  const payload = {
    deptType: 4,
    status: 1,
  };
  getDeptList(payload).then((res: any) => {
    state.dept = res.data.deptList;
  });
};

// 新增弹窗
const onOpenAddEditor = () => {
  editorRef.value.openEditor(undefined, state.dept);
};

// 修改弹窗
const onOpenEditor = (row: ClinicData) => {
  editorRef.value.openEditor(row, state.dept);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  clinicList()
};

// 框选数据
const onSelectionChange = (selection: ClinicData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除诊所
const onRowDel = (row: ClinicData) => {
  let msg = '你确定要删除所选数据？';
  let ids: string[] = [];
  if (row) {
    msg = `此操作将永久删除：${row.name}，是否继续？`
    ids = [row.id]
  } else {
    ids = state.ids
  }
  if (ids.length === 0) {
    ElMessage.error('请选择要删除的数据');
    return
  }
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        deleteClinic(ids).then(() => {
          ElMessage.success('删除成功');
          clinicList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: ClinicData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + '：' + row.name + '诊所吗？', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return changeStatus(row.id, row.status);
  }).then(() => {
    ElMessage.success(text + "成功");
  }).catch(function () {
    row.status = row.status === 0 ? 1 : 0;
  });
};

// 页面加载时初始化
onMounted(() => {
  initTableData();
});

// 导出 emit 事件方法
defineExpose({clinicList})
</script>

<style scoped lang="scss">
</style>