import * as THREE from "three";

import fragment from "./fragment.glsl?raw";
import vertex from "./vertex.glsl?raw";

import { ShaderPass } from "three/examples/jsm/Addons.js";
import { gui } from "../../boilerplate/init";

const ASCII_MAP = [" ", "·", ":", "=", "#", "$", "%", "@"];
// const ASCII_MAP = [" ", "░", "░", "▒", "▒", "▓", "▓", "█"];
const asciiMapCanvas = document.createElement("canvas");
asciiMapCanvas.hidden = true;
asciiMapCanvas.style.position = "absolute";
asciiMapCanvas.style.top = "0";
asciiMapCanvas.style.left = "50%";
asciiMapCanvas.style.transform = "translateX(-50%)";
document.body.appendChild(asciiMapCanvas);
function generateASCIITexture() {
	asciiMapCanvas.id = "ascii-texture";
	asciiMapCanvas.width = uniformValues.pixelSize * ASCII_MAP.length;
	asciiMapCanvas.height = uniformValues.pixelSize;
	
	const ctx = asciiMapCanvas.getContext("2d");
	if(!ctx) throw new Error("Could not get 2D context");

	ctx.fillStyle = SHADER_CONFIG.backgroundColor;
	ctx.fillRect(0, 0, asciiMapCanvas.width, asciiMapCanvas.height);

	ctx.fillStyle = SHADER_CONFIG.foregroundColor;
	ctx.font = `${uniformValues.pixelSize}px monospace`;
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	ASCII_MAP.forEach((char, i) => {
		ctx.fillText(char, i * uniformValues.pixelSize + uniformValues.pixelSize / 2, 0);
	});

	const texture = new THREE.CanvasTexture(asciiMapCanvas);
	texture.needsUpdate = true;
	
	return texture;
}

const SHADER_CONFIG = {
	enabled: true,
	backgroundColor: "#000000",
	foregroundColor: "#FFFFFF",
};

const uniformValues = {
	// Not generated
	tDiffuse: null,
	bufferWidth: window.innerWidth,
	bufferHeight: window.innerHeight,

	// Generated
	asciiTexture: new THREE.CanvasTexture(document.createElement("canvas")),
	colorDepth: ASCII_MAP.length,
	
	// Controlled
	pixelSize: 10,
	color: false,
	brightnessCompensation: 0,
};

function calculateUniforms() {
	uniformValues.asciiTexture = generateASCIITexture();
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

export const AsciifyPass = new ShaderPass({
	uniforms,
	vertexShader: vertex,
	fragmentShader: fragment,
});

const shaderFolder = gui.addFolder("Asciify");
shaderFolder.add(SHADER_CONFIG, "enabled").onChange((v) => AsciifyPass.enabled = v);
shaderFolder.addColor(SHADER_CONFIG, "backgroundColor").onChange(() => modifyUniform(AsciifyPass, "asciiTexture", generateASCIITexture()));
shaderFolder.addColor(SHADER_CONFIG, "foregroundColor").onChange(() => modifyUniform(AsciifyPass, "asciiTexture", generateASCIITexture()));
shaderFolder.add(uniformValues, "pixelSize", 1, 20, 1).onChange((v) => {
	modifyUniform(AsciifyPass, "pixelSize", v);
	modifyUniform(AsciifyPass, "asciiTexture", generateASCIITexture());
});
shaderFolder.add(uniformValues, "color").onChange((v) => modifyUniform(AsciifyPass, "color", v));
shaderFolder.add(uniformValues, "brightnessCompensation", 0, 1, 0.01).onChange((v) => modifyUniform(AsciifyPass, "brightnessCompensation", v)).name("Brightness");
shaderFolder.add(asciiMapCanvas, "hidden").name("Hide ASCII Map");