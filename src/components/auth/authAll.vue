<template>
	<slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { judgmentSameArr } from '/@/utils/arrayOperation';
import { useStore } from '/@/store';

export default defineComponent({
	name: 'authAll',
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		const store = useStore();
		// 获取 vuex 中的用户权限
		const getUserAuthBtnList = computed(() => {
			return judgmentSameArr(props.value, store.state.userInfos.userInfos.authBtnList);
		});
		return {
			getUserAuthBtnList,
		};
	},
});
</script>
