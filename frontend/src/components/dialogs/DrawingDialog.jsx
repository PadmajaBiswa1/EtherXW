import { useRef, useState, useEffect } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Modal, Button, ColorSwatch, Tooltip } from '@/components/ui';

const TOOLS  = [{ id:'pen', icon:'✏', label:'Pen' }, { id:'highlighter', icon:'🖍', label:'Highlighter' }, { id:'eraser', icon:'⬜', label:'Eraser' }];
const COLORS = ['#d4af37','#e8d98a','#ffffff','#ff5555','#55ff88','#55aaff','#ff55ff','#000000'];
const SIZES  = [2, 4, 6, 10, 16];

export function DrawingDialog() {
  const { closeDialog, toast } = useUIStore();
  const { editor } = useEditorStore();
  const canvasRef = useRef();
  const [tool,   setTool]   = useState('pen');
  const [color,  setColor]  = useState('#d4af37');
  const [size,   setSize]   = useState(3);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef(null);

  const W = 560, H = 360;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, W, H);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => { setDrawing(true); lastPos.current = getPos(e); };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);

    if (tool === 'eraser') {
      ctx.clearRect(pos.x - size, pos.y - size, size * 2, size * 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(pos.x - size, pos.y - size, size * 2, size * 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'highlighter' ? `${color}66` : color;
      ctx.lineWidth   = tool === 'highlighter' ? size * 4 : size;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.globalCompositeOperation = 'source-over';
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const stopDraw = () => { setDrawing(false); lastPos.current = null; };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, W, H);
  };

  const insertDrawing = () => {
    const img = canvasRef.current.toDataURL('image/png');
    editor?.chain().focus().setImage({ src: img, alt: 'Drawing' }).run();
    toast('Drawing inserted!', 'success');
    closeDialog('drawing');
  };

  return (
    <Modal title="Freehand Drawing" onClose={() => closeDialog('drawing')} width={620} noPad>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid var(--border)', flexWrap:'wrap' }}>
          {/* Tools */}
          <div style={{ display:'flex', gap:3 }}>
            {TOOLS.map((t) => (
              <Tooltip key={t.id} text={t.label}>
                <button onClick={() => setTool(t.id)} style={{
                  background: tool===t.id ? 'var(--bg-active)':'var(--bg-elevated)',
                  border: tool===t.id ? '1px solid var(--gold)':'1px solid var(--border)',
                  borderRadius:'var(--radius-sm)', padding:'4px 10px',
                  cursor:'pointer', fontSize:15, color:'var(--text-primary)',
                  transition:'var(--transition)',
                }}>{t.icon}</button>
              </Tooltip>
            ))}
          </div>

          <div style={{ width:1, height:24, background:'var(--border)' }} />

          {/* Colors */}
          <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{
                width:20, height:20, background:c, border: color===c ? '2px solid var(--gold)':'1px solid var(--border)',
                borderRadius:3, cursor:'pointer', padding:0,
              }} />
            ))}
          </div>

          <div style={{ width:1, height:24, background:'var(--border)' }} />

          {/* Brush size */}
          <div style={{ display:'flex', gap:3, alignItems:'center' }}>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} style={{
                width:s+12, height:s+12,
                background: size===s ? 'var(--gold)':'var(--bg-elevated)',
                border: size===s ? '1px solid var(--gold)':'1px solid var(--border)',
                borderRadius:'50%', cursor:'pointer',
              }} />
            ))}
          </div>

          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            <Button variant="subtle"  onClick={clearCanvas}>Clear</Button>
            <Button variant="primary" onClick={insertDrawing}>✓ Insert</Button>
          </div>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} width={W} height={H}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          style={{ cursor: tool==='eraser'?'cell':'crosshair', display:'block', width:'100%' }} />
      </div>
    </Modal>
  );
}
