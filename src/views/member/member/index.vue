<template>
  <div class="member-member-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template v-slot:title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="member-member-search mb15">
                <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="70px">
                  <el-form-item label="客户姓名" prop="name">
                    <el-input clearable v-model="state.list.param.name" @keyup.enter.native="memberList" placeholder="请输入客户姓名"/>
                  </el-form-item>
                  <el-form-item label="客户性别" prop="gender">
                    <el-select clearable v-model="state.list.param.gender" placeholder="请选择客户性别">
                      <el-option key="0" value="0" label="保密"/>
                      <el-option key="1" value="1" label="先生"/>
                      <el-option key="2" value="2" label="女士"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户状态" prop="status">
                    <el-select clearable v-model="state.list.param.status" placeholder="请选择客户状态">
                      <el-option key="0" value="0" label="冻结"/>
                      <el-option key="1" value="1" label="正常"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="来源渠道" prop="channelId">
                    <el-select clearable v-model="state.list.param.channelId" placeholder="请选择来源渠道">
                      <el-option
                          v-for="channel in state.channel"
                          :key="channel.id"
                          :value="channel.id"
                          :label="channel.short"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属诊所" prop="clinicId">
                    <el-select clearable v-model="state.list.param.clinicId" placeholder="请选择所属诊所">
                      <el-option
                          v-for="clinic in state.clinic"
                          :key="clinic.id"
                          :value="clinic.id"
                          :label="clinic.short"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item clearable label="客户电话" prop="mobile">
                    <el-input clearable v-model="state.list.param.mobile" @keyup.enter.native="memberList" placeholder="请输入客户电话"/>
                  </el-form-item>
                  <el-form-item clearable label="客户地址" prop="address">
                    <el-input clearable v-model="state.list.param.address" @keyup.enter.native="memberList" placeholder="请输入客户地址"/>
                  </el-form-item>

                  <div style="display: inline-flex;margin-bottom: 18px;vertical-align: middle;">
                    <el-button type="primary" @click="memberList">
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
              新增客户
            </el-button>
            <el-button plain type="danger" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除客户
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
        <el-table-column sortable label="姓名" show-overflow-tooltip width="100" prop="name"/>
        <el-table-column sortable label="性别" width="100" align="center" prop="gender">
          <template #default="scope">
            <el-tag v-if="scope.row.gender===0">保密</el-tag>
            <el-tag type="success" v-if="scope.row.gender===1">先生</el-tag>
            <el-tag type="success" v-if="scope.row.gender===2">女士</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="生日" width="100" align="center" prop="birthday"/>
        <el-table-column sortable label="所属诊所" width="110" align="center" prop="clinicId">
          <template #default="scope">
              {{ state.clinic.filter(item => item.id === scope.row.clinicId)[0]?.short }}
          </template>
        </el-table-column>
        <el-table-column sortable label="来源渠道" width="110" align="center" prop="channelId">
          <template #default="scope">
            {{ state.channel.filter(item => item.id === scope.row.channelId)[0]?.short }}
          </template>
        </el-table-column>
        <el-table-column sortable label="联系地址" min-width="120" show-overflow-tooltip prop="address"/>
        <el-table-column sortable label="最近登录" min-width="120"  show-overflow-tooltip prop="lastLoginTime"/>
        <el-table-column sortable label="备注" min-width="120" show-overflow-tooltip prop="remark"/>
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
          @pagination="memberList"
      />
    </el-card>
    <Editor ref="editorRef" @onRefresh="memberList"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus';
import {changeStatus, deleteMember, listMember} from '/@/api/member/member';
import {MemberData, MemberList} from "/@/views/member/member/dataType";
import Editor from "/@/views/member/member/editor.vue";
import {listClinic} from "/@/api/ophtha/clinic";
import {listChannel} from "/@/api/member/channel";

const queryRef = ref();
const editorRef = ref();
const state = reactive<MemberList>({
  ids: [],
  clinic: [],
  broker: [],
  channel: [],
  list: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
      dateRange: [],
      name: '',
      mail: '',
      mobile: '',
      status: undefined,
      gender: undefined,
      birthday: '',
      nickname: '',
      password: '',
      salt: '',
      introduce: '',
      channelId: '',
      brokerId: '',
      clinicId: '',
      avatar: '',
      remark: '',
      address: '',
      describe: '',
      createdBy: ''
    },
  },
});

// 初始数据
const initTableData = () => {
  memberList()
  clinicList()
  channelList()
};
// 客户列表
const memberList = () => {
  listMember(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
  });
};
// 诊所列表
const clinicList = () => {
  listClinic({status: 1}).then((res: any) => {
    state.clinic = res.data.list;
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
  editorRef.value.openEditor(undefined, state.clinic);
};

// 修改弹窗
const onOpenEditor = (row: MemberData) => {
  editorRef.value.openEditor(row, state.clinic);
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  memberList()
};

// 框选数据
const onSelectionChange = (selection: MemberData[]) => {
  state.ids = selection.map(item => item.id)
};

// 删除客户
const onRowDel = (row: MemberData) => {
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
        deleteMember(ids).then(() => {
          ElMessage.success('删除成功');
          memberList();
        })
      })
      .catch(() => {
      });
};

// 切换状态
const onStatusChange = (row: MemberData) => {
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm('确认要' + text + row.name + '客户吗？', "警告", {
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
defineExpose({memberList})
</script>

<style scoped lang="scss">
.el-tag {
  margin: 0 2px;
}

</style>