<template>
  <div class="system-dic-container">
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
                  <el-form-item label="参数名称" prop="configName">
                    <el-input
                        v-model="tableData.param.configName"
                        placeholder="请输入参数名称"
                        clearable
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="参数键名" prop="configKey">
                    <el-input
                        v-model="tableData.param.configKey"
                        placeholder="请输入参数键名"
                        clearable
                        @keyup.enter.native="dataList"
                    />
                  </el-form-item>
                  <el-form-item label="系统内置" prop="configType" style="width: 200px;">
                    <el-select
                        v-model="tableData.param.configType"
                        placeholder="系统内置"
                        clearable
                        style="width: 240px"
                    >
                      <el-option v-for="dict in sys_yes_no"
                                 :key="dict.value"
                                 :label="dict.label"
                                 :value="dict.value"/>
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
            <el-button type="success" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增参数
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除参数
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column sortable label="参数主键" width="120" align="center" prop="configId"/>
        <el-table-column sortable label="参数名称" width="180" prop="configName" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="参数键名" min-width="120" prop="configKey" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="参数键值" min-width="120" prop="configValue" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="系统内置" width="120" align="center" prop="configType" :formatter="typeFormat"/>
        <el-table-column sortable label="备注" min-width="120" prop="remark" :show-overflow-tooltip="true"/>
        <el-table-column sortable label="创建时间" align="center" prop="createdAt" width="180"/>
        <el-table-column fixed="right" label="操作" align="center" width="110">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="onOpenEditDic(scope.row)">修改</el-button>
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
    <EditConfig ref="editDicRef" @dataList="dataList" :sysYesNoOptions="sys_yes_no"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, unref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import EditConfig from '/@/views/system/config/component/editConfig.vue';
import {deleteConfig, getConfigList} from "/@/api/system/config";


// 定义接口来定义对象的类型
interface TableDataRow {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string,
  configType: number,
  remark: string,
  createdAt: string,
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
      configName: string;
      configKey: string;
      configType: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemDictDataList',
  components: {EditConfig},
  setup() {
    const {proxy} = getCurrentInstance() as any;
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const {sys_yes_no} = proxy.useDict('sys_yes_no')
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          dateRange: [],
          pageNum: 1,
          pageSize: 10,
          configName: '',
          configKey: '',
          configType: ''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList = () => {
      getConfigList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    // 打开新增字典弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改字典弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除字典
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除用户：${row.configName}，是否继续？`
        ids = [row.configId]
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
            deleteConfig(ids).then(() => {
              ElMessage.success('删除成功');
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
      state.ids = selection.map(item => item.configId)
    };
    // 参数系统内置字典翻译
    const typeFormat = (row: TableDataRow) => {
      return proxy.selectDictLabel(unref(sys_yes_no), row.configType);
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      sys_yes_no,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      typeFormat,
      ...toRefs(state),
    };
  },
});
</script>
