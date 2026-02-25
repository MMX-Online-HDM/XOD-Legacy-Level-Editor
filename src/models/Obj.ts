import * as _ from "lodash";
import { Point } from "./Point";

const ICON_WIDTH = 16;

export class Obj {
	name: string;
	isShape: boolean;
	color: string;
	imgEl: HTMLImageElement;
	zIndex: number;
	exclusiveMap: string;
	center: boolean;
	iconSize: [number, number];

	constructor(
		name: string, isShape: boolean, color: string,
		imageFileName: string, zIndex: number,
		center: boolean = false,
		size: [number, number] = [ICON_WIDTH, ICON_WIDTH]
	) {
		this.name = name;
		this.isShape = isShape;
		this.color = color;
		this.zIndex = zIndex;
		this.center = center;
		this.iconSize = size;

		if (imageFileName) {
			this.imgEl = document.createElement("img");
			this.imgEl.src = "file:///" + imageFileName;
			this.imgEl.onload = () => {
				//Make sure this loads before app is ready? Might cause issues if not
			};
		}
	}
}