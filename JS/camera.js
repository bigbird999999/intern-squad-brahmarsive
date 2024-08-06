import * as BABYLON from "@babylonjs/core";
import { setupBowAndArrow } from "./archer";

export function setupCamera(scene) {
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        0,
        0,
        0,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
    
    camera.setPosition(new BABYLON.Vector3(-18.5, -14, -500));
    setupBowAndArrow(scene, camera);
}
