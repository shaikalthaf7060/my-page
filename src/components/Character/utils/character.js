import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { setCharTimeline, setAllTimeline } from "../../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

let cachedCharacterBlobPromise = null;
export const preloadCharacterAsset = () => {
  if (!cachedCharacterBlobPromise) {
    cachedCharacterBlobPromise = decryptFile(
      "/models/character.bin?v=4",
      "MyCharacter12"
    );
  }
  return cachedCharacterBlobPromise;
};
preloadCharacterAsset();

const setCharacter = (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const encryptedBlob = await preloadCharacterAsset();
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child) => {
              if (child.isMesh) {
                const mesh = child;
                if (mesh.material) {
                  if (mesh.name === "BODY.SHIRT" || mesh.name.includes("SHIRT")) {
                    const newMat = mesh.material.clone();
                    newMat.color = new THREE.Color("#161719");
                    newMat.roughness = 0.88;
                    newMat.metalness = 0.0;
                    mesh.material = newMat;
                  } else if (mesh.name === "Pant" || mesh.name.includes("Pant")) {
                    const newMat = mesh.material.clone();
                    newMat.color = new THREE.Color("#000000");
                    mesh.material = newMat;
                  } else if (mesh.name === "CAP.001") {
                    const newMat = mesh.material.clone();
                    newMat.color = new THREE.Color("#dcdcdc");
                    newMat.roughness = 0.35;
                    newMat.metalness = 0.45;
                    mesh.material = newMat;
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();

            const footR = character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL = character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            window.__characterLoaded = true;
            window.dispatchEvent(new CustomEvent("characterReady"));

            dracoLoader.dispose();
            URL.revokeObjectURL(blobUrl);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
