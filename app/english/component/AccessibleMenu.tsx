import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AccessibleMenuProps {
    isOpen: boolean;
    onClose: () => void;
    items;
    onItemClick: (item, index: number) => void;
    renderItem: (item, index: number) => React.ReactNode;
    className?: string;
}

export const AccessibleMenu: React.FC<AccessibleMenuProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  items,
                                                                  onItemClick,
                                                                  renderItem,
                                                                  className
                                                              }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    focusNextItem(1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    focusNextItem(-1);
                    break;
            }
        };

        const focusNextItem = (direction: number) => {
            const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
            if (!menuItems) return;

            const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);
            let nextIndex = currentIndex + direction;
            if (nextIndex < 0) nextIndex = menuItems.length - 1;
            if (nextIndex >= menuItems.length) nextIndex = 0;

            (menuItems[nextIndex] as HTMLElement).focus();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className={`absolute left-0 top-20 w-80 bg-white border-l-4 shadow 
        border-blue-800 dark:bg-slate-800 rounded-lg ${className}`}
            role="menu"
        >
            <ScrollArea className="h-64">
                {items.map((item, index) => (
                    <div
                        key={index}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => onItemClick(item, index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onItemClick(item, index);
                            }
                        }}
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};
