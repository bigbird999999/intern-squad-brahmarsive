import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control, Button } from "@babylonjs/gui";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins/cannonJSPlugin"; 
import * as CANNON from 'cannon'; 

let arrowMesh = null, archeryTarget = null, posX = -10, posY = -75, posZ = -400,
 importedMesh = null, scopeMesh = null, cover, flag = 1, 
 bowDummyParent = null, score = 0, scoreText, targetText,
 chanceText, scoreValue, chanceValue = 3, targetValue = 250, 
 refreshButtonText, resultText, hitText, endGameFlag = 0;

export function setupBowAndArrow(scene, camera) {
    bowDummyParent = new BABYLON.TransformNode("bowDummyParent", scene);

    BABYLON.SceneLoader.ImportMesh('bow', './models/', 'bow_and_arrow.glb', scene, (meshes) => {
        importedMesh = meshes[0];
        importedMesh.parent = bowDummyParent;
        importedMesh.scaling = new BABYLON.Vector3(0.025, 0.025, 0.025);
        importedMesh.position = new BABYLON.Vector3(posX, posY, posZ);
        importedMesh.rotation = new BABYLON.Vector3(0.01, -1.8, 0);
    });

    const brownMaterial = new BABYLON.StandardMaterial("blackMaterial", scene);
    brownMaterial.diffuseColor = new BABYLON.Color3(0.561, 0.431, 0.341);

    BABYLON.SceneLoader.ImportMesh('', './models/', 'scoppe.glb', scene, (meshes) => {

        scopeMesh = meshes[0];
        console.log('Scope imported successfully');
        scopeMesh.scaling = new BABYLON.Vector3(.05, .05, .05);
        scopeMesh.parent = bowDummyParent;
        scopeMesh.position = new BABYLON.Vector3(posX + 8, posY + 60, posZ - 23);
        scopeMesh.rotation = new BABYLON.Vector3(0.06, -1.7, 4.8);
        scopeMesh.material = brownMaterial;
    });

    setupArcheryTarget(scene, camera);
    createArrowMesh(scene, camera);
    scoreBox(scene);

    var bowshot = new BABYLON.Sound("bow", "../audio/bow.wav", scene, null, {
        loop: false,
        autoplay: false,
    });

    var release = new BABYLON.Sound("Release", "../audio/Release.wav", scene, null, {
        loop: false,
        autoplay: false
    });

    var hit = new BABYLON.Sound("hit", "../audio/hit.wav", scene, null, {
        loop: false,
        autoplay: false
    });

    function setupArcheryTarget(scene) {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "/models/",
            "arc_target.glb",
            scene,
            function (meshes) {
                archeryTarget = meshes[0];
                // archeryTarget.position = new BABYLON.Vector3(-10, 130, 370);
                archeryTarget.position = new BABYLON.Vector3(posX, posY + 55, 370);
                archeryTarget.scaling = new BABYLON.Vector3(13, 13, 13);
            }

        );
    }

    scene.onPointerDown = function () {
        if (endGameFlag === 0) {
            arrowMesh.position.z = -20;
            bowshot.play();
        }
    }

    scene.onPointerUp = function () {
        if (endGameFlag === 0) {
            bowshot.pause();
            launchArrow();
        }
    }

    function launchArrow() {
        setTimeout(() => {
            camera.setPosition(new BABYLON.Vector3(-18.5, -14, -500));
        }, 1225);
        const forceDirection = new BABYLON.Vector3(0, 0, 600);

        cover.physicsImpostor.applyForce(forceDirection.scale(50), cover.getAbsolutePosition());
        release.play();
        flag = 0;

        scene.onAfterPhysicsObservable.add(() => {
            if (cover.position.z > 360) {

                let x = cover.getAbsolutePosition().x;
                let y = cover.getAbsolutePosition().y;
                let position = cover.getAbsolutePosition();
                if (flag === 0) {
                    chanceValue--;
                    chanceText.text = "Chances : " + chanceValue;
                    if ((x > -18 && x < -2) && (y < -22 && y > -38)) {
                        scoreValue = 100;
                        score += scoreValue;
                        hitText = "Perfect !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    else if ((x > -29 && x < 9) && (y < -11 && y > -49)) {
                        scoreValue = 80;
                        score += scoreValue;
                        hitText = "Very Good !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    else if ((x > -34 && x < 14) && (y < -6 && y > -54)) {
                        scoreValue = 60;
                        score += scoreValue;
                        hitText = "Good !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    else if ((x > -39 && x < 19) && (y < -1 && y > -59)) {
                        scoreValue = 40;
                        score += scoreValue;
                        hitText = "Better !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    else if ((x > -55 && x < 45) && (y < 15 && y > -75)) {
                        console.log("5 - whiteeyyyy");
                        scoreValue = 20;
                        score += scoreValue;
                        hitText = "Not Bad !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    else {
                        scoreValue = 0;
                        hitText = "Missed !";
                        displayAnimatedScore(position, scoreValue, hitText, scene);
                    }
                    updateScore(score);
                    // if (score >= targetValue) {
                    //     resultText = "You won!";
                    //     refreshButtonText = "Play Again";
                    //     displayWinMessage(position, scene); // Call the win message function
                    //     displayWinPopup(position, scene);
                    //     endGameFlag = 1;
                    // } else if (chanceValue === 0) {
                    //     resultText = "You Lose!";
                    //     refreshButtonText = "Retry";
                    //     displayWinMessage(position, scene); // Call the win message function
                    //     displayWinPopup(position, scene);
                    //     endGameFlag = 1;
                    // }
                }

                cover.physicsImpostor.mass = 0;
                scene.removeMesh(cover);
                cover.physicsImpostor.dispose();
                if (flag === 0) {
                    createArrowMesh(scene, camera);
                    flag = 1;
                    hit.play();
                }
            }
        });
    };
}

function scoreBox(scene) {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    const scoreBoxBlurBackground = new Rectangle();
    scoreBoxBlurBackground.width = "150px";
    scoreBoxBlurBackground.height = "120px";
    scoreBoxBlurBackground.cornerRadius = 0;
    scoreBoxBlurBackground.color = "black"; 
    scoreBoxBlurBackground.alpha = 0.5; 
    scoreBoxBlurBackground.thickness = 100; 
    scoreBoxBlurBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreBoxBlurBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreBoxBlurBackground.left = "10px"; 
    scoreBoxBlurBackground.top = "10px";

    advancedTexture.addControl(scoreBoxBlurBackground);

    const scoreBoxBackground = new Rectangle();
    scoreBoxBackground.width = "150px";
    scoreBoxBackground.height = "120px";
    scoreBoxBackground.cornerRadius = 0;
    scoreBoxBackground.color = "white";
    scoreBoxBackground.alpha = 1; 
    scoreBoxBackground.thickness = 1; 
    scoreBoxBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreBoxBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreBoxBackground.left = "10px"; 
    scoreBoxBackground.top = "10px"; 

    advancedTexture.addControl(scoreBoxBackground);

    scoreText = new TextBlock();
    scoreText.text = "Score : " + score; 
    scoreText.color = "white";
    scoreText.fontSize = 22;
    scoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreText.top = "-275px"; 
    scoreText.left = "-595px"; 

    targetText = new TextBlock();
    targetText.text = "Target : " + targetValue; 
    targetText.color = "white";
    targetText.fontSize = 22; 
    
    targetText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    targetText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    targetText.top = "-245px"; 
    targetText.left = "-595px"; 

    chanceText = new TextBlock();
    chanceText.text = "Chances : -"; 
    chanceText.color = "white";
    chanceText.fontSize = 22; 
    
    chanceText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    chanceText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    chanceText.top = "-215px"; 
    chanceText.left = "-595px";

    advancedTexture.addControl(scoreText);
    advancedTexture.addControl(targetText);
    advancedTexture.addControl(chanceText);

}

function updateScore(newScore) {
    scoreText.text = "Score : " + newScore;
}

async function createArrowMesh(scene, camera) {

    const arrowParent = new BABYLON.TransformNode("arrowParent", scene);
    bowDummyParent.parent = arrowParent;

    BABYLON.SceneLoader.ImportMesh('', './models/', 'arrow.glb', scene, function (meshes) {
        arrowMesh = meshes[0];
        arrowMesh.scaling = new BABYLON.Vector3(70, 70, 70);
        arrowMesh.position = new BABYLON.Vector3(-10, -30, -380);
        arrowMesh.rotation = new BABYLON.Vector3(0, 11, 0);
        arrowMesh.parent = arrowParent;

        cover = new BABYLON.MeshBuilder.CreateBox("cover", { size: 300 }, scene);
        cover.position = new BABYLON.Vector3(-10, -30, -380);
        cover.visibility = 0;
        cover.physicsImpostor = new BABYLON.PhysicsImpostor(cover, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
        cover.parent = arrowParent;

        const rotationBehaviorY = new BABYLON.PointerDragBehavior({
            dragAxis: new BABYLON.Vector3(0, 1, 0)
        });
        arrowParent.addBehavior(rotationBehaviorY);

        const rotationBehaviorX = new BABYLON.PointerDragBehavior({
            dragAxis: new BABYLON.Vector3(1, 0, 0)
        });
        arrowParent.addBehavior(rotationBehaviorX);

        rotationBehaviorX.onDragObservable.add(() => {
            camera.setPosition(new BABYLON.Vector3(arrowParent.position.x - 18.5, arrowParent.position.y - 14, -500));
        });

        rotationBehaviorY.onDragObservable.add(() => {
            camera.setPosition(new BABYLON.Vector3(arrowParent.position.x - 18.5, arrowParent.position.y - 14, -500));
        });

        arrowMesh.setParent(cover);
    });

}

function displayAnimatedScore(position, scoreValue, hitText, scene) {
    const animatedScoreText = new TextBlock();
    animatedScoreText.text = "+" + scoreValue; 
    animatedScoreText.color = getRandomColor(); 
    animatedScoreText.fontSize = 32; 
    animatedScoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    animatedScoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    // animatedScoreText.left = position.x;
    // animatedScoreText.top = position.y-150; 
    animatedScoreText.alpha = 1; 

    const animatedText = new TextBlock();
    animatedText.text = hitText; 
    animatedText.color = getRandomColor(); 
    animatedText.fontSize = 32; 
    animatedText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    animatedText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    // animatedText.left = position.x;
    animatedText.top = -100; 
    animatedText.alpha = 1; 

    const animatedTexture = AdvancedDynamicTexture.CreateFullscreenUI("AnimatedUI", true, scene);
    animatedTexture.addControl(animatedScoreText);
    animatedTexture.addControl(animatedText);

    if (!animatedScoreText.animations) {
        animatedScoreText.animations = []; 
        animatedText.animations = []; 
    }

    const animationDuration = 1000; 

    const moveAnimation = new BABYLON.Animation("moveAnimation", "top", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({ frame: 0, value: animatedScoreText.top });
    keyFrames.push({ frame: animationDuration / 30, value: animatedScoreText.top + 50 }); 
    moveAnimation.setKeys(keyFrames);

    const fadeAnimation = new BABYLON.Animation("fadeAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const fadeKeyFrames = [];
    fadeKeyFrames.push({ frame: 0, value: 1 });
    fadeKeyFrames.push({ frame: animationDuration / 30, value: 0 });
    fadeAnimation.setKeys(fadeKeyFrames);

    animatedScoreText.animations.push(moveAnimation);
    animatedText.animations.push(moveAnimation);
    animatedText.animations.push(fadeAnimation);
    animatedScoreText.animations.push(fadeAnimation);

    scene.beginAnimation(animatedScoreText, 0, animationDuration / 30, false, 1, () => {
        animatedTexture.removeControl(animatedScoreText);
        animatedTexture.removeControl(animatedText);
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function displayWinMessage(position, scene) {
    const animatedWinText = new TextBlock();
    animatedWinText.text = resultText; 
    animatedWinText.color = "gold"; 
    animatedWinText.fontSize = 42; 
    animatedWinText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    animatedWinText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    animatedWinText.left = position.x;
    animatedWinText.top = position.y - 250;
    animatedWinText.alpha = 1; 

    const animatedTexture = AdvancedDynamicTexture.CreateFullscreenUI("AnimatedUI", true, scene);
    animatedTexture.addControl(animatedWinText);

    if (!animatedWinText.animations) {
        animatedWinText.animations = []; 
    }

    const animationDuration = 3000; 

    const moveAnimation = new BABYLON.Animation("moveAnimation", "top", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({ frame: 0, value: animatedWinText.top });
    keyFrames.push({ frame: animationDuration / 30, value: animatedWinText.top + 50 });
    moveAnimation.setKeys(keyFrames);

    const fadeAnimation = new BABYLON.Animation("fadeAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const fadeKeyFrames = [];
    fadeKeyFrames.push({ frame: 0, value: 1 });
    fadeKeyFrames.push({ frame: animationDuration / 30, value: 0 });
    fadeAnimation.setKeys(fadeKeyFrames);

    animatedWinText.animations.push(moveAnimation);
    animatedWinText.animations.push(fadeAnimation);

    scene.beginAnimation(animatedWinText, 0, animationDuration / 30, false, 1, () => {
        animatedTexture.removeControl(animatedWinText);
    });
}

function displayWinPopup(position, scene) {
    const popupBackground = new Rectangle();
    popupBackground.width = "300px";
    popupBackground.height = "200px";
    popupBackground.color = "black";
    popupBackground.alpha = 1; 
    popupBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    popupBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    popupBackground.thickness = 4;

    const popupBackgroundBlur = new Rectangle();
    popupBackgroundBlur.width = "300px";
    popupBackgroundBlur.height = "200px";
    popupBackgroundBlur.color = "black";
    popupBackgroundBlur.alpha = 0.5;
    popupBackgroundBlur.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    popupBackgroundBlur.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    popupBackgroundBlur.thickness = 100;

    const winMessage = new TextBlock();
    winMessage.text = resultText;
    winMessage.color = "white"; 
    winMessage.fontSize = 42; 
    winMessage.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    winMessage.top = "-20px";

    const refreshButton = Button.CreateSimpleButton("refreshButton", refreshButtonText);
    refreshButton.width = "150px";
    refreshButton.height = "40px";
    refreshButton.color = "white";
    refreshButton.cornerRadius = 20;
    refreshButton.background = "green";
    refreshButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    refreshButton.top = "-10px";

    refreshButton.onPointerUpObservable.add(() => {
        window.location.reload(); 
    });

    const popupTexture = AdvancedDynamicTexture.CreateFullscreenUI("PopupUI", true, scene);
    popupTexture.addControl(popupBackgroundBlur); 
    popupTexture.addControl(popupBackground); 
    popupBackground.addControl(winMessage); 
    popupBackground.addControl(refreshButton); 


    if (!popupBackground.animations) {
        popupBackground.animations = [];
    }

    popupBackground.alpha = 0; 
    const popupAnimation = new BABYLON.Animation("popupAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const popupKeyFrames = [
        { frame: 0, value: 0 },
        { frame: 30, value: 1 }
    ];
    popupAnimation.setKeys(popupKeyFrames);


    popupBackground.animations.push(popupAnimation);
    scene.beginAnimation(popupBackground, 0, 30, false, 1);
}
