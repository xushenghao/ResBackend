<template>
  <div class="member-edit-member-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'记录'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" label-width="80px">
          <el-form-item required :inline="true" label="名称" prop="name">
            <el-input v-model="state.data.name" placeholder="请输入渠道名称"/>
          </el-form-item>
          <el-form-item required :inline="true" label="简称" prop="short">
            <el-input v-model="state.data.short" placeholder="请输入渠道简称"/>
          </el-form-item>
          <el-form-item :inline="true" label="地址" prop="address">
            <el-input v-model="state.data.address" placeholder="请输入渠道地址"/>
          </el-form-item>
          <el-form-item required :inline="true" label="渠道主管" prop="contact">
            <el-input v-model="state.data.contact" placeholder="请输入渠道主管"/>
          </el-form-item>
          <el-form-item required :inline="true" label="联系电话" prop="mobile">
            <el-input v-model="state.data.mobile" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item required :inline="true" label="创建人员" prop="createdBy">
            <el-input v-model="state.data.createdBy" placeholder="请输入创建人员"/>
          </el-form-item>
          <el-form-item :inline="true" label="备注" prop="remark">
            <el-input v-model="state.data.remark" autosize type="textarea" placeholder="请输入备注信息"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="state.data.status">
              <el-radio :label=1>启用</el-radio>
              <el-radio :label=0>禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 20px">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">{{ state.data.id !== "" ? '修改' : '添加' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {ElMessage} from "element-plus";
import {reactive, ref, unref} from 'vue';
import {ChannelData, ChannelEditor} from "/@/views/member/channel/dataType";
import {addChannel, updateChannel} from "/@/api/member/channel";
import {Session} from "/@/utils/storage";

const formRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['mainList'])

// 检查联系电话
const checkPhone = (rule: any, value: string, callback: any) => {
  if (value !== '' && !/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

// 编辑器状态
const state = reactive<ChannelEditor>({
  isShow: false,
  data: {
    id: '',        // 渠道ID
    account: '',   // 账户名称
    name: '',      // 渠道全称
    short: '',     // 渠道简称
    address: '',   // 联系地址
    contact: '',   // 渠道主管
    mobile: '',    // 联系电话
    status: 1,     // 账户状态，0禁用 1正常
    remark: '',    // 备注
    createdAt: '', // 创建时间
    createdBy: Session.get('userInfo').userNickname || ' - ',
  },
  rules: {
    mobile: [
      {validator: checkPhone, trigger: 'blur'}
    ],
  },
});

// 打开弹窗
const openEditor = (
    row?: ChannelData,
) => {
  resetForm();
  if (row) state.data = row;
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',         // 渠道ID
    account: '',    // 账户名称
    name: '',       // 渠道全称
    short: '',      // 渠道简称
    address: '',    // 联系地址
    contact: '',    // 渠道主管
    mobile: '',     // 联系电话
    status: 1,      // 账户状态，0禁用 1正常
    remark: '',     // 备注
    createdAt: '',  // 创建时间
    createdBy: Session.get('userInfo').userNickname || ' - ',
  }
};

// 关闭弹窗
const closeEditor = () => {
  state.isShow = false;
};

// 取消
const onCancel = () => {
  closeEditor();
};

// 提交表单
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      if (state.data.id !== "") {
        updateChannel(state.data).then(() => {
          ElMessage.success('渠道记录更新成功');
          closeEditor();
          emit('mainList');
        })
      } else {
        addChannel(state.data).then(() => {
          ElMessage.success('渠道记录添加成功');
          closeEditor();
          emit('mainList');
        })
      }
    }
  });
};

// 对上暴露方法
defineExpose({openEditor})
</script>

<style lang="scss">
</style>
