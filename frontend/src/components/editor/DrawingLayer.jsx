import { useEffect, useRef, useState, useCallback } from 'react';
import { useUIStore, useEditorStore } from '@/store';

const BRUSH_SIZES = { ballpoint: 2, pencil: 3, highlighter: 20, eraser: 25, lasso: 2 };
const BRUSH_OPACITY = { ballpoint: 1, pencil: 0.8, highlighter: 0.4, eraser: 1 };

export function DrawingLayer() {
  const { drawingTool, drawingColor, drawingSize, drawingHistory, setDrawingHistory } = useUIStore();
  const { editor } = useEditorStore();
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [displayMode, setDisplayMode] = useState('normal'); // 'replay' for playback

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const pageContainers = document.querySelectorAll('[id^="document-page-"]');
    
    if (pageContainers.length === 0) return;

    const pageWrapper = pageContainers[0];
    const rect = pageWrapper.getBoundingClientRect();
    const scrollArea = document.getElementById('editor-scroll-area');
    const scrollRect = scrollArea?.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height * pageContainers.length;
    
    canvas.style.position = 'absolute';
    canvas.style.top = (scrollRect?.top + scrollArea?.scrollTop - rect.top) + 'px';
    canvas.style.left = (scrollRect?.left + scrollArea?.scrollLeft - rect.left) + 'px';
    canvas.style.pointerEvents = drawingTool && drawingTool !== 'select' ? 'auto' : 'none';
    canvas.style.cursor = drawingTool === 'select' ? 'default' : drawingTool === 'lasso' ? 'crosshair' : 'crosshair';
    canvas.style.zIndex = '100';

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Restore drawing from history
    if (drawingHistory.length > 0) {
      drawingHistory.forEach(stroke => drawStroke(context, stroke));
    }
  }, [drawingTool, drawingHistory]);

  // Draw a single stroke
  const drawStroke = (ctx, stroke) => {
    if (!stroke || stroke.points.length < 2) return;

    const tool = stroke.tool;
    const size = stroke.size || BRUSH_SIZES[tool] || 2;
    const color = stroke.color || drawingColor;
    const opacity = BRUSH_OPACITY[tool] || 1;

    ctx.strokeStyle = tool === 'eraser' 
      ? 'rgba(255,255,255,1)' 
      : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
    
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      if (tool === 'pencil') {
        // Add slight texture to pencil
        ctx.globalAlpha = Math.random() * 0.3 + 0.7;
      }
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  // Handle mouse events
  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!drawingTool || drawingTool === 'select' || !canvasRef.current) return;
    
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setCurrentStroke([coords]);
  }, [drawingTool, getCanvasCoords]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !contextRef.current) return;
    
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setCurrentStroke(prev => [...prev, coords]);

    const ctx = contextRef.current;
    const size = drawingSize || BRUSH_SIZES[drawingTool];
    const opacity = BRUSH_OPACITY[drawingTool];

    ctx.strokeStyle = drawingTool === 'eraser'
      ? 'rgba(255,255,255,1)'
      : `rgba(${parseInt(drawingColor.slice(1, 3), 16)}, ${parseInt(drawingColor.slice(3, 5), 16)}, ${parseInt(drawingColor.slice(5, 7), 16)}, ${opacity})`;
    
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = drawingTool === 'eraser' ? 'destination-out' : 'source-over';

    if (drawingTool === 'pencil') {
      ctx.globalAlpha = Math.random() * 0.3 + 0.7;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, [isDrawing, drawingTool, drawingColor, drawingSize, getCanvasCoords]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !contextRef.current) return;

    setIsDrawing(false);

    if (currentStroke.length > 1) {
      const newStroke = {
        tool: drawingTool,
        color: drawingColor,
        size: drawingSize || BRUSH_SIZES[drawingTool],
        points: currentStroke,
        timestamp: Date.now(),
      };

      setDrawingHistory([...drawingHistory, newStroke]);
    }

    setCurrentStroke([]);
  }, [isDrawing, currentStroke, drawingTool, drawingColor, drawingSize, drawingHistory, setDrawingHistory]);

  // Add mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  // Replay animation
  const replayDrawing = useCallback(async () => {
    if (!contextRef.current || drawingHistory.length === 0) return;

    setDisplayMode('replay');
    
    // Clear canvas
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const stroke of drawingHistory) {
      await new Promise(async (resolve) => {
        for (let i = 1; i < stroke.points.length; i++) {
          await delay(10); // 10ms between points for smooth playback
          drawStroke(contextRef.current, {
            ...stroke,
            points: stroke.points.slice(0, i + 1),
          });
        }
        resolve();
      });
    }

    setDisplayMode('normal');
  }, [drawingHistory]);

  // Flatten to image
  const flattenDrawing = useCallback(async () => {
    if (!canvasRef.current || drawingHistory.length === 0) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');

    // Insert as image in editor
    if (editor && dataUrl) {
      editor.chain().setImage({ src: dataUrl }).run();
    }

    // Reset drawing
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingHistory([]);
  }, [canvasRef, drawingHistory, editor, setDrawingHistory]);

  // Handle select tool
  useEffect(() => {
    if (drawingTool === 'select' && drawingHistory.length > 0) {
      flattenDrawing();
    }
  }, [drawingTool, drawingHistory, flattenDrawing]);

  // Expose replay and flatten functions through window for Ribbon access
  useEffect(() => {
    window.drawingLayerReplay = replayDrawing;
    window.drawingLayerFlatten = flattenDrawing;

    return () => {
      delete window.drawingLayerReplay;
      delete window.drawingLayerFlatten;
    };
  }, [replayDrawing, flattenDrawing]);

  if (!drawingTool || drawingTool === 'select') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      id="drawing-layer-canvas"
      style={{
        background: 'transparent',
      }}
    />
  );
}
