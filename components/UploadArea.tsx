import React, { ChangeEvent } from 'react';

interface UploadAreaProps {
  label: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  accept?: string;
  filesCount?: number;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ 
  label, 
  multiple = false, 
  onChange, 
  accept = "image/*",
  filesCount = 0
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#8D5FFF] border-dashed rounded-2xl cursor-pointer bg-[#8D5FFF]/5 hover:bg-[#8D5FFF]/10 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-3 text-[#8D5FFF]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-[#111010] font-medium text-center px-4">{filesCount > 0 ? `Выбрано файлов: ${filesCount}` : label}</p>
          <p className="text-xs text-gray-500">
            {multiple ? "Можно выбрать до 10 фото" : "JPEG, PNG, WEBP"}
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          multiple={multiple} 
          accept={accept}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};