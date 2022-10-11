<template>
  <div class="member-edit-member-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'记录'">
      <el-form :model="state.data" ref="formRef" :rules="state.rules" label-width="80px" style="padding: 0 20px">
        <el-form-item required :inline="true" label="头像" prop="avatar">
          <el-upload
              class="avatar uploader"
              accept=".jpg, .png"
              ref="uploadAvatar"
              :limit=1
              :auto-upload="true"
              :show-file-list="false"
              :action="state.upload.url"
              :headers="state.upload.headers"
              :before-upload="beforeUpload"
              :on-progress="onUploadProgress"
              :on-success="onAvatarUploadSuccess"
          >
            <el-tooltip
                effect="dark"
                class="box-item"
                placement="left-start"
            >
              <template #content>点击更换 JPEG 或 PNG 格式的图<br>片，推荐尺寸为 128 * 128 像素</template>
              <el-avatar shape="square" size="large" :src="state.data.avatar"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
        <el-form-item required :inline="true" label="姓名" prop="name">
          <el-input v-model="state.data.name" placeholder="请输入人员姓名"/>
        </el-form-item>
        <el-form-item required :inline="true" label="昵称" prop="nickname">
          <el-input v-model="state.data.nickname" placeholder="请输入人员昵称"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="state.data.gender">
            <el-radio :label=0>保密</el-radio>
            <el-radio :label=1>先生</el-radio>
            <el-radio :label=2>女士</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :inline="true" label="身份证" prop="residentId">
          <el-input clearable type="password" v-model="state.data.residentId" maxlength="18" show-password placeholder="请输入身份证"/>
        </el-form-item>
        <el-form-item required :inline="true" label="电话" prop="mobile">
          <el-input v-model="state.data.mobile" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item required :inline="true" label="密码" prop="password">
          <el-input type="password" v-model="state.data.password" show-password placeholder="请生成登录密码"/>
        </el-form-item>
        <el-form-item :inline="true" label="地址" prop="address">
          <el-input v-model="state.data.address" placeholder="请输入联系地址"/>
        </el-form-item>
        <el-form-item required :inline="true" label="所属渠道" prop="channelId">
          <el-select :filterable="true" v-model="state.data.channelId" placeholder="请选择所属渠道" class="w100">
            <el-option
                v-for="channel in state.channel"
                :key="channel.id"
                :value="channel.id"
                :label="channel.short"
            />
          </el-select>
        </el-form-item>
        <el-form-item required :inline="true" label="开户人员" prop="createdBy">
          <el-input v-model="state.data.createdBy" placeholder="请输入开户人员"/>
        </el-form-item>
        <el-form-item :inline="true" label="备注" prop="remark">
          <el-input v-model="state.data.remark" autosize type="textarea" placeholder="请输入备注信息"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="state.data.status">
            <el-radio :label=1>正常</el-radio>
            <el-radio :label=0>冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
import {reactive, ref, unref} from 'vue';
import {ElMessage, UploadInstance} from "element-plus";
import {UploadRawFile} from "element-plus/es/components/upload/src/upload";
import {BrokerData, BrokerEditor, ChannelList, UploadResult} from "/@/views/member/broker/dataType";
import {addBroker, updateBroker} from "/@/api/member/broker";
import {uploader} from "/@/utils/upload";
import {Session} from "/@/utils/storage";

const uploadAvatar = ref<UploadInstance>()
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
const state = reactive<BrokerEditor>({
  isShow: false,
  channel: [],
  data: {
    id: '',
    name: '',
    nickname: '',
    residentId: '',
    channelId: '',
    mobile: '',
    password: '',
    salt: '',
    status: 1,
    gender: 0,
    avatar: '',
    remark: '',
    address: '',
    lastLoginIp: '',
    lastLoginTime: '',
    createdBy: Session.get('userInfo').userNickname || ' - ',
    createdAt: '',
  },
  rules: {
    mobile: [
      {validator: checkPhone, trigger: 'blur'}
    ],
  },
  upload: uploader,
});

// 打开弹窗
const openEditor = (
    row?: BrokerData,
    channel?: Array<ChannelList>,
) => {
  resetForm();
  if (row) state.data = row;
  if (channel) state.channel = channel;
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',
    name: '',
    nickname: '',
    residentId: '',
    channelId: '',
    mobile: '',
    password: '',
    salt: '',
    status: 1,
    gender: 0,
    avatar: '',
    remark: '',
    address: '',
    lastLoginIp: '',
    lastLoginTime: '',
    createdBy: Session.get('userInfo').userNickname || ' - ',
    createdAt: '',
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
        updateBroker(state.data).then(() => {
          ElMessage.success('渠道人员记录更新成功');
          closeEditor();
          emit('mainList');
        })
      } else {
        addBroker(state.data).then(() => {
          ElMessage.success('渠道人员记录添加成功');
          closeEditor();
          emit('mainList');
        })
      }
    }
  });
};

// 上传图片之前
const beforeUpload = (rawFile: UploadRawFile) => {
  // 限制图片格式
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('请选择 JPEG或PNG 格式的图片')
    return false
  }

  // 限制图片大小
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过 2MB')
    return false
  }

  return true
}

// 上传图片途中
const onUploadProgress = () => {
  state.upload.isUploading = true;
}

// 更新 Avatar 图片地址
const onAvatarUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
  uploadAvatar.value!.clearFiles();
  if (result.code === 0) {
    state.data.avatar = result.data.full_path;
  } else {
    ElMessage.error(`图片上传失败，${result.message}`);
  }
}

// 对上暴露方法
defineExpose({openEditor})
</script>

<style lang="scss">
</style>
