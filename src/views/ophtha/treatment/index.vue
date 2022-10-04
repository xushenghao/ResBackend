<template>
  <div class="ophtha-treatment-container">
    <el-card shadow="hover">
      <div class="ophtha-treatment-search mb15">
        <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="科目名称" prop="name">
            <el-input
                v-model="state.list.param.name"
                placeholder="请输入科目名称"
                clearable
                size="default"
                @keyup.enter.native="treatmentList"
            />
          </el-form-item>
          <el-form-item label="科目状态" prop="status">
            <el-select v-model="state.list.param.status" placeholder="请选择科目状态" class="w100">
              <el-option key="0" value="0" label="停用"/>
              <el-option key="1" value="1" label="启用"/>
            </el-select>
          </el-form-item>
          <el-form-item label="服务诊所" prop="clinicName">
            <el-select v-model="state.list.param.clinicName" placeholder="请选择服务诊所" class="w100">
              <el-option
                  v-for="clinic in state.clinic"
                  :key="clinic.id"
                  :value="clinic.short"
                  :label="clinic.short"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="treatmentList">
              <el-icon>
                <ele-Search/>
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="onReset(queryRef)">
              <el-icon>
                <ele-Refresh/>
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="primary" class="ml10" @click="onOpenAddEditor">
              <el-icon>
                <ele-Plus/>
              </el-icon>
              新增科目
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除科目
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe style="width: 100%" :data="state.list.data" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="科目图例" width="100" alian="center" prop="photos">
          <template #default="scope">
            <el-avatar shape="square" size="large" :src="scope.row.photos"/>
          </template>
        </el-table-column>
        <el-table-column sortable label="科目代码" width="120" prop="code"/>
        <el-table-column sortable label="科目名称" width="160" prop="name"/>
        <el-table-column sortable label="科目分类" width="120" align="center" prop="category"/>
        <el-table-column sortable label="服务诊所" width="120" align="center" prop="clinicName"/>
        <el-table-column sortable label="科目介绍" show-overflow-tooltipprop="remark"/>
        <el-table-column sortable label="科目状态" width="120" prop="status" align="center">
          <template #default="scope">
            <el-switch
                @change="onStatusChange(scope.row)"
                v-model="scope.row.status"
                inline-prompt
                :active-value=1
                active-text="启"
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
          @pagination="treatmentList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="treatmentList"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteTreatment, listTreatment} from '/@/api/ophtha/treatment/index';
import {TreatmentData, TreatmentList} from "/@/views/ophtha/treatment/dataType";
import Editor from "/@/views/ophtha/treatment/editor.vue";
import {listClinic} from "/@/api/ophtha/clinic";

const queryRef = ref();
const editorRef = ref();
const state = reactive<TreatmentList>({
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
      code: '',
      category: '',
      clinicName: '',
    },
  },
});

// 初始数据
const initTableData = () => {
  treatmentList()
  clinicList()
};
const treatmentList = () => {
  listTreatment(state.list.param).then((res: any) => {
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
const onOpenEditor = (row: TreatmentData) => {
  editorRef.value.openEditor(row, state.clinic);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  treatmentList()
};

// 框选数据
const onSelectionChange = (selection: TreatmentData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除科目
const onRowDel = (row: TreatmentData) => {
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
        deleteTreatment(ids).then(() => {
          ElMessage.success('删除成功');
          treatmentList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: TreatmentData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + row.name + '科目吗？', "警告", {
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
defineExpose({treatmentList})
</script>

<style scoped lang="scss">
.el-tag {
  margin: 0 2px;
}
</style>