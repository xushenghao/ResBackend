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
              <div class="system-user-search mb15">
                <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item  label="登录 IP" prop="ipaddr">
                    <el-input
                        v-model="tableData.param.ipaddr"
                        placeholder="请输入登录地址"
                        clearable
                        style="width: 180px;"
                        size="default"
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="登录地点" prop="loginLocation">
                    <el-input
                        v-model="tableData.param.loginLocation"
                        placeholder="请输入登录地点"
                        clearable
                        style="width: 180px;"
                        size="default"
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="用户名称" prop="userName">
                    <el-input
                        v-model="tableData.param.userName"
                        placeholder="请输入用户名称"
                        clearable
                        style="width: 180px;"
                        size="default"
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="登录状态" prop="status">
                    <el-select
                        v-model="tableData.param.status"
                        placeholder="登录状态"
                        clearable
                        size="default"
                        style="width: 180px"
                    >
                      <el-option
                          v-for="dict in sys_login_status"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="登录时间" prop="dateRange">
                    <el-date-picker
                        v-model="tableData.param.dateRange"
                        size="default"
                        style="width: 240px"
                        value-format="YYYY-MM-DD"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
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
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="right-button">
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除日志
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowClear()">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              清空日志
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column sortable label="编号" align="center" width="80" prop="infoId"/>
        <el-table-column sortable label="登录日期" align="center" width="180" prop="loginTime"/>
        <el-table-column sortable label="登录名称" align="center" prop="loginName" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="登录模块" alian="center" width="120" prop="module"/>
        <el-table-column sortable label="登录状态" align="center" width="120" prop="status" :formatter="statusFormat"/>
        <el-table-column sortable label="登录 IP" align="center" width="120" prop="ipaddr" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="登录地点" align="center" width="140" prop="loginLocation" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="操作信息" align="center" prop="msg" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="浏览器" align="center" width="110" prop="browser"/>
        <el-table-column sortable label="操作系统" align="center" prop="os" :show-overflow-tooltip="true"/>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="dataList"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, unref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {clearLog, deleteLog, logList} from '/@/api/system/monitor/logs';

// 定义接口来定义对象的类型
interface TableDataRow {
  infoId: number;
  loginName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: number;
  msg: string;
  loginTime: string;
  module: string;
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
      status: string;
      ipaddr: string;
      loginLocation: string;
      userName: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemLoginLogList',
  setup() {
    const queryRef = ref();
    const {proxy} = getCurrentInstance() as any;
    const {sys_login_status} = proxy.useDict('sys_login_status')
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
          status: '',
          ipaddr: '',
          loginLocation: '',
          userName: ''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList = () => {
      logList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    // 删除日志
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除：“${row.loginName}”，是否继续?`
        ids = [row.infoId]
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
            deleteLog(ids).then(() => {
              ElMessage.success('删除成功');
              dataList();
            })
          })
          .catch(() => {
          });
    };
    // 清空日志
    const onRowClear = () => {
      ElMessageBox.confirm('你确定要删除所选数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            clearLog().then(() => {
              ElMessage.success('清除成功');
              dataList();
            })
          })
          .catch(() => {
          });
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      dataList()
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map(item => item.infoId)
    };
    // 登录状态字典翻译
    const statusFormat = (row: TableDataRow) => {
      return proxy.selectDictLabel(unref(sys_login_status), row.status);
    };
    return {
      queryRef,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      statusFormat,
      onRowClear,
      sys_login_status,
      ...toRefs(state),
    };
  },
});
</script>
