varying vec2 vUv;

void main() {
	vUv = uv;

	vec3 oPosition = position;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(oPosition, 1.0);
}