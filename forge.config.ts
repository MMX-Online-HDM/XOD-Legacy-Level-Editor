import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack/webpack.main.config';
import { rendererConfig } from './webpack/webpack.renderer.config';

const config: ForgeConfig = {
	packagerConfig: {
		name: "MMXOD Editor",
		executableName: "MMXOD_Sprite_Editor",
		icon: "favicon.ico",
		extraResource: ["./resources/images/", "./resources/css/"],
	},
	rebuildConfig: {},
	makers: [
		new MakerZIP({}, ['darwin']),
	],
	plugins: [
		new WebpackPlugin({
			mainConfig,
			renderer: {
				config: rendererConfig,
				entryPoints: [
					{
						html: './src/index.html',
						js: './src/renderer.tsx',
						name: 'main_window',
						preload: {
							js: './src/preload.ts',
						},
					},
				],
			},
			devContentSecurityPolicy: "",
		}),
	],
};

export default config;
