// Procedural two-hemisphere surface. Every visit uses the same folds and
// connections; only the lighting and camera move.
export function brainPoint(side, latitude, longitude) {
    const c = Math.cos(latitude);
    const fold = 1 + 0.105 * Math.sin(longitude * 7 + latitude * 4)
        + 0.045 * Math.sin(longitude * 13 - latitude * 9);
    return [
        side * (0.075 + 1.2 * c * Math.abs(Math.cos(longitude)) * fold * (1 + 0.06 * Math.sin(latitude))),
        0.08 + 1.08 * Math.sin(latitude) + 0.035 * Math.sin(longitude * 5) * c,
        0.88 * c * Math.sin(longitude) * fold,
    ];
}

export function regionFor([x, y]) {
    const angle = Math.atan2(y, x) + Math.PI;
    return Math.min(4, Math.floor(angle / (Math.PI * 2) * 5));
}

export function createBrainGeometry(count = 3600) {
    const points = [];
    const seeds = [];
    const groups = [];
    const paths = [];
    for (let i = 0; i < count; i++) {
        const half = Math.floor(count / 2);
        const k = i % half;
        const latitude = Math.asin(1 - 2 * (k + 0.5) / half);
        const longitude = k * Math.PI * (3 - Math.sqrt(5));
        const p = brainPoint(i < half ? -1 : 1, latitude, longitude);
        points.push(...p);
        seeds.push((i * 0.61803398875) % 1);
        groups.push(regionFor(p));
    }
    // The visible gyri are continuous curved filaments, not a polygon cage.
    for (const side of [-1, 1]) {
        for (let j = 0; j < 18; j++) {
            const path = [];
            for (let i = 0; i <= 85; i++) {
                const t = i / 85;
                const lat = -1.34 + t * 2.68;
                const lon = j * Math.PI * 2 / 18 + 0.2 * Math.sin(t * Math.PI * 5 + j * 0.8) + 0.05 * Math.sin(t * Math.PI * 13);
                path.push(brainPoint(side, lat, lon));
            }
            paths.push(path);
        }
        for (let j = 0; j < 9; j++) {
            const path = [];
            for (let i = 0; i <= 100; i++) {
                const lon = i / 100 * Math.PI * 2;
                path.push(brainPoint(side, -1.12 + j * 0.28 + 0.055 * Math.sin(lon * 6 + j), lon));
            }
            paths.push(path);
        }
    }
    for (const side of [-1, 1]) {
        for (let j = 0; j < 3; j++) {
            paths.push(Array.from({ length: 38 }, (_, i) => {
                const t = i / 37;
                return [side * (0.065 + j * 0.025 + Math.sin(t * 5) * 0.012), -0.93 - t * 0.35, -0.1 - t * 0.16];
            }));
        }
    }
    // A spatial grid keeps graph construction bounded as detail increases.
    const cells = new Map();
    const edges = [];
    const cellSize = 0.17;
    for (let i = 0; i < count; i += 3) {
        const p = points.slice(i * 3, i * 3 + 3);
        const cell = p.map(v => Math.floor(v / cellSize));
        let connections = 0;
        for (let x = -1; x <= 1 && connections < 3; x++) {
            for (let y = -1; y <= 1 && connections < 3; y++) {
                for (let z = -1; z <= 1 && connections < 3; z++) {
                    const nearby = cells.get(`${cell[0] + x},${cell[1] + y},${cell[2] + z}`) || [];
                    for (const other of nearby) {
                        const q = points.slice(other * 3, other * 3 + 3);
                        const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
                        if (d > 0.065 && d < cellSize) { edges.push([p, q]); connections++; }
                        if (connections >= 3) break;
                    }
                }
            }
        }
        const key = cell.join(',');
        if (!cells.has(key)) cells.set(key, []);
        cells.get(key).push(i);
    }
    return { points, seeds, groups, paths, edges };
}
