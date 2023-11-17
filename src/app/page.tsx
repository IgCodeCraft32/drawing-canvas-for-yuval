"use client"
import { useState, useRef, useEffect } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineLength, setLineLength] = useState(0);
  const [color, setColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.strokeStyle = color;
        ctx.lineWidth = penWidth;
      }
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing || !ctx) return;

      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();

      setLineLength((prevLength) => prevLength + Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)));

      if (lineLength >= 300) {
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        submitBtn.style.display = 'block';
      }
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const checkLineLength = () => {
      if (lineLength >= 300) {
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        submitBtn.style.display = 'block';
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('mouseenter', checkLineLength);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('mouseenter', checkLineLength);
    };
  }, [isDrawing, lineLength, color, penWidth]);

  const submitDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  };

  const updateColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const updatePenWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenWidth(Number(e.target.value));
  };

  return (
    <div>
      <div id="options">
        <label htmlFor="colorPicker">Select Color:</label>
        <input type="color" id="colorPicker" value={color} onChange={updateColor} />

        <label htmlFor="penWidth">Pen Width:</label>
        <input type="number" id="penWidth" value={penWidth} min="1" onChange={updatePenWidth} />
      </div>

      <canvas id="drawingCanvas" ref={canvasRef} width="300" height="300"></canvas>

      <button id="submitBtn" onClick={submitDrawing}>
        Submit
      </button>
    </div>
  );
};

export default DrawingCanvas;
