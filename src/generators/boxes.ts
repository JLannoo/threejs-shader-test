import * as THREE from "three";
import { scene, gui } from "../boilerplate/init";

const BOX_PARAMS = {
	QUANTITY: 10,
	SIZE: 0.5
};

export let boxes: THREE.Object3D[] = [];
export function generateBoxes() {
	for(let i = 0; i < BOX_PARAMS.QUANTITY; i++) {
		const randX = Math.random() * 8 - 4;
		const randY = Math.random() * 3 + 1;
		const randZ = Math.random() * 8 - 4;
	
		const randColor = Math.random() * 0xffffff;
		const box = new THREE.Mesh(
			new THREE.BoxGeometry(BOX_PARAMS.SIZE, BOX_PARAMS.SIZE, BOX_PARAMS.SIZE),
			new THREE.MeshStandardMaterial({ color: randColor })
		);
	
		box.position.set(randX, randY, randZ);
		box.castShadow = true;
		box.receiveShadow = true;
		box.userData.physics = { mass: 1 };
		scene.add(box);
		boxes.push(box);
	}
}
generateBoxes();
	
const boxesFolder = gui.addFolder("Boxes");
boxesFolder.add(BOX_PARAMS, "QUANTITY", 0, 100, 1)
	.onChange(() => {
		boxes.forEach((b) => scene.remove(b));
		boxes = [];
		generateBoxes();
	});
boxesFolder.add(BOX_PARAMS, "SIZE", 0.1, 2, 0.1)
	.onChange(() => {
		boxes.forEach((b) => {
			b.scale.set(BOX_PARAMS.SIZE, BOX_PARAMS.SIZE, BOX_PARAMS.SIZE);
		});
	});