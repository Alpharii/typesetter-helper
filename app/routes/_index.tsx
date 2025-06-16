// app/routes/index.tsx
import { useState, ChangeEvent, CSSProperties, useEffect } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import html2canvas from 'html2canvas';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

interface OCRWord {
  text: string;
  translated: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  fontSize: number;
  fontFamily: string;
}

export default function Index() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ocrWords, setOcrWords] = useState<OCRWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    console.log('Initializing worker...');
    let w: any;
    (async () => {
      try {
        console.log('Calling createWorker...');
        w = await createWorker(['eng']);
        setWorker(w);
        console.log('Worker set in state');
      } catch (err) {
        console.error('Worker init failed:', err);
      }
    })();

    return () => {
      console.log('Cleaning up worker...');
      if (w && typeof w.terminate === 'function') {
        w.terminate();
        console.log('Worker terminated');
      }
    };
  }, []);

  const preprocessImage = (file: File): Promise<Blob> => {
    console.log('Preprocessing image...');
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        console.log('Image loaded for preprocessing');
        const canvas = document.createElement('canvas');
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('No 2D context found');
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log('Image drawn on canvas');

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
        console.log('Converted image to grayscale');

        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Preprocessing complete, returning blob');
            resolve(blob);
          } else {
            console.error('Failed to convert canvas to blob');
          }
        }, 'image/png');
      };
      img.src = url;
      console.log('Image source set');
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }
    if (!worker) {
      console.warn('Worker not ready');
      return;
    }

    console.log('Handling file input...');
    setLoading(true);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    console.log('Image src set:', url);

    try {
      const processed = await preprocessImage(file);
      console.log('Processed image:', processed);

      const { data } = await worker.recognize(processed);
      console.log('OCR data:', data.text);

      const words: OCRWord[] = data.words.map((w: any) => ({
        text: w.text,
        translated: w.text,
        bbox: w.bbox,
        fontSize: 16,
        fontFamily: 'Arial',
      }));

      console.log('Parsed words:', words);
      setOcrWords(words);
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setLoading(false);
      console.log('OCR process finished');
    }
  };

  const updateWord = (idx: number, key: keyof OCRWord, value: any) => {
    console.log(`Updating word at index ${idx}, key: ${key}, value: ${value}`);
    setOcrWords(prev => {
      const arr = [...prev];
      // @ts-ignore
      arr[idx][key] = value;
      return arr;
    });
  };

  const exportImage = async () => {
    const container = document.getElementById('canvas-area');
    if (!container) {
      console.error('Canvas area not found');
      return;
    }
    console.log('Exporting image...');
    const canvas = await html2canvas(container);
    canvas.toBlob(blob => {
      if (!blob) {
        console.error('Failed to create export blob');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translated_comic.png';
      a.click();
      console.log('Image exported:', url);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Komik Translator & Typesetter</h1>
      <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {loading && <p>Running OCR...</p>}

      <div id="canvas-area" className="relative inline-block border">
        {imageSrc && <img src={imageSrc} alt="Komik" />}
        {ocrWords.map((w, idx) => {
          const style: CSSProperties = {
            position: 'absolute',
            left: w.bbox.x0,
            top: w.bbox.y0,
            width: w.bbox.x1 - w.bbox.x0,
            height: w.bbox.y1 - w.bbox.y0,
            fontSize: w.fontSize,
            fontFamily: w.fontFamily,
            color: 'black',
            background: 'rgba(255,255,255,0.5)',
            padding: '2px',
          };
          return (
            <div key={idx} style={style}>
              <Input
                value={w.translated}
                onChange={e => updateWord(idx, 'translated', e.target.value)}
                className="bg-transparent p-0 m-0"
              />
              <div className="flex space-x-2 mt-1">
                <Input
                  type="number"
                  value={w.fontSize}
                  onChange={e => updateWord(idx, 'fontSize', parseInt(e.target.value) || 16)}
                  placeholder="Size"
                  className="w-16"
                />
                <Input
                  value={w.fontFamily}
                  onChange={e => updateWord(idx, 'fontFamily', e.target.value)}
                  placeholder="Font"
                  className="w-24"
                />
              </div>
            </div>
          );
        })}
      </div>

      {ocrWords.length > 0 && (
        <Button onClick={exportImage} className="mt-4">
          Export Image
        </Button>
      )}
    </div>
  );
}
