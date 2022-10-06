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
                  <el-form-item label="人员姓名" prop="name">
                    <el-input clearable v-model="state.list.param.name" @keyup.enter.native="mainList" placeholder="请输入渠道人员姓名"/>
                  </el-form-item>
                  <el-form-item label="人员状态" prop="status">
                    <el-select clearable v-model="state.list.param.status" placeholder="请选择渠道人员状态">
                      <el-option key="1" value="1" label="正常"/>
                      <el-option key="0" value="0" label="冻结"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属渠道" prop="channelId">
                    <el-select clearable v-model="state.list.param.channelId" placeholder="请选择来源渠道">
                      <el-option
                          v-for="channel in state.channel"
                          :key="channel.id"
                          :value="channel.id"
                          :label="channel.short"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item clearable label="联系电话" prop="mobile">
                    <el-input clearable v-model="state.list.param.mobile" @keyup.enter.native="mainList" placeholder="请输入联系电话"/>
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
              新增人员
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除人员
            </el-button>
          </div>
        </div>
      </template>
      <el-table stripe :data="state.list.data" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="头像" width="100" alian="center" prop="avatar">
          <template #default="scope">
            <el-avatar shape="square" size="large" :src="scope.row.avatar"/>
          </template>
        </el-table-column>
        <el-table-column sortable label="姓名" width="120" prop="name" show-overflow-tooltip/>
        <el-table-column sortable label="昵称" width="120" prop="nickname" show-overflow-tooltip/>
        <el-table-column sortable label="性别" width="100" prop="gender" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.gender===0">保密</el-tag>
            <el-tag type="success" v-if="scope.row.gender===1">先生</el-tag>
            <el-tag type="success" v-if="scope.row.gender===2">女士</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="所属渠道" width="120" align="center" prop="channelId">
          <template #default="scope">
            {{ state.channel.filter(item => item.id === scope.row.channelId)[0]?.short }}
          </template>
        </el-table-column>
        <el-table-column sortable label="地址" min-width="120" prop="address" show-overflow-tooltip/>
        <el-table-column sortable label="备注" min-width="120" prop="describe" show-overflow-tooltip/>
        <el-table-column sortable label="手机" width="120" prop="mobile"/>
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
import {changeStatus, deleteBroker, listBroker} from '/@/api/member/broker';
import {BrokerData, BrokerList} from "/@/views/member/broker/dataType";
import Editor from "/@/views/member/broker/editor.vue";
import {listChannel} from "/@/api/member/channel";

const queryRef = ref();
const editorRef = ref();
const state = reactive<BrokerList>({
  ids: [],
  channel: [],
  list: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
      dateRange: [],
      name: '',          // 渠道人员姓名
      nickname: '',      // 渠道人员昵称
      residentId: '',    // 身份证号
      channelId: '',     // 所属渠道ID
      mobile: '',        // 中国手机不带国家代码，国际手机号格式为：国家代码-手机号
      status: undefined, // 渠道人员状态，0禁用 1正常 2未验证
      gender: undefined, // 渠道人员性别，0保密 1男 2女
      remark: '',        // 备注
      address: '',       // 联系地址
      lastLoginIp: '',   // 最后登录IP
      lastLoginTime: '', // 最后登录时间
      createdBy: '',     // 创建人员
      createdAt: '',     // 创建时间
    },
  },
});

// 初始数据
const initTableData = () => {
  mainList()
  channelList()
};
// 渠道人员列表
const mainList = () => {
  listBroker(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
  });
};
// 渠道列表
const channelList = () => {
  listChannel({status: 1}).then((res: any) => {
    state.channel = res.data.list;
  });
};

// 新增弹窗
const onOpenAddEditor = () => {
  editorRef.value.openEditor(undefined, state.channel);
};

// 修改弹窗
const onOpenEditor = (row: BrokerData) => {
  editorRef.value.openEditor(row, state.channel);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  mainList()
};

// 框选数据
const onSelectionChange = (selection: BrokerData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除渠道人员
const onRowDel = (row: BrokerData) => {
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
        deleteBroker(ids).then(() => {
          ElMessage.success('删除成功');
          mainList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: BrokerData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + row.name + '渠道人员吗？', "警告", {
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
defineExpose({mainList})
</script>

<style scoped lang="scss">
</style>