import * as THREE from "three";

import fragment from "./fragment.glsl?raw";
import vertex from "./vertex.glsl?raw";

import { ShaderPass } from "three/examples/jsm/Addons.js";
import { gui } from "../../boilerplate/init";

const uniformValues = {
	tDiffuse: null,
	enabled: true,
	bufferWidth: window.innerWidth,
	bufferHeight: window.innerHeight,
	radius1: 0,
	radius2: 5,
	thresholdEnabled: true,
	threshold: 0.002,
	color: "#000000",
};

function calculateUniforms() {
	return Object.keys(uniformValues)
		.reduce((acc, key) => {
			acc[key] = { value: uniformValues[key as keyof typeof uniformValues] };
			return acc;
		}, {} as Record<string, THREE.IUniform>);
}
const uniforms = calculateUniforms();

function modifyUniform<T>(shader: ShaderPass, key: keyof typeof uniformValues, value: T) {	
	uniformValues[key] = value as never;
	shader.uniforms[key].value = value;
}

export const EdgeDetectionPass = new ShaderPass({
	uniforms,
	vertexShader: vertex,
	fragmentShader: fragment,
});

const shaderFolder = gui.addFolder("Edge Detection");
shaderFolder.add(uniformValues, "enabled").onChange((v) => EdgeDetectionPass.enabled = v);
shaderFolder.add(uniformValues, "radius1", 0, 5, 0.01).onChange((v) => modifyUniform(EdgeDetectionPass, "radius1", v));
shaderFolder.add(uniformValues, "radius2", 0, 5, 0.01).onChange((v) => modifyUniform(EdgeDetectionPass, "radius2", v));
shaderFolder.add(uniformValues, "thresholdEnabled").onChange((v) => modifyUniform(EdgeDetectionPass, "thresholdEnabled", v));
shaderFolder.add(uniformValues, "threshold", 0, 0.5).onChange((v) => modifyUniform(EdgeDetectionPass, "threshold", v));
shaderFolder.addColor(uniformValues, "color").onChange((v) => modifyUniform(EdgeDetectionPass, "color", v));
