<template>
  <div class="system-edit-dept-container">
    <el-dialog :title="(deptForm.deptId!==0?'修改':'添加')+'机构'" v-model="isShowDialog" width="769px">
      <el-form ref="formRef" :model="deptForm" :rules="rules" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="上级机构">
              <el-cascader
                  :options="deptData"
                  :props="{ checkStrictly: true,emitPath: false, value: 'deptId', label: 'deptName' }"
                  placeholder="请选择机构"
                  clearable
                  class="w100"
                  v-model="deptForm.parentId"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="机构类型" prop="deptType">
              <el-select v-model="deptForm.deptType" placeholder="请选择机构类型" class="w100">
                <el-option
                    v-for="dict in sys_dept_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="deptForm.deptName" placeholder="请输入机构名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="负责人">
              <el-input v-model="deptForm.leader" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机号">
              <el-input v-model="deptForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱">
              <el-input v-model="deptForm.email" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序">
              <el-input-number v-model="deptForm.orderNum" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="机构状态">
              <el-switch v-model="deptForm.status" :active-value="1" :inactive-value="0" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ deptForm.deptId !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, reactive, ref, toRefs, unref} from 'vue';
import {addDept, editDept, getDeptList} from "/@/api/system/dept";
import {ElMessage} from "element-plus";

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  deptName: string;
  deptType: string;
  parentId: number;
  children?: TableDataRow[];
}

interface deptFormState {
  deptId: number;
  parentId: number;
  deptName: string;
  deptType: string;
  orderNum: number;
  leader: string;
  phone: string | number;
  email: string;
  status: number;
}

interface DeptSate {
  isShowDialog: boolean;
  deptForm: deptFormState;
  deptData: Array<TableDataRow>;
  rules: object;
}

export default defineComponent({
  name: 'systemEditDept',
  setup(prop, {emit}) {
    const {proxy} = getCurrentInstance() as any;
    const {sys_dept_type} = proxy.useDict('sys_dept_type')
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<DeptSate>({
      isShowDialog: false,
      deptForm: {
        deptId: 0,
        parentId: 0, // 上级机构
        deptName: '', // 机构名称
        deptType: '',
        orderNum: 0,
        leader: '',
        phone: '',
        email: '',
        status: 1,
      },
      deptData: [], // 机构数据
      rules: {
        deptName: [
          {required: true, message: "机构名称不能为空", trigger: "blur"},
        ]
      }
    });
    // 打开弹窗
    const openDialog = (row?: deptFormState | number) => {
      resetForm()
      getDeptList().then((res: any) => {
        state.deptData = proxy.handleTree(res.data.deptList ?? [], "deptId", "parentId");
      });
      if (row && typeof row === "object") {
        row.deptType = row.deptType.toString()
        state.deptForm = row;
      } else if (row) {
        state.deptForm.parentId = row
      }
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.deptForm.deptId === 0) {
            //添加
            addDept(state.deptForm).then(() => {
              ElMessage.success('机构添加成功');
              closeDialog(); // 关闭弹窗
              emit('deptList')
            });
          } else {
            //修改
            editDept(state.deptForm).then(() => {
              ElMessage.success('机构修改成功');
              closeDialog(); // 关闭弹窗
              emit('deptList')
            });
          }
        }
      });
    };
    const resetForm = () => {
      state.deptForm = {
        deptId: 0,
        parentId: 0, // 上级机构
        deptName: '', // 机构名称
        deptType: '',
        orderNum: 0,
        leader: '',
        phone: '',
        email: '',
        status: 1,
      }
    };
    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      sys_dept_type,
      ...toRefs(state),
    };
  },
});
</script>
