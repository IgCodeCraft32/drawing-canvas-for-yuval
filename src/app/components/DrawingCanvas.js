'use client'
// components/DrawingCanvas.js
import React from 'react';
import dynamic from 'next/dynamic';

const SketchPicker = dynamic(() => import('react-color').then((module) => module.SketchPicker), {
  ssr: false,
});

let isDrawing = false;
let lineLength = 0;
let color = '#000000';
let penWidth = 2;

const DrawingCanvas = () => {
  const initializeCanvas = () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    const startDrawing = (e) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.strokeStyle = color;
      ctx.lineWidth = penWidth;
    };

    const draw = (e) => {
      if (!isDrawing) return;

      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();

      lineLength += Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));

      if (lineLength >= 300) {
        document.getElementById('submitBtn').style.display = 'block';
      }
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const checkLineLength = () => {
      // Check line length on mouse re-enter
      if (lineLength >= 300) {
        document.getElementById('submitBtn').style.display = 'block';
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
  };

  const handleColorChange = (newColor) => {
    color = newColor.hex;
  };

  const submitDrawing = () => {
    // Download the canvas as an image
    const canvas = document.getElementById('drawingCanvas');
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  };

  // Initialize the canvas on component mount
  React.useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div>
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
      <canvas
        id="drawingCanvas"
        width={300}
        height={300}
        style={{ border: '2px solid #000', marginTop: '10px' }}
      ></canvas>
      <div>
        <label htmlFor="penWidth">Pen Width:</label>
        <input
          type="number"
          id="penWidth"
          value={penWidth}
          min="1"
          onChange={(e) => (penWidth = e.target.value)}
        />
      </div>
      <button id="submitBtn" onClick={submitDrawing}>
        Submit
      </button>
    </div>
  );
};

export default DrawingCanvas;
 