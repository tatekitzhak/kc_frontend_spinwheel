import React, { useEffect, useRef, useState } from 'react';

interface WheelProps {
  entries: string[];
  onWinner: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A', '#85C1E9'
];

export default function Wheel({ entries, onWinner, isSpinning, setIsSpinning }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const requestRef = useRef<number>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.45;

    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f3f4f6';
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Add entries to start', center, center);
      return;
    }

    const sliceAngle = (Math.PI * 2) / entries.length;

    entries.forEach((entry, i) => {
      const startAngle = rotationRef.current + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, 44 - entries.length)}px Inter`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(entry, radius - 20, 5);
      ctx.restore();
    });

    // Draw center pin
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(size - 10, center);
    ctx.lineTo(size - 40, center - 15);
    ctx.lineTo(size - 40, center + 15);
    ctx.closePath();
    ctx.fillStyle = '#1f2937';
    ctx.fill();
  };

  const animate = (time: number) => {
    if (velocityRef.current > 0.001) {
      rotationRef.current += velocityRef.current;
      velocityRef.current *= 0.985; // Friction
      setRotation(rotationRef.current);
      draw();
      requestRef.current = requestAnimationFrame(animate);
    } else if (isSpinning) {
      setIsSpinning(false);
      velocityRef.current = 0;
      
      // Calculate winner
      // The pointer is at 0 degrees (right side)
      // The slices are drawn starting from rotationRef.current
      // A slice i is at [rotation + i*sliceAngle, rotation + (i+1)*sliceAngle]
      // We want to find which slice contains the angle 0 (or 2*PI)
      const sliceAngle = (Math.PI * 2) / entries.length;
      const normalizedRotation = rotationRef.current % (Math.PI * 2);
      
      // The pointer is at 0. We need to find which slice i satisfies:
      // (rotation + i*sliceAngle) <= 0 <= (rotation + (i+1)*sliceAngle) mod 2PI
      // Or more simply, the angle pointing to the pointer is -rotation
      let winningAngle = -normalizedRotation;
      while (winningAngle < 0) winningAngle += Math.PI * 2;
      const winnerIndex = Math.floor(winningAngle / sliceAngle) % entries.length;
      
      onWinner(entries[winnerIndex]);
    }
  };

  useEffect(() => {
    if (isSpinning && velocityRef.current === 0) {
      velocityRef.current = 0.3 + Math.random() * 0.4;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isSpinning]);

  useEffect(() => {
    
    draw();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [entries]);

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="w-full h-full drop-shadow-2xl"
      />
    </div>
  );
}
