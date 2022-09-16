import enLocale from 'element-plus/lib/locale/lang/en';
import pagesFormI18nEn from '/@/i18n/pages/formI18n/en';
import pagesFormI18nZh from '/@/i18n/pages/formI18n/zh-cn';
import pagesLoginEn from '/@/i18n/pages/login/en';
import pagesLoginZh from '/@/i18n/pages/login/zh-cn';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';
import { createI18n } from 'vue-i18n';
import nextZh from '/@/i18n/lang/zh-cn';
import nextEn from '/@/i18n/lang/en';
import { store } from '/@/store';

// 定义语言国际化内容
/**
 * 说明：
 * /src/i18n/lang 下的 ts 为框架的国际化内容
 * /src/i18n/pages 下的 ts 为各界面的国际化内容
 */
const messages = {
	[zhLocale.name]: {
		...zhLocale,
		message: {
			...nextZh,
			...pagesLoginZh,
			...pagesFormI18nZh,
		},
	},
	[enLocale.name]: {
		...enLocale,
		message: {
			...nextEn,
			...pagesLoginEn,
			...pagesFormI18nEn,
		},
	},
};

// 导出语言国际化
export const i18n = createI18n({
	legacy: false,
	locale: store.state.themeConfig.themeConfig.globalI18n,
	fallbackLocale: zhLocale.name,
	messages,
});
