import { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  timeLeft: number;
  word: string;
}

type StrokeWidth = 2 | 5 | 10;

interface DrawPoint {
  x: number;
  y: number;
}

export function DrawingCanvas({ onSave, timeLeft, word }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>(5);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);

  const strokeWidths: { value: StrokeWidth; label: string }[] = [
    { value: 2, label: 'Fino' },
    { value: 5, label: 'Médio' },
    { value: 10, label: 'Grosso' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Fill with white background (use display dimensions)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev, imageData]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): DrawPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setIsCanvasExpanded(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setIsCanvasExpanded(false);
      saveToHistory();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Get display dimensions
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHistory([]);
    saveToHistory();
  };

  const handleUndo = () => {
    if (history.length <= 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Remove current state
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    // Restore previous state
    const previousState = newHistory[newHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const isLowTime = timeLeft <= 10;

  return (
    <div className="space-y-2 h-screen flex flex-col overflow-hidden">
      {/* Word Display and Timer Combined - Hide when expanded */}
      <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-2 border-2 border-white/20 transition-all duration-300 ${
        isCanvasExpanded ? 'h-0 opacity-0 overflow-hidden p-0 border-0' : ''
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-white/80 text-xs mb-1">Desenha:</div>
            <div className="text-white text-xl font-bold">{word}</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isLowTime ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className={`bg-white rounded-2xl p-2 shadow-2xl transition-all duration-300 ${
        isCanvasExpanded ? 'flex-1' : ''
      }`}>
        <canvas
          ref={canvasRef}
          className={`w-full touch-none cursor-crosshair transition-all duration-300 ${
            isCanvasExpanded ? 'h-full' : 'h-[200px]'
          }`}
          style={{ touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Stroke Width - Hide when expanded */}
      <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-2 border-2 border-white/20 transition-all duration-300 ${
        isCanvasExpanded ? 'h-0 opacity-0 overflow-hidden p-0 border-0' : ''
      }`}>
        <div className="text-white text-xs mb-1">Espessura:</div>
        <div className="grid grid-cols-3 gap-2">
          {strokeWidths.map((sw) => (
            <button
              key={sw.value}
              onClick={() => setStrokeWidth(sw.value)}
              className={`py-1.5 px-3 text-sm rounded-xl border-2 transition-all ${
                strokeWidth === sw.value
                  ? 'bg-white text-purple-600 border-white scale-105'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              {sw.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons - Hide when expanded */}
      <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${
        isCanvasExpanded ? 'h-0 opacity-0 overflow-hidden' : ''
      }`}>
        <button
          onClick={handleUndo}
          disabled={history.length <= 1}
          className={`py-2 px-3 text-sm rounded-xl border-2 transition-all ${
            history.length <= 1
              ? 'bg-white/5 text-white/30 border-white/10'
              : 'bg-white/20 text-white border-white/30 hover:bg-white/30 active:scale-95'
          }`}
        >
          ↶ Desfazer
        </button>
        <button
          onClick={handleClear}
          className="bg-white/20 text-white py-2 px-3 text-sm rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
        >
          🗑️ Limpar
        </button>
      </div>

      {/* Done Button - Hide when expanded */}
      <button
        onClick={handleDone}
        className={`w-full bg-white text-purple-600 py-3 px-4 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold ${
          isCanvasExpanded ? 'h-0 opacity-0 overflow-hidden py-0' : ''
        }`}
      >
        ✓ Terminar Desenho
      </button>
    </div>
  );
}
