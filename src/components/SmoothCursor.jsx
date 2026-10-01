import { useEffect, useRef } from 'react';

const DESKTOP_POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)';
const SPRING = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 };
const LINK_MAGNET_RADIUS = 120;
const LINK_MAGNET_STRENGTH = 0.3;
const LINK_MAGNET_MAX_OFFSET = 16;

function getMagneticPoint(x, y) {
  const links = document.querySelectorAll('a');
  let closestLink = null;
  let closestDistance = LINK_MAGNET_RADIUS;

  for (const link of links) {
    if (!link.textContent?.trim()) continue;
    const rect = link.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const nearestX = Math.max(rect.left, Math.min(x, rect.right));
    const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));
    const distance = Math.hypot(x - nearestX, y - nearestY);
    if (distance < closestDistance) {
      closestLink = rect;
      closestDistance = distance;
    }
  }

  if (!closestLink) return { x, y };

  const pointerIsInsideLink = x >= closestLink.left
    && x <= closestLink.right
    && y >= closestLink.top
    && y <= closestLink.bottom;
  if (pointerIsInsideLink) return { x, y };

  const centerX = closestLink.left + closestLink.width / 2;
  const centerY = closestLink.top + closestLink.height / 2;
  const deltaX = centerX - x;
  const deltaY = centerY - y;
  const distanceToCenter = Math.hypot(deltaX, deltaY);
  if (!distanceToCenter) return { x, y };

  const proximityProgress = 1 - closestDistance / LINK_MAGNET_RADIUS;
  const proximity = proximityProgress * proximityProgress * (3 - 2 * proximityProgress);
  const pull = Math.min(distanceToCenter * LINK_MAGNET_STRENGTH * proximity, LINK_MAGNET_MAX_OFFSET);
  return {
    x: x + (deltaX / distanceToCenter) * pull,
    y: y + (deltaY / distanceToCenter) * pull,
  };
}

function DefaultCursor() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="54"
      viewBox="0 0 50 54"
      fill="none"
      aria-hidden="true"
    >
      <g filter="url(#smooth-cursor-shadow)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth="2.25825"
        />
      </g>
      <defs>
        <filter
          id="smooth-cursor-shadow"
          x="0.602397"
          y="0.952444"
          width="49.0584"
          height="52.428"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.25825" />
          <feGaussianBlur stdDeviation="2.25825" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default function SmoothCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const pointerQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const target = { x: 0, y: 0, rotation: 0, scale: 1 };
    const current = { x: 0, y: 0, rotation: 0, scale: 1 };
    const speed = { x: 0, y: 0, rotation: 0, scale: 0 };
    let active = false;
    let hasPosition = false;
    let frameId = 0;
    let lastFrameTime = 0;
    let lastPointer = null;
    let previousAngle = 0;
    let scaleTimeout = 0;

    const isEnabled = () => pointerQuery.matches && !reducedMotionQuery.matches;

    const render = (visible = true) => {
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) rotate(${current.rotation}deg) scale(${current.scale})`;
      cursor.style.opacity = visible && hasPosition ? '1' : '0';
    };

    const stopAnimation = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrameTime = 0;
    };

    const updateEnabled = () => {
      const shouldEnable = isEnabled();
      if (shouldEnable === active) return;

      active = shouldEnable;
      if (active) {
        document.body.classList.add('smooth-cursor-active');
        document.documentElement.classList.add('smooth-cursor-active');
      } else {
        document.body.classList.remove('smooth-cursor-active');
        document.documentElement.classList.remove('smooth-cursor-active');
        hasPosition = false;
        lastPointer = null;
        stopAnimation();
        render(false);
      }
    };

    const frame = (time) => {
      frameId = 0;
      if (!active || !hasPosition) return;

      const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.032) : 0;
      lastFrameTime = time;

      if (delta > 0) {
        const damping = Math.exp(-SPRING.damping / SPRING.mass * delta);
        for (const key of ['x', 'y', 'rotation', 'scale']) {
          const acceleration = ((target[key] - current[key]) * SPRING.stiffness) / SPRING.mass;
          speed[key] = (speed[key] + acceleration * delta) * damping;
          current[key] += speed[key] * delta;
        }
      }

      render();

      const settled = ['x', 'y', 'rotation', 'scale'].every(
        (key) => Math.abs(target[key] - current[key]) < SPRING.restDelta && Math.abs(speed[key]) < SPRING.restDelta,
      );
      if (!settled) frameId = requestAnimationFrame(frame);
      else lastFrameTime = 0;
    };

    const scheduleFrame = () => {
      if (!frameId) {
        lastFrameTime = 0;
        frameId = requestAnimationFrame(frame);
      }
    };

    const onPointerMove = (event) => {
      if (!active || event.pointerType === 'touch') return;

      const magneticPoint = getMagneticPoint(event.clientX, event.clientY);

      const now = event.timeStamp || performance.now();
      if (!hasPosition) {
        current.x = target.x = magneticPoint.x;
        current.y = target.y = magneticPoint.y;
        hasPosition = true;
        lastPointer = { x: event.clientX, y: event.clientY, time: now };
        render();
      } else if (lastPointer) {
        const deltaTime = now - lastPointer.time;
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;
        if (deltaTime > 0 && Math.hypot(deltaX, deltaY) / deltaTime > 0.1) {
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
          let angleDelta = angle - previousAngle;
          if (angleDelta > 180) angleDelta -= 360;
          if (angleDelta < -180) angleDelta += 360;
          target.rotation += angleDelta;
          previousAngle = angle;
          target.scale = 0.95;
          window.clearTimeout(scaleTimeout);
          scaleTimeout = window.setTimeout(() => {
            target.scale = 1;
            scheduleFrame();
          }, 150);
        }
        lastPointer = { x: event.clientX, y: event.clientY, time: now };
        target.x = magneticPoint.x;
        target.y = magneticPoint.y;
      }

      scheduleFrame();
    };

    const hide = () => render(false);
    const onVisibilityChange = () => {
      if (document.hidden) {
        hide();
        stopAnimation();
      }
    };

    updateEnabled();
    pointerQuery.addEventListener('change', updateEnabled);
    reducedMotionQuery.addEventListener('change', updateEnabled);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      pointerQuery.removeEventListener('change', updateEnabled);
      reducedMotionQuery.removeEventListener('change', updateEnabled);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', hide);
      window.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.body.classList.remove('smooth-cursor-active');
      document.documentElement.classList.remove('smooth-cursor-active');
      window.clearTimeout(scaleTimeout);
      stopAnimation();
    };
  }, []);

  return (
    <div ref={cursorRef} className="smooth-cursor" aria-hidden="true">
      <DefaultCursor />
    </div>
  );
}
