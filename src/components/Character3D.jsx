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

function nameMatch(name, ...targets) {
  if (!name) return false;
  const cleanName = name.replace(/[\._]/g, '').toLowerCase();
  for (const t of targets) {
    if (name === t || cleanName === t.replace(/[\._]/g, '').toLowerCase()) {
      return true;
    }
  }
  return false;
}

function findNode(model, ...names) {
  if (!model) return null;
  let found = null;
  model.traverse((child) => {
    if (!found && nameMatch(child.name, ...names)) {
      found = child;
    }
  });
  return found;
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

    const isMobile = window.innerWidth <= 1024;

    // Camera settings: perfectly framing broad shoulders and compact head matching reference Image 4
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, isMobile ? 13.0 : 12.4, isMobile ? 24.5 : 22.8);
    camera.zoom = isMobile ? 0.96 : 1.12;
    camera.lookAt(0, 12.0, 0);
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    // Shadows disabled on renderer and lights: removes harsh horizontal cut shadows from face, cheeks, nose, and chest!
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Environment Lighting
    new RGBELoader().setPath('/models/').load('char_enviorment.hdr?v=2', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.55;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

    // Warm, flattering ambient light for smooth, shadowless skin and fabric
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.65);
    scene.add(ambientLight);

    // Vibrant Cyan / Teal Backlight placed behind character pointing toward camera: Color #00e5ff
    const cyanBackRimLight = new THREE.DirectionalLight(0x00e5ff, 5.5);
    cyanBackRimLight.position.set(0, 15, -15);
    cyanBackRimLight.target.position.set(0, 12, 5);
    scene.add(cyanBackRimLight);
    scene.add(cyanBackRimLight.target);

    // Dual Shoulder Rim Lights (behind shoulders) for crisp cyan rim glow
    const leftRimLight = new THREE.DirectionalLight(0x00e5ff, 4.0);
    leftRimLight.position.set(-8, 13, -8);
    leftRimLight.target.position.set(0, 12, 3);
    scene.add(leftRimLight);
    scene.add(leftRimLight.target);

    const rightRimLight = new THREE.DirectionalLight(0x00e5ff, 4.0);
    rightRimLight.position.set(8, 13, -8);
    rightRimLight.target.position.set(0, 12, 3);
    scene.add(rightRimLight);
    scene.add(rightRimLight.target);

    // Front-left warm key light (shadowless) for clean, radiant facial skin
    const warmKeyLight = new THREE.DirectionalLight(0xffecd2, 1.5);
    warmKeyLight.position.set(-2, 14, 16);
    warmKeyLight.target.position.set(0, 12, 0);
    scene.add(warmKeyLight);
    scene.add(warmKeyLight.target);

    // Front-right fill light for smooth, uniform illumination across face & chest
    const frontFillLight = new THREE.DirectionalLight(0xfff5ea, 0.85);
    frontFillLight.position.set(2.5, 12, 14);
    frontFillLight.target.position.set(0, 12, 0);
    scene.add(frontFillLight);
    scene.add(frontFillLight.target);

    // Soft top-right pinkish highlight on cap dome (exact match to reference Image 4!)
    const topPinkLight = new THREE.DirectionalLight(0xf472b6, 0.75);
    topPinkLight.position.set(2, 18, 5);
    topPinkLight.target.position.set(0, 13, 0);
    scene.add(topPinkLight);
    scene.add(topPinkLight.target);

    // Subtle purple rim accent
    const purpleRimLight = new THREE.DirectionalLight(0xc084fc, 0.8);
    purpleRimLight.position.set(5, 12, 8);
    purpleRimLight.target.position.set(0, 12, 0);
    scene.add(purpleRimLight);
    scene.add(purpleRimLight.target);

    let characterModel = null;
    let mixer = null;
    let deskMaterial = null;
    let screenLight = null;
    let spine003 = null;
    let spine005 = null;
    let spine006 = null;
    let eyebrowL = null;
    let eyebrowR = null;
    let faceMesh = null;
    let eyesMesh = null;
    let shirtMesh = null;

    // Resting head pose with natural chin-to-collar distance matching reference Image 4
    const BASE_NECK_PITCH = 0.42;
    const BASE_HEAD_PITCH = -0.22;
    const BASE_MODEL_Y = -1.02;

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

            // Character model proportion: round head & broad shoulders matching reference Image 4
            characterModel.scale.set(1.0, 1.0, 1.0);
            characterModel.position.set(0, BASE_MODEL_Y, 0);

            // Eye texture loader with natural eye socket positioning
            const texLoader = new THREE.TextureLoader();
            let eyeTexture = null;
            texLoader.load('/images/eyes_original.png', (tex) => {
              tex.flipY = false;
              tex.colorSpace = THREE.SRGBColorSpace;
              eyeTexture = tex;
              const eyeObj = findNode(characterModel, 'EYEs.001', 'EYEs');
              if (eyeObj) {
                eyesMesh = eyeObj;
                eyeObj.position.z = 0.02;
                eyeObj.scale.set(1.0, 1.0, 1.0);
                eyeObj.renderOrder = 2;
                if (eyeObj.material) {
                  eyeObj.material = new THREE.MeshPhysicalMaterial({
                    map: tex,
                    roughness: 0.08,
                    metalness: 0.0,
                    clearcoat: 0.6,
                    clearcoatRoughness: 0.1,
                  });
                  eyeObj.material.needsUpdate = true;
                }
              }
            });

            // Refined mouth cavity & teeth loader: clean open smile with continuous white dental arch & dark maroon cavity
            let teethTexture = null;
            texLoader.load('/images/teeth_refined.png', (teethTex) => {
              teethTex.flipY = false;
              teethTex.colorSpace = THREE.SRGBColorSpace;
              teethTexture = teethTex;
              const teethObj = findNode(characterModel, 'Teeth.001', 'Teeth');
              if (teethObj && teethObj.material) {
                teethObj.visible = true;
                teethObj.material = new THREE.MeshStandardMaterial({
                  map: teethTex,
                  roughness: 0.18,
                  metalness: 0.0,
                  emissive: new THREE.Color('#ffffff'),
                  emissiveMap: teethTex,
                  emissiveIntensity: 0.15,
                });
                teethObj.material.needsUpdate = true;
              }
            });

            // Traverse and configure materials
            characterModel.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.visible = true;

                if (nameMatch(child.name, 'EYEs.001', 'EYEs')) {
                  eyesMesh = child;
                  child.position.z = 0.02;
                  child.scale.set(1.0, 1.0, 1.0);
                  child.renderOrder = 2;
                  if (eyeTexture && child.material) {
                    child.material = new THREE.MeshPhysicalMaterial({
                      map: eyeTexture,
                      roughness: 0.08,
                      metalness: 0.0,
                      clearcoat: 0.6,
                      clearcoatRoughness: 0.1,
                    });
                    child.material.needsUpdate = true;
                  }
                } else if (nameMatch(child.name, 'Teeth.001', 'Teeth')) {
                  // Continuous white upper dental arch with dark maroon interior background
                  child.visible = true;
                  if (child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                      map: teethTexture || null,
                      color: new THREE.Color('#ffffff'),
                      roughness: 0.18,
                      metalness: 0.0,
                      emissive: new THREE.Color('#ffffff'),
                      emissiveMap: teethTexture || null,
                      emissiveIntensity: 0.15,
                    });
                    child.material.needsUpdate = true;
                  }
                } else if (nameMatch(child.name, 'CAP.001')) {
                  // Brushed satin metallic silver cap dome (exact match to reference Image 4!)
                  if (child.material) {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#cbd0d5');
                    mat.metalness = 0.70;
                    mat.roughness = 0.35;
                    mat.clearcoat = 0.25;
                    mat.clearcoatRoughness = 0.25;
                    child.material = mat;
                  }
                } else if (nameMatch(child.name, 'CAP.002')) {
                  // Dark charcoal brim / visor with subtle specular edge (exact match to Image 4!)
                  if (child.material) {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#141416');
                    mat.roughness = 0.45;
                    mat.metalness = 0.15;
                    child.material = mat;
                  }
                } else if (nameMatch(child.name, 'BODY.SHIRT', 'BODYSHIRT')) {
                  // Rich uniform matte dark charcoal/black shirt with clean dark collar band (exact match to reference Image 2!)
                  shirtMesh = child;
                  child.position.set(0, 0, 0);
                  if (Array.isArray(child.material)) {
                    child.material = child.material.map((m, idx) => {
                      const mat = m.clone();
                      if (idx === 0) {
                        // Main shirt body fabric: smooth uniform matte charcoal
                        mat.color = new THREE.Color('#16171a');
                        mat.roughness = 0.82;
                        mat.metalness = 0.02;
                      } else {
                        // Collar & cuffs trim: solid dark black ring
                        mat.color = new THREE.Color('#0a0b0d');
                        mat.roughness = 0.50;
                        mat.metalness = 0.05;
                      }
                      mat.needsUpdate = true;
                      return mat;
                    });
                  } else if (child.material) {
                    const mat = child.material.clone();
                    mat.color = new THREE.Color('#16171a');
                    mat.roughness = 0.82;
                    mat.metalness = 0.02;
                    mat.needsUpdate = true;
                    child.material = mat;
                  }
                } else if (nameMatch(child.name, 'Pant')) {
                  if (child.material) {
                    if (Array.isArray(child.material)) {
                      child.material = child.material.map((m) => {
                        const mat = m.clone();
                        mat.color = new THREE.Color('#1a1b20');
                        mat.roughness = 0.80;
                        mat.needsUpdate = true;
                        return mat;
                      });
                    } else {
                      const mat = child.material.clone();
                      mat.color = new THREE.Color('#1a1b20');
                      mat.roughness = 0.80;
                      mat.needsUpdate = true;
                      child.material = mat;
                    }
                  }
                } else if (nameMatch(child.name, 'Face.002', 'Neck', 'Ear.001', 'Hand')) {
                  if (nameMatch(child.name, 'Face.002')) {
                    faceMesh = child;
                  }
                  // Authentic caramel/tan skin shader preserving painted eye creases, lip definition, and pores (exact match to Image 4!)
                  if (child.material) {
                    const old = child.material;
                    const skinMat = new THREE.MeshPhysicalMaterial({
                      map: old.map || null,
                      normalMap: old.normalMap || null,
                      roughnessMap: old.roughnessMap || null,
                      color: new THREE.Color(1, 1, 1), // White tint multiplier lets authentic texture shine through without bleaching
                      roughness: 0.38,
                      metalness: 0.04,
                      clearcoat: 0.35,
                      clearcoatRoughness: 0.18,
                      reflectivity: 0.75,
                      side: THREE.DoubleSide,
                    });
                    child.material = skinMat;
                  }
                }
              }
            });

            // Collect all workstation objects (desk, chair, keyboard, monitor, screenlight)
            // Note: Plane.003 is excluded as it is a large stray slab geometry under the chair
            const deskObjects = [];
            characterModel.children.forEach((c) => {
              if (
                nameMatch(
                  c.name,
                  'Plane004',
                  'Plane.004',
                  'Plane002',
                  'Plane.002',
                  'Plane',
                  'Cube002',
                  'Cube.002',
                  'Keyboard',
                  'screenlight'
                ) &&
                !nameMatch(c.name, 'Plane.003', 'Plane003')
              ) {
                deskObjects.push(c);
                c.visible = true; // KEEP TRUE so Three.js renders when opacity fades in!
                c.traverse((l) => {
                  if (l.isMesh && l.material) {
                    l.material = l.material.clone();
                    l.material.transparent = true;
                    l.material.opacity = 0; // HIDE INITIALLY ON HERO LANDING
                    l.material.depthWrite = true;

                    // Polish materials to match reference Image 3
                    if (nameMatch(l.material.name, 'Material.018')) {
                      // Sleek white desk top
                      l.material.color = new THREE.Color('#f5f5f7');
                      l.material.roughness = 0.35;
                    } else if (nameMatch(l.material.name, 'Material.020')) {
                      // Dark matte steel desk legs
                      l.material.color = new THREE.Color('#111215');
                      l.material.metalness = 0.8;
                      l.material.roughness = 0.25;
                    } else if (nameMatch(l.material.name, 'Material.021')) {
                      // Clean white chair shell
                      l.material.color = new THREE.Color('#ffffff');
                      l.material.roughness = 0.4;
                    } else if (nameMatch(l.material.name, 'Wood')) {
                      // Warm wooden chair legs
                      l.material.color = new THREE.Color('#8d5b3a');
                      l.material.roughness = 0.5;
                    } else if (nameMatch(l.material.name, 'Material.016', 'Material.017')) {
                      // Crisp light keyboard and keys
                      l.material.color = new THREE.Color('#e5e7eb');
                      l.material.roughness = 0.35;
                    } else if (nameMatch(c.name, 'Plane') && !nameMatch(c.name, 'Plane.004', 'Plane004', 'Plane.002', 'Plane002')) {
                      // Computer monitor back casing / housing
                      l.material.color = new THREE.Color('#e2e8f0');
                      l.material.roughness = 0.25;
                      l.material.metalness = 0.2;
                    } else if (nameMatch(c.name, 'screenlight') || nameMatch(l.material.name, 'screenlight')) {
                      // Emissive neon pink computer screen!
                      l.material.color = new THREE.Color('#ff2e93');
                      l.material.emissive = new THREE.Color('#ff2e93');
                      l.material.emissiveIntensity = 3.5;
                      l.material.side = THREE.DoubleSide;
                    }
                  }
                });
              } else if (nameMatch(c.name, 'Plane.003', 'Plane003', 'ground')) {
                // Permanently hide the stray slab and ground mesh
                c.visible = false;
              } else {
                c.visible = true;
              }
            });

            if (characterModel.getObjectByName('footR')) {
              characterModel.getObjectByName('footR').position.y = 3.36;
            }
            if (characterModel.getObjectByName('footL')) {
              characterModel.getObjectByName('footL').position.y = 3.36;
            }

            // Articulation bones
            spine003 = findNode(characterModel, 'spine.003', 'spine003');
            spine005 = findNode(characterModel, 'spine.005', 'spine005');
            spine006 = findNode(characterModel, 'spine.006', 'spine006');
            eyebrowL = findNode(characterModel, 'eyebrow_L', 'eyebrowL');
            eyebrowR = findNode(characterModel, 'eyebrow_R', 'eyebrowR');

            // Authentic bone positioning matching reference proportions (natural compact neck & collar proximity)
            if (spine003) {
              spine003.position.set(0, 1.33, 0);
            }
            if (spine005) {
              spine005.scale.set(1.0, 1.0, 1.0);
              spine005.position.set(0, 1.30, 0.05);
            }
            if (spine006) {
              spine006.scale.set(1.0, 1.0, 1.0);
              spine006.position.set(0, 0.30, 0);
            }
            if (shirtMesh) {
              shirtMesh.position.set(0, 0, 0);
            }

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
              // Note: Blink animation is omitted to prevent flat/box-shaped eyelid polygons from cutting across the open circular eyeballs
            }

            // Screen glow light casting vibrant screen reflection onto face & hands
            const screenGlowLight = new THREE.PointLight(0xff2e93, 0, 12);
            screenGlowLight.position.set(0.5, 10, 4.5);
            scene.add(screenGlowLight);

            // Setup GSAP Interactive Scroll Transitions
            setupScrollTransitions(
              characterModel,
              camera,
              deskObjects,
              spine005,
              screenGlowLight
            );

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

    // GSAP ScrollTrigger Animations (Exact match to reference site & Image 3!)
    function setupScrollTransitions(model, cam, deskObjs, spine, ptLight) {
      if (window.innerWidth <= 1024) return;

      // 1. Landing to About transition: Character moves to left (-25%)
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
        .fromTo('.about-me', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }, 0);

      // 2. About to What I Do transition: Camera zooms out to (0, 8.4, 75), desk, chair, computer & keyboard appear!
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
        .to(cam.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: 'power3.inOut' }, 0)
        .to('.about-section', { y: '30%', duration: 4 }, 0)
        .to('.about-section', { opacity: 0, delay: 0.8, duration: 1.5 }, 0)
        .fromTo('.character-model', { pointerEvents: 'inherit' }, { pointerEvents: 'none', x: '-13%', delay: 2, duration: 5 }, 0)
        .to(model.rotation, { y: 0.92, x: 0.12, delay: 2.5, duration: 3 }, 0);

      if (spine) {
        aboutTl.to(spine.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }

      // Smoothly fade in ALL workstation elements (desk, chair, keyboard, monitor, screenlight)
      if (deskObjs && deskObjs.length > 0) {
        deskObjs.forEach((obj) => {
          obj.traverse((child) => {
            if (child.isMesh && child.material) {
              aboutTl.to(child.material, { opacity: 1, duration: 1.2, delay: 2.8 }, 0);
            }
          });
        });
      }

      // Turn on vibrant hot pink screen reflection on boy's face, hands, and clothes (exact match to Image 3!)
      if (ptLight) {
        ptLight.color.set(0xff2e93);
        aboutTl.to(ptLight, { intensity: 3.5, duration: 1.2, delay: 3.8 }, 0);
      }

      // 3. Smooth exit transition when scrolling into the Work section
      // Character, desk, chair, keyboard, and screen glow remain 100% visible and anchored while user is inside What I Do!
      const whatTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.work-section',
          start: 'top bottom',
          end: 'top 20%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      whatTl
        .to('.character-model', { y: '-160%', opacity: 0, duration: 3, ease: 'power2.in' }, 0)
        .to(ptLight, { intensity: 0, duration: 1.5 }, 0);

      if (deskObjs && deskObjs.length > 0) {
        deskObjs.forEach((obj) => {
          obj.traverse((child) => {
            if (child.isMesh && child.material) {
              whatTl.to(child.material, { opacity: 0, duration: 1.5 }, 0);
            }
          });
        });
      }
    }

    // Dynamic Pointer & Cursor Tracking with Clamping & Weighted Lerp Damping
    let targetRotX = 0, targetRotY = 0;
    let currRotX = 0, currRotY = 0;
    let lastInteractTime = Date.now();

    const handleMouseMove = (e) => {
      lastInteractTime = Date.now();
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Realistic rotation limits (clamping) to prevent awkward over-rotation or mesh breaking
      const clampedX = Math.max(-1, Math.min(1, normX));
      const clampedY = Math.max(-1, Math.min(1, normY));

      targetRotY = clampedX * 0.42;
      targetRotX = -clampedY * 0.24;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      lastInteractTime = Date.now();
      const touch = e.touches[0];
      const normX = (touch.clientX / window.innerWidth) * 2 - 1;
      const normY = -(touch.clientY / window.innerHeight) * 2 + 1;

      const clampedX = Math.max(-1, Math.min(1, normX));
      const clampedY = Math.max(-1, Math.min(1, normY));

      targetRotY = clampedX * 0.38;
      targetRotX = -clampedY * 0.22;
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      if (mixer) mixer.update(delta);

      // Confident, relaxed gaze with natural 20% upper eyelid coverage (exact match to reference Image 2!)
      if (faceMesh && faceMesh.morphTargetDictionary && faceMesh.morphTargetInfluences) {
        for (const k in faceMesh.morphTargetDictionary) {
          const idx = faceMesh.morphTargetDictionary[k];
          if (nameMatch(k, 'eyeL_60', 'eyeL60')) {
            faceMesh.morphTargetInfluences[idx] = 0.20;
          } else {
            faceMesh.morphTargetInfluences[idx] = 0.0;
          }
        }
      }

      // Natural eye socket depth without bulging
      if (eyesMesh) {
        eyesMesh.position.z = 0.02;
      }

      const t = clock.getElapsedTime();

      // Subtle idle breathing/bobbing animation so neck and shoulders gently rise and fall
      const breath = Math.sin(t * 1.8);

      // Living idle sway when no recent mouse/touch activity
      if (Date.now() - lastInteractTime > 1200) {
        const idleT = t * 0.9;
        targetRotY = Math.sin(idleT * 0.8) * 0.055;
        targetRotX = Math.cos(idleT * 0.6) * 0.035;
      }

      // Smooth exponential lerp damping for weighted, fluid transitions
      const lerpFactor = 1.0 - Math.exp(-6.5 * delta);
      currRotX += (targetRotX - currRotX) * lerpFactor;
      currRotY += (targetRotY - currRotY) * lerpFactor;

      // Natural determined brow slanting slightly downward toward the nose (exact match to Image 4!)
      if (eyebrowL) {
        eyebrowL.position.y = 1.62;
        eyebrowL.rotation.z = 0.04;
      }
      if (eyebrowR) {
        eyebrowR.position.y = 1.62;
        eyebrowR.rotation.z = -0.04;
      }

      // Hero section interaction: organic neck & head articulation + breathing bob
      if (window.scrollY < 350) {
        if (characterModel) {
          characterModel.position.y = BASE_MODEL_Y + breath * 0.016;
        }

        // Keep chest bone stable at natural height
        if (spine003) {
          spine003.position.set(0, 1.33, 0);
        }

        // Natural neck articulation without stretching (scale 1.0 maintains round, solid head proportion)
        if (spine005) {
          spine005.scale.set(1.0, 1.0, 1.0);
          spine005.position.set(0, 1.30, 0.05);
          spine005.rotation.x = BASE_NECK_PITCH + currRotX * 0.28;
          spine005.rotation.y = currRotY * 0.32;
          spine005.rotation.z = -currRotY * 0.06;
        }

        // Head bone pivot toward pointer with slight upward tilt lifting chin naturally
        if (spine006) {
          spine006.scale.set(1.0, 1.0, 1.0);
          spine006.position.set(0, 0.30, 0);
          spine006.rotation.x = BASE_HEAD_PITCH + currRotX * 0.55;
          spine006.rotation.y = currRotY * 0.55;
          spine006.rotation.z = -currRotY * 0.04;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = window.innerWidth <= 1024;
      camera.aspect = w / h;
      camera.position.set(0, mobile ? 13.0 : 12.4, mobile ? 24.5 : 22.8);
      camera.zoom = mobile ? 0.96 : 1.12;
      camera.lookAt(0, 12.0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
