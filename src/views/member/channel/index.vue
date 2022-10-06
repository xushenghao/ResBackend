<template>
  <div class="member-member-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template #title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="member-member-search mb15">
                <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="70px">
                  <el-form-item label="渠道名称" prop="name">
                    <el-input clearable v-model="state.list.param.name" @keyup.enter.native="mainList" placeholder="请输入渠道名称"/>
                  </el-form-item>
                  <el-form-item label="渠道状态" prop="status">
                    <el-select clearable v-model="state.list.param.status" placeholder="请选择渠道状态">
                      <el-option key="1" value="1" label="启用"/>
                      <el-option key="0" value="0" label="禁用"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item clearable label="联系电话" prop="mobile">
                    <el-input clearable v-model="state.list.param.mobile" @keyup.enter.native="mainList" placeholder="请输入联系电话"/>
                  </el-form-item>
                  <el-form-item clearable label="联系地址" prop="address">
                    <el-input clearable v-model="state.list.param.address" @keyup.enter.native="mainList" placeholder="请输入联系地址"/>
                  </el-form-item>
                  <div style="display: inline-flex;margin-bottom: 18px;vertical-align: middle;">
                    <el-button type="primary" @click="mainList">
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
                  </div>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="right-button">
            <el-button type="primary" @click="onOpenAddEditor">
              <el-icon>
                <ele-Plus/>
              </el-icon>
              新增渠道
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除渠道
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="state.list.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column sortable label="简称" width="120" prop="short" show-overflow-tooltip/>
        <el-table-column sortable label="全称" min-width="120" prop="name" show-overflow-tooltip/>
        <el-table-column sortable label="主管" min-width="80" prop="contact" show-overflow-tooltip/>
        <el-table-column sortable label="电话" width="120" prop="mobile"/>
        <el-table-column sortable label="地址" min-width="120" prop="address" show-overflow-tooltip/>
        <el-table-column sortable label="备注" min-width="120" prop="describe" show-overflow-tooltip/>
        <el-table-column sortable label="状态" width="100" prop="status" align="center">
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
          @pagination="mainList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="mainList"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteChannel, listChannel} from '/@/api/member/channel';
import {ChannelData, ChannelList} from "/@/views/member/channel/dataType";
import Editor from "/@/views/member/channel/editor.vue";

const queryRef = ref();
const editorRef = ref();
const state = reactive<ChannelList>({
  ids: [],
  list: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
      dateRange: [],
      id: '',               // 渠道ID
      account: '',          // 账户名称
      name: '',             // 渠道全称
      short: '',            // 渠道简称
      address: '',          // 联系地址
      contact: '',          // 渠道主管
      mobile: '',           // 联系电话
      status: undefined,    // 账户状态，0禁用 1正常
      createdBy: '',        // 创建用户
      createdAt: '',        // 创建时间
    },
  },
});

// 初始数据
const initTableData = () => {
  mainList()
};
// 渠道列表
const mainList = () => {
  listChannel(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
  });
};

// 新增弹窗
const onOpenAddEditor = () => {
  editorRef.value.openEditor(undefined);
};

// 修改弹窗
const onOpenEditor = (row: ChannelData) => {
  editorRef.value.openEditor(row);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  mainList()
};

// 框选数据
const onSelectionChange = (selection: ChannelData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除渠道
const onRowDel = (row: ChannelData) => {
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
        deleteChannel(ids).then(() => {
          ElMessage.success('删除成功');
          mainList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: ChannelData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + row.name + '渠道吗？', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return changeStatus(row.id, row.status!);
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
defineExpose({mainList})
</script>

<style scoped lang="scss">
</style>