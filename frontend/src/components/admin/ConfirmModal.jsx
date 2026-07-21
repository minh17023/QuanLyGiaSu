import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-rose-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-center text-zinc-900 mb-2">Xác nhận</h3>
          <p className="text-center text-zinc-600 font-medium">{message}</p>
        </div>
        
        <div className="flex gap-3 p-4 bg-zinc-50/50 border-t border-zinc-100">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-2xl font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            Không
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-2xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
