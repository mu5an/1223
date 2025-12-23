const $ = (sel) => document.querySelector(sel);
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

const tree = document.getElementById('tree');
const btn = document.getElementById('partyBtn');
const audio = document.getElementById('xmasSound');
const snowContainer = document.querySelector('.snow');
const body = document.body;

let isParty = false;
let snowIntervalId = null;


btn.addEventListener('click',async() =>{
    isParty = !isParty;

    if(isParty){
        tree.classList.add('party');
        btn.textContent ='演奏停止';

        try{
            audio.currentTime = 0;
            await audio.play();
        }catch(e){
            console.warn('Audio play was blockd:',e);
        }
    }else{
        tree.classList.remove('party');
        btn.textContent = 'クリック演出';

        audio.pause();
        audio.currentTime = 0;
    }
});

function createFlake() {
  if (!snowContainer) return null;

  const flake = document.createElement('span');
  flake.className = 'flake';
  flake.setAttribute('aria-hidden', 'true');
  flake.dataset.dynamic = '1'; // mark as dynamically created

  // set CSS variables expected by style.css
  const x = `${rand(0, 100).toFixed(2)}%`;
  const s = `${rand(2, 10).toFixed(2)}px`;
  const o = `${rand(0.35, 0.95).toFixed(2)}`;
  const d = `${rand(4, 18).toFixed(2)}s`; // duration
  const delay = `${rand(0, 3).toFixed(2)}s`; // small initial delay
  const drift = `${rand(-120, 120).toFixed(2)}px`;

  flake.style.setProperty('--x', x);
  flake.style.setProperty('--s', s);
  flake.style.setProperty('--o', o);
  flake.style.setProperty('--d', d);
  flake.style.setProperty('--delay', delay);
  flake.style.setProperty('--drift', drift);

  // ensure the dynamic flake runs only once (CSS has infinite by default)
  // override iteration count so it falls and we can remove it on animationend
  flake.style.animationIterationCount = '1';
  // make sure it runs immediately if snowing is active
  flake.style.animationPlayState = body.classList.contains('snowing') ? 'running' : 'paused';

  // append and remove after animation finishes
  const removeFn = () => {
    flake.removeEventListener('animationend', removeFn);
    if (flake.parentNode) flake.parentNode.removeChild(flake);
  };
  flake.addEventListener('animationend', removeFn);

  snowContainer.appendChild(flake);

  // safety: remove after max duration (in case animationend doesn't fire)
  const maxMs = Math.ceil(parseFloat(d) * 1000) + 2000;
  setTimeout(() => {
    if (flake.parentNode) flake.remove();
  }, maxMs);

  return flake;
}

function startSnow(intensity = 6) {
  // intensity: approximate flakes created per second
  if (!snowContainer) return;
  if (snowIntervalId) return; // already running

  // Make sure body.snowing is set so CSS static flakes animate
  body.classList.add('snowing');

  // Spawn a few initial flakes with stagger
  for (let i = 0; i < Math.ceil(intensity * 1.5); i++) {
    setTimeout(() => createFlake(), Math.random() * 800);
  }

  const intervalMs = Math.max(40, 1000 / intensity);
  snowIntervalId = setInterval(() => {
    createFlake();
    // random extra flakes to vary rhythm
    if (Math.random() > 0.6) createFlake();
  }, intervalMs);

  // update button text if present
  if (snowBtn) snowBtn.textContent = '⛄ 雪を止める';
}

function stopSnow() {
  // remove dynamic flakes and stop spawning; keep static flakes but pause them via body class
  if (snowIntervalId) {
    clearInterval(snowIntervalId);
    snowIntervalId = null;
  }

  // remove only dynamically created flakes
  if (snowContainer) {
    const dyn = snowContainer.querySelectorAll('.flake[data-dynamic="1"]');
    dyn.forEach(f => f.remove());
  }

  // pause CSS-driven flakes by removing class
  body.classList.remove('snowing');

  if (snowBtn) snowBtn.textContent = '❄ 雪を降らす';
}

// SNOW button
if (snowBtn) {
  snowBtn.addEventListener('click', () => {
    if (snowIntervalId) {
      stopSnow();
    } else {
      // default intensity: 6 flakes/sec (tweak to taste)
      startSnow(6);
    }
  });
}

// Accessibility / initial state
// Ensure .snow exists; if not, create a container so script still works.
if (!snowContainer) {
  const sc = document.createElement('div');
  sc.className = 'snow';
  sc.setAttribute('aria-hidden', 'true');
  Object.assign(sc.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '0',
    overflow: 'hidden',
    opacity: '0'
  });
  document.body.appendChild(sc);
}

// Optional: expose controls for debugging in console
window.__XMAS = {
  startSnow,
  stopSnow,
  createFlake
};