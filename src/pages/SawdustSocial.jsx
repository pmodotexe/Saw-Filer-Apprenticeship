
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApprenticeUser } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, Menu, X, Search, MoreVertical, Bell } from 'lucide-react';
import Chatroom from '../components/chatroom/Chatroom';
import FloSignInComponent from '../components/ui/sign-in-flo';
import ChatSidebar from '../components/chatroom/ChatSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApprenticePortalTitle from '../components/ui/ApprenticePortalTitle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserNotification } from '@/api/entities';

const HARDCODED_ADMINS = {
    'admin@reliabilitysolutions.net': {
        email: 'admin@reliabilitysolutions.net',
        firstName: 'Main',
        lastName: 'Admin',
        company: 'Reliability Solutions',
        cohortNumber: 0,
        country: 'United States',
        millCity: 'Mobile',
        millState: 'Alabama',
        role: 'admin',
        password: 'rspd2003',
        status: 'approved',
        isVerified: true,
        profilePictureUrl: null
    }
};

const CHAT_ROOMS = [
    { id: 'general', name: 'General Discussion' },
    { id: 'technical', name: 'Technical Questions' },
    { id: 'safety', name: 'Safety Corner' },
    { id: 'random', name: 'Random' },
];

export default function SawdustSocial() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState('general');
    const [activeChatTab, setActiveChatTab] = useState('messages');
    const [showSearch, setShowSearch] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const checkAuthentication = async () => {
            const storedEmail = localStorage.getItem('apprenticeEmail');
            if (storedEmail) {
                await loadUser(storedEmail);
            } else {
                setShowLogin(true);
                setIsLoading(false);
            }
        };
        checkAuthentication();
    }, []);

    useEffect(() => {
        const fetchNotifications = async (userId) => {
            if (!userId) return;
            try {
                // Assuming userId for UserNotification is currentUser.id
                const userNotifications = await UserNotification.filter({
                    userId: userId,
                    isRead: false
                }, '-lastMentionDate'); // Order by lastMentionDate descending
                setNotifications(userNotifications);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        if (currentUser) {
            // Use currentUser.id as the userId for notifications.
            // If for some reason id isn't available (e.g., during initial setup for hardcoded admin
            // before it's persisted and gets an ID), fall back to email.
            const userId = currentUser.id || currentUser.email;
            fetchNotifications(userId);
            // Poll for new notifications every 20 seconds
            const interval = setInterval(() => fetchNotifications(userId), 20000);
            return () => clearInterval(interval); // Cleanup interval on component unmount or currentUser change
        }
    }, [currentUser]);

    const loadUser = async (email) => {
        try {
            const hardcodedAdminData = HARDCODED_ADMINS[email.toLowerCase()];
            if (hardcodedAdminData) {
                let userFromDb = null;
                const adminUsers = await ApprenticeUser.filter({ email: email.toLowerCase() });
                if (adminUsers.length > 0) {
                    userFromDb = adminUsers[0];
                } else {
                    // Only create if it truly doesn't exist
                    userFromDb = await ApprenticeUser.create({
                        ...hardcodedAdminData,
                        registrationDate: new Date().toISOString(),
                    });
                }
                setCurrentUser(userFromDb);
                setIsLoading(false);
                return;
            }

            const users = await ApprenticeUser.list();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (user && user.status === 'approved') {
                setCurrentUser(user);
            } else {
                localStorage.removeItem('apprenticeEmail');
                setShowLogin(true);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setShowLogin(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            const emailToCheck = loginData.email.trim().toLowerCase();
            let userToLogin = null;

            const hardcodedAdminData = HARDCODED_ADMINS[emailToCheck];
            if (hardcodedAdminData && hardcodedAdminData.password === loginData.password) {
                const adminUsers = await ApprenticeUser.filter({ email: emailToCheck });
                if (adminUsers.length > 0) {
                    userToLogin = adminUsers[0];
                } else {
                    // Only create if it truly doesn't exist
                    userToLogin = await ApprenticeUser.create({
                        ...hardcodedAdminData,
                        registrationDate: new Date().toISOString(),
                    });
                }
            } else {
                const allUsers = await ApprenticeUser.list();
                const user = allUsers.find(u => u.email.trim().toLowerCase() === emailToCheck);

                if (!user) {
                    setLoginError('No account found with this email address.');
                    setIsLoading(false);
                    return;
                }

                if (user.status !== 'approved') {
                    setLoginError('Your account is not approved yet. Please contact an administrator.');
                    setIsLoading(false);
                    return;
                }
                
                if (user.password !== loginData.password) {
                    setLoginError('Invalid email or password.');
                    setIsLoading(false);
                    return;
                }
                userToLogin = user;
            }
            
            if (userToLogin) {
                setCurrentUser(userToLogin);
                localStorage.setItem('apprenticeEmail', userToLogin.email);
                setShowLogin(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('apprenticeEmail');
        setCurrentUser(null);
        setShowLogin(true);
        setLoginData({ email: '', password: '' });
        setLoginError('');
    };

    const handleUserUpdate = async (updatedUser) => {
        setCurrentUser(updatedUser);
        if (updatedUser.id && !String(updatedUser.id).startsWith('hardcoded_')) {
            try {
                await ApprenticeUser.update(updatedUser.id, {
                    profilePictureUrl: updatedUser.profilePictureUrl
                });
            } catch (error) {
                console.error('Error updating user profile:', error);
            }
        }
    };

    const handleFormDataChange = (field, value) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    const handleSetRoom = async (roomId) => {
        // Mark notifications for this room as read
        const roomNotifications = notifications.filter(n => n.roomId === roomId);
        for (const notification of roomNotifications) {
            try {
                await UserNotification.update(notification.id, { isRead: true });
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }
        // Update local state to remove marked notifications
        setNotifications(prev => prev.filter(n => n.roomId !== roomId));

        setCurrentRoomId(roomId);
        setActiveChatTab('messages');
    };
    
    const handleShowFiles = () => setActiveChatTab('files');
    const handleShowImages = () => setActiveChatTab('images');
    const handleShowOnlineUsers = () => setActiveChatTab('online');
    
    const currentRoom = CHAT_ROOMS.find(r => r.id === currentRoomId);

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (showLogin) {
        return (
            <>
                <Header />
                <FloSignInComponent
                    isSignUp={false}
                    onSubmit={handleLogin}
                    onToggleMode={() => window.location.href = '/ApprenticePortal?action=register'}
                    formData={loginData}
                    onFormDataChange={handleFormDataChange}
                    error={loginError}
                    isLoading={isLoading}
                    headerComponent={
                        <>
                            <div className="flex flex-col items-center -space-y-4 md:-space-y-6">
                                <ApprenticePortalTitle value="Sawdust" />
                                <ApprenticePortalTitle value="Social" />
                            </div>
                            <p className="text-gray-600 mt-6">Sign in to join the conversation</p>
                        </>
                    }
                    showStatusCheck={false}
                    showRegistrationFields={false}
                />
                {/* Only show footer on desktop */}
                <div className="hidden md:block">
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <div className="h-screen bg-white flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 bg-gray-800 text-white flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                    {currentUser && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.firstName} ${currentUser.lastName}`} />
                            <AvatarFallback className="text-xs">{currentUser.firstName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                    )}
                    <h2 className="text-lg font-semibold">Sawdust Social</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Unread
                        </h3>
                        {notifications.length > 0 ? (
                            <div className="space-y-1">
                                {notifications.map(notification => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleSetRoom(notification.roomId)}
                                        className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md bg-blue-600 text-white font-semibold transition-colors hover:bg-blue-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>#</span>
                                            <span className="truncate">{notification.roomName}</span>
                                        </div>
                                        <div className="bg-red-500 text-white rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                            {notification.mentionCount}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-2 py-1 text-sm text-gray-500 italic">
                                No unread messages
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">Channels</h3>
                        <div className="space-y-1">
                            {CHAT_ROOMS.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => handleSetRoom(room.id)}
                                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 transition-colors ${
                                        currentRoomId === room.id
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    <span>#</span>
                                    <span>{room.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">Resources</h3>
                        <div className="space-y-1">
                            <button onClick={handleShowImages} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                📷 Images
                            </button>
                            <button onClick={handleShowFiles} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                📁 Files
                            </button>
                            <button onClick={handleShowOnlineUsers} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
                                👥 Online Users
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700 space-y-2">
                    <a href="/ApprenticePortal" className="flex items-center justify-center gap-2 w-full text-center text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Portal
                    </a>
                    <a href="/Home" className="flex items-center justify-center gap-2 w-full text-center text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                        🏠 Home
                    </a>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="md:hidden">
                                <Menu className="w-6 h-6" />
                            </Button>
                            <h1 className="font-semibold text-lg">
                                # {currentRoom?.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                                <Search className="w-5 h-5 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </Button>
                            <div className="hidden md:flex items-center gap-2 ml-4">
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <ChatSidebar 
                    isOpen={showSidebar}
                    onClose={() => setShowSidebar(false)}
                    onSelectRoom={handleSetRoom}
                    currentRoomId={currentRoomId}
                    onShowFiles={handleShowFiles}
                    onShowImages={handleShowImages}
                    onShowOnlineUsers={handleShowOnlineUsers}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    notifications={notifications} // Pass notifications to mobile sidebar as well
                />

                {/* Chat Component */}
                <div className="flex-1 overflow-hidden">
                    <Chatroom 
                        user={currentUser} 
                        onUserUpdate={handleUserUpdate}
                        currentRoomId={currentRoomId}
                        onRoomChange={setCurrentRoomId}
                        activeTab={activeChatTab}
                        onTabChange={setActiveChatTab}
                    />
                </div>
            </div>
        </div>
    );
}
