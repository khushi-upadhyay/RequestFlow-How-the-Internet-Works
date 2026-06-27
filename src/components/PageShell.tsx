import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  fullBleed?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  className = '',
  contentClassName = '',
  fullBleed = false,
}) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#09090b] ${className}`}>
      <div className={`relative z-10 mx-auto w-full ${fullBleed ? '' : 'max-w-7xl'} px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
