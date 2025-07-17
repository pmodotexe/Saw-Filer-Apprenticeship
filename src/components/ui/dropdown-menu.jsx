import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const DropdownMenuContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
});

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children, asChild }) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  const triggerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };
  
  if (asChild) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
    });
  }

  return (
    <div ref={triggerRef} onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

const DropdownMenuContent = ({ children, className, align = 'end' }) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the content
      if (contentRef.current && !contentRef.current.contains(event.target)) {
          // A bit of a hack, but we also need to ensure we are not clicking on a trigger again
          const isTrigger = event.target.closest('[data-b44-dropdown-trigger]');
          if(!isTrigger) {
               setIsOpen(false);
          }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClasses = align === 'end' ? 'right-0' : 'left-0';

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-lg',
        alignmentClasses,
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className, onClick, ...props }) => {
  const { setIsOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Add data attribute to trigger for outside click detection
const OriginalDropdownMenuTrigger = DropdownMenuTrigger;
const WrappedDropdownMenuTrigger = React.forwardRef((props, ref) => {
    if (props.asChild) {
        const child = React.Children.only(props.children);
        return (
            <OriginalDropdownMenuTrigger {...props}>
                {React.cloneElement(child, { 'data-b44-dropdown-trigger': true })}
            </OriginalDropdownMenuTrigger>
        );
    }
    return (
        <div data-b44-dropdown-trigger>
            <OriginalDropdownMenuTrigger {...props} ref={ref} />
        </div>
    );
});


// Dummy exports for compatibility
const DropdownMenuGroup = ({ children }) => <>{children}</>;
const DropdownMenuSeparator = () => <div className="-mx-1 my-1 h-px bg-gray-200" />;
const DropdownMenuLabel = ({ children, className }) => <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>;
const DropdownMenuCheckboxItem = () => null;
const DropdownMenuRadioGroup = ({ children }) => <>{children}</>;
const DropdownMenuRadioItem = () => null;
const DropdownMenuPortal = ({ children }) => <>{children}</>;
const DropdownMenuSub = ({ children }) => <>{children}</>;
const DropdownMenuSubContent = () => null;
const DropdownMenuSubTrigger = ({ children }) => <>{children}</>;
const DropdownMenuShortcut = () => null;


export {
  DropdownMenu,
  WrappedDropdownMenuTrigger as DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
};