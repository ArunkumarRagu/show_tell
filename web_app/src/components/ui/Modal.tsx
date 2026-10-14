import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, isOpen, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  const isModalOpen = open ?? isOpen ?? false;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
        <div className="card max-h-[85vh] overflow-hidden border border-[#26324A] bg-[#151E33] shadow-2xl">
          <div className="flex items-start justify-between border-b border-[#26324A] px-6 py-4 bg-[#11182B]/60">
            <div>
              <h3 className="text-xl font-display font-bold text-white">{title}</h3>
              {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1C2742] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-5 text-slate-200">{children}</div>
          {footer && <div className="flex justify-end gap-3 border-t border-[#26324A] bg-[#11182B]/80 px-6 py-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
