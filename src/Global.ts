import { Level } from "./models/Level";
import { Obj, PropertyData } from "./models/Obj";
import { Sprite } from "./models/Sprite";
import { Spritesheet } from "./models/Spritesheet";

class Global {
	sprites: Sprite[] = [];
	levels: Level[] = [];
	spritesheetMap: { [path: string]: Spritesheet } = {};
	backgroundMap: { [path: string]: Spritesheet } = {};
	backgroundMapAlt: { [path: string]: Spritesheet } = {};
	imageMap: { [fileName: string]: HTMLImageElement } = {};
	nextSelectableId: number = 0;
	// Minimal ammount for default.
	// Most objects are external.
	objects: Obj[] = [
		new Obj("Collision Shape", true, "blue", "", 2),

		new Obj("Node", false, "", "resources/images/graph_node.png", 90, true),

		new Obj("Map Sprite", false, "", "resources/images/mapSpritePlaceholder.png", 100),
		new Obj("Moving Platform", false, "", "resources/images/mapSpritePlaceholder.png", 101),

		new Obj("Jape Memorial", false, "", "resources/images/japeMemorial.png", 110),
	];
	alignments: string[] = ["topleft", "topmid", "topright", "midleft", "center", "midright", "botleft", "botmid", "botright"];
	wrapModes: string[] = ["loop", "once"];
	hitboxFlags: string[] = ["hitbox", "hurtbox", "hit+hurt", "none"];

	constructor() {
	}

	getObjectByName(name: string): Obj {
		for (let obj of this.objects) {
			if (obj.name === name) {
				return obj;
			}
		}
		return undefined;
	}

	get spritesheets(): Spritesheet[] {
		let retSpritesheets: Spritesheet[] = [];
		for (let spritesheetPath in this.spritesheetMap) {
			retSpritesheets.push(this.spritesheetMap[spritesheetPath]);
		}
		return retSpritesheets;
	}

	get backgrounds(): Spritesheet[] {
		let retBackgrounds: Spritesheet[] = [];
		for (let backgroundPath in this.backgroundMap) {
			retBackgrounds.push(this.backgroundMap[backgroundPath]);
		}
		return retBackgrounds;
	}

	getNextSelectableId() {
		return this.nextSelectableId++;
	}

	initLinks(folders: string[]) {
	}

	initObjects(jsonData: any) {
		let objs: ObjJsonData[] = jsonData

		for (let i = 0; i < objs.length; i++) {
			if (!objs[i].name) {
				continue;
			}
			// Init the object.
			let tempObj = new Obj(
				objs[i].name, objs[i].isShape ?? false,
				objs[i].color ?? "", objs[i].image ?? "",
				objs[i].zIndex, false, objs[i].size ?? [16, 16],
				objs[i].isArea ?? false, objs[i].minSize ?? [1, 1]
			)
			tempObj.modeSettings = objs[i].modeSettings ?? false;
			tempObj.disableMirroring = objs[i].disableMirroring ?? false;
			tempObj.mirrorObj = objs[i].mirrorObj ?? "";

			// Parse propieties.
			let prop = tempObj.baseProperties;
			let propLength = -1;
			if (objs[i].propieties) {
				propLength = objs[i].propieties.length;
			}
			for (let j = 0; j < propLength; j++) {
				// Get values.
				let propData = objs[i].propieties[j];
				let newProp = new PropertyData();
				// Match data.
				newProp.name = propData.id;
				newProp.displayName = propData.name ?? propData.id;
				newProp.type = propData.type;
				newProp.mirror = propData.mirror ?? false;
				newProp.options = propData.options ?? null;
				newProp.mirrorOptions = propData.mirrorOptions ?? null;
				newProp.linkData = propData.linkData ?? null;
				let def : any = propData.default ?? null;
				if (def == null) {
					if (propData.type == "link" && propData.linkData?.length > 0) {
						def = propData.linkData[0].id;
					} else if (propData.options?.length > 0) {
						def = propData.options[0];
					}
					else if (propData.type == "bool") {
						def = true;
					}
					else if (
						propData.type == "mstr" ||
						propData.type == "str" ||
						propData.type == "link"
					) {
						def = "";
					}
					else if (propData.type == "num") {
						def = 0;
					}
				}
				newProp.default = def;
				// Save the propiety in the array.
				let count = prop.length;
				prop[count] = newProp;
			}
			tempObj.baseProperties = prop;
			// Find if there is a obj with the same name.
			let replaced = false;
			for (let j = 0; j < this.objects.length; j++) {
				// If so replace it.
				if (this.objects[j].name == tempObj.name) {
					this.objects[j] = tempObj;
					replaced = true;
				}
			}
			// If not add to end of list.
			if (!replaced) {
				this.objects[this.objects.length] = tempObj;
			}
		}

		this.objects = this.objects.sort(function (a, b) {
			return a.zIndex - b.zIndex;
		});
	}
}

interface ObjJsonData {
	name: string;
	isShape?: boolean;
	color?: string;
	zIndex: number;
	isArea?: boolean;
	modeSettings?: boolean;
	propieties?: ObjJsonPropiety[];
	image?: string;
	disableMirroring?: boolean;
	mirrorObj?: string;
	size?: [number, number];
	minSize?: [number, number];
}

interface ObjJsonPropiety {
	id: string;
	type: string;
	name?: string;
	mirror?: boolean;
	options?: any[];
	mirrorOptions?: any[];
	default?: any;
	linkData?: any[];
}

let global = new Global();
export { global };