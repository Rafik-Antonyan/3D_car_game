import React, { useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function Car() {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [direction, setDirection] = useState('forward')
    const [rotation, setRotation] = useState(0)

    const gltf = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "models/car/scene.gltf"
    );

    useEffect(() => {
        gltf.scene.scale.set(0.005, 0.005, 0.005);
        gltf.scene.position.set(y, -0.035, x);
        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 18;
            }
        });
    }, [gltf, x, y, speed, direction]);

    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp') {
            setSpeed(1.5)
            setDirection('forward')
            setX(x + .05)
        } else if (event.code === 'ArrowDown') {
            setSpeed(1.5)
            setDirection("back")
            setX(x - .05)
        } else if (event.code === 'ArrowRight') {
            setY(y - .02)
            setRotation(-.2)
        } else if (event.code === 'ArrowLeft') {
            setY(y + .02)
            setRotation(.2)
        } else if (event.code === 'Space') {
            setRotation(1)
            setX(x + .04)
            setSpeed(1.4)
        }
    })

    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp') {
            setSpeed(1)
            setX(x + .05)
        } else if (event.code === 'ArrowDown') {
            setSpeed(1)
            setDirection("forward")
            setX(x - .05)
        } else if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
            setRotation(0)
        } else if (event.code === 'Space') {
            setRotation(0)
            setX(x + .05)
            setSpeed(1)
        }
    })

    useFrame((state) => {
        let t = direction === 'forward' ? state.clock.getElapsedTime() : -state.clock.getElapsedTime();
        let group = gltf.scene.children[0].children[0].children[0];
        group.children[0].rotation.x = t * speed;
        group.children[2].rotation.x = t * speed;
        group.children[4].rotation.x = t * speed;
        group.children[6].rotation.x = t * speed;
    });

    return <primitive object={gltf.scene} rotation-y={rotation} />;
}