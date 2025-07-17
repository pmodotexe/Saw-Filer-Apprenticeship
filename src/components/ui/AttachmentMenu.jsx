import React from 'react';
import { motion } from 'framer-motion';
import { Image, Paperclip, Smile } from 'lucide-react';

export default function AttachmentMenu({ onImageClick, onFileClick, onEmojiClick, onClose }) {
    const menuItems = [
        { icon: Smile, label: 'Emojis', onClick: onEmojiClick, color: 'text-yellow-600' },
        { icon: Image, label: 'Photo', onClick: onImageClick, color: 'text-green-600' },
        { icon: Paperclip, label: 'File', onClick: onFileClick, color: 'text-blue-600' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]"
        >
            {menuItems.map((item, index) => (
                <button
                    key={item.label}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
                >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </button>
            ))}
        </motion.div>
    );
}