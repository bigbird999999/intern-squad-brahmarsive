import * as BABYLON from "@babylonjs/core";
import { AdvancedDynamicTexture, Image, Button, Control, Rectangle } from "@babylonjs/gui";
import * as GUI from "@babylonjs/gui";
import { createScene } from "./scene";
 
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = createScene(engine);

await scene.createDefaultXRExperienceAsync({
  optionalFeatures: true,
});
console.log(scene);

const music = new BABYLON.Sound("background", "audio/background.wav", scene, null, {  loop: true,  autoplay: true,});
console.log(scene);
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
 