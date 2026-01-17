import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { UploadArea } from './components/UploadArea';
import { generateDescription, generateRoomStaging, generate3DFloorPlan } from './services/geminiService';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

const App: React.FC = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Features
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const resetState = () => {
    setSelectedFiles([]);
    setGeneratedText(null);
    setGeneratedImage(null);
    setError(null);
    setLoading(false);
  };

  const handleBack = () => {
    resetState();
    setView(ViewState.HOME);
  };

  const handleFilesSelected = (files: FileList | null, max: number = 1) => {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, max);
    setSelectedFiles(fileArray);
    setError(null);
  };

  // --- Feature Handlers ---

  const handleGenerateDescription = async () => {
    if (selectedFiles.length === 0) {
      setError("Пожалуйста, загрузите хотя бы одну фотографию.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateDescription(selectedFiles);
      setGeneratedText(result);
    } catch (e) {
      console.error(e);
      setError("Ошибка генерации. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFurniture = async () => {
    if (selectedFiles.length === 0) {
      setError("Пожалуйста, загрузите фотографию.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateRoomStaging(selectedFiles[0]);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("Не удалось сгенерировать изображение.");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при обработке изображения.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFloorPlan = async () => {
    if (selectedFiles.length === 0) {
      setError("Пожалуйста, загрузите план.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generate3DFloorPlan(selectedFiles[0]);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("Не удалось сгенерировать планировку.");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при обработке плана.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Views ---

  const renderHome = () => (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto w-full">
      <h1 className="text-[#111010] text-3xl font-bold mb-4 text-center">
        Инструменты <br />
        <span className="text-[#8D5FFF]">AI Риелтора</span>
      </h1>
      
      <Button 
        onClick={() => setView(ViewState.DESCRIPTION)} 
        fullWidth 
        className="flex items-center justify-between group"
      >
        <span>Продающее описание</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">📝</span>
      </Button>
      
      <Button 
        onClick={() => setView(ViewState.FURNITURE)} 
        variant="secondary" 
        fullWidth
        className="flex items-center justify-between group"
      >
        <span>Расставить мебель</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">🛋️</span>
      </Button>

      <Button 
        onClick={() => setView(ViewState.FLOOR_PLAN)} 
        variant="accent" 
        fullWidth
        className="flex items-center justify-between group"
      >
        <span>Отрисовать планировку</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">🏗️</span>
      </Button>
    </div>
  );

  const renderFeatureLayout = (
    title: string, 
    onGenerate: () => void,
    resultView: React.ReactNode,
    uploadProps: { label: string, multiple: boolean, max?: number }
  ) => (
    <div className="flex flex-col p-6 max-w-md mx-auto w-full min-h-[calc(100vh-80px)]">
      <button 
        onClick={handleBack}
        className="mb-6 text-sm text-gray-500 hover:text-[#8D5FFF] flex items-center gap-1 font-semibold self-start"
      >
        ← Назад
      </button>

      <h2 className="text-2xl font-bold text-[#111010] mb-6">{title}</h2>

      {!generatedText && !generatedImage ? (
        <div className="flex flex-col gap-6 flex-1">
          <UploadArea 
            label={uploadProps.label} 
            multiple={uploadProps.multiple}
            onChange={(files) => handleFilesSelected(files, uploadProps.max)}
            filesCount={selectedFiles.length}
          />
          
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {selectedFiles.map((file, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-auto">
            <Button 
              onClick={onGenerate} 
              disabled={loading || selectedFiles.length === 0} 
              fullWidth
              variant="primary"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Думаю...
                </span>
              ) : (
                "Сгенерировать"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 flex-1">
          {resultView}
          <Button onClick={resetState} variant="secondary" fullWidth className="mt-auto">
            Создать еще
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#111010] flex flex-col font-['Unbounded']">
      <Header />
      
      {view === ViewState.HOME && renderHome()}

      {view === ViewState.DESCRIPTION && renderFeatureLayout(
        "Продающее описание",
        handleGenerateDescription,
        <div className="bg-[#8D5FFF]/5 p-6 rounded-2xl border border-[#8D5FFF]/10">
          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
            {generatedText}
          </p>
          <button 
            className="mt-4 text-[#8D5FFF] text-xs font-bold uppercase tracking-wider hover:text-[#7b4fe0]"
            onClick={() => {
              if (generatedText) navigator.clipboard.writeText(generatedText);
            }}
          >
            Копировать текст
          </button>
        </div>,
        { label: "Загрузите фото (макс. 10)", multiple: true, max: 10 }
      )}

      {view === ViewState.FURNITURE && renderFeatureLayout(
        "Виртуальный стейджинг",
        handleGenerateFurniture,
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
           {generatedImage && (
             <img src={generatedImage} alt="Furnished room" className="w-full h-auto" />
           )}
        </div>,
        { label: "Загрузите фото комнаты", multiple: false, max: 1 }
      )}

      {view === ViewState.FLOOR_PLAN && renderFeatureLayout(
        "3D Планировка",
        handleGenerateFloorPlan,
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
           {generatedImage && (
             <img src={generatedImage} alt="3D Floor Plan" className="w-full h-auto" />
           )}
        </div>,
        { label: "Загрузите скан планировки", multiple: false, max: 1 }
      )}
    </div>
  );
};

export default App;