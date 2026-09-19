import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./Character/utils/character";
import setLighting from "./Character/utils/lighting";
import handleResize from "./Character/utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./Character/utils/mouseUtils";
import setAnimations from "./Character/utils/animationUtils";

const Character3D = () => {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());

  const [character, setChar] = useState(null);

  useEffect(() => {
    if (!canvasDiv.current) return;

    let rect = canvasDiv.current.getBoundingClientRect();
    let container = {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight,
    };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.2, 26.5);
    camera.zoom = 1.0;
    camera.updateProjectionMatrix();

    let headBone = null;
    let screenLight = null;
    let mixer = null;
    let cleanUpHover = null;
    let charScene = null;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const onResize = () => {
      handleResize(renderer, camera, canvasDiv, charScene);
    };

    loadCharacter().then((gltf) => {
      if (gltf) {
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          cleanUpHover = animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        charScene = gltf.scene;
        setChar(charScene);
        scene.add(charScene);
        headBone = charScene.getObjectByName("spine006") || null;
        screenLight = charScene.getObjectByName("screenlight") || null;

        setTimeout(() => {
          light.turnOnLights();
          animations.startIntro();
        }, 300);

        window.addEventListener("resize", onResize);
      }
    });

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce;
    const onTouchStart = (event) => {
      const element = event.target;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearTimeout(debounce);
      cancelAnimationFrame(animId);
      if (cleanUpHover) cleanUpHover();
      window.removeEventListener("resize", onResize);
      scene.clear();
      renderer.dispose();
      if (canvasDiv.current && canvasDiv.current.contains(renderer.domElement)) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Character3D;
