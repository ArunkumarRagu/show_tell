import { useState, useRef, type ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({
  content,
  position = 'top',
  delay = 150,
  children,
  className = '',
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!content || disabled) {
    return <>{children}</>;
  }

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#2A364F] border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#2A364F] border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#2A364F] border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#2A364F] border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`aria-tooltip absolute z-50 pointer-events-none w-max max-w-xs whitespace-normal rounded-lg border border-[#2A364F] bg-[#151C2C] px-3 py-1.5 text-xs font-medium text-slate-200 shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in zoom-in-95 ${positionClasses[position]}`}
        >
          {content}
          <div className={`absolute h-0 w-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}

interface InfoTooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  className?: string;
  iconSize?: number;
}

export function InfoTooltip({ content, position = 'top', className = '', iconSize = 14 }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <span className={`inline-flex items-center text-slate-400 hover:text-purple-400 transition-colors cursor-help ${className}`}>
        <HelpCircle style={{ width: iconSize, height: iconSize }} />
      </span>
    </Tooltip>
  );
}
