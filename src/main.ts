import { camera, renderer, scene, stats, gui } from "./boilerplate/init";
import { moveObjectToMouse, onResize } from "./boilerplate/events";

import * as THREE from "three";
import "three/examples/jsm/libs/ammo.wasm.js";

import { OrbitControls, RenderPass, ShaderPass, EffectComposer, GammaCorrectionShader, GLTFLoader, HDRCubeTextureLoader } from "three/examples/jsm/Addons.js";

import { EdgeDetectionPass } from "./shaders/edgeDetection/EdgeDetectionPass";
import { AsciifyPass } from "./shaders/ascii/AsciifyPass";

import { generateToruses } from "./generators/torusKnots";
import { generateBoxes } from "./generators/boxes";

generateBoxes();

// GUI
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

const helper = new THREE.AxesHelper(2);
scene.add(helper);

// Lights
const LIGHTS = {
	HDRI: true,
};

const point = new THREE.PointLight(0xffffff, 10);
point.castShadow = true;
scene.add(point);

const lightMesh = new THREE.Mesh(
	new THREE.SphereGeometry(0.1),
	new THREE.MeshBasicMaterial({ color: 0xffffff })
);
point.add(lightMesh);

const lightFolder = gui.addFolder("Point Light");
lightFolder.add(LIGHTS, "HDRI").onChange((v) => scene.background = v ? scene.environment : null);
lightFolder.add(point.position, "x", -5, 5);
lightFolder.add(point.position, "y", -5, 5);
lightFolder.add(point.position, "z", -5, 5);

const genCubeUrls = function(prefix: string, postfix: string) {
	return [
		prefix + "px" + postfix, prefix + "nx" + postfix,
		prefix + "py" + postfix, prefix + "ny" + postfix,
		prefix + "pz" + postfix, prefix + "nz" + postfix
	];
};

const hdrUrls = genCubeUrls("https://raw.githubusercontent.com/takahirox/takahirox.github.io/master/three.js.mmdeditor/examples/textures/cube/pisaHDR/", ".hdr" );
new HDRCubeTextureLoader().load(hdrUrls, (hdrCubeMap) => {
	scene.background = hdrCubeMap;
	scene.environment = hdrCubeMap;
});


// Geometry
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({ color: 0xffffff })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.userData.physics = { mass: 0 };
scene.add(floor);

// Load model
// const loader = new GLTFLoader();
// loader.load("monke.glb", (gltf) => {
// 	const model = gltf.scene.children[0];
// 	model.castShadow = true;
// 	model.receiveShadow = true;

// 	model.position.set(0, 1, 0);
// 	model.scale.set(2, 2, 2);

// 	const material = new THREE.MeshNormalMaterial();
// 	model.traverse((child) => {
// 		if(child instanceof THREE.Mesh) {
// 			child.material = material;
// 		}
// 	});

// 	scene.add(gltf.scene);
// });

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const gammaCorrection = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrection);

composer.addPass(EdgeDetectionPass);
composer.addPass(AsciifyPass);


function mainLoop() {
	// renderer.render(scene, camera);
	composer.render();

	stats.update();
	gui.controllers.forEach((c) => c.updateDisplay());

	controls.update();

	requestAnimationFrame(mainLoop);
}
mainLoop();

window.addEventListener("resize", () => onResize(camera, renderer));
window.addEventListener("mousemove", (e) => moveObjectToMouse(e, point, camera, [floor]));