import React, { useEffect, useRef } from 'react';
import './Canvas.css';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Handle canvas resizing and high-DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set the canvas logical size in device pixels and CSS size in layout pixels
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Reset transform and scale for high-DPI rendering
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      // Optional: set default drawing styles after resize
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Handle pointer events for drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPoint = (e: PointerEvent) => ({ x: e.clientX, y: e.clientY });

    const onPointerDown = (e: PointerEvent) => {
      (e.target as Element).setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      lastPointRef.current = getPoint(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      const p = getPoint(e);
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastPointRef.current = p;
    };

    const stop = (e: PointerEvent) => {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
      isDrawingRef.current = false;
      lastPointRef.current = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, []);

  return <canvas className="fullscreen-canvas" ref={canvasRef} />;
};

export default Canvas;
