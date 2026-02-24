import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
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
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerRpm({}),
		new MakerDeb({}),
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
