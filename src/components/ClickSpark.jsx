import { useCallback, useEffect, useRef } from 'react';

export default function ClickSpark({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationRef = useRef(0);
  const drawRef = useRef(null);

  const ease = useCallback((progress) => {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      default:
        return progress * (2 - progress);
    }
  }, [easing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const resizeCanvas = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (timestamp) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);
      const themeColor = sparkColor.match(/^var\((--[\w-]+)\)$/);
      context.strokeStyle = themeColor
        ? getComputedStyle(document.documentElement).getPropertyValue(themeColor[1]).trim() || '#fff'
        : sparkColor;
      context.lineWidth = 2;
      context.lineCap = 'round';

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = Math.max(0, elapsed / duration);
        const traveled = ease(progress) * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - ease(progress));
        const directionX = Math.cos(spark.angle);
        const directionY = Math.sin(spark.angle);

        context.beginPath();
        context.moveTo(
          spark.x + traveled * directionX,
          spark.y + traveled * directionY,
        );
        context.lineTo(
          spark.x + (traveled + lineLength) * directionX,
          spark.y + (traveled + lineLength) * directionY,
        );
        context.stroke();
        return true;
      });

      if (sparksRef.current.length) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        animationRef.current = 0;
      }
    };

    drawRef.current = draw;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      drawRef.current = null;
    };
  }, [duration, ease, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClickCapture = useCallback((event) => {
    if (
      event.detail === 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const now = performance.now();
    for (let index = 0; index < sparkCount; index += 1) {
      sparksRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        angle: (Math.PI * 2 * index) / sparkCount,
        startTime: now,
      });
    }

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame((timestamp) => {
        animationRef.current = 0;
        drawRef.current?.(timestamp);
      });
    }
  }, [sparkCount]);

  return (
    <div className="click-spark-root" onClickCapture={handleClickCapture}>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </div>
  );
}
