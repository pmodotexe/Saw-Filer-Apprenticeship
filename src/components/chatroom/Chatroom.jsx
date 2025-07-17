
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/api/entities';
import { UserActivity } from '@/api/entities';
import { ApprenticeUser } from '@/api/entities'; // Added
import { UserNotification } from '@/api/entities'; // Added
// Input component will be replaced by native input, so it can be removed if not used elsewhere
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Users, Loader2, Reply, X, Trash2, Plus, Circle, FileText, ArrowDown } from 'lucide-react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { UploadFile } from '@/api/integrations';
import AttachmentMenu from '../ui/AttachmentMenu';
import EmojiPicker from '../ui/EmojiPicker';
import UserMentionPicker from '../ui/UserMentionPicker';

const QUICK_REACTION_EMOJIS = ['👍', '👎', '😂', '😮', '🔥', '🎉', '❗️'];

// Define constants for file handling
const DOC_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/csv'
];
const DOC_EXTENSIONS_ACCEPTS = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv";
const MAX_IMAGE_SIZE_MB = 5;
const MAX_DOC_SIZE_MB = 20;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_DOC_SIZE_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;

const PULL_THRESHOLD = 70; // Pixels to pull down to trigger refresh

// Mock CHAT_ROOMS for compilation. In a real app, this would likely be imported or come from context.
const CHAT_ROOMS = [
    { id: 'general', name: 'General Chat' },
    { id: 'support', name: 'Support' },
    { id: 'announcements', name: 'Announcements' },
    // Add more rooms as needed to match your application's room IDs
    // Example: { id: 'someRoomId', name: 'Some Room Name' }
];

const MessageReactions = ({ reactions, messageId, currentUserId, onReact }) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(reactions).map(([emoji, userIds]) => (
                <button
                    key={emoji}
                    onClick={() => onReact(messageId, emoji)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
                        userIds.includes(currentUserId)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                >
                    <span>{emoji}</span>
                    <span>{userIds.length}</span>
                </button>
            ))}
        </div>
    );
};

const FileAttachment = ({ fileUrl, fileName, fileType }) => {
    const isImage = fileType && fileType.startsWith('image/');

    if (isImage) {
        return (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block max-w-full">
                <img src={fileUrl} alt={fileName || 'Attached Image'} className="max-w-xs max-h-48 object-contain rounded-lg border" />
            </a>
        );
    }

    return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mt-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <FileText className="w-6 h-6 text-gray-600" />
            <span className="text-sm text-blue-600 underline font-medium">{fileName || 'View Attachment'}</span>
        </a>
    );
};

const OnlineUsersList = ({ onlineUsers, currentUserId }) => {
    if (onlineUsers.length === 0) {
        return (
            <div className="text-center text-gray-500 text-sm py-4">
                No one else is online right now
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {onlineUsers.map(user => (
                <div key={user.userId} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.userProfilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.userName}`} />
                            <AvatarFallback className="text-xs">{user.userName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.userRole} • {user.userCompany}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Helper function to format date headers
const formatDateHeader = (date) => {
    if (isToday(date)) {
        return 'Today';
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else {
        return format(date, 'EEEE, MMMM d, yyyy');
    }
};

// Helper function to format user display name
const formatUserDisplayName = (userName, userCompany, userRole) => {
    const roleDisplay = userRole === 'admin' ? 'Admin' :
                       userRole === 'mentor' ? 'Mentor' : 'Apprentice';
    return `${userName} (${userCompany}) - ${roleDisplay}`;
};

// Helper function to check if messages should be grouped
const shouldGroupMessages = (currentMsg, previousMsg) => {
    if (!previousMsg) return false;

    const timeDiff = new Date(currentMsg.created_date) - new Date(previousMsg.created_date);
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds

    return (
        currentMsg.userId === previousMsg.userId &&
        timeDiff < FIVE_MINUTES &&
        !currentMsg.replyToMessageId // Don't group reply messages
    );
};

// Helper function to render message text with highlighted mentions
const renderMessageText = (text, users) => {
    if (!text) return null;
    
    // This regex will split the text by mentions that are terminated with a zero-width space.
    const mentionRegex = /(@(?:[^\s@]+\s?)+)\u200B/g;
    const parts = text.split(mentionRegex);
    const userNames = new Set(users.map(u => `${u.firstName} ${u.lastName}`.toLowerCase()));
    
    return parts.map((part, index) => {
        // The split results in an array like: ["text before", "mention", "text after", "mention"...]
        // The captured mentions will be at the odd indices.
        if (index % 2 === 1) {
            const mentionedName = part.substring(1).trim().replace(/\u200B/g, ''); // remove '@' and ZWS
            if (userNames.has(mentionedName.toLowerCase())) {
                return <strong key={index} className="text-blue-600 font-semibold">{part}</strong>;
            }
        }
        return part;
    });
};


export default function Chatroom({ user, onUserUpdate, currentRoomId, activeTab }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [allApprenticeUsers, setAllApprenticeUsers] = useState([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMentionPicker, setShowMentionPicker] = useState(false);
    const [mentionSearchTerm, setMentionSearchTerm] = useState('');
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);
    const [touchStartY, setTouchStartY] = useState(0);
    const [pullDownDistance, setPullDownDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const inputRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchMessages = async (isPullToRefresh = false) => {
        if (!isPullToRefresh && !messages.length) setIsLoading(true);
        try {
            const fetchedMessages = await ChatMessage.filter({ roomId: currentRoomId }, '-created_date', 200);
            setMessages(fetchedMessages.reverse());
        } catch (error) {
            console.error(`Failed to fetch messages for room ${currentRoomId}:`, error);
        } finally {
            setIsLoading(false);
            if (isPullToRefresh) {
                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullDownDistance(0);
                }, 500); // Give some time for refresh animation
            }
        }
    };

    useEffect(() => {
        if (isRefreshing) {
            fetchMessages(true);
        }
    }, [isRefreshing]);

    const updateUserActivity = async () => {
        try {
            const currentUserId = user.id || user.email;
            const existingActivity = await UserActivity.filter({ userId: currentUserId });

            const activityData = {
                userId: currentUserId,
                userName: `${user.firstName} ${user.lastName}`,
                userProfilePictureUrl: user.profilePictureUrl || null,
                userRole: user.role,
                userCompany: user.company,
                roomId: currentRoomId,
                lastSeen: new Date().toISOString(),
                isOnline: true
            };

            if (existingActivity.length > 0) {
                await UserActivity.update(existingActivity[0].id, activityData);
            } else {
                await UserActivity.create(activityData);
            }
        } catch (error) {
            console.error('Failed to update user activity:', error);
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const currentUserId = user.id || user.email;
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

            const activities = await UserActivity.filter({ roomId: currentRoomId }, '-lastSeen', 50);
            const onlineInRoom = activities.filter(activity =>
                activity.lastSeen >= fiveMinutesAgo &&
                activity.userId !== currentUserId &&
                activity.isOnline
            );

            setOnlineUsers(onlineInRoom);
        } catch (error) {
            console.error('Failed to fetch online users:', error);
        }
    };
    
    // Added
    const fetchAllUsers = async () => {
        try {
            const users = await ApprenticeUser.filter({ status: 'approved' });
            setAllApprenticeUsers(users);
        } catch (error) {
            console.error('Failed to fetch all users:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        updateUserActivity();
        fetchOnlineUsers();
        fetchAllUsers(); // Added

        const messagesInterval = setInterval(fetchMessages, 8000);
        const onlineInterval = setInterval(fetchOnlineUsers, 15000);
        const activityInterval = setInterval(updateUserActivity, 30000);

        return () => {
            clearInterval(messagesInterval);
            clearInterval(onlineInterval);
            clearInterval(activityInterval);
        };
    }, [currentRoomId, user.id, user.email, user.firstName, user.lastName, user.profilePictureUrl, user.role, user.company]);

    useEffect(() => {
        const setOffline = async () => {
            try {
                const currentUserId = user.id || user.email;
                const existingActivity = await UserActivity.filter({ userId: currentUserId });
                if (existingActivity.length > 0) {
                    await UserActivity.update(existingActivity[0].id, { isOnline: false });
                }
            } catch (error) {
                console.error('Failed to set user offline:', error);
            }
        };

        return () => {
            setOffline();
        };
    }, [user.id, user.email]);

    useEffect(() => {
        if (activeTab === 'messages') {
            scrollToBottom();
        }
    }, [messages, activeTab]);

    const handleSendMessage = async (text, fileInfo = null) => {
        if ((!text || !text.trim()) && !fileInfo) return;

        setIsSending(true);
        try {
            const userId = user.id || user.email;
            const messageData = {
                userId,
                userName: `${user.firstName} ${user.lastName}`,
                userProfilePictureUrl: user.profilePictureUrl || null,
                userRole: user.role,
                userCompany: user.company,
                message: text ? text.trim() : '',
                roomId: currentRoomId,
                fileUrl: fileInfo?.fileUrl || null,
                fileName: fileInfo?.fileName || null,
                fileType: fileInfo?.fileType || null,
                replyToMessageId: replyingTo?.id || null,
                replyToUserName: replyingTo?.userName || null,
                replyToMessage: replyingTo?.message || null,
                reactions: {},
            };
            await ChatMessage.create(messageData);
            setNewMessage('');
            setReplyingTo(null);
            await fetchMessages();

            // Mention Notification Logic
            const mentionRegex = /@([^@\s]+(?:\s+[^@\s]*)*?)\u200B/g;
            const mentions = text.match(mentionRegex);

            if (mentions) {
                const currentRoom = CHAT_ROOMS.find(r => r.id === currentRoomId);
                const roomName = currentRoom ? currentRoom.name : currentRoomId;

                for (const mention of mentions) {
                    const name = mention.replace('@', '').replace(/\u200B/g, '').trim();
                    const mentionedUser = allApprenticeUsers.find(u => 
                        `${u.firstName} ${u.lastName}`.toLowerCase() === name.toLowerCase()
                    );

                    if (mentionedUser && (mentionedUser.id || mentionedUser.email) !== userId) {
                        const mentionedUserId = mentionedUser.id || mentionedUser.email;
                        try {
                            const existingNotifications = await UserNotification.filter({
                                userId: mentionedUserId,
                                roomId: currentRoomId,
                                isRead: false,
                            });

                            if (existingNotifications.length > 0) {
                                const notification = existingNotifications[0];
                                await UserNotification.update(notification.id, {
                                    mentionCount: (notification.mentionCount || 0) + 1,
                                    lastMentionDate: new Date().toISOString(),
                                    isRead: false,
                                });
                            } else {
                                await UserNotification.create({
                                    userId: mentionedUserId,
                                    roomId: currentRoomId,
                                    roomName: roomName,
                                    mentionCount: 1,
                                    lastMentionDate: new Date().toISOString(),
                                    isRead: false,
                                });
                            }
                        } catch (e) {
                            console.error("Error creating notification for user:", name, e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
            setShowAttachmentMenu(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(newMessage);
    };

    const handleFileAttachment = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const isImage = file.type.startsWith('image/');
        // Allow for some variation in CSV mime types
        const isDocument = DOC_MIME_TYPES.includes(file.type) || (file.name.toLowerCase().endsWith('.csv') && file.type === 'text/plain');

        if (isImage) {
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                alert(`Image file is too large. Max size is ${MAX_IMAGE_SIZE_MB}MB.`);
                event.target.value = null; // Reset file input
                return;
            }
        } else if (isDocument) {
             if (file.size > MAX_DOC_SIZE_BYTES) {
                alert(`Document file is too large. Max size is ${MAX_DOC_SIZE_MB}MB.`);
                event.target.value = null;
                return;
            }
        } else {
            alert('Unsupported file type. Please upload an image or a supported document (.pdf, .doc, .xls, .ppt, .csv).');
            event.target.value = null;
            return;
        }

        setIsUploadingFile(true);
        try {
            const { file_url } = await UploadFile({ file });
            const fileInfo = {
                fileUrl: file_url,
                fileName: file.name,
                fileType: file.type,
            };
            await handleSendMessage(newMessage, fileInfo);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to upload/send file:", error);
            alert("File upload failed. Please try again.");
        } finally {
            setIsUploadingFile(false);
            event.target.value = null;
            setShowAttachmentMenu(false);
        }
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const currentUserId = user.id || user.email;
            const reactions = JSON.parse(JSON.stringify(message.reactions || {}));

            if (!reactions[emoji]) reactions[emoji] = [];

            if (reactions[emoji].includes(currentUserId)) {
                reactions[emoji] = reactions[emoji].filter(id => id !== currentUserId);
                if (reactions[emoji].length === 0) delete reactions[emoji];
            } else {
                reactions[emoji].push(currentUserId);
            }

            await ChatMessage.update(messageId, { reactions });
            await fetchMessages();
        } catch (error) {
            console.error('Failed to update reaction:', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (confirm('Are you sure you want to delete this message? This cannot be undone.')) {
            try {
                await ChatMessage.delete(messageId);
                await fetchMessages();
            } catch (error) {
                    console.error('Failed to delete message:', error);
            }
        }
    };

    const handleClearAllChat = async () => {
        if (user.role !== 'admin') return;

        if (confirm('Are you sure you want to clear all messages in this channel? This action cannot be undone.')) {
            try {
                const roomMessages = await ChatMessage.filter({ roomId: currentRoomId });
                for (const message of roomMessages) {
                    await ChatMessage.delete(message.id);
                }
                await fetchMessages();
            } catch (error) {
                console.error('Failed to clear all messages:', error);
                alert('Failed to clear messages. Please try again.');
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setNewMessage(value);

        // Check for @ mentions
        const beforeCursor = value.substring(0, cursorPos);
        const mentionMatch = beforeCursor.match(/@([\w\s]*)$/); // Changed regex

        if (mentionMatch) {
            const searchTerm = mentionMatch[1];
            setMentionSearchTerm(searchTerm);
            setMentionStartIndex(beforeCursor.lastIndexOf('@'));

            // Only show picker if search term is 4+ characters or empty (to allow backspacing)
            if (searchTerm.length >= 4 || searchTerm.length === 0) { // Adjusted condition
                setShowMentionPicker(true);
            } else {
                setShowMentionPicker(false);
            }
        } else {
            setShowMentionPicker(false);
            setMentionStartIndex(-1);
        }
    };

    const handleMentionSelect = (selectedUser) => {
        const currentText = inputRef.current.value;
        const start = mentionStartIndex;
        const end = inputRef.current.selectionStart;

        const beforeMention = currentText.substring(0, start);
        const afterMention = currentText.substring(end);
        // Add a zero-width space (\u200B) to terminate the mention regex and prevent re-triggering a search
        const newText = `${beforeMention}@${selectedUser.firstName} ${selectedUser.lastName}\u200B ${afterMention}`;

        setNewMessage(newText);
        setShowMentionPicker(false);
        setMentionStartIndex(-1);
        setMentionSearchTerm('');

        setTimeout(() => {
            if (inputRef.current) {
                // Update cursor position to account for the new text and the invisible character
                const newCursorPos = beforeMention.length + `@${selectedUser.firstName} ${selectedUser.lastName}\u200B `.length;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleEmojiSelect = (emoji) => {
        const inputElement = inputRef.current;
        if (!inputElement) return;

        const start = inputElement.selectionStart;
        const end = inputElement.selectionEnd;

        const newText = newMessage.substring(0, start) + emoji + newMessage.substring(end);
        setNewMessage(newText);

        setTimeout(() => {
            inputElement.focus();
            inputElement.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const handleTouchStart = (e) => {
        if (messagesContainerRef.current && messagesContainerRef.current.scrollTop === 0) {
            setTouchStartY(e.touches[0].clientY);
        } else {
            setTouchStartY(0);
        }
    };

    const handleTouchMove = (e) => {
        if (touchStartY === 0 || isRefreshing) return;
        const touchY = e.touches[0].clientY;
        let pullDistance = touchY - touchStartY;
        if (pullDistance < 0) pullDistance = 0; // Don't allow pulling up
        setPullDownDistance(pullDistance);
    };

    const handleTouchEnd = () => {
        if (touchStartY === 0) return;

        if (pullDownDistance > PULL_THRESHOLD) {
            setIsRefreshing(true);
        } else {
            setPullDownDistance(0); // Snap back if not enough pull
        }
        setTouchStartY(0); // Reset touch start Y
    };

    const currentUserId = user.id || user.email;

    const filteredMessages = useMemo(() => {
        return messages;
    }, [messages]);

    const fileMessages = useMemo(() => {
        return messages.filter(msg => msg.fileUrl && !msg.fileType?.startsWith('image/')).reverse();
    }, [messages]);

    const imageMessages = useMemo(() => {
        return messages.filter(msg => msg.fileUrl && msg.fileType?.startsWith('image/')).reverse();
    }, [messages]);

    // Group messages with date headers
    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentDateGroup = null;

        filteredMessages.forEach((msg, index) => {
            const msgDate = new Date(msg.created_date);
            const previousMsg = filteredMessages[index - 1];

            // Check if we need a new date header
            if (!previousMsg || !isSameDay(msgDate, new Date(previousMsg.created_date))) {
                if (currentDateGroup) {
                    groups.push(currentDateGroup);
                }
                currentDateGroup = {
                    type: 'date',
                    date: msgDate,
                    messages: []
                };
            }

            // Check if message should be grouped with previous
            const isGrouped = shouldGroupMessages(msg, previousMsg) &&
                             isSameDay(msgDate, new Date(previousMsg.created_date));

            currentDateGroup.messages.push({
                ...msg,
                isGrouped,
                showAvatar: !isGrouped,
                showHeader: !isGrouped
            });
        });

        if (currentDateGroup) {
            groups.push(currentDateGroup);
        }

        return groups;
    }, [filteredMessages]);

    return (
        <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">
            {/* Pull to refresh indicator */}
            <div
                className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center text-gray-500 z-0"
                style={{
                    transform: `translateY(${pullDownDistance > 0 ? (pullDownDistance - PULL_THRESHOLD) / 2 : 0}px)`, // Adjust indicator position
                    opacity: isRefreshing ? 1 : Math.min(pullDownDistance / PULL_THRESHOLD, 1) // Fade in/out
                }}
            >
                {isRefreshing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <div className="flex items-center gap-2 transition-opacity duration-200">
                        <ArrowDown className="w-5 h-5 transition-transform duration-200" style={{ transform: `rotate(${pullDownDistance > PULL_THRESHOLD ? '180deg' : '0deg'})` }}/>
                        <span>{pullDownDistance > PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}</span>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                    >
                        {activeTab === 'messages' && (
                            <div className="h-full flex flex-col">
                                <div
                                    ref={messagesContainerRef}
                                    className="flex-1 overflow-y-auto px-4 py-2 transition-transform duration-200"
                                    style={{ transform: `translateY(${isRefreshing ? PULL_THRESHOLD : pullDownDistance}px)` }}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {user.role === 'admin' && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                                            <Button
                                                onClick={handleClearAllChat}
                                                variant="outline"
                                                className="text-red-600 border-red-300 hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Clear All Messages (Admin)
                                            </Button>
                                        </div>
                                    )}

                                    {isLoading && !isRefreshing ? ( // Only show full loader if not already refreshing
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        </div>
                                    ) : groupedMessages.length > 0 ? (
                                        <div className="space-y-4 pb-4">
                                            {groupedMessages.map((group, groupIndex) => (
                                                <div key={groupIndex}>
                                                    {/* Date Header */}
                                                    <div className="flex items-center justify-center py-2">
                                                        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                                                            {formatDateHeader(group.date)}
                                                        </div>
                                                    </div>

                                                    {/* Messages for this date */}
                                                    {group.messages.map((msg, msgIndex) => (
                                                        <motion.div
                                                            key={msg.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className={`relative group flex items-start gap-3 hover:bg-gray-100 p-2 rounded-lg -mx-2 ${
                                                                msg.isGrouped ? 'mt-1' : 'mt-4'
                                                            }`}
                                                        >
                                                            {/* Avatar - only show for non-grouped messages */}
                                                            <div className={`flex-shrink-0 ${msg.showAvatar ? '' : 'w-9'}`}>
                                                                {msg.showAvatar ? (
                                                                    <Avatar className="h-9 w-9 border">
                                                                        <AvatarImage src={msg.userProfilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${msg.userName}`} />
                                                                        <AvatarFallback>{msg.userName?.charAt(0) || '?'}</AvatarFallback>
                                                                    </Avatar>
                                                                ) : (
                                                                    // Show timestamp for grouped messages on hover
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 text-right pr-2 pt-1">
                                                                        {format(new Date(msg.created_date), 'HH:mm')}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                {/* Header - only show for non-grouped messages */}
                                                                {msg.showHeader && (
                                                                    <div className="flex items-baseline gap-2 mb-1">
                                                                        <span className="font-bold text-sm text-gray-900">
                                                                            {formatUserDisplayName(msg.userName, msg.userCompany, msg.userRole)}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {format(new Date(msg.created_date), 'HH:mm')}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {msg.replyToMessageId && (
                                                                    <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-2 mb-1">
                                                                        <span className="font-semibold text-blue-600">Replying to {msg.replyToUserName}</span>
                                                                        <p className="truncate italic text-gray-700">"{msg.replyToMessage}"</p>
                                                                    </div>
                                                                )}

                                                                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                                    {renderMessageText(msg.message, allApprenticeUsers)}
                                                                    {msg.fileUrl && <FileAttachment fileUrl={msg.fileUrl} fileName={msg.fileName} fileType={msg.fileType} />}
                                                                </div>
                                                                <MessageReactions reactions={msg.reactions} messageId={msg.id} currentUserId={currentUserId} onReact={handleReaction} />
                                                            </div>

                                                            {/* Combined Action Toolbar */}
                                                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white border rounded-full shadow-md flex items-center gap-1 p-1">
                                                                {QUICK_REACTION_EMOJIS.map(emoji => (
                                                                    <button
                                                                        key={emoji}
                                                                        onClick={() => handleReaction(msg.id, emoji)}
                                                                        className="p-1 rounded-full hover:bg-gray-100 text-sm transition-colors"
                                                                        title={`React with ${emoji}`}
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                ))}
                                                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                                <button onClick={() => setReplyingTo(msg)} title="Reply" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                                                    <Reply className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                                {user.role === 'admin' && (
                                                                    <button onClick={() => handleDeleteMessage(msg.id)} title="Delete Message" className="p-1.5 rounded-full hover:bg-red-100 transition-colors">
                                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'images' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                                ) : imageMessages.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {imageMessages.map(msg => (
                                            <a key={msg.id} href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block border rounded-lg p-2 hover:shadow-md transition-shadow group aspect-square">
                                                <img src={msg.fileUrl} alt={msg.fileName} className="w-full h-full object-cover rounded" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No images have been shared in this room yet.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'files' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                                ) : fileMessages.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {fileMessages.map(msg => (
                                            <a key={msg.id} href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block border rounded-lg p-3 hover:shadow-md transition-shadow group bg-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {msg.fileType?.startsWith('image/') ? (
                                                            <img src={msg.fileUrl} alt={msg.fileName} className="w-10 h-10 object-cover rounded" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                                                                <FileText className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate group-hover:text-blue-600">{msg.fileName}</p>
                                                        <p className="text-xs text-gray-500">by {msg.userName}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No files have been shared in this room yet.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'online' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Online in #{currentRoomId}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Users who have been active in the last 5 minutes
                                    </p>
                                </div>
                                <OnlineUsersList onlineUsers={onlineUsers} currentUserId={currentUserId} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 relative">
                {/* Mention Picker */}
                {showMentionPicker && (
                    <div className="absolute bottom-full left-4 mb-2 z-20">
                        <UserMentionPicker
                            users={allApprenticeUsers}
                            onUserSelect={handleMentionSelect}
                            searchTerm={mentionSearchTerm}
                        />
                    </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)} />
                        <div className="absolute bottom-full right-4 mb-2 z-20">
                            <EmojiPicker
                                onEmojiSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        </div>
                    </>
                )}

                {/* Attachment Menu */}
                {showAttachmentMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowAttachmentMenu(false)} />
                        <div className="absolute bottom-full right-12 mb-2 z-20">
                            <AttachmentMenu
                                onImageClick={() => { imageInputRef.current?.click(); setShowAttachmentMenu(false); }}
                                onFileClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}
                                onEmojiClick={() => { setShowEmojiPicker(true); setShowAttachmentMenu(false); }}
                                onClose={() => setShowAttachmentMenu(false)}
                            />
                        </div>
                    </>
                )}

                {replyingTo && (
                    <div className="bg-gray-100 p-2 rounded-t-lg text-sm text-gray-600 flex justify-between items-center mb-2">
                        <span>Replying to <strong>{replyingTo.userName}</strong></span>
                        <button type="button" onClick={() => setReplyingTo(null)} className="p-1 rounded-full hover:bg-gray-200">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 relative">
                    {/* @ Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setNewMessage(prev => prev + '@');
                            inputRef.current?.focus();
                        }}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                    >
                        <span className="text-lg font-medium">@</span>
                    </button>

                    {/* Simplified Message Input */}
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={`Message #${currentRoomId}...`}
                            value={newMessage}
                            onChange={handleInputChange}
                            disabled={isUploadingFile}
                            className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-gray-900"
                        />
                        <input type="file" ref={fileInputRef} onChange={handleFileAttachment} className="hidden" accept={DOC_EXTENSIONS_ACCEPTS} />
                        <input type="file" ref={imageInputRef} onChange={handleFileAttachment} accept="image/*" className="hidden" />
                    </div>

                    {/* Plus Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowAttachmentMenu(!showAttachmentMenu);
                            setShowMentionPicker(false);
                            setShowEmojiPicker(false);
                        }}
                        disabled={isUploadingFile}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                    >
                        {isUploadingFile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>

                    {/* Send Button */}
                    <button 
                        type="submit" 
                        disabled={isSending || isUploadingFile || newMessage.trim() === ''} 
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
