
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PortalContent } from '@/api/entities';
import { ApprenticeUser } from '@/api/entities';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserManagement from './UserManagement';
import CohortsAdmin from './CohortsAdmin';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard({ adminUser, contentRecord, onContentUpdate }) {
    const [activeTab, setActiveTab] = useState('users');
    const [bannerContent, setBannerContent] = useState(contentRecord?.bannerContent || '');
    const [notesContent, setNotesContent] = useState(contentRecord?.notesContent || '');
    const [isSaving, setIsSaving] = useState(false);

    console.log('AdminDashboard received adminUser:', adminUser);

    const [allUsers, setAllUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const fetchAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const users = await ApprenticeUser.list('-created_date');
            setAllUsers(users.filter(u => u.email !== adminUser.email));
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchAllUsers();
        }
    }, [activeTab]);

    const handleSaveContent = async () => {
        setIsSaving(true);
        try {
            const updatedContent = await PortalContent.update(contentRecord.id, { bannerContent: bannerContent, notesContent: notesContent });
            onContentUpdate(updatedContent);
            alert('Content updated successfully!');
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Error saving content.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditFormData({ ...user });
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            try {
                await ApprenticeUser.delete(user.id);
                fetchAllUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Error deleting user.');
            }
        }
    };

    const handleApprove = async (user) => {
        if (window.confirm(`Are you sure you want to approve ${user.firstName} ${user.lastName}?`)) {
            try {
                await ApprenticeUser.update(user.id, { 
                    status: 'approved',
                    approvalDate: new Date().toISOString(),
                    approvedBy: adminUser.email,
                });
                fetchAllUsers();
            } catch (error) {
                    console.error('Failed to approve user:', error);
                    alert('Error approving user.');
                }
            }
        };
        
        const handleReject = async (user) => {
            if (window.confirm(`Are you sure you want to reject ${user.firstName} ${user.lastName}?`)) {
                try {
                    await ApprenticeUser.update(user.id, { status: 'rejected' });
                    fetchAllUsers();
                } catch (error) {
                    console.error('Failed to reject user:', error);
                    alert('Error rejecting user.');
                }
            }
        };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await ApprenticeUser.update(editingUser.id, editFormData);
            setEditingUser(null);
            fetchAllUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Error updating user.');
        }
    };

    return (
        <>
            <div className="w-full max-w-none">
                <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg w-full">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <CardTitle className="text-xl md:text-2xl">Admin Dashboard</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Logged in as:</span>
                                <span className="font-medium">{adminUser?.firstName} {adminUser?.lastName}</span>
                            </div>
                        </div>
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex flex-wrap gap-2 sm:gap-8">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'users'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    User Management
                                </button>
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'content'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Portal Content
                                </button>
                                <button
                                    onClick={() => setActiveTab('cohorts')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'cohorts'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Cohorts
                                </button>
                            </nav>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {activeTab === 'users' && (
                             isLoadingUsers ? <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div> :
                            <UserManagement 
                                users={allUsers} 
                                onEdit={handleEditUser} 
                                onDelete={handleDeleteUser}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                adminUser={adminUser} 
                            />
                        )}
                        {activeTab === 'content' && (
                             <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Announcements Banner
                                    </label>
                                    <ReactQuill
                                        value={bannerContent}
                                        onChange={setBannerContent}
                                        className="bg-white"
                                        theme="snow"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline'],
                                                ['link'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Important Notes
                                    </label>
                                    <ReactQuill
                                        value={notesContent}
                                        onChange={setNotesContent}
                                        className="bg-white"
                                        theme="snow"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline'],
                                                ['link'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                                <Button onClick={handleSaveContent} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                        {activeTab === 'cohorts' && <CohortsAdmin />}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User: {editingUser?.firstName} {editingUser?.lastName}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input value={editFormData.firstName} onChange={e => setEditFormData({...editFormData, firstName: e.target.value})} placeholder="First Name"/>
                            <Input value={editFormData.lastName} onChange={e => setEditFormData({...editFormData, lastName: e.target.value})} placeholder="Last Name"/>
                        </div>
                        <Input value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} placeholder="Email" type="email"/>
                        <Input value={editFormData.company} onChange={e => setEditFormData({...editFormData, company: e.target.value})} placeholder="Company"/>
                        <Input value={editFormData.cohortNumber} onChange={e => setEditFormData({...editFormData, cohortNumber: e.target.value})} placeholder="Cohort" type="number"/>

                        <Select value={editFormData.role} onValueChange={role => setEditFormData({...editFormData, role})}>
                            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="apprentice">Apprentice</SelectItem>
                                <SelectItem value="mentor">Mentor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={editFormData.status} onValueChange={status => setEditFormData({...editFormData, status})}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
