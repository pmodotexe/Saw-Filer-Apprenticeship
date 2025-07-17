
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Users, Folder, Image as ImageIcon, Home, ArrowLeft, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } '@/components/ui/avatar';
import { UserNotification } from '@/api/entities';

const CHAT_ROOMS = [
    { id: 'general', name: 'General Discussion' },
    { id: 'technical', name: 'Technical Questions' },
    { id: 'safety', name: 'Safety Corner' },
    { id: 'random', name: 'Random' },
];

export default function ChatSidebar({ 
    isOpen, 
    onClose, 
    onSelectRoom, 
    currentRoomId, 
    onShowFiles, 
    onShowImages, 
    onShowOnlineUsers,
    currentUser,
    onLogout,
    notifications: initialNotifications // Rename prop to avoid conflict
}) {
    const [notifications, setNotifications] = useState(initialNotifications || []);

    useEffect(() => {
        // Update state when the prop changes
        setNotifications(initialNotifications || []);

        const fetchNotifications = async () => {
            // Only fetch if the user is logged in and sidebar is open
            if (currentUser && isOpen) {
                try {
                    const userNotifications = await UserNotification.filter({ 
                        userId: currentUser.id || currentUser.email, // Use id or email as a fallback for userId
                        isRead: false 
                    }, '-lastMentionDate'); // Sort by last mention date, descending
                    setNotifications(userNotifications);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };

        fetchNotifications(); // Initial fetch when sidebar opens or currentUser changes

        // Poll for notifications while sidebar is open
        if (isOpen) {
            const interval = setInterval(fetchNotifications, 20000); // Poll every 20 seconds
            return () => clearInterval(interval); // Clear interval on unmount or if isOpen becomes false
        }
    }, [currentUser, isOpen, initialNotifications]); // Depend on currentUser, isOpen, and initialNotifications prop

    const handleRoomSelect = async (roomId) => {
        // Mark notifications as read for this room
        const roomNotificationsToMarkRead = notifications.filter(n => n.roomId === roomId);
        for (const notification of roomNotificationsToMarkRead) {
            try {
                // Assuming UserNotification.update marks the notification as read on the backend
                await UserNotification.update(notification.id, { isRead: true });
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }
        
        // After marking as read, update the local state to reflect changes
        // Filter out the notifications that were just marked as read for this room
        setNotifications(prevNotifications => 
            prevNotifications.filter(n => n.roomId !== roomId || n.isRead === true)
        );

        onSelectRoom(roomId);
        onClose();
    };

    const getNotificationCount = (roomId) => {
        // Find if there's any unread notification for the given room
        const roomNotification = notifications.find(n => n.roomId === roomId && !n.isRead);
        return roomNotification ? roomNotification.mentionCount : 0;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gray-800 text-white z-50 flex flex-col"
                    >
                        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {currentUser && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.firstName} ${currentUser.lastName}`} />
                                        <AvatarFallback className="text-xs">{currentUser.firstName?.charAt(0) || '?'}</AvatarFallback>
                                    </Avatar>
                                )}
                                <h2 className="text-lg font-semibold">Sawdust Social</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-gray-700">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {notifications.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Unread
                                    </h3>
                                    <div className="space-y-1">
                                        {notifications.map(notification => (
                                            <button
                                                key={notification.id}
                                                onClick={() => handleRoomSelect(notification.roomId)}
                                                className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md bg-blue-600 text-white font-semibold transition-colors hover:bg-blue-700"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4" />
                                                    <span className="truncate">{notification.roomName}</span>
                                                </div>
                                                <div className="bg-red-500 text-white rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                                    {notification.mentionCount}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">Channels</h3>
                                <div className="space-y-1">
                                    {CHAT_ROOMS.map(room => {
                                        const notificationCount = getNotificationCount(room.id);
                                        return (
                                            <button
                                                key={room.id}
                                                onClick={() => handleRoomSelect(room.id)}
                                                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md text-gray-300 transition-colors ${
                                                    currentRoomId === room.id
                                                        ? 'bg-blue-600 text-white font-semibold'
                                                        : 'hover:bg-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4" />
                                                    <span>{room.name}</span>
                                                </div>
                                                {notificationCount > 0 && currentRoomId !== room.id && (
                                                    <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                                        {notificationCount}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">Resources</h3>
                                <div className="space-y-1">
                                    <button onClick={() => { onShowImages(); onClose(); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                        <ImageIcon className="w-4 h-4" /> Images
                                    </button>
                                    <button onClick={() => { onShowFiles(); onClose(); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                        <Folder className="w-4 h-4" /> Files
                                    </button>
                                    <button onClick={() => { onShowOnlineUsers(); onClose(); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                        <Users className="w-4 h-4" /> Online Users
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 p-4 border-t border-gray-700 space-y-2">
                            <a href="/ApprenticePortal" className="flex items-center justify-center gap-2 w-full text-center text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Portal
                            </a>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    if(onLogout) onLogout();
                                    onClose();
                                }}
                                className="flex items-center justify-center gap-2 w-full text-center text-sm py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-md transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                            <a href="/Home" className="flex items-center justify-center gap-2 w-full text-center text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                                <Home className="w-4 h-4" /> Home
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
