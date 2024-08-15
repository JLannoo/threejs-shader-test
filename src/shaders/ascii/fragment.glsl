uniform sampler2D tDiffuse;
uniform float bufferWidth;
uniform float bufferHeight;

uniform float pixelSize;
uniform float colorDepth;
uniform bool color;
uniform float brightnessCompensation;

uniform sampler2D asciiTexture;

varying vec2 vUv;

vec3 pixelate(vec2 texcoord, sampler2D buff) {
    vec2 pSize = vec2(1.0 / bufferWidth, 1.0 / bufferHeight) * pixelSize;
    vec2 uv = texcoord - fract(texcoord / pSize) * pSize;
    vec3 o = texture2D(buff, uv).xyz;
    return o;
}

vec3 toGrayscale(vec3 color) {
	float gray = dot(color, vec3(0.299, 0.587, 0.114));
	return vec3(gray);
}

vec3 posterize(vec3 color, float numColors) {
	float r = floor(color.r * numColors) / numColors;
	float g = floor(color.g * numColors) / numColors;
	float b = floor(color.b * numColors) / numColors;

	return vec3(r, g, b);
}

vec3 grayscaleToAsciiSample(vec3 color) {
    float asciiIndex = clamp(color.r * colorDepth - 1.0, 0.0, colorDepth - 1.0);

	vec2 pSize = vec2(1.0 / bufferWidth, 1.0 / bufferHeight) * pixelSize;
	vec2 dispFromPixelOrigin = mod(vUv, pSize) / pSize;

	vec2 asciiUV = vec2(float(asciiIndex) / colorDepth + dispFromPixelOrigin.x / colorDepth, dispFromPixelOrigin.y);
	vec3 asciiColor = texture2D(asciiTexture, asciiUV).xyz;

	return asciiColor;
}

void main() {
	// Pixelate
	vec3 inColor = pixelate(vUv, tDiffuse);

	vec3 outColor = inColor;
	outColor = toGrayscale(outColor) + brightnessCompensation;
	outColor = posterize(outColor.xyz, colorDepth);
	outColor = grayscaleToAsciiSample(outColor);

	if (color) {
		outColor = inColor * outColor;
	}

	gl_FragColor = vec4(outColor.xyz, 1.0);
}