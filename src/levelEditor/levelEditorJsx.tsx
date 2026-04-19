import { LevelEditor } from "./levelEditor";
import { global } from "../Global";
import { NumberInput } from "../Components/NumberInput";
import * as Helpers from "../helpers";
import { Parallax } from "../models/Parallax";
import _ from "lodash";
import { MirrorEnabled } from "../enums";
import { NavMeshNeighbor } from "../models/NavMeshNode";
import { TextInput } from "../Components/TextInput";
import { PropertyInput } from "../Components/PropertyInput";
import { JSX } from "react/jsx-runtime";

export function render(t: LevelEditor): JSX.Element {
	return (
		<>
			<div id="soj" style={{ visibility: t.isLoading ? "visible" : "hidden" }}>
				<span id="soj-text">Loading...</span>
			</div>
			<div id="level-editor">
				{renderLevelList(t)}
				{renderObjectList(t)}
				{renderLevelCanvas(t)}
				{renderInstanceList(t)}
			</div>
		</>
	);
}

function renderLevelList(t: LevelEditor): JSX.Element {
	let state = t.data;
	return (
		<div className="sprite-list-container">
			<h2 style={{ marginBlock: "6px" }}>{t?.config?.isInMapModFolder ? "Custom Maps" : "Official Maps"}</h2>
			{
				!state.newLevelActive &&
				<button onClick={() => t.newLevel()}>New Map</button>
			}
			{
				state.newLevelActive &&
				<div id="newSpriteBox">
					<div id="newSpriteLabel">New Map</div>
					Name:
					<br />
					<input type="text" maxLength={40} onChange={e => { state.newLevelName = e.target.value; t.changeState(); }} style={{ width: "180px" }} />
					<br />
					<button onClick={() => t.addLevel()}>Add</button>
				</div>
			}
			<div>
				Filter: <TextInput width="140px" initialValue={state.levelFilter} onSubmit={str => { t.changeLevelFilter(str); }} />
			</div>
			<div>
				Filter mode: <select value={state.selectedFilterMode} onChange={e => { t.changeLevelFilterMode(e.target.value); }}>
					<option value="contains">Contains</option>
					<option value="exactmatch">Exact match</option>
					<option value="startswith">Starts with</option>
					<option value="endswith">Ends with</option>
				</select>
			</div>

			<div className="sprite-list-scroll">
				{
					t.getFilteredLevels().map((level, index) => (
						<div key={level.name} className={"sprite-item" + (level.name === state.selectedLevel?.name ? " selected" : "")} onClick={e => t.changeLevel(level)}>
							{t.getLevelDisplayName(level)}
						</div>
					))
				}
			</div>
		</div>
	);
}

function renderObjectList(t: LevelEditor): JSX.Element {
	let state = t.data;
	return (
		<div className="sprite-list-container" style={{ width: "130px" }}>
			<h2 style={{ marginBlock: "6px" }}>Objects</h2>
			<div className="sprite-list-scroll">
				{
					global.objects.map((obj, index) => {
						if (obj.exclusiveMap && obj.exclusiveMap !== state.selectedLevel?.name) {
							return null;
						}
						if (t.config && t.config.isProd && (obj.name === "Jape Memorial")) {
							return null;
						}
						return (
							<div key={obj.name} className={"sprite-item" + (obj.name === state.selectedObject?.name ? " selected" : "")} onClick={e => t.changeObject(obj)}>
								{obj.name}
							</div>
						);
					})
				}
				<br />
			</div>
		</div>
	);
}

function renderLevelCanvas(t: LevelEditor): JSX.Element {
	let state = t.data;
	return (
		<div className="canvas-section">
			<div className="level-canvas-wrapper">
				<canvas id="level-canvas" width={t.canvasWidth.toString()} height={t.canvasHeight.toString()}></canvas>
			</div>
			{
				state.selectedLevel &&

				<div className="level-canvas-buttons">
					{t.isOptimizedMode() &&
						<div style={{
							border: "1px solid black",
							height: "100%",
							overflowX: "auto",
							overflowY: "hidden"
						}}>
							<table>
								<tbody>
									<tr>
										<td>
											<div>OPTIMIZED MODE ON</div>
											<button onClick={e => t.setOptimizedMode(false)}>Turn Off</button>
										</td>
										<td style={{ paddingLeft: "185px", paddingRight: "15px" }}>
											Scroll
										</td>
										<td>
											<div>
												<button onClick={e => t.fastScroll(0, -1)} style={{ marginLeft: "30px" }}>↑</button>
												<div>
													<button onClick={e => t.fastScroll(-1, 0)}>←</button>
													<button onClick={e => t.fastScroll(0, 1)}>↓</button>
													<button onClick={e => t.fastScroll(1, 0)}>→</button>
												</div>
											</div>
										</td>
										<td style={{ paddingLeft: "100px", paddingRight: "15px" }}>
											Scroll Page
										</td>
										<td>
											<div>
												<button onClick={e => t.fastScrollPage(0, -1)} style={{ marginLeft: "30px" }}>↑</button>
												<div>
													<button onClick={e => t.fastScrollPage(-1, 0)}>←</button>
													<button onClick={e => t.fastScrollPage(0, 1)}>↓</button>
													<button onClick={e => t.fastScrollPage(1, 0)}>→</button>
												</div>
											</div>
										</td>
										<td style={{ paddingLeft: "100px", paddingRight: "15px" }}>
											Jump To Start/End
										</td>
										<td>
											<div>
												<button onClick={e => t.fastScrollStartEnd(0, -1)} style={{ marginLeft: "30px" }}>↑</button>
												<div>
													<button onClick={e => t.fastScrollStartEnd(-1, 0)}>←</button>
													<button onClick={e => t.fastScrollStartEnd(0, 1)}>↓</button>
													<button onClick={e => t.fastScrollStartEnd(1, 0)}>→</button>
												</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					}

					<div style={{
						display: "flex", flexDirection: "row",
						alignItems: "baseline", width: "100%", flexWrap: "wrap"
					}}>
						{!t.data.selectedLevel.isMirrorJson() &&
							<div>
								<button disabled={!state.selectedLevel.isDirty} onClick={e => t.saveLevel()}>Save</button>
								<button onClick={e => t.cssld()}>Force Dirty</button>
								<button onClick={e => t.unhideAll()}>Unhide All</button>
							</div>
						}
						{!t.isOptimizedMode() && <div style={{ width: 2 }} />}
						{!t.isOptimizedMode() &&
							<button onClick={e => t.setOptimizedMode(true)}>Optimized mode</button>
						}
						<div><input type="checkbox" checked={state.showInstanceLabels} onChange={e => { state.showInstanceLabels = e.target.checked; t.changeState(); }} />Show labels</div>
						<div style={{ width: 2 }} />
						<div><input type="checkbox" checked={state.showWallPaths} onChange={e => { t.setShowWallPaths(e.target.checked); }} />Show wall paths&nbsp;
							<button title="regenerate" disabled={!state.showWallPaths} onClick={e => t.refreshShowWallPaths()}>⟳</button></div>
						<div style={{ width: 2 }} />
						<div><input type="checkbox" checked={state.snapCollision} onChange={e => { state.snapCollision = e.target.checked; t.changeState(); }} />Snap Collision</div>
						<div style={{ width: 6 }} />
						<div>Zoom Level: <input style={{ width: "35px" }} type="number" value={t.getZoom().toString()} onChange={e => t.setZoom(e.target.valueAsNumber)} /></div>
						<div style={{ width: 6 }} />
						<div>Overscroll: <input
							value={state.overscroll}
							type="number"
							style={{ width: "35px" }}
							onChange={e => {
								state.overscroll = e.target.valueAsNumber;
								t.levelCanvas.toggleOverscroll(state.overscroll);
								t.changeState();
							}}
						/></div>
						<div style={{ width: 6 }} />
						<div>Clicked Mouse Coords: {Math.round(t.levelCanvas.lastClickX)},{Math.round(t.levelCanvas.lastClickY)}</div>
					</div>
					<div id="map-control-tabs">
						<button className="maptab-button active" onClick={e => toggleTab(e, 0)}>Properties</button>
						<button className="maptab-button" onClick={e => toggleTab(e, 1)}>Parallax</button>
						<button className="maptab-button" onClick={e => toggleTab(e, 2)}>Instance</button>
					</div>
					<div id="map-control-menu">
						<div id="map-proptab">
							<div id="map-properties">
								<div id="map-properties-element">
									Short Name: <input type="text" maxLength={14} value={state.selectedLevel.shortName ?? ""} onChange={e => { state.selectedLevel.shortName = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									Display Name: <input type="text" maxLength={25} value={state.selectedLevel.displayName ?? ""} onChange={e => { state.selectedLevel.displayName = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									Custom Map Download Url: <input type="text" maxLength={128} style={{ "width": "350px" }} value={state.selectedLevel.customMapUrl ?? ""} onChange={e => { state.selectedLevel.customMapUrl = e.target.value; t.cssld(); }} />
								</div>

								<div id="map-properties-element">
									Map Size:
									<NumberInput initialValue={state.selectedLevel.width} onSubmit={num => { t.changeWidth(num); }} /> x&nbsp;
									<NumberInput initialValue={state.selectedLevel.height} onSubmit={num => { t.changeHeight(num); }} />
								</div><div id="map-properties-element">
									Mirror X: <NumberInput initialValue={state.selectedLevel.mirrorX} onSubmit={num => { state.selectedLevel.mirrorX = num; t.cssld(); }} />
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.selectedLevel.mirroredOnly ?? false} onChange={e => { state.selectedLevel.mirroredOnly = e.target.checked; t.cssld(); }} />Mirrored Only
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.selectedLevel.mirrorMapImages ?? true} onChange={e => { state.selectedLevel.mirrorMapImages = e.target.checked; t.cssld(); }} />Mirror Map Images
									{/*Kill Y: <NumberInput initialValue={state.selectedLevel.killY} onSubmit={num => {state.selectedLevel.killY = num; t.cssld();}} /> |*/}
									{/*Water Y: <NumberInput initialValue={state.selectedLevel.waterY} onSubmit={num => {state.selectedLevel.waterY = num; t.cssld();}} /> |*/}
									{/*Max Players: <NumberInput initialValue={state.selectedLevel.maxPlayers} onSubmit={num => {state.selectedLevel.maxPlayers = Helpers.clamp(Math.round(num), 2, 16); t.cssld();}} />*/}
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.selectedLevel.supportsLargeCam ?? false} onChange={e => { state.selectedLevel.supportsLargeCam = e.target.checked; t.cssld(); }} /> Supports Large Cam
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.selectedLevel.defaultLargeCam ?? false} onChange={e => { state.selectedLevel.defaultLargeCam = e.target.checked; t.cssld(); }} /> Default Large Cam
								</div><div id="map-properties-element">
									BG Color Hex: <input style={{ width: "50px" }} maxLength={6} type="text" value={state.selectedLevel.bgColorHex ?? ""} onChange={e => { state.selectedLevel.bgColorHex = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.selectedLevel.raceOnly ?? false} onChange={e => { state.selectedLevel.raceOnly = e.target.checked; t.cssld(); }} /> Race only?
								</div>

								<div id="map-properties-element">
									Background Shader: <input type="text" value={state.selectedLevel.backgroundShader ?? ""} onChange={e => { state.selectedLevel.backgroundShader = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									Bg. Shader Image: <input type="text" value={state.selectedLevel.backgroundShaderImage ?? ""} onChange={e => { state.selectedLevel.backgroundShaderImage = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									Parallax Shader: <input type="text" value={state.selectedLevel.parallaxShader ?? ""} onChange={e => { state.selectedLevel.parallaxShader = e.target.value; t.cssld(); }} />
								</div><div id="map-properties-element">
									Px. Shader Image: <input type="text" value={state.selectedLevel.parallaxShaderImage ?? ""} onChange={e => { state.selectedLevel.parallaxShaderImage = e.target.value; t.cssld(); }} />
								</div>

								<div id="map-properties-element">
									<input type="checkbox" checked={state.showBackground} onChange={e => { state.showBackground = e.target.checked; t.redraw(true); t.changeState(); }} />
									Background:
									<select style={{ width: "200px" }} value={t.getBgPath(state.selectedLevel.backgroundPath)} onChange={e => { t.onBackgroundChange(e.target.value); t.cssld(); }}>
										<option key={-1} value=""></option>
										{t.availableBackgrounds.map((background, index) => (
											<option key={index} value={background.uid}>{background.shortPath}</option>
										))}
									</select>
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.showForeground} onChange={e => { state.showForeground = e.target.checked; t.redraw(true); t.changeState(); }} />
									Foreground:
									<select style={{ width: "200px" }} value={t.getBgPath(state.selectedLevel.foregroundPath)} onChange={e => { t.onForegroundChange(e.target.value); t.cssld(); }}>
										<option key={-1} value=""></option>
										{t.availableBackgrounds.map((background, index) => (
											<option key={index} value={background.uid}>{background.shortPath}</option>
										))}
									</select>
								</div><div id="map-properties-element">
									<input type="checkbox" checked={state.showBackwall} onChange={e => { state.showBackwall = e.target.checked; t.redraw(true); t.changeState(); }} />
									Backwall:
									<select style={{ width: "200px" }} value={t.getBgPath(state.selectedLevel.backwallPath)} onChange={e => { t.onBackwallChange(e.target.value); t.cssld(); }}>
										<option key={-1} value=""></option>
										{t.availableBackgrounds.map((background, index) => (
											<option key={index} value={background.uid}>{background.shortPath}</option>
										))}
									</select>
								</div>
							</div>
						</div>

						<div id="map-parallaxtab" hidden={true}>
							<input type="checkbox" checked={state.showParallaxes} onChange={e => { state.showParallaxes = e.target.checked; t.redraw(true); t.changeState(); }} />
							Parallaxes:
							<button onClick={e => { state.selectedLevel.parallaxes.push(new Parallax()); t.cssld(); }}>Add new</button>
							<div className="parallax-list">
								{state.selectedLevel.parallaxes.map((parallax, index) => (
									<div className="parallax" key={parallax.path + "_" + index + "_" + parallax.isLargeCamOverride}>
										<div>
											<span>{"Parallax " + (index + 1)}</span>
											<select style={{ width: "250px" }} value={t.getBgPath(parallax.path)} onChange={e => { t.onParallaxChange(index, e.target.value); t.cssld(); }}>
												<option key={-1} value=""></option>
												{t.availableBackgrounds.map((background, index) => (
													<option key={index} value={background.uid}>{background.shortPath}</option>
												))}
											</select>
											<button onClick={e => { state.selectedLevel.parallaxes.splice(index, 1); t.cssld(); }}>Remove</button>
											<button onClick={e => { t.moveParallax(index, -1); }}>Move Up</button>
											<button onClick={e => { t.moveParallax(index, 1); }}>Move Down</button>
											Is Large Cam Override? <input type="checkbox" checked={parallax.isLargeCamOverride} onChange={e => { parallax.isLargeCamOverride = e.target.checked; t.cssld(); }} />
										</div>

										Parallax Start X<NumberInput initialValue={parallax.startX} onSubmit={num => { parallax.startX = num; t.cssld(); }} />
										Parallax Start Y<NumberInput initialValue={parallax.startY} onSubmit={num => { parallax.startY = num; t.cssld(); }} />
										Parallax X Speed<NumberInput initialValue={parallax.speedX} onSubmit={num => { parallax.speedX = num; t.cssld(); }} />
										Parallax Y Speed<NumberInput initialValue={parallax.speedY} onSubmit={num => { parallax.speedY = num; t.cssld(); }} />

										<br />

										Parallax Mirror X: <NumberInput initialValue={parallax.mirrorX} onSubmit={num => { parallax.mirrorX = num; t.cssld(); }} />
										Parallax Scroll Speed X: <NumberInput initialValue={parallax.scrollSpeedX} onSubmit={num => { parallax.scrollSpeedX = num; t.cssld(); }} />
										Parallax Scroll Speed Y: <NumberInput initialValue={parallax.scrollSpeedY} onSubmit={num => { parallax.scrollSpeedY = num; t.cssld(); }} />
									</div>
								))}
							</div>
						</div>
						<div id="instance-proptab" hidden={true}>
							{
								state.selectedInstances.length > 0 &&
								<div id="instance-properties">
									<div className="properties">
										<div>
											<input type="checkbox" checked={!state.selectedInstances[0].hidden} onChange={e => { state.selectedInstances[0].hidden = !e.target.checked; t.changeState(); }} /> Visible
										</div>
										<div>
											Name <input type="text" value={state.selectedInstances[0].name} onChange={e => { state.selectedInstances[0].rename(e.target.value, state.selectedLevel); t.cssld(); }} />
										</div>
										<div>
											Object: {state.selectedInstances[0].objectName}
										</div>
										{state.selectedInstances[0].pos &&
											<div>
												x: <NumberInput initialValue={state.selectedInstances[0].pos.x} onSubmit={num => { state.selectedInstances[0].pos.x = num; t.cssld(); }} />
												&nbsp;&nbsp;
												y: <NumberInput initialValue={state.selectedInstances[0].pos.y} onSubmit={num => { state.selectedInstances[0].pos.y = num; t.cssld(); }} />
											</div>
										}

										Enabled in:
										<select style={{ width: "137px" }} value={state.selectedInstances[0].mirrorEnabled} onChange={e => { state.selectedInstances[0].mirrorEnabled = Number(e.target.value); t.cssld(); }}>
											<option key={0} value={MirrorEnabled.Both}>{ state.selectedInstances[0].obj?.disableMirroring ? "Keep Non-Mirror (Default)" : "All" }</option>
											<option key={1} value={MirrorEnabled.NonMirroredOnly}>{ state.selectedInstances[0].obj?.disableMirroring ? "Remove on Mirrored" : "Non-Mirror Only" }</option>
											<option key={2} value={MirrorEnabled.MirroredOnly}>Mirror Only</option>
											{ state.selectedInstances[0].obj?.disableMirroring != true && <option key={3} value={MirrorEnabled.KeepNonMirror}>Keep Non-Mirror</option> }
											<option key={4} value={MirrorEnabled.KeepMirror}>Keep Mirror</option>
										</select>
										{
											state.selectedInstances[0].points &&
											<div>
												Shape Instance Points:
												{
													state.selectedInstances[0].points.map((point, index) => (
														<div key={String(point.x) + "," + String(point.y) + "," + index}>
															<b>{index + 1})&nbsp;</b>
															x: <NumberInput initialValue={point.x} onSubmit={num => { point.x = num; t.cssld(); }} />
															&nbsp;&nbsp;
															y: <NumberInput initialValue={point.y} onSubmit={num => { point.y = num; t.cssld(); }} />
															{state.selectedInstances[0].points.length >= 4 &&
																<button title="Delete" onClick={e => { state.selectedInstances[0].points.splice(index, 1); t.cssld(); }}><img src="file:///resources/images/delete.png" /></button>
															}
														</div>
													))
												}
											</div>
										}
									</div>
									<div className="properties" style={{ marginLeft: 5, marginRight: 5 }}>
										<div>Properties:</div>
										<textarea rows={8} cols={40}
											value={state.selectedInstances[0].getPropertiesString()}
											onChange={e => { state.selectedInstances[0].propertiesString = e.target.value; t.forceUpdate(); }}
											onBlur={e => t.changeProperties(e.target.value)} />
									</div>

									<div className="properties">
										{state.selectedInstances[0].obj.baseProperties.length > 0 && <div>Flags:</div>}
										{state.selectedInstances[0].obj.renderPropCode(t)}

										{
											state.selectedInstances[0].objectName === 'Node' &&
											<>
												<PropertyInput propertyName="connectToSelfIfMirrored" value={t.getPropertyValue("connectToSelfIfMirrored") ?? true} displayName="Connect To Self If Mirrored" levelEditor={t} />
												{
													(state.selectedInstances[0].properties.neighbors ?? []).map((neighbor: NavMeshNeighbor, index: number) => (
														<div style={{ display: "inline-block", border: "1px solid black", padding: "2px", margin: "2px" }} key={index + "_" + neighbor.nodeName}>
															<div>
																Neighbor: {neighbor.nodeName}
																<button onClick={e => t.removeNeighbor(state.selectedInstances[0], neighbor.nodeName)}>🗑</button>
															</div>
															<PropertyInput propertyName="ladderDir" value={neighbor.ladderDir ?? "up"} displayName="Ladder Climb Dir" levelEditor={t} options={["up", "down"]} neighbor={neighbor} />
															<PropertyInput propertyName="wallDir" value={neighbor.wallDir ?? "left"} displayName="Wall Climb Dir" levelEditor={t} options={["left", "right"]} neighbor={neighbor} />
															<PropertyInput propertyName="platformJumpDir" value={neighbor.platformJumpDir ?? "left"} displayName="Platform Jump Dir" levelEditor={t} options={["left", "right"]} neighbor={neighbor} />
															<PropertyInput propertyName="platformJumpDirDist" value={neighbor.platformJumpDirDist ?? 30} displayName="Platform Jump Dir Dist" levelEditor={t} neighbor={neighbor} />
															<PropertyInput propertyName="includeJumpZones" value={neighbor.includeJumpZones ?? ""} displayName="Include Jump Zones" levelEditor={t} neighbor={neighbor} />
															<PropertyInput propertyName="movingPlatXDist" value={neighbor.movingPlatXDist ?? 60} displayName="Moving Plat X Dist" levelEditor={t} neighbor={neighbor} />
															<PropertyInput singleLine={true} propertyName="dash" value={neighbor.dash ?? true} displayName="Dash" levelEditor={t} neighbor={neighbor} />&nbsp;
															<PropertyInput singleLine={true} propertyName="dropFromLadder" value={neighbor.dropFromLadder ?? true} displayName="Ladder Drop" levelEditor={t} neighbor={neighbor} />&nbsp;
															<PropertyInput singleLine={true} propertyName="isDestNodeInAir" value={neighbor.isDestNodeInAir ?? true} displayName="To Air Node" levelEditor={t} neighbor={neighbor} />
														</div>
													))
												}
											</>
										}
										{
											// Game Mode Exclusion Shared
											state.selectedInstances[0].obj.modeSettings &&
											<>
												Gamemode:
												<PropertyInput propertyName="nonDmOnly" value={t.getPropertyValue("nonDmOnly") ?? true} displayName="Exclude in DM" levelEditor={t} />
												<PropertyInput propertyName="nonCtfOnly" value={t.getPropertyValue("nonCtfOnly") ?? true} displayName="Exclude in CTF" levelEditor={t} />
												<PropertyInput propertyName="nonKothOnly" value={t.getPropertyValue("nonKothOnly") ?? true} displayName="Exclude in KOTH" levelEditor={t} />
												<PropertyInput propertyName="nonCpOnly" value={t.getPropertyValue("nonCpOnly") ?? true} displayName="Exclude in CP" levelEditor={t} />
												<PropertyInput propertyName="dmOnly" value={t.getPropertyValue("dmOnly") ?? true} displayName="Include in DM Only" levelEditor={t} />
											</>
										}
									</div>

								</div>
							}
						</div>
					</div>

				</div>
			}
		</div>
	);
}

function renderInstanceList(t: LevelEditor): JSX.Element {
	let state = t.data;
	return (
		<div className="sprite-list-container" style={{ width: "150px" }}>
			<h2 style={{ marginBlock: "6px" }}>Instances</h2>
			{
				state.selectedLevel &&
				<div style={{
					display: "flex", flexDirection: "column", alignItems: "flex-start",
					width: "100%", height: "100%", overflow: "hidden"
				}}>
					<button onClick={e => t.sortInstances()}>Sort</button>
					<div className="sprite-list-scroll">
						{
							state.selectedLevel.instances.map((instance, index) => (
								<div key={instance.id} onClick={e => t.onInstanceClick(instance)} style={{ backgroundColor: instance.getListItemColor(state) }}>
									{instance.name}
								</div>
							))
						}
						<br />
					</div>
				</div>
			}
		</div>
	);
}

function toggleTab(e: any, active: number) {
	let tabs = [
		document.getElementById("map-proptab"),
		document.getElementById("map-parallaxtab"),
		document.getElementById("instance-proptab"),
	]
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].hidden = i != active;
	}
	let tablinks = document.getElementsByClassName("maptab-button");
	for (let i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	e.currentTarget.className += " active";
}