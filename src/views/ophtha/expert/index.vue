<template>
  <div class="ophtha-expert-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="ophtha-expert-search mb15">
                <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item label="专家姓名" prop="name">
                    <el-input
                        v-model="state.list.param.name"
                        placeholder="请输入专家姓名"
                        clearable
                        @keyup.enter.native="expertList"
                    />
                  </el-form-item>
                  <el-form-item label="专家状态" prop="status">
                    <el-select v-model="state.list.param.status" placeholder="请选择专家状态" class="w100">
                      <el-option key="0" value="0" label="停诊"/>
                      <el-option key="1" value="1" label="接诊"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属诊所" prop="clinicName">
                    <el-select v-model="state.list.param.clinicName" placeholder="请选择所属诊所" class="w100">
                      <el-option
                          v-for="clinic in state.clinic"
                          :key="clinic.id"
                          :value="clinic.short"
                          :label="clinic.short"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="expertList">
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
              新增专家
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除专家
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="state.list.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="头像" width="100" alian="center" prop="avatar">
          <template #default="scope">
            <el-avatar shape="square" size="large" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column sortable label="姓名" width="100" prop="name"/>
        <el-table-column sortable label="称谓" width="100" prop="title"/>
        <el-table-column sortable label="诊所" width="100" prop="clinicName"/>
        <el-table-column sortable label="专长" prop="ability" show-overflow-tooltip/>
        <el-table-column sortable label="标签" prop="tags" show-overflow-tooltip>
          <template #default>
            <el-tag class="ml-2" type="success">Tag</el-tag>
            <el-tag class="ml-2" type="info">Tag</el-tag>
            <el-tag class="ml-2" type="warning">Tag</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="简介" prop="brief" show-overflow-tooltip/>
        <el-table-column sortable label="手机" width="120" prop="mobile"/>
        <el-table-column sortable label="状态" width="100" prop="status" align="center">
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
          @pagination="expertList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="expertList"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteExpert, listExpert} from '/@/api/ophtha/expert';
import {ExpertData, ExpertList} from "/@/views/ophtha/expert/dataType";
import Editor from "/@/views/ophtha/expert/editor.vue";
import {listClinic} from "/@/api/ophtha/clinic";

const queryRef = ref();
const editorRef = ref();
const state = reactive<ExpertList>({
  ids: [],
  clinic: [],
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
      title: '',
      mobile: '',
      clinicName: '',
    },
  },
});

// 初始数据
const initTableData = () => {
  expertList()
  clinicList()
};
const expertList = () => {
  listExpert(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
  });
};
const clinicList = () => {
  listClinic({status: 1}).then((res: any) => {
    state.clinic = res.data.list;
  });
};

// 新增弹窗
const onOpenAddEditor = () => {
  editorRef.value.openEditor(undefined, state.clinic);
};

// 修改弹窗
const onOpenEditor = (row: ExpertData) => {
  editorRef.value.openEditor(row, state.clinic);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  expertList()
};

// 框选数据
const onSelectionChange = (selection: ExpertData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除专家
const onRowDel = (row: ExpertData) => {
  let msg = '你确定要删除所选数据？';
  let ids: string[] = [];
  if (row) {
    msg = `此操作将永久删除${row.name}，是否继续？`
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
        deleteExpert(ids).then(() => {
          ElMessage.success('删除成功');
          expertList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: ExpertData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + row.name + '专家吗？', "警告", {
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

// 页面加载时
onMounted(() => {
  initTableData();
});

// 导出 emit 事件方法
defineExpose({expertList})
</script>

<style scoped lang="scss">
.el-tag {
  margin: 0 2px;
}
</style>