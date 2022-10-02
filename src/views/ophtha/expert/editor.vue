<template>
  <div class="ophtha-edit-expert-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'专家'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" size="default" label-width="100px">
          <el-form-item required :inline="true" label="形象照" prop="avatar">
            <el-upload
                class="avatar-uploader"
                accept=".jpg, .png"
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
                  placement="right"
              >
                <template #content>点击更换 JPEG 或 PNG 格式的图<br>片，推荐尺寸为 128 * 128 像素</template>
                <el-avatar shape="square" size="large" :src="state.data.avatar" />
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item :inline="true" label="执业照" prop="licence">
            <el-upload
                class="photos-uploader"
                accept=".jpg, .png"
                :limit=1
                :auto-upload="true"
                :show-file-list="false"
                :action="state.upload.url"
                :headers="state.upload.headers"
                :before-upload="beforeUpload"
                :on-progress="onUploadProgress"
                :on-success="onLicenceUploadSuccess"
            >
              <el-tooltip
                  effect="dark"
                  class="box-item"
                  placement="right"
              >
                <template #content>点击更换 JPEG 或 PNG 格式的图<br>片，推荐尺寸为 640 * 300 像素</template>
                <el-image :src="state.data.licence" class="licence" fit="cover" alt=""/>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item required :inline="true" label="专家姓名" prop="name">
            <el-input v-model="state.data.name" placeholder="请输入专家姓名" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="专家称谓" prop="title">
            <el-input v-model="state.data.title" placeholder="请输入专家称谓" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="联系电话" prop="mobile">
            <el-input v-model="state.data.mobile" placeholder="请输入联系电话" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="所属诊所" prop="clinicName">
            <el-select v-model="state.data.clinicName" @change="onClinicChange" placeholder="请选择所属诊所" class="w100">
              <el-option v-for="clinic in state.clinic" :key="clinic.id" :value="clinic.short" :label="clinic.short"/>
            </el-select>
          </el-form-item>
          <el-form-item :inline="true" label="专家标签" prop="tags">
            <el-input v-model="state.data.tags" placeholder="请输入专家标签" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="技术专长" prop="ability">
            <el-input v-model="state.data.ability" autosize type="textarea" placeholder="请输入技术专长" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="专家介绍" prop="brief">
            <el-input v-model="state.data.brief" autosize type="textarea" placeholder="请输入专家介绍" class="w100"/>
          </el-form-item>
          <el-form-item label="专家状态" prop="status">
            <el-radio-group v-model="state.data.status">
              <el-radio :label=1>接诊</el-radio>
              <el-radio :label=0>停诊</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 20px">
          <el-button @click="onCancel" size="default">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ state.data.id !== "" ? '修改' : '添加' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, unref} from 'vue';
import {ElMessage} from "element-plus";
import {UploadRawFile} from "element-plus/es/components/upload/src/upload";
import {ClinicData, ExpertData, ExpertEditor, UploadResult} from "/@/views/ophtha/expert/dataType";
import {addExpert, updateExpert} from "/@/api/ophtha/expert";
import {uploadUrl} from "/@/utils/consts";
import {Session} from "/@/utils/storage";

const formRef = ref<HTMLElement | null>(null);

// 检查联系电话
const checkPhone = (rule: any, value: string, callback: any) => {
  if (value !== '' && !/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

// 编辑器状态
const state = reactive<ExpertEditor>({
  isShow: false,
  clinic: [],
  data: {
    id: '',
    name: '',
    title: '',
    mobile: '',
    status: 1,
    avatar: '',
    licence: '',
    brief: '',
    tags: '',
    ability: '',
    clinicId: '',
    clinicName: '',
  },
  rules: {
    mobile: [
      {validator: checkPhone, trigger: 'blur'}
    ],
  },
  upload: {
    url: uploadUrl,
    headers: {Authorization: `Bearer ${Session.get('token')}`},
    isUploading: false,
  },
});

// 打开弹窗
const openEditor = (row?: ExpertData, clinic?: Array<ClinicData>) => {
  resetForm();
  if (row) {
    state.data = row;
  }
  if (clinic) {
    state.clinic = clinic;
  }
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',
    name: '',
    title: '',
    mobile: '',
    status: 0,
    avatar: '',
    licence: '',
    brief: '',
    tags: '',
    ability: '',
    clinicId: '',
    clinicName: '',
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
        updateExpert(state.data).then(() => {
          ElMessage.success('专家记录更新成功');
          closeEditor();
        })
      } else {
        addExpert(state.data).then(() => {
          ElMessage.success('专家记录添加成功');
          closeEditor();
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

// 同步设置诊所ID
const onClinicChange = (value: string) => {
  state.data.clinicId = state.clinic.find((item: ClinicData) => item.short === value)?.id || '';
}

// 上传图片途中
const onUploadProgress = () => {
  state.upload.isUploading = true;
}

// 更新 Avatar 图片地址
const onAvatarUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
  if (result.code === 0) {
    state.data.avatar = result.data.full_path;
  } else {
    ElMessage.error(`图片上传失败，${result.message}`);
  }
}

// 更新 Licence 图片地址
const onLicenceUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
  if (result.code === 0) {
    state.data.licence = result.data.full_path;
  } else {
    ElMessage.error(`图片上传失败，${result.message}`);
  }
}

// 对上暴露方法
defineExpose({openEditor})
</script>

<style lang="scss">
.el-form-item__label {
  font-weight: bold;
}

.photos-uploader {
  width: 100%;

  .el-upload {
    width: 100%;
  }
}

.avatar-uploader,
.photos-uploader {
  line-height: 0;
  border-radius: 5px;
  border: 1px solid #dddfe6;

  .el-upload {
    cursor: pointer;
    float: left;

    .licence {
      width: 100%;
      min-height: 128px;
      max-height: 150px;
      overflow: hidden;
      border-radius: 5px;
    }
  }
}

</style>