<template>
  <div class="ophtha-edit-clinic-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'诊所'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" size="default" label-width="100px">
          <el-form-item :inline="true" label="品牌标志" prop="logo">
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
                :on-success="onLogoUploadSuccess"
            >
              <el-tooltip
                  effect="dark"
                  class="box-item"
                  placement="right"
              >
                <template #content>点击更换 JPEG 或 PNG 格式的图<br>片，推荐尺寸为 128 * 128 像素</template>
                <el-avatar shape="square" size="large" :src="state.data.logo" />
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item :inline="true" label="形象照片" prop="photos">
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
                :on-success="onHeroUploadSuccess"
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
          <el-form-item :inline="true" label="诊所全称" prop="name">
            <el-input v-model="state.data.name" placeholder="请输入诊所全称" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="诊所简称" prop="short">
            <el-input v-model="state.data.short" placeholder="请输入诊所简称" class="w100"/>
          </el-form-item>
          <el-form-item required :inline="true" label="所属机构" prop="deptName">
            <el-select v-model="state.data.deptName" @change="onDeptChange" placeholder="请选择所属机构" class="w100">
              <el-option v-for="dept in state.dept" :key="dept.deptId" :value="dept.deptName" :label="dept.deptName"/>
            </el-select>
          </el-form-item>
          <el-form-item :inline="true" label="诊所地址" prop="address">
            <el-input v-model="state.data.address" placeholder="请输入诊所地址" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="联系电话" prop="phoneMain">
            <el-input v-model="state.data.phoneMain" placeholder="请输入联系电话" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="备用电话" prop="phoneOther">
            <el-input v-model="state.data.phoneOther" placeholder="请输入备用电话" class="w100"/>
          </el-form-item>
          <el-form-item label="运营状态" prop="status">
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
import {ClinicData, ClinicEditor, DeptData, UploadResult} from "/@/views/ophtha/clinic/dataType";
import {addClinic, updateClinic} from "/@/api/ophtha/clinic";
import {Session} from "/@/utils/storage";
import {uploadUrl} from "/@/utils/consts";

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
const state = reactive<ClinicEditor>({
  isShow: false,
  dept: [],
  data: {
    id: '',
    name: '',
    short: '',
    deptId: '',
    deptName: '',
    photos: '',
    logo: '',
    address: '',
    phoneMain: '',
    phoneOther: '',
    status: 1,
  },
  rules: {
    phoneMain: [
      {validator: checkPhone, trigger: 'blur'}
    ],
    phoneOther: [
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
const openEditor = (row?: ClinicData, dept?: Array<DeptData>) => {
  resetForm();
  if (row) {
    state.data = row;
  }
  if (dept) {
    state.dept = dept;
  }
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',
    name: '',
    short: '',
    deptId: '',
    deptName: '',
    photos: '',
    logo: '',
    address: '',
    phoneMain: '',
    phoneOther: '',
    status: 0,
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
        updateClinic(state.data).then(() => {
          ElMessage.success('诊所记录更新成功');
          closeEditor();
        })
      } else {
        addClinic(state.data).then(() => {
          ElMessage.success('诊所记录添加成功');
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

// 同步设置机构ID
const onDeptChange = (value: string) => {
  state.data.deptId = state.dept.find((item: DeptData) => item.deptName === value)?.deptId || '';
}

// 上传图片途中
const onUploadProgress = () => {
  state.upload.isUploading = true;
}

// 更新 Logo 图片地址
const onLogoUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
  if (result.code === 0) {
    state.data.logo = result.data.full_path;
  } else {
    ElMessage.error(`图片上传失败，${result.message}`);
  }
}

// 更新 Hero 图片地址
const onHeroUploadSuccess = (result: UploadResult) => {
  state.upload.isUploading = false;
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

  .el-upload {
    width: 100%;
  }
}

.photos-uploader {
  line-height: 0;
  border-radius: 5px;
  border: 1px solid #dddfe6;

  .el-upload {
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
