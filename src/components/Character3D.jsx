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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.4, 3.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Environment Lighting
    new RGBELoader().setPath('/models/').load('char_enviorment.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const dirLight = new THREE.DirectionalLight('#5eead4', 2.5);
    dirLight.position.set(2, 4, 2);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight('#22d3ee', 4);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    let characterModel = null;

    // Load & Decrypt 3D Character
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    decryptModel('/models/character.enc', 'MyCharacter12')
      .then((decryptedBuffer) => {
        const blobUrl = URL.createObjectURL(new Blob([decryptedBuffer]));
        loader.load(blobUrl, (gltf) => {
          characterModel = gltf.scene;
          characterModel.position.set(0, -1.1, 0);
          characterModel.scale.set(1.15, 1.15, 1.15);
          scene.add(characterModel);
          URL.revokeObjectURL(blobUrl);
        });
      })
      .catch((err) => {
        console.log('Using visual avatar mode:', err.message);
      });

    // Mouse Tracking
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (characterModel) {
        characterModel.rotation.y += (mouseX * 0.4 - characterModel.rotation.y) * 0.05;
        characterModel.rotation.x += (mouseY * 0.15 - characterModel.rotation.x) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-model">
      <div className="character-rim" />
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
