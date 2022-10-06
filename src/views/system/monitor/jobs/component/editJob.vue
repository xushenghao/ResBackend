<template>
  <div class="system-edit-job-container">
    <el-dialog :title="(jobForm.jobId!==0?'修改':'添加')+'任务'" v-model="isShowDialog" width="800px">
      <el-form :model="jobForm" ref="formRef" :rules="rules"  label-width="100px">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :inline="true" label="任务名称" prop="jobName">
              <el-input v-model="jobForm.jobName" placeholder="请输入任务名称" class="w100"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :inline="true" label="任务分组" prop="jobGroup">
              <el-select v-model="jobForm.jobGroup" placeholder="请选择任务分组" class="w100">
                <el-option
                    v-for="dict in sys_job_group"
                    :key="dict.key"
                    :label="dict.label"
                    :value="dict.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item required clearable label="调用方法" prop="invokeTarget">
              <el-input v-model="jobForm.invokeTarget" placeholder="请输入调用方法"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item clearable label="执行参数" prop="jobParams">
              <el-input v-model="jobForm.jobParams" placeholder="请输入执行参数"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item required clearable label="cron 表达式" prop="cronExpression">
          <el-input v-model="jobForm.cronExpression" placeholder="请输入 CRON 表达式"/>
          <ul style="list-style: none;">
            <li>* / 5 * * * * ? : 每隔5秒执行一次</li>
            <li>20 * / 1 * * * ? : 每隔1分钟执行一次</li>
            <li>30 0 23 * * ? : 每天23点执行一次</li>
            <li>0 0 1 * * ? : 每天凌晨1点执行一次</li>
            <li>0 0 1 1 * ? : 每月1号凌晨1点执行一次</li>
          </ul>
        </el-form-item>

        <el-form-item label="计划执行策略" prop="misfirePolicy">
          <el-radio-group v-model="jobForm.misfirePolicy">
            <el-radio :label=1>多次执行</el-radio>
            <el-radio :label=2>执行一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否并发执行" prop="concurrent">
          <el-radio-group v-model="jobForm.concurrent">
            <el-radio :label=0>允许</el-radio>
            <el-radio :label=1>禁止</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="jobForm.status">
            <el-radio :label=0>启用</el-radio>
            <el-radio :label=1>禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item hidden label="备注" prop="remark">
          <el-input v-model="jobForm.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>

      </el-form>

      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" >取 消</el-button>
					<el-button type="primary" @click="onSubmit" >{{ jobForm.jobId !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, reactive, ref, toRefs, unref} from 'vue';
import {addJob, updateJob} from "/@/api/system/monitor/jobs";
import {ElMessage} from "element-plus";

interface JobFormState {
  jobId: number;
  jobName: string;
  jobGroup: string;
  jobParams: string;
  invokeTarget: string;
  cronExpression: string;
  misfirePolicy: number;
  concurrent: number;
  remark: string;
  status: number;
}

interface JobState {
  isShowDialog: boolean;
  jobForm: JobFormState;
  rules: {}
}

export default defineComponent({
  name: 'systemEditJob',
  setup(prop, {emit}) {
    const {proxy} = getCurrentInstance() as any;
    const {sys_job_group} = proxy.useDict('sys_job_group')
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<JobState>({
      isShowDialog: false,
      jobForm: {
        jobId: 0,
        jobName: '',
        jobGroup: '',
        jobParams: '',
        invokeTarget: '',
        cronExpression: '',
        misfirePolicy: 0,
        concurrent: 1,
        status: 1,
        remark: ''
      },
      rules: {
        jobName: [
          {required: true, message: "任务名称不能为空", trigger: "blur"}
        ],
        invokeTarget: [
          {required: true, message: "调用目标字符串不能为空", trigger: "blur"}
        ],
        cronExpression: [
          {required: true, message: "cron执行表达式不能为空", trigger: "blur"}
        ]
      }
    });
    // 打开弹窗
    const openDialog = (row: JobFormState | null) => {
      resetForm();
      if (row) {
        state.jobForm = row;
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.jobForm = {
        jobId: 0,
        jobName: '',
        jobGroup: '',
        jobParams: '',
        invokeTarget: '',
        cronExpression: '',
        misfirePolicy: 0,
        concurrent: 1,
        status: 1,
        remark: ''
      }
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
          if (state.jobForm.jobId !== 0) {
            //修改
            updateJob(state.jobForm).then(() => {
              ElMessage.success('任务类型修改成功');
              closeDialog();
              emit('typeList')
            })
          } else {
            //添加
            addJob(state.jobForm).then(() => {
              ElMessage.success('任务类型添加成功');
              closeDialog();
              emit('typeList')
            })
          }
        }
      });
    };

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      sys_job_group,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.el-form-item__label {
  font-weight: bold;
}
</style>
