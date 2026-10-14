// @ts-nocheck
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Responsive Canvas Size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();

const frameCount = 48; // Total frames count

// Aapke frame naming format: frame_001.png ... frame_048.png
const currentFrame = (index) =>
  `images/frames/frame_${(index + 1).toString().padStart(3, "0")}.png`;

const images = [];
const rocketAnimation = { frame: 0 }; // GSAP is object ki value 0 se 47 tak badhayega

// Saare frames preload karna
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Canvas par frame draw karne ka function
function render() {
  const img = images[rocketAnimation.frame];
  if (!img || !img.complete) return;

  // Aspect Ratio maintain karke screen par fill/cover karna
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);

  const centerShiftX = (canvas.width - img.width * ratio) / 2;
  const centerShiftY = (canvas.height - img.height * ratio) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShiftX,
    centerShiftY,
    img.width * ratio,
    img.height * ratio
  );
}

// Pehla frame ready hote hi screen par render karna
if (images[0].complete) {
  render();
} else {
  images[0].onload = render;
}

window.addEventListener("resize", () => {
  setCanvasSize();
  render();
});

// ScrollTimeline: Scroll ke sath frames run honge
// Timeline setup: Scroll depth thoda bada kar lijiye taaki reading space mile
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=250%", // Scroll space ko 150% se badha kar 250% karein
    pin: true,
    scrub: 1
  }
});

// 1. Frames scrub (0 se last frame tak)
tl.to(rocketAnimation, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  onUpdate: render
}, 0);

// 2. Starting title aur stats turant fade out ho jayenge
tl.to(".content-overlay", {
  opacity: 0,
  y: -40,
  duration: 0.2,
  ease: "power1.out"
}, 0);

// YAHAN LAGAYEIN: Scroll ke dauran aane wale text steps
// Step 1: Animation ke shuruati scroll par
tl.to(".step-1", { opacity: 1, y: -10, duration: 0.2 }, 0.25)
  .to(".step-1", { opacity: 0, y: -30, duration: 0.2 }, 0.45);

// Step 2: Beech me jab animation chal rahi ho
tl.to(".step-2", { opacity: 1, y: -10, duration: 0.2 }, 0.55)
  .to(".step-2", { opacity: 0, y: -30, duration: 0.2 }, 0.75);

// Step 3: Aakhiri frames aane par
tl.to(".step-3", { opacity: 1, y: -10, duration: 0.2 }, 0.85)
  .to(".step-3", { opacity: 0, y: -30, duration: 0.2 }, 0.98);
// 2. Scroll shuru hote hi text aur stats ka gayab hona
tl.to(".content-overlay", {
  opacity: 0,
  y: -50,
  ease: "power1.out"
}, 0);

