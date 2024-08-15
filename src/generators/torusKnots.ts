import * as THREE from "three";
import { scene, gui } from "../boilerplate/init";

const TORUS_KNOT_PARAMS = {
	QUANTITY: 10,
	RADIUS: 0.5,
	TUBE: 0.1,
	TUBULAR_SEGMENTS: 64,
	RADIAL_SEGMENTS: 12,
	P: 1,
	Q: 2
    
};

const toruses: THREE.Object3D[] = [];
export function generateToruses() {
	for(let i = 0; i < TORUS_KNOT_PARAMS.QUANTITY; i++) {
		const torus = new THREE.Mesh(
			new THREE.TorusKnotGeometry(
				TORUS_KNOT_PARAMS.RADIUS,
				TORUS_KNOT_PARAMS.TUBE,
				TORUS_KNOT_PARAMS.TUBULAR_SEGMENTS,
				TORUS_KNOT_PARAMS.RADIAL_SEGMENTS,
			),
			new THREE.MeshNormalMaterial()
		);
		const x = Math.random() * 8 - 4;
		const y = Math.random() * 3 + 1;
		const z = Math.random() * 8 - 4;

		torus.position.set(x, y, z);
		torus.rotation.set(
			Math.random() * Math.PI * 2, 
			Math.random() * Math.PI * 2, 
			Math.random() * Math.PI * 2
		);

		torus.castShadow = true;
		torus.receiveShadow = true;
		torus.userData.physics = { mass: 1 };
		scene.add(torus);
		toruses.push(torus);
	}
}
generateToruses();

const torusFolder = gui.addFolder("Toruses");
torusFolder.add(TORUS_KNOT_PARAMS, "QUANTITY", 0, 100, 1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "RADIUS", 0.1, 2, 0.1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "TUBE", 0.1, 2, 0.1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "TUBULAR_SEGMENTS", 3, 256, 1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "RADIAL_SEGMENTS", 3, 256, 1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "P", 1, 10, 1).onChange(() => regenerateToruses());
torusFolder.add(TORUS_KNOT_PARAMS, "Q", 1, 10, 1).onChange(() => regenerateToruses());

function regenerateToruses() {
	toruses.forEach((t) => scene.remove(t));
	toruses.length = 0;
	generateToruses();
}
