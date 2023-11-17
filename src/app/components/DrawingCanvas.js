'use client'
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';

const DrawingCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineLength, setLineLength] = useState(0);
  const [color, setColor] = useState('#FF0000');
  const [penWidth, setPenWidth] = useState(2);

  const initializeCanvas = () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.style.cursor = 'crosshair';

    const marker = new Image();
    marker.src = '/pointer_1538.png'; // Replace with the actual path to your image
    
    const markerSize = 20;

    const startDrawing = (e) => {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.strokeStyle = color;
      ctx.lineWidth = penWidth;
    };

    const draw = (e) => {
      if (!isDrawing) return;

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(marker, x - markerSize / 2, y - markerSize / 2, markerSize, markerSize);

      ctx.lineTo(x, y);
      ctx.stroke();

      // Update the line length
      setLineLength((prevLength) => prevLength + Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)));

      if (lineLength >= 300) {
        document.getElementById('submitBtn').style.display = 'block';
      }
    };
    
    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
    };

    const checkLineLength = () => {
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
    setColor(newColor.hex);
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
  useEffect(() => {
    initializeCanvas();
  }, [color, isDrawing, lineLength, penWidth]);

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
          onChange={(e) => setPenWidth(e.target.value)}
        />
      </div>
      <button id="submitBtn" onClick={submitDrawing}>
        Submit
      </button>
    </div>
  );
};

export default DrawingCanvas;
