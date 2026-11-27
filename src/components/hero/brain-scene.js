import {
    AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Group,
    LineSegments, PerspectiveCamera, Points, Scene, ShaderMaterial, Vector3,
    WebGLRenderer,
} from 'three';
import { createBrainGeometry, regionFor } from './brain-geometry';

// Particle/connection approach adapted from dhileepkumargm's SynapseBackground:
// https://21st.dev/@dhileepkumargm/components/synapse-background
// This scene uses a brain surface, curved folds, shader pulses and one shared
// page ticker. No independent animation loop or quadratic pair search.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
const VERTEX = `
    attribute float aSeed;
    attribute float aGroup;
    uniform float uTime;
    uniform float uAssembly;
    uniform float uActive;
    uniform float uOpacity;
    uniform float uDpr;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float angle = aGroup * 1.256637 + aSeed * 0.6;
        vec3 origin = vec3(cos(angle) * (2.4 + aSeed), sin(angle) * 2.0, sin(aSeed * 20.0) * 1.3);
        float built = smoothstep(aSeed * 0.24, 0.72 + aSeed * 0.28, uAssembly);
        vec3 p = mix(origin, position, built);
        p *= 1.0 + sin(uTime * 0.8 + aSeed * 8.0) * 0.006;
        float pulse = pow(max(0.0, sin(uTime * 1.35 + position.y * 4.0 + aSeed * 6.28)), 14.0);
        float selected = 1.0 - step(0.3, abs(aGroup - uActive));
        float muted = uActive < 0.0 ? 1.0 : mix(0.35, 1.0, selected);
        vColor = mix(vec3(0.43, 0.59, 1.0), vec3(1.0, 0.78, 0.40), aSeed * 0.72 + 0.20);
        vColor = mix(vColor, vec3(1.0, 0.93, 0.73), max(pulse * 0.75, selected * 0.6));
        vAlpha = (0.36 + pulse * 0.64 + selected * 0.4) * uOpacity * muted;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp((1.4 + aSeed * 2.0 + selected * 1.0) * uDpr * 8.0 / max(0.5, -mv.z), 1.0, 18.0);
        gl_Position = projectionMatrix * mv;
    }
`;
const POINT_FRAGMENT = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;
        float glow = exp(-r * r * 24.0) + exp(-r * r * 7.0) * 0.20;
        gl_FragColor = vec4(vColor, glow * vAlpha);
    }
`;
const LINE_FRAGMENT = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() { gl_FragColor = vec4(vColor, vAlpha * 0.42); }
`;

function attributes(geometry, points, seeds, groups) {
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
    geometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
    geometry.setAttribute('aGroup', new Float32BufferAttribute(groups, 1));
    return geometry;
}

export function createBrainScene(canvas, initialWidth, initialHeight) {
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setClearColor(new Color('#0d0d12'), 0);
    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.025, 80);
    const brain = new Group();
    scene.add(brain);
    const model = createBrainGeometry(initialWidth < 768 ? 2200 : 4000);
    const uniforms = { uTime: { value: 0 }, uAssembly: { value: 0 }, uActive: { value: -1 }, uOpacity: { value: 0 }, uDpr: { value: 1 } };
    const material = fragmentShader => new ShaderMaterial({
        uniforms, vertexShader: VERTEX, fragmentShader,
        transparent: true, blending: AdditiveBlending, depthWrite: false,
    });
    const points = new Points(attributes(new BufferGeometry(), model.points, model.seeds, model.groups), material(POINT_FRAGMENT));
    brain.add(points);
    const linePoints = [], lineSeeds = [], lineGroups = [];
    const addEdge = (a, b, seed) => {
        for (const p of [a, b]) { linePoints.push(...p); lineSeeds.push(seed); lineGroups.push(regionFor(p)); }
    };
    model.paths.forEach((path, j) => path.slice(1).forEach((p, i) => addEdge(path[i], p, (j * 0.618) % 1)));
    model.edges.forEach(([a, b], i) => addEdge(a, b, (i * 0.618) % 1));
    brain.add(new LineSegments(attributes(new BufferGeometry(), linePoints, lineSeeds, lineGroups), material(LINE_FRAGMENT)));

    // Depth continues beyond the cortex, so the camera enters a connected
    // interior instead of enlarging a flat illustration.
    const interiorUniforms = { ...uniforms, uAssembly: { value: 1 }, uOpacity: { value: 0 } };
    const interiorPoints = [], interiorSeeds = [], interiorGroups = [];
    for (let i = 0; i < 440; i++) {
        const a = i * 2.399963;
        const radius = 1.7 + ((i * 0.37) % 1) * 5;
        interiorPoints.push(Math.cos(a) * radius, Math.sin(a) * radius * 0.75, -2.5 - ((i * 0.73) % 1) * 17);
        interiorSeeds.push((i * 0.618) % 1); interiorGroups.push(i % 5);
    }
    const interior = new Group();
    const interiorMaterial = fragmentShader => new ShaderMaterial({ uniforms: interiorUniforms, vertexShader: VERTEX, fragmentShader, transparent: true, depthWrite: false, blending: AdditiveBlending });
    interior.add(new Points(attributes(new BufferGeometry(), interiorPoints, interiorSeeds, interiorGroups), interiorMaterial(POINT_FRAGMENT)));
    const interiorLines = [], interiorLineSeeds = [], interiorLineGroups = [];
    for (let i = 2; i < 440; i++) {
        if (i % 3) continue;
        for (const j of [i, i - 2]) {
            interiorLines.push(...interiorPoints.slice(j * 3, j * 3 + 3));
            interiorLineSeeds.push((i * 0.618) % 1); interiorLineGroups.push(i % 5);
        }
    }
    interior.add(new LineSegments(attributes(new BufferGeometry(), interiorLines, interiorLineSeeds, interiorLineGroups), interiorMaterial(LINE_FRAGMENT)));
    scene.add(interior);
    const anchorVectors = [
        new Vector3(-1.75, 0.66, 0.1), new Vector3(1.75, 0.66, 0.1),
        new Vector3(1.65, -0.85, 0.1), new Vector3(-1.65, -0.85, 0.1), new Vector3(0, 1.51, 0.1),
    ];
    const projected = anchorVectors.map(() => new Vector3());
    let width = 0, height = 0;
    const resize = (w, h) => {
        if (width === w && height === h) return;
        width = w; height = h;
        const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 1.8);
        uniforms.uDpr.value = dpr;
        renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize(initialWidth, initialHeight);
    return {
        render({ formation, journey, pointerX = 0, pointerY = 0, time, active = -1, w, h }, onAnchor) {
            resize(w, h);
            const mobile = w < 768;
            const dive = smooth(journey);
            uniforms.uTime.value = time;
            uniforms.uAssembly.value = formation;
            uniforms.uActive.value = active;
            uniforms.uOpacity.value = smooth(formation / 0.35) * (1 - smooth((journey - 0.62) / 0.3));
            interiorUniforms.uOpacity.value = smooth((journey - 0.25) / 0.5) * 0.55;
            camera.position.set(pointerX * 0.13 * (1 - dive), -pointerY * 0.08 * (1 - dive), (mobile ? 11.3 : 7.6) * (1 - dive) - 2.8 * dive);
            // A fixed forward camera passes through the central fissure.
            camera.rotation.set(0, 0, 0);
            brain.position.y = (mobile ? 1.22 : 0.82) * (1 - dive);
            brain.rotation.set((-0.08 + pointerY * 0.10) * (1 - dive), (0.07 + pointerX * 0.14 + Math.sin(time * 0.12) * 0.035) * (1 - dive), 0);
            interior.rotation.z = Math.sin(time * 0.025) * 0.025;
            scene.updateMatrixWorld(); camera.updateMatrixWorld();
            anchorVectors.forEach((p, i) => {
                projected[i].copy(p).applyMatrix4(brain.matrixWorld).project(camera);
                const margin = mobile ? 52 : 65;
                const x = Math.max(margin, Math.min(w - margin, (projected[i].x * 0.5 + 0.5) * w));
                const y = (-projected[i].y * 0.5 + 0.5) * h;
                if (Number.isFinite(x) && Number.isFinite(y)) onAnchor(i, x, y);
            });
            renderer.render(scene, camera);
        },
        dispose() {
            scene.traverse(object => {
                object.geometry?.dispose();
                if (object.material) object.material.dispose();
            });
            renderer.dispose();
        },
    };
}
