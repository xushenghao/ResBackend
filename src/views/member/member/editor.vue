<template>
  <div class="member-edit-member-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'客户'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" label-width="80px">
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
            <el-input v-model="state.data.name" placeholder="请输入客户姓名"/>
          </el-form-item>
          <el-form-item required :inline="true" label="昵称" prop="nickname">
            <el-input v-model="state.data.nickname" placeholder="请输入客户昵称"/>
          </el-form-item>
          <el-form-item required :inline="true" label="邮箱" prop="mail">
            <el-input v-model="state.data.mail" placeholder="请输入客户邮箱"/>
          </el-form-item>
          <el-form-item required :inline="true" label="电话" prop="mobile">
            <el-input v-model="state.data.mobile" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="state.data.gender">
              <el-radio :label=0>保密</el-radio>
              <el-radio :label=1>先生</el-radio>
              <el-radio :label=2>女士</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
                type="date"
                class="w100"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择客户生日"
                v-model="state.data.birthday"
            />
          </el-form-item>
          <el-form-item :inline="true" label="身份证" prop="residentId">
            <el-input type="password" v-model="state.data.residentId" maxlength="18" show-password placeholder="请输入身份证"/>
          </el-form-item>
          <el-form-item required :inline="true" label="密码" prop="password">
            <el-input type="password" v-model="state.data.password" show-password placeholder="请生成登录密码"/>
          </el-form-item>
          <el-form-item :inline="true" label="地址" prop="address">
            <el-input v-model="state.data.address" placeholder="请输入联系地址"/>
          </el-form-item>
          <el-form-item :inline="true" label="来源渠道" prop="channelId">
            <el-select :clearable="true" :filterable="true" v-model="state.data.channelId" placeholder="请选择来源渠道" class="w100">
              <el-option
                  v-for="channel in state.channel"
                  :key="channel.id"
                  :value="channel.id"
                  :label="channel.short"
              />
            </el-select>
          </el-form-item>
          <el-form-item :inline="true" label="渠道人员" prop="brokerId">
            <el-select :clearable="true" :filterable="true" v-model="state.data.brokerId" placeholder="请选择渠道人员" class="w100">
              <el-option
                  v-for="broker in state.broker"
                  :key="broker.id"
                  :value="broker.id"
                  :label="broker.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item required :inline="true" label="归属诊所" prop="clinicId">
            <el-select v-model="state.data.clinicId" placeholder="请选择归属诊所" class="w100">
              <el-option
                  v-for="clinic in state.clinic"
                  :key="clinic.id"
                  :value="clinic.id"
                  :label="clinic.short"
                  @change="onClinicChange"
              />
            </el-select>
          </el-form-item>
          <el-form-item required :inline="true" label="开户人员" prop="createdBy">
            <el-input v-model="state.data.createdBy" placeholder="请输入开户人员"/>
          </el-form-item>
          <el-form-item :inline="true" label="备注" prop="describe">
            <el-input v-model="state.data.describe" autosize type="textarea" placeholder="请输入备注信息"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="state.data.status">
              <el-radio :label=1>正常</el-radio>
              <el-radio :label=0>冻结</el-radio>
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
import {reactive, ref, unref} from 'vue';
import {ElMessage, UploadInstance} from "element-plus";
import {UploadRawFile} from "element-plus/es/components/upload/src/upload";
import {BrokerList, ChannelList, ClinicList, MemberData, MemberEditor, UploadResult} from "/@/views/member/member/dataType";
import {addMember, updateMember} from "/@/api/member/member";
import {uploader} from "/@/utils/upload";
import {Session} from "/@/utils/storage";

const uploadAvatar = ref<UploadInstance>()
const formRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['memberList'])

// 检查联系电话
const checkPhone = (rule: any, value: string, callback: any) => {
  if (value !== '' && !/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

// 编辑器状态
const state = reactive<MemberEditor>({
  isShow: false,
  clinic: [],
  broker: [],
  channel: [],
  data: {
    id: '',
    name: '',
    mail: '',
    mobile: '',
    status: 1,
    gender: 0,
    birthday: '',
    nickname: '',
    residentId: '',
    password: '',
    salt: '',
    channelId: '',
    brokerId: '',
    clinicId: '',
    avatar: '',
    describe: '',
    address: '',
    createdBy: Session.get('userInfo').userNickname || ' - ',
    lastLoginTime: ''
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
    row?: MemberData,
    broker?: Array<BrokerList>,
    clinic?: Array<ClinicList>,
    channel?: Array<ChannelList>,
) => {
  resetForm();
  if (row) state.data = row;
  if (clinic) state.clinic = clinic;
  if (broker) state.broker = broker;
  if (channel) state.channel = channel;
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',
    name: '',
    mail: '',
    mobile: '',
    status: 1,
    gender: 0,
    birthday: '',
    nickname: '',
    residentId: '',
    password: '',
    salt: '',
    channelId: '',
    brokerId: '',
    clinicId: '',
    avatar: '',
    describe: '',
    address: '',
    createdBy: '',
    lastLoginTime: ''
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
        updateMember(state.data).then(() => {
          ElMessage.success('客户记录更新成功');
          closeEditor();
          emit('memberList');
        })
      } else {
        addMember(state.data).then(() => {
          ElMessage.success('客户记录添加成功');
          closeEditor();
          emit('memberList');
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

// 归属诊所ID
const onClinicChange = () => {
  // TODO 变更归属诊所的权限控制
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
