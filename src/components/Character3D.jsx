import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
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
    let spineNode = null;

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

            if (characterModel.getObjectByName('footR')) {
              characterModel.getObjectByName('footR').position.y = 3.36;
            }
            if (characterModel.getObjectByName('footL')) {
              characterModel.getObjectByName('footL').position.y = 3.36;
            }

            spineNode = characterModel.getObjectByName('spine006');
            scene.add(characterModel);

            // Animations if available
            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(characterModel);
              const intro = gltf.animations.find((a) => a.name === 'introAnimation') || gltf.animations[0];
              if (intro) {
                const action = mixer.clipAction(intro);
                action.play();
              }
            }

            URL.revokeObjectURL(blobUrl);
            dracoLoader.dispose();
          },
          undefined,
          (err) => {
            console.error('Error parsing decrypted model:', err);
          }
        );
      })
      .catch((err) => {
        console.error('Failed to decrypt character model:', err);
      });

    // Mouse Tracking parallax
    let targetRotX = 0, targetRotY = 0;
    let currRotX = 0, currRotY = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * (Math.PI / 8);
      targetRotX = -normY * (Math.PI / 12);
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

      if (spineNode) {
        spineNode.rotation.y = currRotY;
        spineNode.rotation.x = currRotX;
      } else if (characterModel) {
        characterModel.rotation.y = currRotY * 0.5;
        characterModel.rotation.x = currRotX * 0.3;
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
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-model">
      <div className="character-rim" />
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
    </div>
  );
}
