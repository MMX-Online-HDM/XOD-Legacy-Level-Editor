import { Point } from "./Point";
import { Rect } from "./Rect";
import { Selectable } from "../selectable";
import { Exclude, Expose, Type } from "class-transformer";
import { global } from "../Global";

export class Hitbox implements Selectable {
	@Expose() width: number;
	@Expose() height: number;
	@Expose() flag: number;
	@Expose() name: string;
	@Expose() isTrigger: boolean = false;
	@Expose() @Type(() => Point) offset: Point;
	@Exclude() selectableId: number;

	constructor() {
		this.name = "";
		this.width = 20;
		this.height = 40;
		this.offset = new Point(0, 0);
		this.selectableId = global.getNextSelectableId();
	}

	move(deltaX: number, deltaY: number) {
		this.offset.x += deltaX;
		this.offset.y += deltaY;
	}

	resizeCenter(w: number, h: number) {
		this.width += w;
		this.height += h;
	}

	getRect(alignment: string) {
		let hx = 0;
		let hy = 0;
		let halfW = this.width * 0.5;
		let halfH = this.height * 0.5;
		let w = halfW * 2;
		let h = halfH * 2;
		if (alignment === "topmid") {
			hx = -halfW;
		}
		else if (alignment === "topright") {
			hx = -w;
		}
		else if (alignment === "midleft") {
			hy = -halfH;
		}
		else if (alignment === "center") {
			hx = -halfW; hy = -halfH;
		}
		else if (alignment === "midright") {
			hx = -w; hy = -halfH;
		}
		else if (alignment === "botleft") {
			hy = -h;
		}
		else if (alignment === "botmid") {
			hx = -halfW; hy = -h;
		}
		else if (alignment === "botright") {
			hx = -w; hy = -h;
		}
		return new Rect(hx, hy, hx + this.width, hy + this.height);
	}
}