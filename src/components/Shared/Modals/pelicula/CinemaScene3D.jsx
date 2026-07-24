// CinemaScene3D.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import {
    PerspectiveCamera,
    Environment,
    ContactShadows
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import CinemaRoom from "./CinemaRoom";

export default function CinemaScene3D({
    lucesApagadas,
    encendido
}) {

    return (
        <div className="absolute inset-0">

            <Canvas
                shadows
                dpr={[1,2]}
                gl={{
                    antialias:true
                }}
            >

                <color attach="background" args={["#050505"]} />

                <PerspectiveCamera
                    makeDefault
                    position={[0, 5.6, 17.5]}
                    fov={54}
                    onUpdate={(cam) => cam.lookAt(0, 3.6, -4)}
                />

                <fog
                    attach="fog"
                    args={[
                        "#050505",
                        lucesApagadas ? 10 : 18,
                        lucesApagadas ? 30 : 50
                    ]}
                />

                <CinemaRoom
                    lucesApagadas={lucesApagadas}
                    encendido={encendido}
                />

                <ContactShadows
                    position={[0,-1.95,0]}
                    opacity={0.65}
                    blur={2.5}
                    scale={40}
                    far={10}
                />

                <Environment preset="city" environmentIntensity={lucesApagadas ? 0.09 : 0.4} />

                <EffectComposer>

                    <Bloom
                        intensity={lucesApagadas ? 2.6 : .6}
                        luminanceThreshold={0.15}
                        luminanceSmoothing={0.5}
                    />

                    <Vignette
                        eskil={false}
                        offset={0.15}
                        darkness={lucesApagadas ? 1.15 : .45}
                    />

                </EffectComposer>

            </Canvas>

        </div>
    );

}