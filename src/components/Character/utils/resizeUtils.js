import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../../utils/GsapScroll";

export default function handleResize(
  renderer,
  camera,
  canvasDiv,
  character
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  if (character) {
    if (window.scrollY === 0) {
      character.rotation.set(0, 0, 0);
      camera.position.set(0, 13.3, 26.5);
    }
    setCharTimeline(character, camera);
  }
  setAllTimeline();
}
