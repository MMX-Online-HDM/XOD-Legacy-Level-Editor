import * as _ from "lodash";
import { Point } from "./Point";

export class Obj {
	name: string;
	isShape: boolean;
	color: string;
	imgEl: HTMLImageElement;
	zIndex: number;
	exclusiveMap: string;
	center: boolean;

	constructor(
		name: string, isShape: boolean, color: string,
		imageFileName: string, zIndex: number, center: boolean = false
	) {
		this.name = name;
		this.isShape = isShape;
		this.color = color;
		this.zIndex = zIndex;
		this.center = center;
		if (imageFileName) {
			this.imgEl = document.createElement("img");
			this.imgEl.src = "file:///" + imageFileName;
			this.imgEl.onload = () => {
				//Make sure this loads before app is ready? Might cause issues if not
			};
		}
	}
}