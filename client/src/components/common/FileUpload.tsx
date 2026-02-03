import { useState, useRef } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { CloudUpload, CheckCircle2, AlertCircle, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
}

export const FileUpload = ({ onUpload, label = 'Upload Asset', accept = '.pdf,.doc,.docx,.png,.jpg' }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too heavy (max 5MB)');
      setUploaded(false);
      return;
    }

    setUploading(true);
    setError('');
    setFileName(file.name);
    setUploaded(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(data.url);
      setUploaded(true);
    } catch (err) {
      setError('System upload failure. Please retry.');
      setFileName('');
      setUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{label}</label>

      <div
        className={`relative group cursor-pointer transition-all duration-300 border-2 border-dashed rounded-[2rem] p-8 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'}
          ${uploaded ? 'border-green-300 bg-green-50/30' : ''}
          ${error ? 'border-red-300 bg-red-50/30' : ''}
        `}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        <div className="space-y-4">
          {!uploading && !uploaded && !error && (
            <>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                <CloudUpload size={32} />
              </div>
              <div>
                <p className="text-gray-900 font-bold">Drag & drop or <span className="text-blue-600">click to browse</span></p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Max size: 5MB • PDF, DOC, PNG, JPG</p>
              </div>
            </>
          )}

          {uploading && (
            <div className="py-2">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-blue-600 font-bold animate-pulse">Synchronizing with Cloud... {fileName}</p>
            </div>
          )}

          {uploaded && (
            <>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-green-700 font-bold">File Secured successfully!</p>
                <p className="text-sm text-green-600 opacity-80">{fileName}</p>
              </div>
            </>
          )}

          {error && (
            <>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
                <AlertCircle size={32} />
              </div>
              <div>
                <p className="text-red-700 font-bold">{error}</p>
                <Button variant="ghost" size="sm" className="mt-2 text-red-600 hover:bg-red-50">Try Again</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
