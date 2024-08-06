import * as BABYLON from "@babylonjs/core";

export function loadModels(scene) {
  importEnv(scene, new BABYLON.Vector3(-5, 150, 570));
  importSpace(scene, new BABYLON.Vector3(100, 90, 500));
  importStand(scene, new BABYLON.Vector3(-11, -70, 400));
}

function importEnv(scene, position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "env1.glb",
    scene,
    function (meshes) {
      const env = meshes[0];
      env.scaling = new BABYLON.Vector3(60,45, 60);
      env.rotation = new BABYLON.Vector3(0, 700.5, 0);
      env.position = position;
    }
  );
}

function importSpace(scene, position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "spc.glb",
    scene,
    function (meshes) {
      const env = meshes[0];
      env.scaling = new BABYLON.Vector3(1500, 1500, 1500);
      env.position = position;
    }
  );
}

function importStand(scene, position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "stand.glb",
    scene,
    function (meshes) {
      const env = meshes[0];
      env.scaling = new BABYLON.Vector3(100, 110, 100);
      env.rotation = new BABYLON.Vector3(0, 900, 0);
      env.position = position;
    }
  );
}
