import {nextTick} from 'vue';
import '/@/theme/loading.scss';

/**
 * 页面全局 Loading
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 创建 loading
	start: () => {
		const body: Element = document.body;
		const div = <HTMLElement>document.createElement('div');
		div.setAttribute('class', 'loading-next');
		div.innerHTML = `
			<div class="loading-next-box">
			<div class="loading-next-box-warp">
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
			</div>
		</div>
		`;
		body.insertBefore(div, body.childNodes[0]);
		window.nextLoading = true;
	},
	// 移除 loading
	done: async () => {
		await nextTick(() => {
			window.nextLoading = false;
			const el = <HTMLElement>document.querySelector('.loading-next');
			el?.parentNode?.removeChild(el);
		});
	},
};
