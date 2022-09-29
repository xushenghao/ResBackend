<template>
  <div class="ophtha-clinic-container">
    <el-card shadow="hover">
      <div class="ophtha-clinic-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="诊所名称" prop="name">
            <el-input
                v-model="tableData.param.name"
                placeholder="请输入诊所名称"
                clearable
                style="width: 180px;"
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>
          <el-form-item label="诊所状态" prop="status">
            <el-input
                v-model="tableData.param.status"
                placeholder="请输入诊所状态"
                clearable
                style="width: 180px;"
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="dataList">
              <el-icon>
                <ele-Search/>
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh/>
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="primary" class="ml10" @click="onOpenAddEditor">
              <el-icon>
                <ele-Plus/>
              </el-icon>
              新增诊所
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除诊所
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe :data="tableData.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="诊所标志" width="120" alian="center" prop="logo">
          <template #default="scope">
            <el-image style="width: 64px; height: 64px" :src="scope.row.logo" fit="cover"/>
          </template>
        </el-table-column>
        <el-table-column label="诊所简称" width="120" prop="short" :show-overflow-tooltip="true"/>
        <el-table-column label="诊所全称" prop="name" :show-overflow-tooltip="true"/>
        <el-table-column label="所属机构" prop="deptName" :show-overflow-tooltip="true"/>
        <el-table-column label="诊所地址" prop="address" :show-overflow-tooltip="true"/>
        <el-table-column label="联系电话" width="120" prop="phoneMain"/>
        <el-table-column label="备用电话" width="120" prop="phoneOther"/>
        <el-table-column label="状态" align="center" width="160" prop="status">
          <template #default="scope">
            <el-switch
                @change="onStatusChange(scope.row)"
                v-model="scope.row.status"
                inline-prompt
                :active-value=1
                active-text="启"
                :inactive-value=0
                inactive-text="禁"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenEditor(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="dataList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="dataList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteClinic, listClinic} from '/@/api/ophtha/clinic';
import TableDataRow from "/@/views/ophtha/clinic/dataType";
import Editor from "/@/views/ophtha/clinic/editor.vue";

interface TableDataState {
  ids: string[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      dateRange: string[];
      name: string;
      status: number | undefined;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemJobsList',
  components: {Editor},
  setup() {
    const queryRef = ref();
    const editorRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          dateRange: [],
          status: undefined,
          name: '',
        },
      },
    });

    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList = () => {
      listClinic(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };

    // 打开新增用户弹窗
    const onOpenAddEditor = () => {
      editorRef.value.openDialog();
    };

    // 打开修改用户弹窗
    const onOpenEditor = (row: TableDataRow) => {
      editorRef.value.openDialog(row);
    };

    // 删除诊所
    const onRowDel = (row: TableDataRow) => {
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
              dataList();
            })
          })
          .catch(() => {
          });
    };

    // 切换状态
    const onStatusChange = (row: TableDataRow) => {
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

    // 页面加载时
    onMounted(() => {
      initTableData();
    });

    // 重置按钮操作
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      dataList()
    };

    // 多选框选中数据
    const onSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map(item => item.id)
    };

    return {
      queryRef,
      editorRef,
      resetQuery,
      dataList,
      onRowDel,
      onSelectionChange,
      onStatusChange,
      onOpenAddEditor,
      onOpenEditor,
      ...toRefs(state),
    };
  },
});
</script>