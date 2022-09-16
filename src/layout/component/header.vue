<template>
  <el-header class="layout-header" :height="setHeaderHeight" v-show="!isTagsViewCurrenFull">
    <NavBarsIndex/>
  </el-header>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import NavBarsIndex from '/@/layout/navBars/index.vue';
import {useStore} from '/@/store';

export default defineComponent({
  name: 'layoutHeader',
  components: {NavBarsIndex},
  setup() {
    const store = useStore();
    const setHeaderHeight = computed(() => {
      let {isTagsview, layout} = store.state.themeConfig.themeConfig;
      if (isTagsview && layout !== 'classic') return '92px';
      else return '50px';
    });
    const isTagsViewCurrenFull = computed(() => {
      return store.state.tagsViewRoutes.isTagsViewCurrenFull;
    });
    return {
      setHeaderHeight,
      isTagsViewCurrenFull,
    };
  },
});
</script>
