import * as BABYLON from "@babylonjs/core";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins/cannonJSPlugin"; 
import * as CANNON from '../node_modules/cannon/'; 

export function setupPhysics(scene) {
    const gravityVector1 = new BABYLON.Vector3(0, 0, 0); 
    scene.enablePhysics(gravityVector1, new CannonJSPlugin());
}
