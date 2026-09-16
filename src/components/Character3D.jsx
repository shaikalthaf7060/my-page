import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

async function deriveKey(pass) {
  const encoded = new TextEncoder().encode(pass);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return crypto.subtle.importKey('raw', digest.slice(0, 32), { name: 'AES-CBC' }, false, ['decrypt']);
}

async function decryptModel(url, pass) {
  const resp = await fetch(url);
  const buffer = await resp.arrayBuffer();
  const iv = new Uint8Array(buffer.slice(0, 16));
  const data = buffer.slice(16);
  const key = await deriveKey(pass);
  return crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, data);
}

export default function Character3D() {
  const containerRef = useRef(null);
  const hoverRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;

    const scene = new THREE.Scene();

    // Exact Camera settings: looking straight at face/chest at (0, 13.1, 0)
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Environment Lighting
    new RGBELoader().setPath('/models/').load('char_enviorment.hdr?v=2', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.64;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

    // Neutral backlight / rim light (neutral cool white)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight.position.set(-0.47, -0.32, -1);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Front Key Light for natural, healthy face skin illumination without any green cast
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    keyLight.position.set(0, 12, 22);
    scene.add(keyLight);

    // Soft warm fill light for gentle contours
    const fillLight = new THREE.DirectionalLight(0xfef2f2, 0.6);
    fillLight.position.set(-5, 4, 15);
    scene.add(fillLight);

    // Subtle warm ambient point light (replacing harsh cyan 0x22d3ee)
    const pointLight = new THREE.PointLight(0xffedd5, 0.3, 100, 3);
    pointLight.position.set(3, 12, 4);
    pointLight.castShadow = true;
    scene.add(pointLight);

    let characterModel = null;
    let mixer = null;
    let deskMaterial = null;
    let screenLight = null;
    let spine005 = null;
    let spine006 = null;

    // Load & Decrypt 3D Character
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    decryptModel('/models/character.enc?v=2', 'MyCharacter12')
      .then((decryptedBuffer) => {
        const blobUrl = URL.createObjectURL(new Blob([decryptedBuffer]));
        loader.load(
          blobUrl,
          (gltf) => {
            characterModel = gltf.scene;

            // Character is positioned at center (x: 0, y: 0, z: 0)
            characterModel.position.set(0, 0, 0);

            // Traverse and configure materials
            characterModel.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (child.name === 'BODY.SHIRT') {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#1e1e1e');
                    child.material = mat;
                  } else if (child.name === 'Pant') {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#0d0d0d');
                    child.material = mat;
                  }
                }
              }
            });

            // Hide the computer desk (Plane004) and screenlight so only the person is shown!
            characterModel.children.forEach((c) => {
              if (c.name === 'Plane004') {
                c.children.forEach((l) => {
                  if (l.material) {
                    l.material.transparent = true;
                    l.material.opacity = 0; // HIDE DESK & COMPUTER
                    if (l.material.name === 'Material.018') {
                      deskMaterial = l.material;
                      deskMaterial.color.set('#FFFFFF');
                    }
                  }
                });
              }
              if (c.name === 'screenlight' && c.material) {
                c.material.transparent = true;
                c.material.opacity = 0; // HIDE SCREENLIGHT
                c.material.emissive.set('#B0F5EA');
                screenLight = c;
              }
            });

            if (characterModel.getObjectByName('footR')) {
              characterModel.getObjectByName('footR').position.y = 3.36;
            }
            if (characterModel.getObjectByName('footL')) {
              characterModel.getObjectByName('footL').position.y = 3.36;
            }

            spine005 = characterModel.getObjectByName('spine005');
            spine006 = characterModel.getObjectByName('spine006');

            scene.add(characterModel);

            // Animations setup
            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(characterModel);
              
              const intro = gltf.animations.find((a) => a.name === 'introAnimation');
              if (intro) {
                const action = mixer.clipAction(intro);
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.play();
              }

              const blink = gltf.animations.find((a) => a.name === 'Blink');
              if (blink) {
                const blinkAction = mixer.clipAction(blink);
                blinkAction.play();
              }
            }

            // Setup GSAP Interactive Scroll Transitions
            setupScrollTransitions(characterModel, camera, deskMaterial, screenLight, spine005, pointLight);

            URL.revokeObjectURL(blobUrl);
            dracoLoader.dispose();
          },
          undefined,
          (err) => {
            console.error('Error loading 3D character:', err);
          }
        );
      })
      .catch((err) => {
        console.error('Failed to decrypt 3D model:', err);
      });

    // GSAP ScrollTrigger Animations
    function setupScrollTransitions(model, cam, deskMat, scrLight, spine, ptLight) {
      if (window.innerWidth <= 1024) return;

      // 1. Landing to About transition: Character moves from Center (x: 0) to Left (x: -3.8)
      const landingTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.landing-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      landingTl
        .fromTo(model.position, { x: 0 }, { x: -3.8, duration: 1 }, 0)
        .fromTo(model.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(cam.position, { z: 22 }, 0)
        .to('.landing-intro', { opacity: 0, duration: 0.4 }, 0)
        .to('.landing-info', { opacity: 0, duration: 0.4 }, 0)
        .fromTo('.about-me', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);

      // 2. About to What I Do transition: Desk appears, moves to left (x: -4.5) to give full room to cards on right!
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'center 55%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      aboutTl
        .to(model.position, { x: -4.5, duration: 4 }, 0)
        .to(cam.position, { z: 75, y: 8.4, duration: 6, ease: 'power3.inOut' }, 0)
        .to('.about-section', { opacity: 0, duration: 2 }, 0)
        .to(model.rotation, { y: 0.92, x: 0.12, duration: 3 }, 0);

      if (spine) {
        aboutTl.to(spine.rotation, { x: 0.6, duration: 3 }, 0);
      }

      if (deskMat) {
        aboutTl.to(deskMat, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
      }

      if (scrLight && scrLight.material) {
        aboutTl.to(scrLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
      }

      if (ptLight) {
        aboutTl.to(ptLight, { intensity: 0.8, duration: 0.8, delay: 4.5 }, 0);
      }

      // 3. Move character out when reaching Work section
      const whatTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      whatTl.to(model.position, { y: 25, duration: 4 }, 0);
      if (ptLight) {
        whatTl.to(ptLight, { intensity: 0, duration: 1 }, 0);
      }
    }

    // Mouse Parallax (Interactive head following cursor in real-time)
    let targetRotX = 0, targetRotY = 0;
    let currRotX = 0, currRotY = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * (Math.PI / 10);
      targetRotX = -normY * (Math.PI / 16);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      currRotX += (targetRotX - currRotX) * 0.06;
      currRotY += (targetRotY - currRotY) * 0.06;

      if (spine006 && window.scrollY < 300) {
        spine006.rotation.y = currRotY;
        spine006.rotation.x = currRotX;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-model">
      <div className="character-rim" />
      <div ref={hoverRef} className="character-hover" />
      <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative' }} />
    </div>
  );
}
