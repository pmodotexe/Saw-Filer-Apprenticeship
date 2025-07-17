import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserMentionPicker({ users, onUserSelect, searchTerm }) {
    // Only show results if search term is 4 or more characters
    if (searchTerm.length < 4) {
        return null;
    }

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (filteredUsers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center text-gray-500 text-sm w-64"
            >
                No approved users found matching "{searchTerm}"
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto w-64"
        >
            {filteredUsers.slice(0, 5).map(user => (
                <button
                    key={user.id}
                    onClick={() => onUserSelect({ ...user, userName: `${user.firstName} ${user.lastName}` })}
                    className="flex items-center gap-2 w-full px-2 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
                >
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-xs">{user.firstName?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.company}</p>
                    </div>
                </button>
            ))}
        </motion.div>
    );
}