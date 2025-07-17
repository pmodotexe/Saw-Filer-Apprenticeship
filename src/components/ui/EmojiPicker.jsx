import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_CATEGORIES = {
    smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣'],
    gestures: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤝', '🙏', '✊', '👊', '🤛', '🤜', '👎', '👍', '🤝', '🙏'],
    objects: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🔥', '⭐', '✨', '💥', '💫', '⚡'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '🔥', '💯', '💢', '💨', '💦', '💤']
};

export default function EmojiPicker({ onEmojiSelect, onClose }) {
    const [activeCategory, setActiveCategory] = useState('smileys');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72 max-h-80 overflow-hidden"
        >
            {/* Category Tabs */}
            <div className="flex border-b border-gray-200 mb-3 -mx-1">
                {Object.keys(EMOJI_CATEGORIES).map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex-1 px-2 py-2 text-xs font-medium capitalize transition-colors ${
                            activeCategory === category
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                {EMOJI_CATEGORIES[activeCategory].map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => {
                            onEmojiSelect(emoji);
                            onClose();
                        }}
                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors aspect-square flex items-center justify-center"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}