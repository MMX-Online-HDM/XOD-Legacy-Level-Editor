import * as _ from "lodash";
import { Point } from "./Point";
import { Instance } from "./Instance";
import { JSX } from "react/jsx-runtime";
import { PropertyInput } from "../Components/PropertyInput";

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
	isArea: boolean;
	minSize: [number, number];
	baseProperties: PropertyData[];
	modeSettings: boolean = false;
	disableMirroring: boolean = false;
	mirrorObj: string = "";
	spriteRect: string = ""
	drawSprite: string = ""
	showLabel: boolean = false;

	constructor(
		name: string, isShape: boolean, color: string,
		imageFileName: string, zIndex: number,
		center: boolean = false,
		size: [number, number] = [ICON_WIDTH, ICON_WIDTH],
		isArea: boolean = false,
		minSize: [number, number] = [1, 1]
	) {
		this.name = name;
		this.isShape = isShape;
		this.color = color;
		this.zIndex = zIndex;
		this.center = center;
		this.iconSize = size;
		this.isArea = isArea;
		this.minSize = minSize;
		this.baseProperties = [];

		if (imageFileName) {
			this.imgEl = document.createElement("img");
			this.imgEl.src = "file:///" + imageFileName;
			this.imgEl.onload = () => {
				//Make sure this loads before app is ready? Might cause issues if not
			};
		}
	}

	renderPropCode(t: any) : JSX.Element[] {
		if (this.baseProperties.length == 0) {
			return ([<div/>]);
		}
		// This is awfull.
		// But I do not want to deal with Electron shenanigans.
		// So will sufice for now.
		let htmlProps = [];

		for (let i = 0; i < this.baseProperties.length; i++) {
			htmlProps[htmlProps.length] = this.baseProperties[i].renderCode(this, t);
		}
		return htmlProps;
	}
}

export class PropertyData {
	name: string;
	type: string;
	displayName: string;
	default?: any = null;
	mirror: boolean;
	alwaysMirror: boolean;
	options?: any[];
	mirrorOptions?: any[];
	linkJson?: any[];
	jsOptions?: string;
	required: boolean;
	cvArraySize: number = 0;
	cvCoordColor: string = "";

	renderCode(obj: Obj, t: any): JSX.Element {
		// Eval is a massive security risk. 
		if (this.jsOptions != null && this.jsOptions.length > 0) {
			let optionsFunct = new Function("obj", "prop", "t", this.jsOptions);
			return (<
				PropertyInput
				propertyName={this.name}
				value={t.getPropertyValue(this.name) ?? this.default}
				displayName={this.displayName}
				levelEditor={t}
				options={optionsFunct(obj, this, t)}
				typeName={this.type}
			/>);
		} else if (this.options?.length > 0) {
			return (<
				PropertyInput
				propertyName={this.name}
				value={t.getPropertyValue(this.name) ?? this.default}
				displayName={this.displayName}
				levelEditor={t}
				options={this.options}
				typeName={this.type}
			/>);
		} else {
			return (<
				PropertyInput
				propertyName={this.name}
				value={t.getPropertyValue(this.name) ?? this.default}
				displayName={this.displayName}
				levelEditor={t}
				typeName={this.type}
			/>);
		}
	}

	// Get the mirrored variant of the value if allowed.
	mirrorVal(instance: Instance) {
		// Get value.
		let val = instance.properties[this.name];
		// If we do not allow mirror we return the val.
		if (!this.mirror && !this.alwaysMirror) {
			return val;
		}
		// If this is undefined we return undefined. Unless alwaysMirror is enabled.
		if (val == undefined) {
			if (this.alwaysMirror) {
				if (this.type == "bool") {
					val = !this.default;
				} else {
					val = this.default;
				}
			} else {
				return val;
			}
		}
		// If is a bool we negate it.
		if (this.type == "bool") {
			return !val;
		}
		// If is a num we just negate it.
		if (this.type == "num") {
			return -val;
		}
		// If is muti-options we flip them.
		if ((this.type == "msrt" || this.type == "mnum" ) &&
			this.options?.length > 0 && this.mirrorOptions?.length > 0
		) {
			// Iterate both arrays. With the same bound to prevent errors.
			for (let i = 0; i < this.options.length && i < this.mirrorOptions.length; i++) {
				// If we find a match we return that.
				if (val == this.options[i]) {
					return this.mirrorOptions[1];
				}
			}
			// Otherwise return the same value.
			return val;
		}
		// If is nothing above we just return as-is.
		return val;
	}
}