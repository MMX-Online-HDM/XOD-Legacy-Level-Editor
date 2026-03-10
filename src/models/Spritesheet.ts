import { Config } from "../config";
import * as Helpers from "../helpers";
import * as Helpers2 from "../helpers2";

export class Spritesheet {
	name: string = "";
	uid: string = "";
	shortPath: string = "";
	mapPath: string = "";
	path: string = "";
	imgEl: HTMLImageElement | undefined;
	imgArr: any;
	lazyLoadImgArr: Function;

	constructor(path: string) {
		this.path = path;
		this.shortPath = Helpers.getShortPath(path);
		this.mapPath = Helpers.mapPath(path);
		this.uid = Helpers.getSheetUID(path);
		this.name = Helpers.getNormalizedSpritesheetName(undefined, this.path);
	}

	loadImage() {
		if (!this.imgEl) {
			let spritesheetImg = document.createElement("img");
			spritesheetImg.onload = () => {
			};
			spritesheetImg.onerror = (e) => {
				window.Main.showError("Error", "Error loading image " + this.path);
			}
			spritesheetImg.src = "file:///" + this.path;
			this.imgEl = spritesheetImg;
		}
	}
}