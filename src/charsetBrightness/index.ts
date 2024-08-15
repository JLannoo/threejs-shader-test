// THIS SCRIPT CALCULATES THE BRIGHTNESS OF EACH CHARACTER IN A CHARSET
// THIS IS SPECIFIC FOR A GIVEN FONT, SIZE AND CHARSET
// AND OUTPUTS THE RESULTS IN A TABLE

import * as THREE from "three";

type Config = {
    charset: string;
    fontSize: number;
    fontFamily: string;
    canvasColumns: number;
};

const CONFIG: Config = {
	charset: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
	fontSize: 10,
	fontFamily: "monospace",
    
	canvasColumns: 10,
};

function generateCharset(config: Config, canvas?: HTMLCanvasElement) {
	if(!canvas) {
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}

	canvas.width = config.canvasColumns * config.fontSize;
	canvas.height = Math.ceil(config.charset.length / config.canvasColumns) * config.fontSize;

	const ctx = canvas.getContext("2d");
	if(!ctx) throw new Error("Could not get 2D context");   

	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#FFF";
	ctx.font = `${config.fontSize}px ${config.fontFamily}`;
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	config.charset.split("").forEach((char, i) => {
		const x = i % config.canvasColumns;
		const y = Math.floor(i / config.canvasColumns);
		ctx.fillText(char, x * config.fontSize + config.fontSize / 2, y * config.fontSize);
	});

	return canvas;
}

function generateBrightnessMap(config: Config, canvas?: HTMLCanvasElement) {
	canvas = generateCharset(config, canvas);

	const ctx = canvas.getContext("2d");
	if(!ctx) throw new Error("Could not get 2D context");
    
	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
    
	const chars: Record<string, number> = {};
	for(let i = 0; i < config.charset.length; i++) {
		const char = config.charset[i];
		const x = i % config.canvasColumns;
		const y = Math.floor(i / config.canvasColumns);
    
		let pixelLightness = 0;
		for(let x2 = 0; x2 < config.fontSize; x2++) {
			for(let y2 = 0; y2 < config.fontSize; y2++) {
				const data = ctx.getImageData(x * config.fontSize + x2, y * config.fontSize + y2, 1, 1).data;
				const lightness = (data[0] + data[1] + data[2]) / 3;

				pixelLightness += lightness;
			}
		}

		pixelLightness /= config.fontSize * config.fontSize;
		chars[char] = pixelLightness;
	}

	return chars;
}

export function generateCharsetTexture(config: Config) {
	const canvas = generateCharset({...config, canvasColumns: config.charset.length});
	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
	return texture;
}

console.table(generateBrightnessMap({ ...CONFIG, fontSize: 32 }));
console.table(generateBrightnessMap(CONFIG));