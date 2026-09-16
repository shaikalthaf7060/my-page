import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default function TechStack3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32.5, width / height, 1, 100);
    camera.position.set(0, 0, 20);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2.0);
    spotLight.position.set(20, 20, 25);
    spotLight.angle = 0.35;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(0, 5, -4);
    scene.add(dirLight);

    // 4. Environment HDR
    new RGBELoader().setPath('/models/').load('char_enviorment.hdr?v=2', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.55;
      scene.environmentRotation.set(0, 4, 2);
    });

    // 5. Tech Textures & Materials
    const textureLoader = new THREE.TextureLoader();
    const texturePaths = [
      '/images/react2.webp',
      '/images/next2.webp',
      '/images/node2.webp',
      '/images/express.webp',
      '/images/mongo.webp',
      '/images/mysql.webp',
      '/images/typescript.webp',
      '/images/javascript.webp'
    ];

    const materials = texturePaths.map((path) => {
      const tex = textureLoader.load(path);
      return new THREE.MeshPhysicalMaterial({
        map: tex,
        emissive: 0xffffff,
        emissiveMap: tex,
        emissiveIntensity: 0.28,
        metalness: 0.45,
        roughness: 0.85,
        clearcoat: 0.25,
        clearcoatRoughness: 0.1
      });
    });

    // 6. Spheres Setup (30 spheres matching Akash's site)
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const scales = [0.7, 1.0, 0.8, 1.0, 1.0];
    const spheres = [];
    const sphereCount = 30;

    for (let i = 0; i < sphereCount; i++) {
      const scale = scales[Math.floor(Math.random() * scales.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(sphereGeometry, mat);
      mesh.scale.set(scale, scale, scale);

      // Distribute randomly around center
      const spreadX = (Math.random() - 0.5) * 14;
      const spreadY = (Math.random() - 0.5) * 8;
      const spreadZ = (Math.random() - 0.5) * 8;
      mesh.position.set(spreadX, spreadY, spreadZ);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(mesh);

      spheres.push({
        mesh,
        scale,
        radius: scale * 0.96,
        pos: mesh.position,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      });
    }

    // 7. Glowing Pointer Ball (matches pink/purple glowing orb from reference image!)
    const pointerVisual = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xd946ef })
    );
    pointerVisual.position.set(0, -100, 0);
    scene.add(pointerVisual);

    const pointerGlow = new THREE.PointLight(0xe879f9, 3, 10);
    pointerVisual.add(pointerGlow);

    const pointerTarget = new THREE.Vector3(0, -100, 0);
    const pointerPos = new THREE.Vector3(0, -100, 0);
    const pointerRadius = 1.8; // Physics collision radius

    // 8. Mouse / Pointer Tracking
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePlanePos = new THREE.Vector3();

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
      raycaster.ray.intersectPlane(planeZ, mousePlanePos);
      pointerTarget.copy(mousePlanePos);
    };

    const onPointerLeave = () => {
      pointerTarget.set(0, -100, 0);
    };

    window.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    // 9. Physics Simulation & Render Loop
    let lastTime = performance.now();
    let animId = null;

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      // Move pointer toward target
      pointerPos.lerp(pointerTarget, 0.15);
      pointerVisual.position.copy(pointerPos);

      // Center attraction pull
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];

        // Stronger Y pull gives the elliptical cluster matching reference image
        const pullX = -s.pos.x * 24 * s.scale;
        const pullY = -s.pos.y * 60 * s.scale;
        const pullZ = -s.pos.z * 24 * s.scale;

        s.vel.x += pullX * dt;
        s.vel.y += pullY * dt;
        s.vel.z += pullZ * dt;

        // Pointer collision
        const distToPointer = s.pos.distanceTo(pointerPos);
        const minPointerDist = s.radius + pointerRadius;
        if (distToPointer < minPointerDist && distToPointer > 0.001) {
          const overlap = minPointerDist - distToPointer;
          const nx = (s.pos.x - pointerPos.x) / distToPointer;
          const ny = (s.pos.y - pointerPos.y) / distToPointer;
          const nz = (s.pos.z - pointerPos.z) / distToPointer;

          s.pos.x += nx * overlap * 0.7;
          s.pos.y += ny * overlap * 0.7;
          s.pos.z += nz * overlap * 0.7;

          s.vel.x += nx * (overlap * 20 + 4);
          s.vel.y += ny * (overlap * 20 + 4);
          s.vel.z += nz * (overlap * 20 + 4);
        }
      }

      // Sphere-to-Sphere collisions
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const s1 = spheres[i];
          const s2 = spheres[j];

          const dx = s1.pos.x - s2.pos.x;
          const dy = s1.pos.y - s2.pos.y;
          const dz = s1.pos.z - s2.pos.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const minDist = s1.radius + s2.radius;

          if (dist < minDist && dist > 0.0001) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;

            // Separate spheres
            const sep = overlap * 0.5;
            s1.pos.x += nx * sep;
            s1.pos.y += ny * sep;
            s1.pos.z += nz * sep;

            s2.pos.x -= nx * sep;
            s2.pos.y -= ny * sep;
            s2.pos.z -= nz * sep;

            // Relative velocity & bounce
            const rvx = s1.vel.x - s2.vel.x;
            const rvy = s1.vel.y - s2.vel.y;
            const rvz = s1.vel.z - s2.vel.z;
            const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

            if (velAlongNormal < 0) {
              const restitution = 0.45;
              const impulse = -(1 + restitution) * velAlongNormal * 0.5;
              s1.vel.x += nx * impulse;
              s1.vel.y += ny * impulse;
              s1.vel.z += nz * impulse;

              s2.vel.x -= nx * impulse;
              s2.vel.y -= ny * impulse;
              s2.vel.z -= nz * impulse;
            }
          }
        }
      }

      // Integration, friction damping & mesh updates
      const damping = Math.pow(0.92, dt * 60);
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        s.vel.multiplyScalar(damping);

        s.pos.x += s.vel.x * dt;
        s.pos.y += s.vel.y * dt;
        s.pos.z += s.vel.z * dt;

        s.mesh.rotation.x += s.rotVel.x * dt;
        s.mesh.rotation.y += s.rotVel.y * dt;
        s.mesh.rotation.z += s.rotVel.z * dt;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();
      renderer.dispose();
      sphereGeometry.dispose();
      materials.forEach((m) => m.dispose());
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="techstack" id="skills">
      <h2>MY TECHSTACK</h2>
      <div className="tech-canvas" ref={containerRef} />
    </section>
  );
}
