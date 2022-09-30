<template>
  <div class="ophtha-edit-clinic-container">
    <el-drawer v-model="state.isShow" :size='480' :title="(state.data.id!==''?'修改':'添加')+'诊所'">
      <div style="padding: 0 20px">
        <el-form :model="state.data" ref="formRef" :rules="state.rules" size="default" label-width="100px">
          <el-form-item :inline="true" label="形象照片" prop="photos">
            <el-input v-model="state.data.photos" placeholder="请选择形象照片" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="品牌标志" prop="logo">
            <el-input v-model="state.data.logo" placeholder="请输入品牌标志" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="诊所名称" prop="name">
            <el-input v-model="state.data.name" placeholder="请输入诊所名称" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="诊所简称" prop="short">
            <el-input v-model="state.data.short" placeholder="请输入诊所简称" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="机构编号" prop="DeptId">
            <el-input v-model="state.data.DeptId" placeholder="请输入机构编号" class="w100"/>
          </el-form-item>
          <el-form-item :inline="true" label="所属机构" prop="DeptName">
            <el-input v-model="state.data.DeptName" placeholder="请输入所属机构" class="w100"/>
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
          <el-button @click="onCancel" size="default">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ state.data.id !== "" ? '修改' : '添加' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, unref} from 'vue';
import {ClinicData, EditorState} from "/@/views/ophtha/clinic/dataType";
import {addClinic, updateClinic} from "/@/api/ophtha/clinic";
import {ElMessage} from "element-plus";

const formRef = ref<HTMLElement | null>(null);
const state = reactive<EditorState>({
  isShow: false,
  data: {
    id: '',
    name: '',
    short: '',
    DeptId: '',
    DeptName: '',
    photos: '',
    logo: '',
    address: '',
    phoneMain: '',
    phoneOther: '',
    status: 0,
  },
  rules: {
    name: [
      {required: true, message: "诊所名称不能为空", trigger: "blur"}
    ]
  }
});

// 打开弹窗
const openDrawer = (row: ClinicData | null) => {
  resetForm();
  if (row) {
    state.data = row;
  }
  state.isShow = true;
};
const resetForm = () => {
  state.data = {
    id: '',
    name: '',
    short: '',
    DeptId: '',
    DeptName: '',
    photos: '',
    logo: '',
    address: '',
    phoneMain: '',
    phoneOther: '',
    status: 0,
  }
};

// 关闭弹窗
const closeDrawer = () => {
  state.isShow = false;
};

// 取消
const onCancel = () => {
  closeDrawer();
};

// 新增
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      if (state.data.id !== "") {
        updateClinic(state.data).then(() => {
          ElMessage.success('诊所记录更新成功');
          closeDrawer();
        })
      } else {
        addClinic(state.data).then(() => {
          ElMessage.success('诊所记录添加成功');
          closeDrawer();
        })
      }
    }
  });
};

defineExpose({openDrawer})
</script>

<style scoped lang="scss">
.el-form-item__label {
  font-weight: bold;
}
</style>
