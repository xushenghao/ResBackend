<template>
  <div class="system-dic-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="system-jobs-search mb15">
                <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item label="任务名称" prop="name">
                    <el-input
                        v-model="tableData.param.jobName"
                        placeholder="请输入任务名称"
                        clearable
                        style="width: 180px;"
                        size="default"
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="任务分组" prop="status">
                    <el-select
                        v-model="tableData.param.jobGroup"
                        placeholder="任务分组"
                        clearable
                        size="default"
                        style="width: 180px"
                    >
                      <el-option
                          v-for="dict in sys_job_group"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务状态" prop="status">
                    <el-select
                        v-model="tableData.param.status"
                        placeholder="任务状态"
                        clearable
                        size="default"
                        style="width: 180px"
                    >
                      <el-option
                          v-for="dict in sys_job_status"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="dataList">
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
            <el-button type="primary" class="ml10" @click="onOpenAddJob">
              <el-icon>
                <ele-Plus/>
              </el-icon>
              新增任务
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除任务
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="tableData.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="任务名称" align="center" width="120" prop="jobName"/>
        <el-table-column label="调用方法" alian="center" width="120" prop="invokeTarget"/>
        <el-table-column label="表达式" prop="cronExpression" :show-overflow-tooltip="true"/>
        <el-table-column label="任务分组" align="center" width="100" prop="group" :formatter="groupFormat"/>
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"/>
        <el-table-column label="任务状态" align="center" width="160" prop="status">
          <template #default="scope">
            <el-switch
                @change="onStatusChange(scope.row)"
                v-model="scope.row.status"
                inline-prompt
                :active-value=0
                active-text="启"
                :inactive-value=1
                inactive-text="停"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenEditJob(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="onRowDel(scope.row)">删除</el-button>
            <el-button size="small" link type="danger">执行一次</el-button>
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
    <EditJob ref="editJobRef" @onRefresh="dataList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, unref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import EditJob from "/@/views/system/monitor/jobs/component/editJob.vue";
import {changeStatus, deleteJob, listJob} from '/@/api/system/monitor/jobs';

// 定义接口来定义对象的类型
interface TableDataRow {
  jobId: number;
  jobName: string;
  jobGroup: string;
  jobParams: string;
  invokeTarget: string;
  cronExpression: string;
  misfirePolicy: number;
  concurrent: number;
  remark: string;
  status: number;
}

interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      dateRange: string[];
      status: number | undefined;
      jobGroup: string;
      jobName: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemJobsList',
  components: {EditJob},
  setup() {
    const queryRef = ref();
    const editJobRef = ref();
    const {proxy} = getCurrentInstance() as any;
    const {sys_job_group} = proxy.useDict('sys_job_group')
    const {sys_job_status} = proxy.useDict('sys_job_status')
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
          jobGroup: '',
          jobName: '',
        },
      },
    });

    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList = () => {
      listJob(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };

    // 打开新增用户弹窗
    const onOpenAddJob = () => {
      editJobRef.value.openDialog();
    };

    // 打开修改用户弹窗
    const onOpenEditJob = (row: TableDataRow) => {
      editJobRef.value.openDialog(row);
    };

    // 删除任务
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除：${row.jobName}，是否继续？`
        ids = [row.jobId]
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
            deleteJob(ids).then(() => {
              ElMessage.success('删除成功');
              dataList();
            })
          })
          .catch(() => {
          });
    };

    // 任务状态修改
    const onStatusChange = (row: TableDataRow) => {
      let text = row.status === 0 ? "启用" : "停用";
      ElMessageBox.confirm('确认要' + text + '：' + row.jobName + '计划任务吗？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeStatus(row.jobId, row.status);
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
      state.ids = selection.map(item => item.jobId)
    };

    // 任务分组字典翻译
    const groupFormat = (row: TableDataRow) => {
      return proxy.selectDictLabel(unref(sys_job_group), row.jobGroup);
    };

    return {
      queryRef,
      editJobRef,
      resetQuery,
      dataList,
      onRowDel,
      onStatusChange,
      onSelectionChange,
      onOpenAddJob,
      onOpenEditJob,
      groupFormat,
      sys_job_group,
      sys_job_status,
      ...toRefs(state),
    };
  },
});
</script>
