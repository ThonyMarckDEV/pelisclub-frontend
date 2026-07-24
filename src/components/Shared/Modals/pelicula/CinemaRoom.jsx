// CinemaRoom.jsx
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CinemaSeat from "./CinemaSeat";

// velocidad del fundido (más alto = más rápido). ~1.1 da un apagado de ~2s, suave y con "peso"
const FADE_SPEED = 1.1;

// suavizado independiente del framerate (damping exponencial)
function damp(current, target, speed, delta) {
    return THREE.MathUtils.lerp(
        current,
        target,
        1 - Math.exp(-speed * delta)
    );
}

export default function CinemaRoom({
    lucesApagadas
}) {

    // ---- valores objetivo (a donde queremos llegar) ----
    const targets = useRef({
        ambient: 0.9,
        roof: 5,
        wall: 2.2,
        screen: 2.5,
        frisoEmissive: 0,
        techoEmissive: 10,
        apliqueEmissive: 6,
    });

    useMemo(() => {
        targets.current = {
            ambient: lucesApagadas ? 0.035 : 0.9,
            roof: lucesApagadas ? 0 : 5,
            wall: lucesApagadas ? 0 : 2.2,
            screen: lucesApagadas ? 2.8 : 2.5,
            frisoEmissive: lucesApagadas ? 0.12 : 0,
            techoEmissive: lucesApagadas ? 0 : 10,
            apliqueEmissive: lucesApagadas ? 0 : 6,
        };
    }, [lucesApagadas]);

    // ---- refs a las luces / materiales que vamos a animar ----
    const ambientRef = useRef();
    const roofRef = useRef();
    const screenRef = useRef();
    const wallLRef = useRef();
    const wallRRef = useRef();
    const frisoLRef = useRef();
    const frisoRRef = useRef();
    const techoRefs = useRef([]);
    const apliqueRefs = useRef([]);

    useFrame((_, delta) => {

        const t = targets.current;

        if (ambientRef.current) {
            ambientRef.current.intensity = damp(
                ambientRef.current.intensity, t.ambient, FADE_SPEED, delta
            );
        }

        if (roofRef.current) {
            roofRef.current.intensity = damp(
                roofRef.current.intensity, t.roof, FADE_SPEED, delta
            );
        }

        if (screenRef.current) {
            screenRef.current.intensity = damp(
                screenRef.current.intensity, t.screen, FADE_SPEED, delta
            );
        }

        [wallLRef, wallRRef].forEach(ref => {
            if (ref.current) {
                ref.current.intensity = damp(
                    ref.current.intensity, t.wall, FADE_SPEED, delta
                );
            }
        });

        [frisoLRef, frisoRRef].forEach(ref => {
            if (ref.current) {
                ref.current.emissiveIntensity = damp(
                    ref.current.emissiveIntensity, t.frisoEmissive, FADE_SPEED, delta
                );
            }
        });

        techoRefs.current.forEach(ref => {
            if (ref) {
                ref.emissiveIntensity = damp(
                    ref.emissiveIntensity, t.techoEmissive, FADE_SPEED, delta
                );
            }
        });

        apliqueRefs.current.forEach(ref => {
            if (ref) {
                ref.emissiveIntensity = damp(
                    ref.emissiveIntensity, t.apliqueEmissive, FADE_SPEED, delta
                );
            }
        });

    });

    const rows = useMemo(() => {

        const arr = [];

        const totalRows = 4;

        for (let r = 0; r < totalRows; r++) {

            const seats = 9 + r;

            const z = 4 + r * 2.3;

            const width = 6 + r * 2;

            for (let i = 0; i < seats; i++) {

                const x =
                    (i / (seats - 1) - .5) * width;

                arr.push(
                    <CinemaSeat
                        key={`${r}-${i}`}
                        position={[x,0,z]}
                        scale={0.85 + r * .12}
                    />
                );

            }

        }

        return arr;

    }, []);

    return (
        <>

            {/* ---------- LUCES ---------- */}

            <ambientLight ref={ambientRef} intensity={0.9} />

            <directionalLight
                ref={roofRef}
                position={[0,8,8]}
                intensity={5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            <pointLight
                ref={screenRef}
                position={[0,6,-9]}
                intensity={2.5}
                color="#ffe4aa"
                distance={lucesApagadas ? 14 : 30}
            />

            <pointLight
                ref={wallLRef}
                position={[-9,3,0]}
                intensity={2.2}
                color="#ffb84d"
            />

            <pointLight
                ref={wallRRef}
                position={[9,3,0]}
                intensity={2.2}
                color="#ffb84d"
            />

            {/* ---------- PISO ---------- */}

            <mesh
                rotation={[-Math.PI/2,0,0]}
                receiveShadow
            >
                <planeGeometry args={[44,40]} />
                <meshStandardMaterial
                    color="#2a0b0d"
                    roughness={1}
                />
            </mesh>

            {/* ---------- ESCENARIO ---------- */}

            <mesh
                position={[0,-0.35,-3]}
                receiveShadow
            >
                <boxGeometry args={[19,.7,3.5]} />
                <meshStandardMaterial
                    color="#3d1113"
                />
            </mesh>

            {/* ---------- PAREDES ---------- */}

            {[-1,1].map(side => (

                <group key={side}>

                    {/* pared principal */}
                    <mesh
                        position={[side*11,5,2]}
                        rotation={[0, side>0 ? -.35 : .35, 0]}
                        receiveShadow
                    >
                        <boxGeometry args={[.4,11,28]} />
                        <meshStandardMaterial
                            color="#401114"
                            roughness={1}
                        />
                    </mesh>

                    {/* zócalo */}
                    <mesh
                        position={[side*10.85,.35,2]}
                        rotation={[0, side>0 ? -.35 : .35, 0]}
                    >
                        <boxGeometry args={[.15,.7,28]} />
                        <meshStandardMaterial
                            color="#1d0708"
                            roughness={1}
                        />
                    </mesh>

                    {/* friso dorado superior */}
                    <mesh
                        position={[side*10.85,10.4,2]}
                        rotation={[0, side>0 ? -.35 : .35, 0]}
                    >
                        <boxGeometry args={[.12,.12,28]} />
                        <meshStandardMaterial
                            ref={side > 0 ? frisoRRef : frisoLRef}
                            color="#d7a348"
                            metalness={.6}
                            roughness={.35}
                            emissive="#d7a348"
                            emissiveIntensity={0}
                        />
                    </mesh>

                </group>

            ))}

            {/* ---------- TECHO ---------- */}

            <mesh
                position={[0,12,2]}
                rotation={[Math.PI/2,0,0]}
            >
                <planeGeometry
                    args={[26,28]}
                />

                <meshStandardMaterial
                    color="#1d0708"
                />

            </mesh>

            {/* ---------- LUCES TECHO ---------- */}

            {[-6,-2,2,6].map((x, idx)=>(

                <group
                    key={x}
                    position={[x,10,0]}
                >

                    <mesh>

                        <cylinderGeometry
                            args={[.12,.12,.1,24]}
                        />

                        <meshStandardMaterial
                            ref={el => (techoRefs.current[idx] = el)}
                            emissive="#fff5d0"
                            emissiveIntensity={10}
                            color="#ddd"
                        />

                    </mesh>

                </group>

            ))}

            {/* ---------- APLIQUES ---------- */}

            {[-1,1].map((side, idx)=>(

                <mesh
                    key={side}
                    position={[side*11,7,-1]}
                    rotation={[0,side>0?-0.35:0.35,0]}
                >

                    <boxGeometry
                        args={[.25,.9,.25]}
                    />

                    <meshStandardMaterial
                        ref={el => (apliqueRefs.current[idx] = el)}
                        emissive="#ffcc77"
                        emissiveIntensity={6}
                        color="#663300"
                    />

                </mesh>

            ))}

            {/* ---------- BUTACAS ---------- */}

            {rows}

        </>
    );

}