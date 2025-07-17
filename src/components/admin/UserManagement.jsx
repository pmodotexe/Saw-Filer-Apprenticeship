import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ApprenticeUser } from '@/api/entities';
import { UserX, Loader2, Search } from 'lucide-react';
import { UserRow } from './UserRow';
import EditUserModal from './EditUserModal';
import { bulkDeleteUsers } from '@/api/functions';

const HARDCODED_ADMIN_EMAIL = 'admin@reliabilitysolutions.net';

export default function UserManagement({ adminUser }) {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const fetchAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const users = await ApprenticeUser.list();
            // Find and separate the hardcoded admin
            const admin = users.find(u => u.email.toLowerCase() === HARDCODED_ADMIN_EMAIL);
            const otherUsers = users.filter(u => u.email.toLowerCase() !== HARDCODED_ADMIN_EMAIL);
            
            // Sort other users alphabetically by first name
            otherUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));

            // Prepend the admin to the list if they exist
            const sortedUsers = admin ? [admin, ...otherUsers] : otherUsers;

            setAllUsers(sortedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleSelectUser = (userId) => {
        const newSelection = new Set(selectedUsers);
        if (newSelection.has(userId)) {
            newSelection.delete(userId);
        } else {
            newSelection.add(userId);
        }
        setSelectedUsers(newSelection);
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            // Select all users except the hardcoded admin
            const allSelectableIds = allUsers
                .filter(u => u.email.toLowerCase() !== HARDCODED_ADMIN_EMAIL)
                .map(u => u.id);
            setSelectedUsers(new Set(allSelectableIds));
        } else {
            setSelectedUsers(new Set());
        }
    };

    const handleBulkDelete = async () => {
        if (selectedUsers.size === 0) {
            alert('Please select users to delete.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`)) {
            try {
                const userIds = Array.from(selectedUsers);
                const response = await bulkDeleteUsers({ userIds });
                
                alert(response.data.message || 'Operation completed.');

                // Refresh user list and clear selection
                await fetchAllUsers();
                setSelectedUsers(new Set());

            } catch (error) {
                console.error('Failed to delete users:', error);
                alert(`An error occurred: ${error.message}`);
            }
        }
    };

    const handleDeleteSingle = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            try {
                const response = await bulkDeleteUsers({ userIds: [user.id] });
                alert(response.data.message || 'User deleted successfully.');
                await fetchAllUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert(`Error deleting user: ${error.message}`);
            }
        }
    };

    const handleStatusChange = async (user, newStatus) => {
        try {
            const updateData = { status: newStatus };
            if (newStatus === 'approved') {
                updateData.approvalDate = new Date().toISOString();
                updateData.approvedBy = adminUser.email;
            }
            
            await ApprenticeUser.update(user.id, updateData);
            await fetchAllUsers(); // Refresh the list
        } catch (error) {
            console.error('Failed to update user status:', error);
            alert(`Error updating status: ${error.message}`);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleSave = async (formData) => {
        try {
            await ApprenticeUser.update(editingUser.id, formData);
            await fetchAllUsers();
            setEditingUser(null);
        } catch (error) {
            console.error('Failed to update user:', error);
            throw error;
        }
    };

    const handleForcePasswordReset = async (userId) => {
        if (window.confirm('Are you sure you want to force a password reset for this user? They will be required to change their password on next login.')) {
            try {
                await ApprenticeUser.update(userId, { forcePasswordChange: true });
                await fetchAllUsers();
                alert('Password reset has been forced. The user will need to change their password on next login.');
            } catch (error) {
                console.error('Failed to force password reset:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            const matchesSearch = searchTerm === '' || 
                `${user.firstName} ${user.lastName} ${user.email} ${user.company}`.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesRole && matchesStatus && matchesSearch;
        });
    }, [allUsers, roleFilter, statusFilter, searchTerm]);

    // Check if all selectable users are selected
    const allSelectableUsers = allUsers.filter(u => u.email.toLowerCase() !== HARDCODED_ADMIN_EMAIL);
    const isAllSelected = allSelectableUsers.length > 0 && allSelectableUsers.every(u => selectedUsers.has(u.id));

    return (
        <div className="w-full">
            {/* Filters and Actions - Mobile Responsive */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                        />
                    </div>
                    
                    {/* Filters */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="apprentice">Apprentice</SelectItem>
                                <SelectItem value="mentor">Mentor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending_approval">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* Delete Button */}
                <Button 
                    onClick={handleBulkDelete} 
                    disabled={selectedUsers.size === 0} 
                    variant="destructive"
                    className="w-full sm:w-auto"
                >
                    <UserX className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedUsers.size})
                </Button>
            </div>
            
            {/* Table Container - Full width and responsive */}
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-[auto_2fr_2fr_1fr_auto] gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-600">
                    <Checkbox 
                        checked={isAllSelected} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                    />
                    <div>NAME</div>
                    <div>COMPANY & ROLE</div>
                    <div>STATUS</div>
                    <div className="text-right">ACTIONS</div>
                </div>
                
                {/* Mobile Header */}
                <div className="md:hidden grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-600">
                    <Checkbox 
                        checked={isAllSelected} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                    />
                    <div>USER</div>
                    <div>ACTIONS</div>
                </div>
                
                <div className="mb-40 divide-y divide-gray-200">
                    {isLoadingUsers ? (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <UserRow
                                key={user.id}
                                user={user}
                                isSelected={selectedUsers.has(user.id)}
                                onSelect={() => handleSelectUser(user.id)}
                                onEdit={() => handleEdit(user)}
                                onDelete={() => handleDeleteSingle(user)}
                                onForcePasswordReset={() => handleForcePasswordReset(user.id)}
                                onStatusChange={(newStatus) => handleStatusChange(user, newStatus)}
                                isImmutable={user.email.toLowerCase() === HARDCODED_ADMIN_EMAIL}
                            />
                        ))
                    )}
                </div>
            </div>

            <EditUserModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                user={editingUser}
                onSave={handleSave}
            />
        </div>
    );
}