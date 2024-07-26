import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.8, 0.8, 0.8, 1); // Set clear color to light gray

// Create a camera
var camera = new BABYLON.ArcRotateCamera(
  "camera",
  0, // Math.PI / 2,
  0, // Math.PI / 3,
  0,
  BABYLON.Vector3.Zero(),
  scene
);
camera.setPosition(new BABYLON.Vector3(-20, 140, -470));
camera.inputs.clear();
// camera.useAutoRotationBehavior = true;
// camera.rotation(new BABYLON.Vector3(200,500,200));
camera.attachControl(canvas, true);

// Create a light
var light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 1, 0),
  scene
);
light.intensity = 1; // Adjust light intensity

// Create ground material
var groundMaterial = new BABYLON.StandardMaterial("ground");
groundMaterial.diffuseTexture = new BABYLON.Texture("./ground2.jpg", scene);

// Create ground plane
var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
  "ground",
  "./ground2.jpg",
  { width: 1000, height: 800, subdivisions: 250, maxHeight: 10 }
);
ground.material = groundMaterial;

var roomWallRight = BABYLON.MeshBuilder.CreateBox(
  "RoomWallRight",
  { width: 20, height: 400, depth: 800 },
  scene
);
roomWallRight.position = new BABYLON.Vector3(500, 198, 0);

var roomWallLeft = BABYLON.MeshBuilder.CreateBox(
  "RoomWallLeft",
  { width: 20, height: 400, depth: 800 },
  scene
);
roomWallLeft.position = new BABYLON.Vector3(-500, 198, 0);

var roomWallBack = BABYLON.MeshBuilder.CreateBox(
  "RoomWallBack",
  { width: 1000, height: 400, depth: 20 },
  scene
);
roomWallBack.position = new BABYLON.Vector3(0, 198, 414);

const WallTexture = new BABYLON.StandardMaterial("WallTexture");
WallTexture.ambientTexture = new BABYLON.Texture("/img4.avif", scene);

roomWallRight.material = WallTexture;
roomWallLeft.material = WallTexture;
roomWallBack.material = WallTexture;

// Function to import and position the "poly.glb" model
function importAndPositionPoly(position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "poly.glb",
    scene,
    function (meshes) {
      var poly = meshes[0];
      poly.scaling = new BABYLON.Vector3(20, 20, 20); // Adjust scaling as needed
      poly.position = position; // Set position
    }
  );
}

// Function to import and position the "maple_tree2.glb" model
function importAndPositionMapleTree(position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "maple_tree2.glb",
    scene,
    function (meshes) {
      var mapleTree = meshes[0];
      mapleTree.scaling = new BABYLON.Vector3(30, 70, 30); // Adjust scaling as needed
      mapleTree.position = position; // Set position
    }
  );
}

// Function to import and position the "wall1.glb" model
function importAndPositionWall(position) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "wall1.glb",
    scene,
    function (meshes) {
      var wall = meshes[0];
      wall.scaling = new BABYLON.Vector3(13, 30, 15); // Adjust scaling as needed
      wall.position = position; // Set position
    }
  );
}

// Import and position "poly.glb" models
importAndPositionPoly(new BABYLON.Vector3(300, 0, 180));
importAndPositionPoly(new BABYLON.Vector3(300, 0, 80));
importAndPositionPoly(new BABYLON.Vector3(300, 0, -20));
importAndPositionPoly(new BABYLON.Vector3(300, 0, -120));
importAndPositionPoly(new BABYLON.Vector3(300, 0, -200));
importAndPositionPoly(new BABYLON.Vector3(-370, 0, 250));
importAndPositionPoly(new BABYLON.Vector3(-450, 0, 250));
importAndPositionPoly(new BABYLON.Vector3(-370, 0, 80));
importAndPositionPoly(new BABYLON.Vector3(-450, 0, 100));
importAndPositionPoly(new BABYLON.Vector3(-370, 0, -50));

// Import and position "maple_tree2.glb" models
importAndPositionMapleTree(new BABYLON.Vector3(400, 0, -100));
importAndPositionMapleTree(new BABYLON.Vector3(400, 0, 0));
importAndPositionMapleTree(new BABYLON.Vector3(400, 0, 120));
importAndPositionMapleTree(new BABYLON.Vector3(400, 0, 220));
importAndPositionMapleTree(new BABYLON.Vector3(-370, 0, 160));

// Import and position the "wall1.glb" model
importAndPositionWall(new BABYLON.Vector3(100, 30, 120));

BABYLON.SceneLoader.ImportMesh(
  "",
  "/models/",
  "bow_and_arrow_a.glb",
  scene,
  function (meshes) {
    // meshes[0].isVisible = false;
    // meshes[1].isVisible = false;
    meshes[3].isVisible = false;
    var bow = meshes[0];

    const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
    const rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
    rotationGizmo.attachedMesh = meshes[0];

    rotationGizmo._rootMesh.getChildren().forEach((bow) => {
      if (bow.name.includes("y")) {
        console.log(1);
        bow.isVisible = false;
      }
    });

    bow.scaling = new BABYLON.Vector3(1, 1, 1); // Adjust scaling as needed
    bow.position = new BABYLON.Vector3(-10, 125, -400); // Set position
    bow.rotation = new BABYLON.Vector3(0, 0, 0); //et rotation
  }
);

// BABYLON.SceneLoader.ImportMesh(
//   "",
//   "/models/",
//   "bow_and_arrow_a.glb",
//   scene,
//   function (meshes) {
//     // meshes.addAllToScene();

//     var bow = meshes[1];
//     meshes[0].isVisible = false;
//     meshes[2].isVisible = false;
//     meshes[3].isVisible = false;
//     bow.scaling = new BABYLON.Vector3(1, 1, 1); // Adjust scaling as needed
//     bow.position = new BABYLON.Vector3(10, 125, -400); // Set position
//     bow.rotation = new BABYLON.Vector3(0, 0, 0); //et rotation
//   }
// );

// function stopSpecificAnimation(mesh, animationName) {
//   // Find the animation by name
//   const animation = mesh.animations.find(anim => anim.name === animationName);
//   if (animation) {
//     // Set the animation speed to 0 to stop it
//     animation.speedRatio = 0;
//   }
// }

let bowMesh = null;
let moveSpeed = 2;
BABYLON.SceneLoader.ImportMesh(
  "",
  "/models/",
  "bow_and_arrow_a.glb",
  scene,
  function (meshes) {
    bowMesh = meshes[3];
    meshes[0].isVisible = false;
    meshes[2].isVisible = false;
    meshes[1].isVisible = false;
    bowMesh.scaling = new BABYLON.Vector3(1, 1, 1); // Adjust scaling as needed
    bowMesh.position = new BABYLON.Vector3(17, 420, 127); // Set position
    bowMesh.rotation = new BABYLON.Vector3(0, 0, 0.1); //et rotation
  }
);

BABYLON.SceneLoader.ImportMesh(
  "",
  "/models/",
  "archery_target.glb",
  scene,
  function (meshes) {
    var archeryTarget = meshes[0];
    archeryTarget.position = new BABYLON.Vector3(-10, 100, 240); // Set position
    archeryTarget.scaling = new BABYLON.Vector3(11, 11, 11); // Adjust scaling as needed
  }
);

// Run the render loop
engine.runRenderLoop(function () {
  if (bowMesh) {
    bowMesh.position.y -= moveSpeed;
  }
  scene.render();
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
  engine.resize();
});
