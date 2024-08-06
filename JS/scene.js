import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { setupCamera } from "./camera";
import { setupLights } from "./lights";
import { setupPhysics } from "./physics";
import { loadModels } from "./models";
import { setupScene } from "./environment";

export function createScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.8, 0.8, 0.8, 1);

    setupScene(scene);
    setupCamera(scene);
    setupLights(scene);
    setupPhysics(scene);
    loadModels(scene);

    return scene;
}
