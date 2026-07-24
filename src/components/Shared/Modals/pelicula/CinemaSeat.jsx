import React from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export default function CinemaSeat({
    position = [0, 0, 0],
    scale = 1
}) {

    const red = new THREE.MeshStandardMaterial({
        color: "#9e1b23",
        roughness: 0.95,
        metalness: 0.05
    });

    const dark = new THREE.MeshStandardMaterial({
        color: "#581015",
        roughness: 1
    });

    const gold = new THREE.MeshStandardMaterial({
        color: "#d7a348",
        metalness: .65,
        roughness: .35
    });

    const metal = new THREE.MeshStandardMaterial({
        color: "#2c2c2c",
        metalness: .95,
        roughness: .25
    });

    return (

        <group
            position={position}
            scale={scale}
            castShadow
        >

            {/* respaldo */}

            <RoundedBox
                args={[0.82,1.05,.22]}
                radius={0.05}
                smoothness={5}
                position={[0,.95,-.15]}
                castShadow
            >
                <primitive object={red}/>
            </RoundedBox>

            {/* cabezal */}

            <RoundedBox
                args={[0.48,.22,.26]}
                radius={0.04}
                smoothness={5}
                position={[0,1.52,-.15]}
                castShadow
            >
                <primitive object={dark}/>
            </RoundedBox>

            {/* asiento */}

            <RoundedBox
                args={[0.82,.20,.70]}
                radius={0.05}
                smoothness={5}
                position={[0,.42,.18]}
                castShadow
            >
                <primitive object={red}/>
            </RoundedBox>

            {/* brazo izquierdo */}

            <RoundedBox
                args={[.12,.55,.72]}
                radius={0.03}
                smoothness={5}
                position={[-.48,.62,.16]}
                castShadow
            >
                <primitive object={dark}/>
            </RoundedBox>

            {/* brazo derecho */}

            <RoundedBox
                args={[.12,.55,.72]}
                radius={0.03}
                smoothness={5}
                position={[.48,.62,.16]}
                castShadow
            >
                <primitive object={dark}/>
            </RoundedBox>

            {/* portavasos */}

            <mesh
                position={[.48,.91,.36]}
                rotation={[-Math.PI/2,0,0]}
            >
                <cylinderGeometry
                    args={[.055,.055,.05,24]}
                />
                <primitive object={metal}/>
            </mesh>

            {/* base */}

            <mesh
                position={[0,.1,.15]}
            >
                <boxGeometry
                    args={[.52,.10,.42]}
                />
                <primitive object={dark}/>
            </mesh>

            {/* patas */}

            {[-.23,.23].map((x)=>(

                <mesh
                    key={x}
                    position={[x,-.33,.12]}
                    castShadow
                >
                    <boxGeometry
                        args={[.05,.72,.05]}
                    />
                    <primitive object={metal}/>
                </mesh>

            ))}

            {/* soporte trasero */}

            <mesh
                position={[0,.55,-.22]}
                castShadow
            >
                <boxGeometry
                    args={[.09,.72,.09]}
                />
                <primitive object={metal}/>
            </mesh>

            {/* detalle dorado */}

            <mesh
                position={[0,.95,-.035]}
            >
                <boxGeometry
                    args={[.03,.82,.01]}
                />
                <primitive object={gold}/>
            </mesh>

        </group>

    );

}