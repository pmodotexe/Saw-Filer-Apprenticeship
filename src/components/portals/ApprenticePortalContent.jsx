
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PortalContent } from '@/api/entities';
import { ApprenticeUser } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import AdminDashboard from '../admin/AdminDashboard';
import {
    Search, ExternalLink, Download, Printer, User, Award, Building,
    Video, BookOpen, Edit, LogOut, UploadCloud, Sun, Moon, Cloud, CheckCircle, Loader2, MessageSquare, SwitchCamera
} from 'lucide-react';

const ADMIN_EMAILS = ['paolomorales@reliabilitysolutions.net', 'jeremysymonds@reliabilitysolutions.net', 'paolomoralesx@gmail.com', 'admin@reliabilitysolutions.net'];

const initialBannerContent = `<p class="text-blue-100">Welcome to your portal! The class schedule is updated weekly. Please check for any new events or changes. No class on the last week of every month.</p>`;
const initialNotesContent = `<ul class="list-disc pl-5 space-y-1"><li>All assignments are due by Sunday at 11:59 PM EST.</li><li>If you miss a live session, a recording will be available in the LMS within 24 hours.</li><li>Ensure your contact information is up to date in the LMS.</li></ul>`;
const initialResources = [
    { id: 1, title: 'Class Requirements', url: 'https://drive.google.com/file/d/1_wDQKk8rjxGkF5RyeKJtMb8A5aKqfQgr/view?usp=drive_link', linkText: 'View Requirements (PDF)', type: 'link', keywords: 'requirements pdf class google drive', downloadName: null },
    { id: 2, title: 'Competency Tracker (ETA 671)', url: 'https://drive.google.com/file/d/1nb-oG3dY1orT5QALlW0-xX5ss8T1hNB0/view', linkText: 'View Competency Tracker', type: 'link', keywords: 'competency tracker eta 671 google drive', downloadName: null }
];
const perks = [
  { title: "Reduced Rate Training (Burton Mill)", description: "Eligible for reduced rate hands-on training.", url: "https://www.burtonmill.com", icon: Building },
  { title: "Intensive Training (NTC)", description: "Tailored 2-week intensive hands-on training.", url: "https://ntcforms.formstack.com/forms/band_saw_fitting_class", icon: Award }
];
const instructors = [{ name: "Paolo M.", email: "paolomorales@reliabilitysolutions.net" }, { name: "Jeremy S.", email: "jeremysymonds@reliabilitysolutions.net" }];

const getTimeBasedTheme = () => {
    const hour = new Date().getHours();
    
    // Morning Theme (5am - 11am)
    if (hour >= 5 && hour < 12) {
        return {
            greeting: 'Good Morning',
            greetingIcon: <Sun className="w-8 h-8 text-yellow-300" />,
            headerGradient: 'from-orange-500 to-amber-600',
            animationIcon: (
                <motion.div
                    className="absolute -top-4 -right-4 text-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                >
                    <Sun className="w-40 h-40" />
                </motion.div>
            ),
        };
    }
    
    // Afternoon Theme (12pm - 5pm)
    if (hour >= 12 && hour < 17) {
        return {
            greeting: 'Good Afternoon',
            greetingIcon: <Cloud className="w-8 h-8 text-sky-300" />,
            headerGradient: 'from-cyan-500 to-sky-600',
            animationIcon: (
                <>
                    <motion.div
                        className="absolute top-0 right-0 text-white/20"
                        animate={{ x: [-20, 20, -20] }}
                        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
                    >
                        <Cloud className="w-32 h-32" />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-0 left-10 text-white/15"
                        animate={{ x: [20, -20, 20] }}
                        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity, delay: 5 }}
                    >
                        <Cloud className="w-24 h-24" />
                    </motion.div>
                </>
            ),
        };
    }

    // Evening Theme (5pm - 4am)
    const stars = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        scale: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 3 + 2,
    }));

    return {
        greeting: 'Good Evening',
        greetingIcon: <Moon className="w-8 h-8 text-indigo-300" />,
        headerGradient: 'from-indigo-700 to-purple-800',
        animationIcon: (
            <div className="absolute inset-0 overflow-hidden">
                 {stars.map(star => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{ top: star.y, left: star.x, width: `${star.scale * 2}px`, height: `${star.scale * 2}px` }}
                        animate={{ opacity: [0.1, 0.8, 0.1] }}
                        transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>
        ),
    };
};

const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-[9999]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

const Card = ({ children, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg ${className}`}
    >
        {children}
    </motion.div>
);

const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-xl font-bold text-gray-800">{children}</h3>;


export default function ApprenticePortalContent({ user, onLogout }) {
    const [localUser, setLocalUser] = useState(user);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bannerContent, setBannerContent] = useState('');
    const [notesContent, setNotesContent] = useState('');
    const [resources, setResources] = useState(initialResources);
    const [searchTerm, setSearchTerm] = useState('');
    const [contentRecord, setContentRecord] = useState(null);
    const [viewAsAdmin, setViewAsAdmin] = useState(true); // New state for view toggle

    const isUserAdmin = localUser && ADMIN_EMAILS.includes(localUser.email);
    const { greeting, greetingIcon, headerGradient, animationIcon } = getTimeBasedTheme();

    const showAdminView = isUserAdmin && viewAsAdmin;

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            let records = await PortalContent.filter({ key: 'main_portal' });
            let record = records[0];
            if (!record) {
                record = await PortalContent.create({ key: 'main_portal', bannerContent: initialBannerContent, notesContent: initialNotesContent });
            }
            setContentRecord(record);
            setBannerContent(record.bannerContent);
            setNotesContent(record.notesContent);
            setIsLoading(false);
        };
        loadContent();
    }, []);

    const handlePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !localUser.id) {
            alert("Could not update picture. User ID not found.");
            return;
        }

        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            if (!file_url) throw new Error("File upload failed.");

            await ApprenticeUser.update(localUser.id, { profilePictureUrl: file_url });
            setLocalUser(prevUser => ({ ...prevUser, profilePictureUrl: file_url }));
        } catch (error) {
            console.error("Profile picture update error:", error);
            alert("Failed to update profile picture: " + (error.message || "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleContentUpdate = (newContent) => {
        if (newContent.bannerContent) {
            setBannerContent(newContent.bannerContent);
        }
        if (newContent.notesContent) {
            setNotesContent(newContent.notesContent);
        }
    };

    const handleUserUpdate = async (updatedUser) => {
        setLocalUser(updatedUser);
        // If it's a database user, update the database
        if (updatedUser.id && !String(updatedUser.id).startsWith('hardcoded_')) { // Ensure it's not a hardcoded admin ID
            try {
                await ApprenticeUser.update(updatedUser.id, {
                    profilePictureUrl: updatedUser.profilePictureUrl
                });
            } catch (error) {
                console.error('Error updating user profile:', error);
                // Optionally revert local state or show error to user
            }
        }
    };

    const filteredResources = useMemo(() => {
        if (!searchTerm.trim()) return resources;
        return resources.filter(r => `${r.title} ${r.linkText} ${r.keywords || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, resources]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 printable-area">
            <style jsx global>{`
                .ql-snow .ql-editor.b44-quill-display { padding: 0; border: none; line-height: 1.6; font-family: inherit; white-space: normal; }
                .b44-quill-banner .ql-editor.b44-quill-display { color: white; }
                .b44-quill-banner .ql-editor.b44-quill-display a { color: #bfdbfe; text-decoration: underline; }
                .b44-quill-banner .ql-editor.b44-quill-display a:hover { color: #eff6ff; }
                
                @keyframes shimmer {
                  from { background-position: 200% 0; }
                  to { background-position: -200% 0; }
                }
                .shimmer-text {
                  background: linear-gradient(to right, #ef4444 20%, #fca5a5 50%, #ef4444 80%);
                  background-size: 200% auto;
                  color: transparent;
                  background-clip: text;
                  -webkit-background-clip: text;
                  animation: shimmer 2s linear infinite;
                }
                
                @keyframes scroll-text {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                
                .scroll-animation {
                  animation: scroll-text 8s linear infinite;
                }
            `}</style>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Profile Header Card */}
                <Card className="overflow-hidden">
                    <div className={`relative overflow-hidden p-6 md:p-8 bg-gradient-to-r ${headerGradient}`}>
                        {animationIcon}
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                             <div className="relative group">
                                <img
                                    src={localUser.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${localUser.firstName} ${localUser.lastName}`}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full border-4 border-white/80 shadow-lg object-cover"
                                />
                                 {isUploading ? (
                                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : (
                                    <label htmlFor="profile-picture-upload" className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <UploadCloud className="w-8 h-8"/>
                                        <span className="text-xs mt-1 font-semibold">Change</span>
                                        <input
                                            id="profile-picture-upload"
                                            type="file"
                                            accept="image/png, image/jpeg, image/gif"
                                            className="hidden"
                                            onChange={handlePictureChange}
                                            disabled={isUploading}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    {greetingIcon}
                                    <h1 className="text-3xl md:text-4xl font-bold text-white shadow-sm">
                                        {greeting}, {localUser.firstName.charAt(0).toUpperCase() + localUser.firstName.slice(1).toLowerCase()}!
                                    </h1>
                                </div>
                                <p className="text-blue-200 text-lg">{localUser.email}</p>
                                <p className="text-blue-300 text-sm mt-1">{localUser.company} - {localUser.role.charAt(0).toUpperCase() + localUser.role.slice(1)}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                {isUserAdmin && (
                                     <Button variant="outline" size="sm" onClick={() => setViewAsAdmin(v => !v)} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                        <SwitchCamera className="w-4 h-4 mr-2"/>
                                        {viewAsAdmin ? 'Apprentice View' : 'Admin View'}
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={onLogout} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    <LogOut className="w-4 h-4 mr-2"/> Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Announcements Banner - Always show this */}
                <Card className="overflow-hidden">
                    <div className={`relative p-6 b44-quill-banner from-blue-600 to-indigo-700 bg-gradient-to-r`}>
                        <div className="absolute top-4 right-4 text-white/20">
                             <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                            >
                                <CheckCircle className="w-24 h-24" />
                            </motion.div>
                        </div>
                        <div className="relative z-10">
                            {/* Permanent Announcements Header */}
                            <motion.h3 
                                className="text-2xl uppercase tracking-widest font-bold mb-4 text-white"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <motion.span
                                    animate={{ 
                                        textShadow: [
                                            "0 0 10px rgba(255,255,255,0.5)",
                                            "0 0 20px rgba(255,255,255,0.8)",
                                            "0 0 10px rgba(255,255,255,0.5)"
                                        ]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                >
                                    Announcements
                                </motion.span>
                            </motion.h3>
                            
                            {/* Editable Content Below */}
                            <div className="ql-snow">
                                <div className="ql-editor b44-quill-display" dangerouslySetInnerHTML={{ __html: bannerContent }} />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className={`space-y-8 ${showAdminView ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                        {showAdminView ? (
                            <div id="admin-dashboard">
                                <AdminDashboard adminUser={localUser} contentRecord={contentRecord} onContentUpdate={handleContentUpdate} />
                            </div>
                        ) : (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Class Schedule</CardTitle>
                                        <p className="text-sm font-semibold text-gray-500 mt-1">No Classes Last Week of the Month</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-3 bg-yellow-100/70 border-l-4 border-yellow-500 p-3 rounded-lg">
                                            <strong>Tip:</strong> Look for events titled <strong className="text-blue-700">'SFAP Cohort'</strong> or colored <strong className="text-blue-700">blue</strong>. Use calendar controls to navigate.
                                        </p>
                                        <div className="relative w-full overflow-hidden rounded-lg shadow-md border border-gray-200 aspect-[9/16] md:aspect-video">
                                            <iframe className="absolute top-0 left-0 w-full h-full border-0" src="https://calendar.google.com/calendar/embed?src=c_e9e7e2c7f1dcee106740d897ad760bf6db8e09c2937ebeed2a755606a2b2ccfb@group.calendar.google.com&ctz=America/New_York&mode=AGENDA&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0" scrolling="no" title="Class Schedule"></iframe>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                   <CardHeader>
                                        <CardTitle>Important Notes</CardTitle>
                                   </CardHeader>
                                   <CardContent>
                                       <div className="ql-snow">
                                            <div className="ql-editor b44-quill-display" dangerouslySetInnerHTML={{ __html: notesContent }} />
                                        </div>
                                   </CardContent>
                                </Card>

                                {/* Sawdust Social Link Card */}
                                <Card className="hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                   <CardContent className="p-6">
                                       <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                           <div className="bg-blue-100 p-4 rounded-full">
                                               <MessageSquare className="w-10 h-10 text-blue-600" />
                                           </div>
                                           <div>
                                               <h3 className="text-2xl font-bold text-gray-800">Join the Conversation!</h3>
                                               <p className="text-gray-600 mt-1 mb-4">Connect with peers, ask questions, and share your experiences in the Sawdust Social chat rooms.</p>
                                               <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                                    <a href="/SawdustSocial">Go to Sawdust Social</a>
                                               </Button>
                                           </div>
                                       </div>
                                   </CardContent>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Side Column - show if not in admin view */}
                    {!showAdminView && (
                        <div className="lg:col-span-1 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                                <Card className="hover:shadow-xl transition-shadow">
                                    <a href="https://clientz.learnupon.com" target="_blank" rel="noopener noreferrer" className="block p-6 text-center">
                                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                                        <p className="font-semibold text-lg text-gray-800">Log in to LMS</p>
                                    </a>
                                </Card>
                                 <Card className="hover:shadow-xl transition-shadow bg-red-50 border-red-200">
                                    <a href="https://reliabilitysolutions-net.zoom.us/j/83395739786?jst=2" target="_blank" rel="noopener noreferrer" className="block p-6 text-center">
                                        <motion.div
                                            animate={{ color: ["#ef4444", "#fca5a5", "#ef4444"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-10 h-10 mx-auto mb-3 text-red-600"
                                        >
                                            <Video className="w-full h-full" fill="currentColor" />
                                        </motion.div>
                                        <p className="font-semibold text-lg text-red-800">Join Live Training</p>
                                        <div className="relative mt-2 h-4 overflow-hidden bg-red-100 rounded-full flex items-center">
                                            <div className="absolute whitespace-nowrap shimmer-text text-xs font-medium scroll-animation">
                                                Class is in session
                                            </div>
                                        </div>
                                    </a>
                                </Card>
                            </div>
                            
                            <Card>
                                <CardHeader><CardTitle>Resources & Printables</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="mb-4 relative no-print">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search resources..." className="pl-9 bg-white" />
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        {filteredResources.length > 0 ? filteredResources.map(resource => (
                                            <div key={resource.id} className="pb-3 border-b border-gray-100 last:border-b-0">
                                                <p className="font-semibold text-gray-700">{resource.title}</p>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1"><ExternalLink className="h-4 w-4" /> {resource.linkText}</a>
                                            </div>
                                        )) : <p className="text-gray-500 italic">No resources found.</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Perks</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {perks.map(perk => (
                                        <div key={perk.title} className="flex items-start gap-4">
                                            <div className="bg-indigo-100 p-2 rounded-full mt-1"><perk.icon className="w-6 h-6 text-indigo-600" /></div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{perk.title}</h4>
                                                <a href={perk.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Learn More</a>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Instructor Contact</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {instructors.map(inst => (
                                        <div key={inst.name} className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-semibold text-gray-700">{inst.name}</p>
                                                <a href={`mailto:${inst.email}`} className="text-sm text-blue-600 hover:underline">{inst.email}</a>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
