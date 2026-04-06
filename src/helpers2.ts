// This file has features that the renderer may not interact well with.
import { promises } from "original-fs";
import { Config } from "./config";
import * as Helpers from "./helpers";
import { LevelEditor } from "./levelEditor/levelEditor";

export function relativeToAbsolutePath(fileName: string, le: LevelEditor) {
	// If is empty we return it as is.
	if (!fileName) {
		return fileName;
	}
	// If is absolute we slash it.
	if (fileName.includes(le.config.assetPath) ) {
		return Helpers.getAssetPath(fileName);
	}
	// If it points to well know folders we return that.
	if (fileName.startsWith("spritesheets/") || fileName.startsWith("maps_shared/")) {
		return fileName;
	}
	// If is relative to current folder we get our map folder.
	if (fileName.startsWith("./")) {
		let folderPath = dirName(le.data.selectedLevel.path);
		let retPath = fileName.slice(1);
		return folderPath + retPath;
	}
	// If everithing else fails we just return it as is.
	return fileName;
}

export function dirName(fileName: string) : string {
	let dirList = fileName.split("/");
	if (dirList.length < 2) {
		return fileName;
	}
	let final = fileName.lastIndexOf("/");

	return fileName.slice(0, final);
}