const clock = new THREE.Clock();
const scene = new THREE.Scene();
const loader = new THREE.GLTFLoader();
let ww = innerWidth;
let wh = innerHeight;
let renderer = new THREE.WebGLRenderer();
let camera = new THREE.PerspectiveCamera(100, ww / wh, 0.01, 10);
let mixer;
let prevAction;
const actions = [];
const field = document.getElementById("buttonField");

resizeHandler();
camera.position.set(0, 1, 3);
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xdddddd));

loader.load("./sample-anim.glb", gltf => {
  mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach(animation => {
    actions.push(mixer.clipAction(animation));
  });
  scene.add(gltf.scene);

  actions.forEach(action => {
    const button = document.createElement("div");
    button.classList.add("button");
    button.textContent = action._clip.name;
    buttonField.appendChild(button);
    action.clampWhenFinished = true;
    button.addEventListener("click", () => {
      if (prevAction) {
        action
          .crossFadeFrom(prevAction, 0.5, false)
          .reset()
          .play();
      } else {
        action.reset().play();
      }

      Array.from(buttonField.children).forEach(child =>
        child.setAttribute("data-active", false)
      );
      button.setAttribute("data-active", true);
      prevAction = action;
    });
  });
});

function anim() {
  requestAnimationFrame(anim);
  const delta = clock.getDelta();
  if (!!mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

function resizeHandler() {
  ww = innerWidth;
  wh = innerHeight;
  renderer.setSize(ww, wh);
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
}

anim();
window.addEventListener("resize", resizeHandler);
