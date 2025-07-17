import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, User, KeyRound, Trash2, Check, X, Clock } from 'lucide-react';

export const UserRow = ({ 
    user, 
    isSelected, 
    onSelect, 
    onEdit, 
    onDelete, 
    onForcePasswordReset, 
    onStatusChange, 
    isImmutable 
}) => {
    const { firstName, lastName, email, company, role, status, profilePictureUrl } = user;
    
    const statusConfig = {
        approved: { 
            label: 'Approved', 
            className: 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer',
            icon: Check
        },
        pending_approval: { 
            label: 'Pending', 
            className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer',
            icon: Clock
        },
        rejected: { 
            label: 'Rejected', 
            className: 'bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer',
            icon: X
        }
    };

    const currentStatus = statusConfig[status] || statusConfig.pending_approval;

    const handleStatusClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            {/* Desktop Layout */}
            <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`hidden md:grid grid-cols-[auto_2fr_2fr_1fr_auto] gap-4 p-4 items-center transition-colors ${
                    isImmutable ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    aria-label={`Select user ${firstName} ${lastName}`}
                    disabled={isImmutable}
                />
                
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">{firstName} {lastName}</p>
                        <p className="text-sm text-gray-500 truncate">{email}</p>
                    </div>
                </div>
                
                <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{company}</p>
                    <p className="text-sm text-gray-500 capitalize truncate">{role}</p>
                </div>
                
                <div className="text-left">
                    {!isImmutable ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span 
                                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${currentStatus.className}`}
                                    onClick={handleStatusClick}
                                >
                                    <currentStatus.icon className="w-3 h-3" />
                                    {currentStatus.label}
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => onStatusChange('approved')}>
                                    <Check className="w-4 h-4 mr-2 text-green-600" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange('pending_approval')}>
                                    <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                    Set Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange('rejected')}>
                                    <X className="w-4 h-4 mr-2 text-red-600" />
                                    Reject
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800`}>
                            <Check className="w-3 h-3" />
                            Approved
                        </span>
                    )}
                </div>
                
                <div className="text-right">
                    {!isImmutable && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <User className="w-4 h-4 mr-2" />
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onForcePasswordReset}>
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Force Password Reset
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete User
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </motion.div>

            {/* Mobile Layout */}
            <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`md:hidden grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center transition-colors ${
                    isImmutable ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    aria-label={`Select user ${firstName} ${lastName}`}
                    disabled={isImmutable}
                />
                
                <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src={profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 truncate">{firstName} {lastName}</p>
                            <p className="text-sm text-gray-500 truncate">{email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600 truncate">{company}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 capitalize">{role}</span>
                            {!isImmutable ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <span 
                                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${currentStatus.className}`}
                                            onClick={handleStatusClick}
                                        >
                                            <currentStatus.icon className="w-3 h-3" />
                                            {currentStatus.label}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => onStatusChange('approved')}>
                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onStatusChange('pending_approval')}>
                                            <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                            Set Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onStatusChange('rejected')}>
                                            <X className="w-4 h-4 mr-2 text-red-600" />
                                            Reject
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800`}>
                                    <Check className="w-3 h-3" />
                                    Approved
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div>
                    {!isImmutable && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <User className="w-4 h-4 mr-2" />
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onForcePasswordReset}>
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Force Password Reset
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete User
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </motion.div>
        </>
    );
};