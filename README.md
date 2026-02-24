# XOD Level Editor

## Overview
- This is the project for the level and sprite editors of MMXOD, used for both sprite mods/custom maps as well as offical development of the game. Both editors are part of this project and are bundled in one app.
- This project is a JavaScript/TypeScript Electron Desktop app. React is used as the UI library.
- Electron Forge was used as template of this repo.  
In GM19 repo originally this template was used to create the project: https://github.com/diego3g/electron-typescript-react
- Redux is NOT used. A simple, custom state management system was developed. This does rely heavily on forceUpdate which may seem crude but makes things simpler and easier especially when interacting with low level canvas drawing.
- As per design of the Electron framework, the UI thread is separate from the main thread. The UI code is rendered in React via tsx files. The main thread code can be found in [index.tsx](./src/index.tsx) and has code related to the window, process, file IO, etc. The UI thread communicates with the main thread via [preload.tsx](./src/preload.ts).

## Local development
First time setup using:
- Install Node.js.
- Enable Yarn via: `corepack enable yarn`
- Update Yarn by: `yarn set version stable`
- Run `yarn` the main repo folder to install packages.

Then, to test your changes locally, run the following the terminal inside the folder:
- `yarn start` starts the sprite editor.
- `yarn start-le` starts the level editor.

Changes to main thread code require closing and restarting the app with the yarn start commands.  
However, changes to UI code support hot reload and should automatically refresh when you change the UI files.

## Building a release
To create a release build of the project just run `yarn package` or ` yarn package-x86`.  
This will create the binaries in the `out` folder.  
Unlike the C#/.NET code there is no concept of "self contained" builds since this is JavaScript/Electron.