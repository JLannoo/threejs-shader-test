import { Camera, Object3D, PerspectiveCamera, Raycaster, Renderer, Vector2 } from "three";

export function onResize(camera: PerspectiveCamera, renderer: Renderer) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export function moveObjectToMouse(event: MouseEvent, object: Object3D, camera: Camera, intersects: Object3D[]) {
	const raycaster = new Raycaster();
	const mouse = new Vector2(
		(event.clientX / window.innerWidth) * 2 - 1,
		-(event.clientY / window.innerHeight ) * 2 + 1
	);

	raycaster.setFromCamera(mouse, camera);

	const hits = raycaster.intersectObjects(intersects, true);

	if (hits.length > 0) {
		const point = hits[0].point;
		object.position.set(point.x, 3, point.z);
	}    
}
