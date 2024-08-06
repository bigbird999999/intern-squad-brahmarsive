import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import 'cannon';
 
export async function setupScene(scene) {
 
    var fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();
 
    var archeryTarget = null;
    BABYLON.SceneLoader.ImportMesh(
        "",
        "/models/",
        "arc_target.glb",
        scene,
        function (meshes) {
            archeryTarget = meshes[0];
            archeryTarget.rotation = new BABYLON.Vector3(3.5, -0.5, 50);
            archeryTarget.position = new BABYLON.Vector3(-85, -75, -400);
            archeryTarget.scaling = new BABYLON.Vector3(3, 3, 3);
        }
    );
 
    function createScoreLabel(scene, text, position, rotation, depth, fontData) {
        const scoreLabel = BABYLON.MeshBuilder.CreateText("score_" + text, text, fontData, {
            size: 3,
            resolution: 64,
            depth: depth
        });
        scoreLabel.position = position;
        scoreLabel.rotation = rotation;
 
        return scoreLabel;
    }
 
    function createTube(scene, points) {
        const tube = BABYLON.MeshBuilder.CreateTube("tube", {
            path: points,
            radius: 0.2,
            updatable: false
        }, scene);
 
        const blackMaterial = new BABYLON.StandardMaterial("blackMaterial", scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // Black color
 
        tube.material = blackMaterial;
        tube.renderingGroupId = 1;
 
        return tube;
    }
 
    function createScoreLabelsAndTubes(scene, fontData) {
        const scores = [
            { text: "100", position: new BABYLON.Vector3(-70, -60, -400), rotation: new BABYLON.Vector3(0.5, -0.5, -0.1), depth: 2, tubePoints: [new BABYLON.Vector3(-85, -75, -400), new BABYLON.Vector3(-70, -60, -400)] },
            { text: "80", position: new BABYLON.Vector3(-66, -66, -400), rotation: new BABYLON.Vector3(0.5, -0.5, -0.1), depth: 2, tubePoints: [new BABYLON.Vector3(-82, -75, -400), new BABYLON.Vector3(-66, -66, -400)] },
            { text: "60", position: new BABYLON.Vector3(-65, -72, -400), rotation: new BABYLON.Vector3(0.5, -0.5, -0.1), depth: 3, tubePoints: [new BABYLON.Vector3(-79, -75, -400), new BABYLON.Vector3(-65, -72, -400)] },
            { text: "40", position: new BABYLON.Vector3(-66, -79, -400), rotation: new BABYLON.Vector3(0.5, -0.5, -0.1), depth: 3, tubePoints: [new BABYLON.Vector3(-78, -77, -400), new BABYLON.Vector3(-67, -78, -400)] },
            { text: "20", position: new BABYLON.Vector3(-69, -86, -400), rotation: new BABYLON.Vector3(0.5, -0.5, -0.1), depth: 3, tubePoints: [new BABYLON.Vector3(-78, -80, -400), new BABYLON.Vector3(-70, -84, -400)] }
        ];
 
        scores.forEach(score => {
            createScoreLabel(scene, score.text, score.position, score.rotation, score.depth, fontData);
            createTube(scene, score.tubePoints);
        });
    }
 
    createScoreLabelsAndTubes(scene, fontData);
   
}