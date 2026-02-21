import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- Particle Component ---
function DustParticles({ count = 50 }) {
    const pointsRef = useRef();

    // Initialize random particle positions within a sphere
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = 2 + Math.random() * 1.5;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);

            p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2; // Start lower
            p[i * 3 + 2] = radius * Math.cos(phi);
        }
        return p;
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Slow drift upwards and subtle rotation
        pointsRef.current.rotation.y += delta * 0.05;

        const positions = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            // Move particle up
            positions[i * 3 + 1] += delta * 0.2;

            // Reset if it goes too high, giving continuous flow
            if (positions[i * 3 + 1] > 3) {
                positions[i * 3 + 1] = -3;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#C9A84C"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
}

// --- Main Crystal Logic ---
function Crystal() {
    const groupRef = useRef();
    const wireframeMatRef = useRef();
    const internalLightRef = useRef();

    // Generate organic, slightly imperfect geometry
    const geometry = useMemo(() => {
        // Icosahedron detail 1 gives a nice complex polyhedron
        const geo = new THREE.IcosahedronGeometry(1, 1);

        // Subtly displace vertices for organic "cut" feel
        const positions = geo.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const displace = (Math.random() - 0.5) * 0.08;
            positions.setXYZ(
                i,
                positions.getX(i) + displace,
                positions.getY(i) + displace,
                positions.getZ(i) + displace
            );
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current || !internalLightRef.current || !wireframeMatRef.current) return;

        const t = state.clock.getElapsedTime();
        const pointer = state.pointer; // Use state.pointer in R3F v8

        // 1. Base continuous animation (rotation + breathing)
        // Dynamic rotation speed based on hover state (simulated via pointer presence relative to canvas center)
        const isHovered = Math.abs(pointer.x) < 0.5 && Math.abs(pointer.y) < 0.5;
        const targetRotationSpeed = isHovered ? 0.15 : 0.08;
        const currentRotationY = groupRef.current.rotation.y;
        // We add to rotation, but speed lerps
        groupRef.current.rotation.y += targetRotationSpeed * delta;

        // Gentle floating bob
        groupRef.current.position.y = Math.sin(t / 1.5) * 0.15;
        // Subtle X oscillation
        groupRef.current.rotation.x = Math.sin(t / 2) * 0.1;

        // 2. Mouse interactivity (Subtle parallax tilt)
        const targetTiltX = THREE.MathUtils.lerp(groupRef.current.rotation.x, (pointer.y * 0.15), 0.05);
        const targetTiltY = THREE.MathUtils.lerp(groupRef.current.rotation.y, (pointer.x * 0.15) + currentRotationY, 0.05);

        groupRef.current.rotation.x = targetTiltX;
        // Don't override the continuous Y rotation completely, just influence it
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -pointer.x * 0.1, 0.05);

        // 3. Hover wireframe opacity
        const targetOpacity = isHovered ? 0.6 : 0.3;
        wireframeMatRef.current.opacity = THREE.MathUtils.lerp(wireframeMatRef.current.opacity, targetOpacity, 0.05);

        // 4. Internal light pulsation (breathing cycle)
        // Pulse between 0.5 and 1.5 intensity
        internalLightRef.current.intensity = 1.0 + Math.sin(t * 2) * 0.5;
    });

    return (
        <group ref={groupRef}>
            {/* Dynamic Internal Glow */}
            <pointLight ref={internalLightRef} color="#C9A84C" intensity={1} distance={3} />

            {/* Primary Dark Glass Mesh */}
            <mesh geometry={geometry}>
                <meshPhysicalMaterial
                    color="#0D0D12"
                    transmission={0.6}
                    opacity={1}
                    metalness={0.1}
                    roughness={0.05}
                    ior={2.0}
                    thickness={1.5}
                    clearcoat={0.3}
                    clearcoatRoughness={0.1}
                    transparent={true}
                />
            </mesh>

            {/* Gold Edge Wireframe Overlay */}
            <mesh geometry={geometry} scale={1.001}>
                <meshBasicMaterial
                    ref={wireframeMatRef}
                    color="#C9A84C"
                    wireframe={true}
                    transparent={true}
                    opacity={0.3}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

// --- Canvas Wrapper Component ---
export default function HeroCrystal() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <PerformanceMonitor onChange={({ factor }) => {
                    // Can be used to downgrade visuals if needed
                    console.log("Performance Factor:", factor);
                }}>
                    <Suspense fallback={null}>
                        {/* Mood Lighting */}
                        <ambientLight intensity={0.05} />
                        {/* Key Gold Light */}
                        <directionalLight position={[5, 5, 5]} color="#C9A84C" intensity={0.8} />
                        {/* Cool rim light for contrast to the gold */}
                        <pointLight position={[-3, -2, 4]} color="#4488ff" intensity={0.3} distance={10} />

                        {/* Core Elements */}
                        <Crystal />
                        <DustParticles count={50} />

                        {/* Cinematic Post Processing */}
                        <EffectComposer disableNormalPass>
                            <Bloom
                                luminanceThreshold={0.6}
                                mipmapBlur
                                intensity={0.4}
                                radius={0.8}
                            />
                        </EffectComposer>
                    </Suspense>
                </PerformanceMonitor>
            </Canvas>
        </div>
    );
}
