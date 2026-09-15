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

    // Exact Camera settings from original site
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
      scene.environmentIntensity = 0.65;
    });

    const dirLight = new THREE.DirectionalLight(0x5eead4, 1.2);
    dirLight.position.set(-0.47, -0.32, -1);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 2.5, 100, 3);
    pointLight.position.set(3, 12, 4);
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

            // Traverse and configure materials
            characterModel.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (child.name === 'BODY.SHIRT') {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#8B4513');
                    child.material = mat;
                  } else if (child.name === 'Pant') {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#000000');
                    child.material = mat;
                  }
                }
              }
            });

            // Hide the computer desk (Plane004) and screenlight initially so character is standalone!
            characterModel.children.forEach((c) => {
              if (c.name === 'Plane004') {
                c.children.forEach((l) => {
                  if (l.material) {
                    l.material.transparent = true;
                    l.material.opacity = 0; // HIDE DESK & COMPUTER INITIALLY
                    if (l.material.name === 'Material.018') {
                      deskMaterial = l.material;
                      deskMaterial.color.set('#FFFFFF');
                    }
                  }
                });
              }
              if (c.name === 'screenlight' && c.material) {
                c.material.transparent = true;
                c.material.opacity = 0; // HIDE SCREENLIGHT INITIALLY
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
            setupScrollTransitions(characterModel, camera, deskMaterial, screenLight, spine005);

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

    // GSAP ScrollTrigger Animations (matching Akash Malhotra's site!)
    function setupScrollTransitions(model, cam, deskMat, scrLight, spine) {
      if (window.innerWidth <= 1024) return;

      // 1. Landing to About section transition: Model rotates and moves to the left!
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
        .fromTo(model.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(cam.position, { z: 22 }, 0)
        .fromTo('.character-model', { x: 0 }, { x: '-25%', duration: 1 }, 0)
        .to('.landing-container', { opacity: 0, duration: 0.4 }, 0)
        .to('.landing-container', { y: '40%', duration: 0.8 }, 0)
        .fromTo('.about-me', { y: '-50%' }, { y: '0%' }, 0);

      // 2. About to What I Do transition: Desk appears and typing starts!
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
        .to(cam.position, { z: 75, y: 8.4, duration: 6, ease: 'power3.inOut' }, 0)
        .to('.about-section', { y: '30%', duration: 6 }, 0)
        .to('.about-section', { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo('.character-model', { pointerEvents: 'inherit' }, { pointerEvents: 'none', x: '-12%', delay: 2, duration: 5 }, 0)
        .to(model.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      if (spine) {
        aboutTl.to(spine.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }

      if (deskMat) {
        aboutTl.to(deskMat, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
      }

      if (scrLight && scrLight.material) {
        aboutTl.to(scrLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
      }

      // 3. What I Do to Career/Work exit transition
      const whatTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      whatTl.fromTo('.character-model', { y: '0%' }, { y: '-100%', duration: 1 }, 0);
    }

    // Mouse Parallax (Interactive head following mouse)
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

      currRotX += (targetRotX - currRotX) * 0.05;
      currRotY += (targetRotY - currRotY) * 0.05;

      if (spine006 && window.scrollY < 200) {
        spine006.rotation.y = currRotY;
        spine006.rotation.x = currRotX;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const r = container.getBoundingClientRect();
      const w = r.width || window.innerWidth;
      const h = r.height || window.innerHeight;
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
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
    </div>
  );
}
