
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
    Shield,
    Eye,
    EyeOff,
    AlertTriangle
} from 'lucide-react';
import { ApprenticeUser } from '@/api/entities';
import { UserActivity } from '@/api/entities';
import ApprenticePortalContent from '../components/portals/ApprenticePortalContent';
import FloSignInComponent from '../components/ui/sign-in-flo';
import ApprenticePortalTitle from '../components/ui/ApprenticePortalTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';

const REGISTRATION_STEPS = {
    REGISTER: 'register',
    PENDING_APPROVAL: 'pending_approval',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    LOGIN: 'login',
    FORCE_PASSWORD_CHANGE: 'force_password_change'
};

// Update hardcoded admin list to a single entry
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

// List of countries for dropdown (Moved outside component)
const COUNTRIES_LIST = [
    'United States', 'Canada', 'Mexico', 'Australia', 'New Zealand', 'United Kingdom',
    'Germany', 'France', 'Sweden', 'Finland', 'Norway', 'Brazil', 'Chile', 'Other'
];

const COUNTRIES_OPTIONS = COUNTRIES_LIST.map(country => ({ value: country, label: country }));

const getInitialStep = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'register') {
        return REGISTRATION_STEPS.REGISTER;
    }
    return REGISTRATION_STEPS.LOGIN;
};

export default function ApprenticePortal() {
    const [currentStep, setCurrentStep] = useState(getInitialStep());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Registration form data
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        cohortNumber: '',
        country: '',
        millCity: '',
        millState: '',
        role: '',
        password: '',
        confirmPassword: '',
        profilePictureUrl: null
    });

    // New state for forced password change
    const [newPasswordData, setNewPasswordData] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });

    // Add company suggestions
    const companySuggestions = [
        'Reliability Solutions', 'WestRock', 'Rex Lumber', 'Atlas Roofing', 'Weyerhaeuser',
        'West Fraser Timber Co. Ltd.', 'Interfor Corporation', 'Canfor Corporation',
        'Sierra Pacific Industries', 'Georgia‑Pacific', 'Hampton Affiliates', 'Idaho Forest Group',
        'PotlatchDeltic Corporation', 'Biewer Lumber', 'Stella‑Jones Inc.', 'Norbord Inc.',
        'Acadian Timber Corp.', 'Western Forest Products Inc.', 'Goodfellow Inc.',
        'Pinnacle Renewable Energy Inc.', '84 Lumber', 'Boise Cascade Company',
        'Louisiana‑Pacific Corporation', 'Stora Enso Oyj', 'UPM‑Kymmene Oyj', 'Södra Skogsägarna',
        'Celulosa Arauco y Constitución S.A.', 'Klabin S.A.', 'Maibec', 'Tolko Industries Ltd.',
        'Conifex Timber Inc.', 'J.D. Irving Limited', 'Resolute Forest Products Inc.',
        'Harrigan Lumber Co., Inc.', 'Roseburg Forest Products', 'Collins Companies',
        'Hancock Lumber', 'Anthony Forest Products', 'Lincoln Wood Products',
        'Westervelt Lumber Co.', 'Johnson Brothers Lumber Company', 'Morgan Lumber Company',
        'Timber Products Company', 'Tolleson Lumber Company', 'Martco Ltd.',
        'Coast Forest Products Ltd.', 'West Oregon Wood Products', 'Idaho Timber Corporation',
        'Mercer International', 'Rayonier', 'Finch, Pruyn & Company', 'EACOM Timber Corp.',
        'Weston Forest Products Inc.', 'International Paper', 'Langdale Forest Products',
        'Thompson Appalachian Hardwoods', 'Randolph Lumber Company', 'Pennington Lumber Company',
        'Alpha Wood Products', 'Cass & Sons Sawmill', 'Wallace Hardwood Company',
        'Carpenter Brothers Sawmill', 'Marion Lumber Company', 'Southern Saw Works'
    ];

    // Add state for company suggestions
    const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    // This effect handles the case where a user might select 'admin' and then change their email.
    useEffect(() => {
        if (formData.role === 'admin' && !formData.email.toLowerCase().endsWith('@reliabilitysolutions.net')) {
            setFormData(prev => ({...prev, role: ''}));
        }
    }, [formData.email, formData.role]);

    // Check if user is already registered when component loads
    useEffect(() => {
        const checkExistingUser = async () => {
            const email = localStorage.getItem('apprenticeEmail');
            if (email) {
                // First check hardcoded admins
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
                    setFormData(prev => ({ ...prev, email: userFromDb.email, password: '' }));

                    if (userFromDb.forcePasswordChange) {
                        setCurrentStep(REGISTRATION_STEPS.FORCE_PASSWORD_CHANGE);
                    } else {
                        setCurrentStep(REGISTRATION_STEPS.APPROVED);
                    }
                    return;
                }

                // Then check database
                try {
                    const users = await ApprenticeUser.list();
                    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                    if (user) {
                        setCurrentUser(user);
                        setFormData({
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            company: user.company,
                            cohortNumber: user.cohortNumber || '',
                            country: user.country || '',
                            millCity: user.millCity || '',
                            millState: user.millState || '',
                            role: user.role,
                            password: '',
                            confirmPassword: '',
                            profilePictureUrl: user.profilePictureUrl || null
                        });

                        if (user.forcePasswordChange) {
                            setCurrentStep(REGISTRATION_STEPS.FORCE_PASSWORD_CHANGE);
                        } else if (user.status === 'approved') {
                            setCurrentStep(REGISTRATION_STEPS.APPROVED);
                        } else if (user.status === 'rejected') {
                            setCurrentStep(REGISTRATION_STEPS.REJECTED);
                        } else {
                            setCurrentStep(REGISTRATION_STEPS.PENDING_APPROVAL);
                        }
                    }
                } catch (error) {
                    console.error('Error checking existing user:', error);
                }
            }
        };

        checkExistingUser();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const emailToCheck = formData.email.trim().toLowerCase();
            let userToLogin = null;

            // First check hardcoded admin credentials
            const hardcodedAdminData = HARDCODED_ADMINS[emailToCheck];
            if (hardcodedAdminData && hardcodedAdminData.password === formData.password) {
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
                    setError('No account found with this email address. Please check your email or register for a new account.');
                    setIsLoading(false);
                    return;
                }

                if (user.password !== formData.password) {
                    setError('Invalid email or password.');
                    setIsLoading(false);
                    return;
                }
                userToLogin = user;
            }

            if (!userToLogin) {
                setError('Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            setCurrentUser(userToLogin);
            localStorage.setItem('apprenticeEmail', userToLogin.email);

            if (userToLogin.forcePasswordChange) {
                setCurrentStep(REGISTRATION_STEPS.FORCE_PASSWORD_CHANGE);
            } else if (userToLogin.status === 'approved') {
                setCurrentStep(REGISTRATION_STEPS.APPROVED);
            } else if (userToLogin.status === 'rejected') {
                setCurrentStep(REGISTRATION_STEPS.REJECTED);
            } else {
                setCurrentStep(REGISTRATION_STEPS.PENDING_APPROVAL);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('apprenticeEmail');
        setCurrentUser(null);
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            company: '',
            cohortNumber: '',
            country: '',
            millCity: '',
            millState: '',
            role: '',
            password: '',
            confirmPassword: '',
            profilePictureUrl: null
        });
        setNewPasswordData({
            newPassword: '',
            confirmNewPassword: ''
        });
        setError('');
        setCurrentStep(REGISTRATION_STEPS.LOGIN);
    };

    const handleCheckStatus = async () => {
        setIsLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter your email and password to check status.');
            setIsLoading(false);
            return;
        }

        try {
            const emailToCheck = formData.email.trim().toLowerCase();
            
            const hardcodedAdmin = HARDCODED_ADMINS[emailToCheck];
            if (hardcodedAdmin && hardcodedAdmin.password === formData.password) {
                setError('STATUS:APPROVED:Your account status: Approved (Admin). You can now sign in to access the portal!');
                setIsLoading(false);
                return;
            }

            const allUsers = await ApprenticeUser.list();
            const user = allUsers.find(u => u.email.trim().toLowerCase() === emailToCheck);

            if (!user) {
                setError('No account found for this email address. Please register or try a different email.');
                setIsLoading(false);
                return;
            }

            if (user.password !== formData.password) {
                setError('Invalid password for this email. Please check your credentials.');
                setIsLoading(false);
                return;
            }

            if (user.status === 'pending_approval') {
                setError('STATUS:PENDING:Your portal access request is currently pending approval. Please check back in 2-4 business days or contact your instructor.');
            } else if (user.status === 'approved') {
                setError('STATUS:APPROVED:Great news! Your account is approved and ready to use. You can now sign in to access the portal!');
            } else if (user.status === 'rejected') {
                setError('STATUS:REJECTED:Your portal access request was not approved. Please contact an administrator at paolomorales@reliabilitysolutions.net for assistance.');
            } else {
                setError('Unknown account status. Please contact support.');
            }

        } catch (error) {
            console.error('Error checking status:', error);
            setError('Failed to check status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (HARDCODED_ADMINS[formData.email.toLowerCase()]) {
                setError('This email address is reserved. Please use a different email.');
                setIsLoading(false);
                return;
            }

            if (formData.role === 'admin' && !formData.email.toLowerCase().endsWith('@reliabilitysolutions.net')) {
                setError('Admin role can only be selected with an @reliabilitysolutions.net email address.');
                setIsLoading(false);
                return;
            }

            if (!formData.cohortNumber || isNaN(formData.cohortNumber) || parseInt(formData.cohortNumber) <= 0) {
                setError('Please enter a valid cohort number.');
                setIsLoading(false);
                return;
            }

            const existingUsers = await ApprenticeUser.filter({ email: formData.email.toLowerCase() });

            if (existingUsers.length > 0) {
                const existingUser = existingUsers[0];
                if (existingUser.status === 'approved') {
                    setError('An account with this email is already approved. Please use the login form.');
                } else if (existingUser.status === 'pending_approval') {
                    setError('An account with this email is already pending approval. Please wait for approval or contact an administrator.');
                } else if (existingUser.status === 'rejected') {
                    setError('Your previous application was not approved. Please contact an administrator at paolomorales@reliabilitysolutions.net for assistance.');
                } else {
                    setError('An account with this email already exists.');
                }
                setIsLoading(false);
                return;
            }

            if (formData.role !== 'admin') {
                if (!formData.password || formData.password.length < 6) {
                    setError('Password must be at least 6 characters long.');
                    setIsLoading(false);
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
            }

            const finalPassword = formData.role === 'admin' ? 'rspd2003' : formData.password;

            const userData = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                company: formData.company,
                cohortNumber: parseInt(formData.cohortNumber),
                country: formData.country,
                millCity: formData.millCity,
                millState: formData.millState,
                role: formData.role,
                password: finalPassword,
                status: 'pending_approval',
                isVerified: true,
                registrationDate: new Date().toISOString(),
                profilePictureUrl: null,
                forcePasswordChange: false
            };

            const newUser = await ApprenticeUser.create(userData);
            setCurrentUser(newUser);
            localStorage.setItem('apprenticeEmail', formData.email);
            setCurrentStep(REGISTRATION_STEPS.PENDING_APPROVAL);

        } catch (error) {
            console.error('Registration error:', error);
            setError(`Registration failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForcePasswordChange = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPasswordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        if (newPasswordData.newPassword !== newPasswordData.confirmNewPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const updatedUser = await ApprenticeUser.update(currentUser.id, {
                password: newPasswordData.newPassword,
                forcePasswordChange: false
            });

            setCurrentUser(updatedUser);
            setCurrentStep(REGISTRATION_STEPS.APPROVED);

        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartOver = () => {
        localStorage.removeItem('apprenticeEmail');
        setCurrentStep(REGISTRATION_STEPS.LOGIN);
        setCurrentUser(null);
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            company: '',
            cohortNumber: '',
            country: '',
            millCity: '',
            millState: '',
            role: '',
            password: '',
            confirmPassword: '',
            profilePictureUrl: null
        });
        setNewPasswordData({
            newPassword: '',
            confirmNewPassword: ''
        });
        setError('');
    };

    const handleForgotPassword = () => {
        alert("Password Reset\n\nPlease contact an administrator at paolomorales@reliabilitysolutions.net to reset your password.");
    };

    const switchToRegister = () => {
        setCurrentStep(REGISTRATION_STEPS.REGISTER);
        setError('');
    };

    const switchToLogin = () => {
        setCurrentStep(REGISTRATION_STEPS.LOGIN);
        setError('');
    };

    const handleCompanyChange = (value) => {
        setFormData({...formData, company: value});
        
        if (value.trim().length >= 3) {
            const filtered = companySuggestions.filter(company => 
                company.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 10);
            setFilteredCompanies(filtered);
            setShowCompanySuggestions(filtered.length > 0);
        } else {
            setShowCompanySuggestions(false);
            setFilteredCompanies([]);
        }
    };

    const handleCompanySelect = (company) => {
        setFormData({...formData, company});
        setShowCompanySuggestions(false);
        setFilteredCompanies([]);
    };

    const handleFormDataChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isAdminEmail = formData.email.toLowerCase().endsWith('@reliabilitysolutions.net');

    // roleOptions remains dynamic based on email, cannot be a top-level constant.
    const roleOptions = [
        { value: 'apprentice', label: 'Apprentice' },
        { value: 'mentor', label: 'Mentor' },
        ...(isAdminEmail ? [{ value: 'admin', label: 'Admin' }] : [])
    ];

    // Create simple data objects without React components
    const simpleCompanySuggestions = filteredCompanies.map(company => ({ 
        name: company, 
        value: company 
    }));

    const simpleCountriesOptions = COUNTRIES_LIST.map(country => ({
        value: country,
        label: country
    }));

    const simpleRoleOptions = roleOptions.map(role => ({
        value: role.value,
        label: role.label
    }));

    // Added loading spinner as per outline suggestion
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white/20 to-gray-100/20 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // If user is approved, show the portal content
    if (currentStep === REGISTRATION_STEPS.APPROVED && currentUser) {
        return <ApprenticePortalContent user={currentUser} onLogout={handleLogout} />;
    }

    // Login and Registration Views with Header and Footer
    if (currentStep === REGISTRATION_STEPS.LOGIN || currentStep === REGISTRATION_STEPS.REGISTER) {
        const isSignUpMode = currentStep === REGISTRATION_STEPS.REGISTER;
        return (
            <>
                <Header />
                <FloSignInComponent
                    isSignUp={isSignUpMode}
                    onSubmit={isSignUpMode ? handleRegister : handleLogin}
                    onToggleMode={isSignUpMode ? switchToLogin : switchToRegister}
                    onCheckStatus={handleCheckStatus}
                    onForgotPassword={handleForgotPassword}
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    error={error}
                    isLoading={isLoading}
                    // Dynamic header component as per outline
                    headerComponent={
                        isSignUpMode ? (
                            <div className="text-center">
                                <ApprenticePortalTitle value="Join The" />
                                <ApprenticePortalTitle value="Portal" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center -space-y-4 md:-space-y-6">
                                <ApprenticePortalTitle value="Apprentice" />
                                <ApprenticePortalTitle value="Portal" />
                            </div>
                        )
                    }
                    showStatusCheck={!isSignUpMode}
                    showRegistrationFields={isSignUpMode}
                    companySuggestions={simpleCompanySuggestions}
                    onCompanyChange={handleCompanyChange}
                    showCompanySuggestions={showCompanySuggestions}
                    onCompanySelect={handleCompanySelect}
                    countriesOptions={simpleCountriesOptions}
                    roleOptions={simpleRoleOptions}
                />
                {/* Only show footer on desktop */}
                <div className="hidden md:block">
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white/20 backdrop-blur-sm flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {/* Pending Approval View */}
                {currentStep === REGISTRATION_STEPS.PENDING_APPROVAL && (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-xl text-center max-w-lg w-full"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 mx-auto mb-6"
                        >
                            <Clock className="w-20 h-20 text-blue-600" />
                        </motion.div>
                        
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Request Received!</h2>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Your portal access request has been successfully submitted and is now under review.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                <strong>Please allow 2-4 business days</strong> for the program manager to approve your request.
                            </p>
                            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-4">
                                <p className="text-amber-800 font-semibold mb-2">📝 Important - Write This Down:</p>
                                <p className="text-amber-700 text-sm">
                                    <strong>Email:</strong> {currentUser?.email}<br />
                                    <strong>Password:</strong> Your chosen password<br />
                                    <small>You'll need these credentials to log in once approved.</small>
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-slate-600 text-sm mb-6">
                            You'll receive an email notification or hear from your Reliability Solutions Apprenticeship Instructor once your account is approved. 
                            After approval, return to this page and log in with your credentials.
                        </p>
                        
                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    window.location.reload();
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Check Status
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleStartOver}
                                className="w-full"
                            >
                                Go back to Apprentice Portal
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Rejected */}
                {currentStep === REGISTRATION_STEPS.REJECTED && (
                    <motion.div
                        key="rejected"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-white/60 border border-gray-200 rounded-3xl p-8 shadow-lg text-center max-w-md w-full"
                    >
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Application Not Approved</h2>
                        <p className="text-slate-600 mb-6">
                            Your application for portal access was not approved. Please contact the program administrator if you believe this is an error.
                        </p>
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500">
                                Contact: paolomorales@reliabilitysolutions.net
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleStartOver}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Try Again
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Force Password Change View */}
                {currentStep === REGISTRATION_STEPS.FORCE_PASSWORD_CHANGE && (
                    <motion.div
                        key="force_change_password"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/60 border border-gray-200 rounded-3xl p-8 shadow-lg max-w-md w-full text-center"
                    >
                        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Password Reset Required</h2>
                        <p className="text-slate-600 mb-6">
                            For your security, you must reset your password to continue.
                        </p>

                        <form onSubmit={handleForcePasswordChange} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPasswordData.newPassword}
                                    onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={newPasswordData.confirmNewPassword}
                                    onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmNewPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-center"
                                >
                                    <div className="flex items-center justify-center p-3 rounded-md border border-red-300 bg-red-100 text-red-800 text-sm">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        <span className="font-semibold text-center">{error}</span>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? 'Updating...' : 'Reset Password & Continue'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
