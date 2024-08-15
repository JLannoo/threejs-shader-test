uniform sampler2D tDiffuse;
uniform float bufferWidth;
uniform float bufferHeight;

uniform float radius1;
uniform float radius2;
uniform bool thresholdEnabled;
uniform float threshold;
uniform vec3 color;

varying vec2 vUv;

vec4 gaussianSum(vec2 uv, float radius) {
	vec4 sum = vec4(0.0);
	float weightSum = 0.0;

	for (float x = -radius; x <= radius; x++) {
		for (float y = -radius; y <= radius; y++) {
			vec2 offset = vec2(x, y);
			vec4 color = texture2D(tDiffuse, uv + offset / vec2(bufferWidth, bufferHeight));
			float weight = 1.0 / (1.0 + x * x + y * y);
			sum += color * weight;
			weightSum += weight;
		}
	}

	return sum / weightSum;

}

void main() {
	vec3 inColor = texture2D(tDiffuse, vUv).xyz;

	vec3 outColor = inColor;

	vec4 sum1 = gaussianSum(vUv, radius1);
	vec4 sum2 = gaussianSum(vUv, radius2);

	outColor = (sum1 - sum2).xyz;

	if (thresholdEnabled) {
		if (length(outColor) > threshold) {
			outColor = vec3(1.0);
		} else {
			outColor = vec3(0.0);
		}
	}

	gl_FragColor = vec4(outColor, 1.0);
}