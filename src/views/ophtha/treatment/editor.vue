<template>
  <div class="ophtha-edit-treatment-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'科目'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" label-width="100px">
          <el-form-item :inline="true" label="科目图例" prop="photos">
            <el-upload
                class="photos-uploader"
                accept=".jpg, .png"
                ref="uploadPhotos"
                :limit=1
                :auto-upload="true"
                :show-file-list="false"
                :action="state.upload.url"
                :headers="state.upload.headers"
                :before-upload="beforeUpload"
                :on-progress="onUploadProgress"
                :on-success="onPhotosUploadSuccess"
            >
              <el-tooltip
                  effect="dark"
                  class="box-item"
                  placement="right"
              >
                <template #content>点击更换 JPEG 或 PNG 格式的图<br>片，推荐尺寸为 640 * 300 像素</template>
                <el-image :src="state.data.photos" class="photos" fit="cover" alt=""/>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item required :inline="true" label="科目代码" prop="code">
            <el-input v-model="state.data.code" placeholder="请输入科目代码" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="科目姓名" prop="name">
            <el-input v-model="state.data.name" placeholder="请输入科目姓名" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="科目分类" prop="category">
            <el-input v-model="state.data.category" placeholder="请输入科目分类" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="服务诊所" prop="clinicName">
            <el-select v-model="state.data.clinicName" @change="onClinicChange" placeholder="请选择服务诊所" class="w100">
              <el-option v-for="clinic in state.clinic" :key="clinic.id" :value="clinic.short" :label="clinic.short"/>
            </el-select>
          </el-form-item>
          <el-form-item :inline="true" label="科目介绍" prop="brief">
            <el-input v-model="state.data.remark" autosize type="textarea" placeholder="请输入科目介绍" class="w100"/>
          </el-form-item>
          <el-form-item label="科目状态" prop="status">
            <el-radio-group v-model="state.data.status">
              <el-radio :label=1>启用</el-radio>
              <el-radio :label=0>停用</el-radio>
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
import {ClinicData, TreatmentData, TreatmentEditor, UploadResult} from "/@/views/ophtha/treatment/dataType";
import {addTreatment, updateTreatment} from "/@/api/ophtha/treatment";
import {uploader} from "/@/utils/upload";

const uploadPhotos = ref<UploadInstance>()
const formRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['treatmentList'])

// 编辑器状态
const state = reactive<TreatmentEditor>({
  isShow: false,
  clinic: [],
  data: {
    id: '',
    name: '',
    code: '',
    clinicId: '',
    clinicName: '',
    category: '',
    status: 1,
    photos: '',
    remark: '',

  },
  rules: {
    category: [],
  },
  upload: uploader,
});

// 打开弹窗
const openEditor = (row?: TreatmentData, clinic?: Array<ClinicData>) => {
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
    code: '',
    clinicId: '',
    clinicName: '',
    category: '',
    status: 1,
    photos: '',
    remark: '',
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
        updateTreatment(state.data).then(() => {
          ElMessage.success('科目记录更新成功');
          closeEditor();
          emit('treatmentList');
        })
      } else {
        addTreatment(state.data).then(() => {
          ElMessage.success('科目记录添加成功');
          closeEditor();
          emit('treatmentList');
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

// 更新 Photos 图片地址
const onPhotosUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
  uploadPhotos.value!.clearFiles();
  if (result.code === 0) {
    state.data.photos = result.data.full_path;
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
  line-height: 0;
  border-radius: 5px;
  border: 1px solid #dddfe6;

  .el-upload {
    width: 100%;
    cursor: pointer;
    float: left;

    .photos {
      width: 100%;
      min-height: 128px;
      max-height: 150px;
      overflow: hidden;
      border-radius: 5px;
    }
  }
}
</style>
