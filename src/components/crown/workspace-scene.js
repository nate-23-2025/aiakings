import {
    AdditiveBlending, AmbientLight, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3,
    CircleGeometry, Color, CustomBlending, CylinderGeometry, DirectionalLight, DoubleSide, EdgesGeometry,
    Float32BufferAttribute, FogExp2, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial,
    MeshStandardMaterial, OctahedronGeometry, OneMinusSrcAlphaFactor, PerspectiveCamera, PlaneGeometry,
    PointLight, Points, PointsMaterial, Scene, SphereGeometry, TorusGeometry, TubeGeometry, Vector3,
    WebGLRenderer, ZeroFactor,
} from 'three';

// Local, low-poly scene: no remote model, environment map, or canvas text.
// Every readable label is accessible HTML placed over points this scene projects.
// Three stations on a glass floor are the work areas. Each area's documents hang
// in front of the camera, tied to the core by threads, so they stay readable.
const ANGLES = [2.65, .36, -1.32];
const STATIONS = ANGLES.map((a, i) => new Vector3(Math.cos(a) * 2.35, .15 + i * .08, Math.sin(a) * 1.45));
// The world rotation that brings each station to the front of the camera.
const FOCUS_ANGLES = STATIONS.map(p => Math.atan2(-p.x, p.z));
const FLOOR = -.72;
// One camera shot per area: client work low and close, working with Ken wide
// enough to show the linked stations, research from above.
const SHOTS = [
    { height: 2.5, distance: 7.5, look: .2 },
    { height: 4.4, distance: 10.4, look: 0 },
    { height: 7.6, distance: 5.4, look: -.2 },
];
// Documents in view terms: x and y from -1 to 1 across the view, then depth.
const DOCS = {
    wide: [[-.46, .46, 8], [0, .7, 8.8], [.46, .46, 8]],
    compact: [[-.6, .38, 8], [0, .78, 8.8], [.6, .38, 8]],
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = n => n * n * (3 - 2 * n);

function radialTexture(stops) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const g = canvas.getContext('2d');
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([at, color]) => gradient.addColorStop(at, color));
    g.fillStyle = gradient; g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
}

export function createWorkspaceScene(canvas, width, height) {
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor('#0d0d12', 0);
    renderer.autoClear = false;
    const scene = new Scene();
    scene.fog = new FogExp2('#0d0d12', .045);
    const camera = new PerspectiveCamera(38, width / height, .1, 60);
    const world = new Group(); scene.add(world);
    scene.add(new AmbientLight('#b7c7f3', 1.15));
    const key = new DirectionalLight('#fff1ca', 3.2); key.position.set(-3, 5, 4); scene.add(key);
    const rim = new PointLight('#5b7bd5', 35, 18); rim.position.set(3, 2, -3); scene.add(rim);
    const warm = new PointLight('#d9b95e', 11, 10); warm.position.set(-2, 1, 3); scene.add(warm);

    const softDot = radialTexture([[0, 'rgba(255,255,255,1)'], [.3, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);
    const metal = new MeshStandardMaterial({ color: '#202a3b', metalness: .72, roughness: .32 });
    const glass = new MeshStandardMaterial({ color: '#7891bd', metalness: .42, roughness: .26, transparent: true, opacity: .35 });
    const gold = new MeshStandardMaterial({ color: '#d9bf79', metalness: .8, roughness: .25 });
    const blueLine = new LineBasicMaterial({ color: '#7b9aca', transparent: true, opacity: .27 });
    const edge = (mesh, material = blueLine) => mesh.add(new LineSegments(new EdgesGeometry(mesh.geometry), material));

    // The base: a plinth and its floor rings.
    const plinth = new Mesh(new CylinderGeometry(1.18, 1.24, .16, 80), metal); plinth.position.y = -.63; world.add(plinth); edge(plinth);
    const inset = new Mesh(new CylinderGeometry(1.04, 1.04, .025, 80), glass); inset.position.y = -.53; world.add(inset);
    for (let i = 0; i < 4; i++) {
        const ring = new Mesh(new TorusGeometry(1.36 + i * .46, .006, 5, 100), new MeshBasicMaterial({ color: i % 2 ? '#8ea5ee' : '#d3b76d', transparent: true, opacity: .14 + (i === 0 ? .2 : 0) }));
        ring.rotation.x = Math.PI / 2; ring.position.y = -.67 - i * .006; world.add(ring);
    }
    // The core is the brain: four glass memory layers under a gold crown that
    // carries five nodes, one per service from the hero. It starts loose and comes
    // together as the visitor scrolls. The layers fill from the bottom as they
    // progress, and each step they reach is filed in as a band of light that rises
    // through the layers into the crown.
    const core = new Group(); world.add(core);
    const edgeBlue = new Color('#7b9aca'), edgeGold = new Color('#ecd08a');
    const layers = [0, 1, 2, 3].map(() => {
        const material = new MeshStandardMaterial({ color: '#7891bd', metalness: .42, roughness: .22, transparent: true, opacity: .28, emissive: '#d9b95e', emissiveIntensity: 0 });
        const layer = new Mesh(new BoxGeometry(.95, .075, .95), material);
        const lines = new LineBasicMaterial({ color: '#7b9aca', transparent: true, opacity: .3 });
        edge(layer, lines); core.add(layer);
        return { layer, material, lines };
    });
    const crown = new Group(); core.add(crown);
    const crownMaterial = new MeshStandardMaterial({ color: '#cfae5c', metalness: .9, roughness: .24, emissive: '#d9b95e', emissiveIntensity: .06 });
    const plate = new Mesh(new BoxGeometry(.9, .05, .9), crownMaterial); crown.add(plate);
    const crownLines = new LineBasicMaterial({ color: '#f3dc9a', transparent: true, opacity: .5 }); edge(plate, crownLines);
    // A dark inlay inside a gold frame, with the five service nodes around a center.
    const inlay = new Mesh(new BoxGeometry(.7, .052, .7), new MeshStandardMaterial({ color: '#131722', metalness: .6, roughness: .32 })); inlay.position.y = .004; crown.add(inlay);
    const nodeMaterial = new MeshBasicMaterial({ color: '#f1d68f', transparent: true, opacity: .4 });
    const crownRing = new Mesh(new TorusGeometry(.21, .0035, 4, 64), new MeshBasicMaterial({ color: '#d9bf79', transparent: true, opacity: .3 }));
    crownRing.rotation.x = Math.PI / 2; crownRing.position.y = .036; crown.add(crownRing);
    const spokes = [];
    for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2, node = new Mesh(new SphereGeometry(.024, 10, 8), nodeMaterial);
        node.position.set(Math.cos(a) * .21, .042, Math.sin(a) * .21); crown.add(node);
        spokes.push(0, .04, 0, node.position.x, .04, node.position.z);
    }
    const spokeGeometry = new BufferGeometry(); spokeGeometry.setAttribute('position', new Float32BufferAttribute(spokes, 3));
    const spokeLines = new LineSegments(spokeGeometry, new LineBasicMaterial({ color: '#d9bf79', transparent: true, opacity: .25 })); crown.add(spokeLines);
    const heart = new Mesh(new SphereGeometry(.04, 16, 12), new MeshBasicMaterial({ color: '#fff0c2', transparent: true, opacity: .6 })); heart.position.y = .05; crown.add(heart);
    const halo = new Mesh(new TorusGeometry(.61, .009, 6, 80), new MeshBasicMaterial({ color: '#e6ce8a', transparent: true, opacity: .55 }));
    halo.rotation.x = Math.PI / 2; core.add(halo);

    // A distinct object on each station: folders, two linked nodes, a lens over sources.
    const objectMaterials = STATIONS.map(() => new MeshStandardMaterial({ color: '#7a90c0', metalness: .58, roughness: .36, transparent: true, opacity: .5, emissive: '#d9b95e', emissiveIntensity: 0 }));
    const beadMaterial = new MeshBasicMaterial({ color: '#efce82' });
    const makers = [
        material => {
            const group = new Group(), sheets = [];
            for (let k = 0; k < 3; k++) {
                const sheet = new Mesh(new BoxGeometry(.5, .04, .36), material);
                sheet.position.y = -.17 + k * .075; sheet.rotation.y = (k - 1) * .16; group.add(sheet); edge(sheet); sheets.push(sheet);
            }
            const tab = new Mesh(new BoxGeometry(.15, .04, .05), material); tab.position.set(-.13, 0, -.2); sheets[2].add(tab);
            return { group, animate: t => { sheets[2].position.y = -.02 + Math.sin(t * 1.1) * .015; sheets[2].rotation.y = .16 + Math.sin(t * .5) * .05; } };
        },
        material => {
            const group = new Group();
            const nodes = [-.2, .2].map(x => {
                const node = new Mesh(new OctahedronGeometry(.1, 0), material); node.position.set(x, .02, 0); group.add(node); edge(node);
                const post = new Mesh(new CylinderGeometry(.012, .012, .22, 6), metal); post.position.set(x, -.12, 0); group.add(post);
                return node;
            });
            const curve = new CatmullRomCurve3([new Vector3(-.2, .06, 0), new Vector3(0, .3, 0), new Vector3(.2, .06, 0)]);
            group.add(new Mesh(new TubeGeometry(curve, 20, .009, 5, false), gold));
            const bead = new Mesh(new SphereGeometry(.028, 8, 6), beadMaterial); group.add(bead);
            return { group, animate: t => { bead.position.copy(curve.getPoint((Math.sin(t * 1.1) + 1) / 2)); nodes.forEach((node, i) => { node.rotation.y = t * .6 + i; }); } };
        },
        material => {
            const group = new Group();
            for (let k = 0; k < 6; k++) {
                const source = new Mesh(new BoxGeometry(.07, .07, .07), material);
                const a = k * 1.05; source.position.set(Math.cos(a) * .16, -.19 + (k % 2) * .05, Math.sin(a) * .16); source.rotation.set(k, k * 2, 0); group.add(source);
            }
            const lens = new Group(); lens.position.y = .14; lens.rotation.x = -.5; group.add(lens);
            lens.add(new Mesh(new TorusGeometry(.17, .014, 8, 48), gold));
            lens.add(new Mesh(new CircleGeometry(.16, 40), new MeshStandardMaterial({ color: '#b7c9f2', metalness: .2, roughness: .05, transparent: true, opacity: .22, side: DoubleSide })));
            const handle = new Mesh(new CylinderGeometry(.012, .012, .16, 6), gold); handle.position.set(.19, -.11, 0); handle.rotation.z = .8; lens.add(handle);
            return { group, animate: t => { lens.position.y = .14 + Math.sin(t * .9) * .03; lens.rotation.y = Math.sin(t * .4) * .6; } };
        },
    ];

    const glowTexture = radialTexture([[0, 'rgba(255,255,255,.9)'], [.4, 'rgba(255,255,255,.3)'], [1, 'rgba(255,255,255,0)']]);
    // Objects that belong above the floor only: skipped in the mirrored pass.
    const unmirrored = [];
    const stations = STATIONS.map((point, i) => {
        const station = new Group(); station.position.copy(point);
        const pad = new Mesh(new CylinderGeometry(.34, .4, .06, 36), metal); pad.position.y = -.27; station.add(pad); edge(pad);
        const marker = new Mesh(new TorusGeometry(.3, .009, 5, 40), glass); marker.rotation.x = Math.PI / 2; marker.position.y = -.22; station.add(marker);
        const object = makers[i](objectMaterials[i]); station.add(object.group);
        const glow = new Mesh(new CircleGeometry(.85, 32), new MeshBasicMaterial({ map: glowTexture, color: '#d9b95e', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
        glow.rotation.x = -Math.PI / 2; glow.position.y = FLOOR - point.y + .006; station.add(glow); unmirrored.push(glow);
        world.add(station);
        return { station, marker, object, glow };
    });
    const curves = STATIONS.map(p => new CatmullRomCurve3([new Vector3(0, -.35, 0), new Vector3(p.x * .6, -.45, p.z * .3), p.clone().add(new Vector3(0, -.25, 0))]));
    const tubes = curves.map(curve => { const mesh = new Mesh(new TubeGeometry(curve, 28, .008, 4, false), new MeshBasicMaterial({ color: '#829bcc', transparent: true, opacity: .26 })); world.add(mesh); return mesh; });
    const sparks = curves.map(curve => { const mesh = new Mesh(new SphereGeometry(.035, 7, 5), new MeshBasicMaterial({ color: '#efce82', transparent: true })); world.add(mesh); return { mesh, curve }; });
    // A warm light that travels to whichever station is in front.
    const stationLight = new PointLight('#e8c97a', 0, 3); world.add(stationLight);

    // Threads from the halo up to each floating document, with a bead running along each.
    const threads = [0, 1, 2].map(() => {
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(6), 3));
        const line = new LineSegments(geometry, new LineBasicMaterial({ color: '#d9bf79', transparent: true, opacity: .2 }));
        const bead = new Mesh(new SphereGeometry(.028, 8, 6), new MeshBasicMaterial({ color: '#efce82', transparent: true, opacity: .8 }));
        scene.add(line, bead); unmirrored.push(line, bead);
        return { line, bead };
    });

    // Far dust behind the scene, and soft specks of light near the camera. The near
    // specks move faster than everything else, which is what reads as depth.
    const dustGeometry = new BufferGeometry(), dustPoints = [];
    for (let i = 0; i < 110; i++) dustPoints.push(Math.sin(i * 16.31) * 5.5, Math.cos(i * 3.31) * 3, -1 - ((i * .73) % 1) * 5.5);
    dustGeometry.setAttribute('position', new Float32BufferAttribute(dustPoints, 3));
    const dust = new Points(dustGeometry, new PointsMaterial({ size: .016, color: '#b1bfdf', transparent: true, opacity: .36, depthWrite: false }));
    scene.add(dust); unmirrored.push(dust);
    const NEAR = 44, nearPoints = [], nearColors = [];
    for (let i = 0; i < NEAR; i++) {
        nearPoints.push(Math.sin(i * 12.9898) * 4.6, .8 + ((i * .618) % 1) * 7, 2.2 + ((i * .371) % 1) * 7);
        const warmSpeck = i % 3 !== 0;
        nearColors.push(warmSpeck ? .85 : .56, warmSpeck ? .76 : .65, warmSpeck ? .55 : .93);
    }
    const nearGeometry = new BufferGeometry();
    nearGeometry.setAttribute('position', new Float32BufferAttribute(nearPoints, 3));
    nearGeometry.setAttribute('color', new Float32BufferAttribute(nearColors, 3));
    const near = new Points(nearGeometry, new PointsMaterial({ size: .13, map: softDot, vertexColors: true, transparent: true, opacity: .26, depthWrite: false, blending: AdditiveBlending, fog: false }));
    scene.add(near); unmirrored.push(near);

    // Glass floor: the world is drawn once mirrored below the floor, then dimmed
    // by a plane that keeps less of the reflection the farther it is from the core.
    const dimScene = new Scene();
    const dimMap = radialTexture([[0, 'rgb(190,190,190)'], [.2, 'rgb(200,200,200)'], [.45, 'rgb(234,234,234)'], [.62, 'rgb(255,255,255)']]);
    const dimPlane = new Mesh(new PlaneGeometry(14, 14), new MeshBasicMaterial({
        color: '#000000', alphaMap: dimMap, transparent: true, depthTest: false, depthWrite: false,
        blending: CustomBlending, blendSrc: ZeroFactor, blendDst: OneMinusSrcAlphaFactor, blendSrcAlpha: ZeroFactor, blendDstAlpha: OneMinusSrcAlphaFactor,
    }));
    dimPlane.rotation.x = -Math.PI / 2; dimPlane.position.y = FLOOR; dimScene.add(dimPlane);

    let viewportWidth = width, viewportHeight = height, fit = 1, layout = 'wide', reflect = true;
    const projected = new Vector3(), haloPoint = new Vector3(), docPoint = new Vector3(), stationPoint = new Vector3(), lit = new Vector3();
    const project = point => {
        projected.copy(point);
        const distance = projected.distanceTo(camera.position);
        projected.project(camera);
        return { x: (projected.x * .5 + .5) * viewportWidth, y: (-projected.y * .5 + .5) * viewportHeight, distance };
    };
    // shift moves the scene's center sideways in pixels, leaving room for copy.
    const resize = (w, h, shift = 0) => {
        viewportWidth = w; viewportHeight = h;
        const aspect = w / h;
        fit = clamp(1.25 / aspect, 1, 1.8);
        layout = aspect < 1.25 || w < 600 ? 'compact' : 'wide';
        // Phones skip the mirrored pass and half the near specks.
        reflect = layout === 'wide';
        nearGeometry.setDrawRange(0, reflect ? NEAR : NEAR / 2);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 600 ? 1.25 : 1.6));
        renderer.setSize(w, h, false);
        camera.aspect = aspect;
        if (shift) camera.setViewOffset(w, h, -shift, 0, w, h); else camera.clearViewOffset();
        camera.updateProjectionMatrix();
    };
    resize(width, height);

    return {
        resize,
        // focus: 0 to 2, the area in front, fractional while the camera travels.
        // entry: 0 while the section approaches, 1 once its stage is in place.
        // travel: 0 to 1 through the pinned scroll, for the near specks.
        // feed: 1 the moment a new step is reached, easing to 0 as its light rises.
        render({ time = 0, focus = 0, entry = 1, travel = 0, feed = 0, pointerX = 0, pointerY = 0, record = 0, paused = false }, place) {
            const t = paused ? 0 : time;
            const away = 1 - entry;
            const f = clamp(focus, 0, 2), i0 = Math.min(1, Math.floor(f)), s = f - i0;
            const a = SHOTS[i0], b = SHOTS[i0 + 1];
            const crane = Math.sin(s * Math.PI) * .55;
            camera.position.set(pointerX * .3, lerp(a.height, b.height, s) * fit + crane + away * 2.6 + pointerY * .14, lerp(a.distance, b.distance, s) * fit + away * 5);
            camera.lookAt(0, lerp(a.look, b.look, s) + away * .4 + (layout === 'compact' ? .55 : 0), 0);
            world.rotation.y = lerp(FOCUS_ANGLES[i0], FOCUS_ANGLES[i0 + 1], s) + away * .9;
            const bob = Math.sin(t * .65) * .035;
            world.position.y = bob;
            halo.rotation.z = t * .12;
            halo.material.opacity = .44 + Math.sin(t * 1.2) * .1;
            // The brain comes together, fills, and takes in each step.
            const assembled = smoothstep(clamp(travel / .8, 0, 1));
            const gap = lerp(.3, .135, assembled);
            const rise = 1.2 * (1 - feed), glowAt = Math.min(1, feed * 2.2);
            layers.forEach(({ layer, material, lines }, i) => {
                layer.position.y = -.37 + i * gap;
                layer.rotation.y = Math.PI / 4 + (1 - assembled) * (i - 1.5) * .34 + Math.sin(t * .4 + i * .7) * .03;
                const level = clamp(travel * 4.6 - i * 1.05, 0, 1);
                const band = glowAt * Math.exp(-((rise - i / 4) ** 2) / .018);
                material.emissiveIntensity = level * .16 + band * 1.1;
                material.opacity = .26 + level * .1 + band * .2;
                lines.color.lerpColors(edgeBlue, edgeGold, Math.min(1, level + band));
                lines.opacity = .22 + level * .3 + band * .45;
            });
            const crownBand = glowAt * Math.exp(-((rise - 1.05) ** 2) / .02);
            crown.position.y = -.37 + 4 * gap + .01;
            crown.rotation.y = Math.PI / 4 + (1 - assembled) * .9 + t * .04;
            crownMaterial.emissiveIntensity = .06 + travel * .3 + crownBand * .9;
            crownLines.opacity = .42 + travel * .3 + crownBand * .28;
            nodeMaterial.opacity = .3 + travel * .6;
            heart.material.opacity = .45 + travel * .4 + crownBand * .15;
            heart.scale.setScalar(1 + crownBand * .7 + Math.sin(t * 1.6) * .05);
            halo.position.y = crown.position.y + .55;
            dust.rotation.y = t * .014;
            near.position.y = travel * 1.7 + Math.sin(t * .15) * .12;
            near.rotation.y = Math.sin(t * .05) * .08;

            const selected = Math.round(f);
            stations.forEach(({ marker, object, glow }, i) => {
                const weight = Math.max(0, 1 - Math.abs(f - i));
                marker.material = i === selected ? gold : glass;
                objectMaterials[i].emissiveIntensity = weight * .2;
                objectMaterials[i].opacity = .45 + weight * .3;
                glow.material.opacity = weight * .24;
                object.animate(t + i * 1.7);
            });
            lit.copy(STATIONS[i0]).lerp(STATIONS[i0 + 1], s);
            stationLight.position.set(lit.x, lit.y + .9, lit.z);
            stationLight.intensity = 2.4 * entry;
            tubes.forEach((tube, i) => { tube.material.opacity = i === selected ? .5 : .16; });
            sparks.forEach(({ mesh, curve }, i) => {
                mesh.position.copy(curve.getPoint((t * .16 + i * .32) % 1));
                mesh.material.opacity = i === selected ? 1 : .25;
            });
            scene.updateMatrixWorld(); camera.updateMatrixWorld();

            halo.getWorldPosition(haloPoint);
            const tanHalf = Math.tan(camera.fov * Math.PI / 360);
            DOCS[layout].forEach(([nx, ny, depth], i) => {
                const x = nx - pointerX * .012 * (i === 1 ? .6 : 1);
                const y = ny + Math.sin(t * .8 + i * 2.1) * .012 + pointerY * .01;
                docPoint.set(x * tanHalf * camera.aspect * depth, y * tanHalf * depth, -depth);
                camera.localToWorld(docPoint);
                const { line, bead } = threads[i];
                const position = line.geometry.attributes.position;
                position.setXYZ(0, haloPoint.x, haloPoint.y, haloPoint.z);
                position.setXYZ(1, docPoint.x, docPoint.y - .2, docPoint.z);
                position.needsUpdate = true;
                line.material.opacity = (i === record ? .55 : .16) * entry;
                bead.position.lerpVectors(haloPoint, docPoint, (t * .22 + i * .33) % 1);
                bead.material.opacity = (i === record ? .9 : .3) * entry;
                const p = project(docPoint);
                place('record', i, p.x, p.y, { scale: 8.4 / depth, lean: nx, blur: 0 });
            });
            const ref = camera.position.length();
            const focal = stations[selected].station.getWorldPosition(stationPoint).distanceTo(camera.position);
            stations.forEach(({ station }, i) => {
                station.getWorldPosition(stationPoint); stationPoint.y -= .36;
                const p = project(stationPoint);
                place('area', i, p.x, p.y, { scale: clamp(ref / p.distance, .66, 1.14), lean: 0, blur: clamp(Math.abs(p.distance - focal) * .4, 0, 1.5) });
            });

            renderer.clear();
            if (reflect) {
                world.scale.y = -1; world.position.y = 2 * FLOOR - bob;
                unmirrored.forEach(o => { o.visible = false; });
                scene.updateMatrixWorld();
                renderer.render(scene, camera);
                renderer.render(dimScene, camera);
                world.scale.y = 1; world.position.y = bob;
                unmirrored.forEach(o => { o.visible = true; });
                scene.updateMatrixWorld();
                renderer.clearDepth();
            }
            renderer.render(scene, camera);
        },
        dispose() {
            const geometries = new Set(), materials = new Set();
            [scene, dimScene].forEach(root => root.traverse(object => {
                if (object.geometry) geometries.add(object.geometry);
                if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m));
            }));
            [gold, glass].forEach(m => materials.add(m));
            geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
            [softDot, glowTexture, dimMap].forEach(texture => texture.dispose());
            renderer.dispose();
        },
    };
}
