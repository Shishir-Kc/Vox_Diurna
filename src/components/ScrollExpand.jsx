import { useCallback, useEffect, useRef } from 'react';
import './ScrollExpand.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const smoothstep = (start, end, value) => {
  const progress = clamp((value - start) / (end - start || 1e-6), 0, 1);
  return progress * progress * (3 - 2 * progress);
};

export default function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);
  const propsRef = useRef(null);

  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  };

  const applyProgress = useCallback((progress) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const config = propsRef.current;
    const eased = smoothstep(0, 1, progress);
    const width = config.startWidth + (100 - config.startWidth) * eased;
    const height = config.startHeight + (100 - config.startHeight) * eased;
    const insetX = Math.max(0, (100 - width) / 2);
    const insetY = Math.max(0, (100 - height) / 2);
    const radius = config.startRadius + (config.endRadius - config.startRadius) * eased;

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    media.style.transform = `scale(${config.mediaZoom + (1 - config.mediaZoom) * eased})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${config.overlayScrim * eased}`;

    if (titleRef.current) {
      const fade = smoothstep(0.4, 0.88, progress);
      titleRef.current.style.opacity = `${1 - fade}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * fade}px, 0) scale(${1 + 0.06 * fade})`;
    }

    if (hintRef.current) {
      const fade = smoothstep(0, 0.12, progress);
      hintRef.current.style.opacity = `${1 - fade}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * fade}px, 0)`;
    }

    if (overlayRef.current) {
      const fade = smoothstep(0.68, 1, progress);
      overlayRef.current.style.opacity = `${fade}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - fade)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;
    let current = 0;
    let target = 0;
    let stageHeight = 0;
    let running = false;

    const measure = () => {
      const config = propsRef.current;
      stageHeight = config.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageHeight <= 0) return;

      stage.style.height = `${stageHeight}px`;
      track.style.height = `${stageHeight * (1 + Math.max(0, config.scrollDistance) + Math.max(0, config.holdDistance))}px`;
      const width = root.clientWidth || stageHeight;
      stage.style.setProperty('--scroll-expand-title-size', `${clamp(width * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const config = propsRef.current;
      if (!config.enabled) return 1;
      const span = stageHeight * Math.max(0.01, config.scrollDistance);
      if (config.useWindowScroll) {
        return clamp(-track.getBoundingClientRect().top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const config = propsRef.current;
      const follow = config.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * config.smoothing));
      current += (target - current) * follow;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      animationFrame = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!animationFrame) animationFrame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media = mediaType === 'video' ? (
    <video
      ref={mediaRef}
      className="scroll-expand__media"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <img
      ref={mediaRef}
      className="scroll-expand__media"
      src={src}
      alt={alt}
      draggable="false"
    />
  );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">{children}</div>
            ) : null}
          </div>
          {title ? <div ref={titleRef} className="scroll-expand__title">{title}</div> : null}
          {scrollHint ? <div ref={hintRef} className="scroll-expand__hint">{scrollHint}</div> : null}
        </div>
      </div>
    </div>
  );
}
