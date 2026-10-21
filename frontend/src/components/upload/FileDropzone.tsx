import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

interface FileDropzoneProps {
  id: string;
  title: string;
  description: string;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  error?: string | null;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  id,
  title,
  description,
  selectedFile,
  onFileSelect,
  onFileRemove,
  error,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const validateAndPassFile = (file: File) => {
    setValidationError(null);

    // Validate type
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setValidationError('Only PDF files are supported.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File size exceeds the 5MB limit.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const currentError = validationError || error;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <span>{title}</span>
          <span className="text-rose-500 font-bold">*</span>
        </label>
        <span className="text-[11px] font-medium text-slate-500">PDF, up to 5MB</span>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={disabled}
        onChange={handleInputChange}
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            disabled
              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60'
              : isDragging
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : currentError
              ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400 hover:bg-rose-50/40'
              : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50/60'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
              isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-800">
            <span className="text-brand-600 hover:underline">Click to browse</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">{description}</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[200px] border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-600">Selected</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate mt-0.5" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 py-1 px-2.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace file</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onFileRemove();
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 py-1 px-2.5 rounded-md hover:bg-rose-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {currentError && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{currentError}</span>
        </div>
      )}
    </div>
  );
};
