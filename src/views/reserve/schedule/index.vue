<template>
  <div class="ophtha-schedule-container">
    <el-card shadow="hover" class="card-table">
      <template #header>
        <div class="card-header">
          <el-collapse>
            <el-collapse-item name="finder">
              <template #title>
                <el-link type="primary" :underline="false">搜索</el-link>
              </template>
              <div class="ophtha-expert-search mb15">
                <el-form :model="state.list.param" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item label="专家姓名" prop="name">
                    <el-input
                        v-model="state.list.param.name"
                        placeholder="请输入专家姓名"
                        clearable
                        @keyup.enter.native="expertList"
                    />
                  </el-form-item>
                  <el-form-item label="所属诊所" prop="clinicName">
                    <el-select v-model="state.list.param.clinicName" placeholder="请选择所属诊所" class="w100">
                      <el-option
                          v-for="clinic in state.clinic"
                          :key="clinic.id"
                          :value="clinic.short"
                          :label="clinic.short"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="ml10" @click="expertList">
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
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="right-button">
            <el-dropdown>
              <el-button type="primary">
                <el-icon>
                  <ele-Plus/>
                </el-icon>
                新增记录
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>复制上周班表</el-dropdown-item>
                  <el-dropdown-item>导入钉钉班表</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button plain type="danger" @click="onShiftMan()">
              <el-icon>
                <ele-Operation/>
              </el-icon>
              班次管理
            </el-button>
          </div>
        </div>
      </template>
      <el-row>
        <el-col :span="10"/>
        <el-col :span="4">
          <el-tooltip content="前一周" placement="left">
            <el-button plain class="arrow-btn" @click="onArrowClick('prev')">
              <el-icon>
                <ArrowLeft/>
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-date-picker
              type="week"
              v-model="weekRef"
              :editable="false"
              :clearable="false"
              format="第 ww 周"
              @change="setWeekNumber"
              class="date-picker"
          />
          <el-tooltip content="后一周" placement="right">
            <el-button plain class="arrow-btn" @click="onArrowClick('next')">
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="10"/>
      </el-row>
      <el-table border :data="state.expert" size="large" v-loading="state.list.loading">
        <el-table-column width="120" prop="name">
          <template #default="{ row }">
            <span style="color: #1f1f1f; font-weight: bold">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="坐诊诊所" align="center" prop="clinicName"/>
        <el-table-column align="center" v-for="(item) in state.weekday" :key="item.date">
          <template #header>
            <span style="color: #1f1f1f">{{ item.week }} {{ item.date }}</span>
          </template>
          <template #default="{ row }">
            <div class="calendar">
              <template v-for="sch in item.schedule">
                  <span v-if="sch.expertName === row.name" class="schedule-info" :key="sch.id">
                    {{ sch.shiftName }} 号{{ sch.serviceCount }}
                  </span>
              </template>
              <el-popover
                  :offset=0
                  :hide-after=0
                  :show-arrow="false"
                  trigger="hover"
                  placement="bottom"
                  popper-class="action-popover"
                  v-if="!item.past"
              >
                <template #reference>
                  <div class="action-hover"/>
                </template>
                <el-row>
                  <el-col :span="12">
                    <el-button size="large" class="action-btn left" @click="onShiftMan()">预留</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="large" class="action-btn right" @click="onPlan()">排班</el-button>
                  </el-col>
                </el-row>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="state.list.total>0"
          :total="state.list.total"
          v-model:page="state.list.param.pageNum"
          v-model:limit="state.list.param.pageSize"
          @pagination="expertList"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import {h, onMounted, reactive, ref} from 'vue';
import {ElNotification, FormInstance} from 'element-plus'
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {ScheduleList} from "/@/views/reserve/schedule/dataType";
import {listSchedule} from "/@/api/reserve/schedule";
import {listClinic} from "/@/api/ophtha/clinic";
import {listExpert} from '/@/api/ophtha/expert';

dayjs.locale('zh-cn')
const weekRef = ref("");
const queryRef = ref();
const state = reactive<ScheduleList>({
  ids: [],
  clinic: [],
  expert: [],
  weekday: [],
  list: {
    data: [],
    total: 0,
    loading: false,
    param: {
      paging: {
        dateRange: [],
        pageSize: 10,
        pageNum: 1,
        orderBy: '',
      },
      status: undefined,
      name: undefined,
      clinicName: undefined,
    },
  },
});

// 获取专家列表
const expertList = async () => {
  state.list.loading = true;
  await listExpert(state.list.param).then((res: any) => {
    state.expert = res.data.list;
    state.list.loading = false;
  });
};

// 获取诊所列表
const clinicList = async () => {
  state.list.loading = true;
  await listClinic({status: 1}).then((res: any) => {
    state.clinic = res.data.list;
    state.list.loading = false;
  });
};

// 获取班表列表
const scheduleList = async () => {
  state.list.loading = true;
  await listSchedule(state.list.param).then((res: any) => {
    state.list.data = res.data.list;
    state.list.total = res.data.total;
    state.list.loading = false;
  });
};

// 排班弹窗
const onPlan = () => {
  onShiftMan();
};

// 重置按钮
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  expertList()
};

// 班次管理
const onShiftMan = () => {
  ElNotification({
    title: '开发中',
    message: h('i', {style: 'color: teal'}, 'This is a reminder'),
  })
};

// 周期选择
const setWeekNumber = async () => {
  // 初始时间
  if (weekRef.value == "") weekRef.value = dayjs().subtract(dayjs().day() - 1, 'day').format('YYYY-MM-DD');
  const start = dayjs(weekRef.value)
  state.list.param.paging.dateRange[0] = start.format('YYYY-MM-DD');
  state.list.param.paging.dateRange[1] = start.add(7, 'day').format('YYYY-MM-DD');

  // 刷新班表
  state.list.loading = true;
  await scheduleList()

  // 遍历填充
  for (let i = 0; i < 7; i++) {
    const theDay = start.add(i, 'day')
    state.weekday[i] = {
      week: theDay.format('ddd'),
      date: theDay.format('MM-DD'),
      past: theDay.isBefore(dayjs(), 'day'),
      today: theDay.isSame(dayjs(), 'day'),
      schedule: state.list.data?.filter((item: any) => dayjs(item.dateAt).day() == theDay.day()),
    }
  }
  state.list.loading = false;
};

// 周期切换
const onArrowClick = (type: string) => {
  if (type == 'prev') {
    weekRef.value = dayjs(weekRef.value).subtract(7, 'day').format('YYYY-MM-DD')
  } else {
    weekRef.value = dayjs(weekRef.value).add(7, 'day').format('YYYY-MM-DD')
  }
  setWeekNumber()
};

// 初始数据
onMounted(async () => {
  await expertList()
  await clinicList()
  await setWeekNumber();
});
</script>

<style lang="scss">
.ophtha-schedule-container {
  // 卡片样式
  .card-table .el-card__body {
    padding: var(--el-card-padding);
  }

  // 右上按钮
  .right-button {
    .el-dropdown {
      float: right;
    }
  }

  // 顶部周历样式
  .date-picker {
    width: calc(100% - 64px);
    margin-bottom: 10px;
    --el-input-border-color: none;
    --el-input-hover-border-color: none;
    --el-input-focus-border-color: none;
  }

  .el-input__prefix {
    display: none;
  }

  .el-input__inner {
    cursor: pointer;
    text-align: center;
    font-weight: 900 !important;
    font-size: 15px;
  }

  // 切换按钮
  .arrow-btn {
    height: 32px;
    width: 32px;
    margin-bottom: 10px;
  }
}

// 悬浮按钮
.action-popover {
  padding: 0 !important;

  .action-btn {
    width: 100%;
    border: none;
    border-radius: 0;
  }

  .left {
    border-radius: 4px 0 0 4px;
  }

  .right {
    border-radius: 0 4px 4px 0;
  }
}
</style>

<style scoped lang="scss">
.cell:has(.calendar),
.el-table__cell:has(.calendar) {
  padding: 0 !important;
}

.ophtha-schedule-container {
  .action-hover,
  .schedule-info {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    position: absolute;
    line-height: 47px;
    margin: auto auto;
    border: 1px solid transparent;
  }

  .schedule-info {
    cursor: not-allowed;
    background: rgba(233, 191, 42, 0.05);
    color: black;
  }

  .action-hover:hover {
    border: 1px solid var(--el-color-primary);
    background: rgba(64, 158, 255, 0.025);
    font-weight: 900;
  }
}
</style>