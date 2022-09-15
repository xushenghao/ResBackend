<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<img :src="logo" class="layout-logo-medium-img"  alt=""/>
		<span hidden>{{ getThemeConfig.globalTitle }}</span>
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img"  alt=""/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '/@/store';
import logo from '/@/assets/logo.svg';
import logoMini from '/@/assets/logo-mini.svg';

export default defineComponent({
	name: 'layoutLogo',
	setup() {
		const store = useStore();
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 设置 logo 的显示
		const setShowLogo = computed(() => {
			let { isCollapse, layout } = store.state.themeConfig.themeConfig;
			return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
		});
		// logo 点击实现菜单展开/收起
		const onThemeConfigChange = () => {
			if (store.state.themeConfig.themeConfig.layout === 'transverse') return false;
			store.state.themeConfig.themeConfig.isCollapse = !store.state.themeConfig.themeConfig.isCollapse;
		};
		return {
      logo,
      logoMini,
			setShowLogo,
			getThemeConfig,
			onThemeConfigChange,
		};
	},
});
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
	color: #646667;
	font-size: 28px;
  font-weight: bold;
	cursor: pointer;
	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: 140px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	&-img {
		width: calc(100% - 20px);
		margin: auto;
	}
}
</style>
