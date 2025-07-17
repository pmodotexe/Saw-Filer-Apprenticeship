
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, User, Search, Building, GraduationCap, MapPin } from "lucide-react";

const AnimatedFormField = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  showToggle,
  onToggle,
  showPassword,
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600">
          {icon}
        </div>
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent pl-10 pr-12 text-gray-900 placeholder:text-gray-500 focus:outline-none ${
            isFocused || value ? 'pt-6 pb-2' : 'py-3'
          }`}
          placeholder=""
          required={required}
        />
        
        <label className={`absolute left-10 transition-all duration-200 ease-in-out pointer-events-none ${
          isFocused || value 
            ? 'top-2 text-xs text-blue-600 font-medium' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
        }`}>
          {placeholder}
        </label>

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {isHovering && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    </div>
  );
};

const AnimatedSelect = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600">
          {icon}
        </div>
        
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent pl-10 pr-8 focus:outline-none appearance-none ${
            value ? 'text-gray-900' : 'text-transparent'
          } ${isFocused || value ? 'pt-6 pb-2' : 'py-3'}`}
          required={required}
        >
          <option value="" disabled hidden></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        
        <label className={`absolute left-10 transition-all duration-200 ease-in-out pointer-events-none ${
          isFocused || value 
            ? 'top-2 text-xs text-blue-600 font-medium' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
        }`}>
          {placeholder}
        </label>

        {isHovering && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    </div>
  );
};

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 50 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
    />
  );
};

const FloSignInComponent = ({
  isSignUp = false,
  onSubmit,
  onToggleMode,
  onCheckStatus,
  onForgotPassword,
  formData,
  onFormDataChange,
  error,
  isLoading,
  headerComponent,
  showStatusCheck = false,
  showRegistrationFields = false,
  companySuggestions = [],
  onCompanyChange,
  showCompanySuggestions = false,
  onCompanySelect,
  countriesOptions = [],
  roleOptions = []
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const getStyledErrorMessage = (rawError) => {
    if (!rawError) return null;

    const parts = rawError.split(':');
    if (parts.length > 2 && parts[0] === 'STATUS') {
      const statusType = parts[1];
      const message = parts.slice(2).join(':');
      let textColorClass = '';
      let bgColorClass = '';
      let icon = null;

      if (statusType === 'APPROVED') {
        textColorClass = 'text-green-800';
        bgColorClass = 'bg-green-100 border-green-300';
        icon = '✅';
      } else if (statusType === 'PENDING') {
        textColorClass = 'text-blue-800';
        bgColorClass = 'bg-blue-100 border-blue-300';
        icon = '⏳';
      } else if (statusType === 'REJECTED') {
        textColorClass = 'text-red-800';
        bgColorClass = 'bg-red-100 border-red-300';
        icon = '❌';
      }

      return (
        <div className={`flex items-center justify-center p-3 rounded-md border text-sm ${textColorClass} ${bgColorClass}`}>
          <span className="mr-2">{icon}</span>
          <span className="font-semibold text-center">{message}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center p-3 rounded-md border border-red-300 bg-red-100 text-red-800 text-sm">
          <span className="mr-2">⚠️</span>
          <span className="font-semibold text-center">{rawError}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 pt-20 pb-4 relative overflow-hidden min-h-screen">
      <FloatingParticles />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
          {/* Custom Header Component */}
          {headerComponent && (
            <div className="text-center mb-6 md:mb-8">
              {headerComponent}
            </div>
          )}

          {/* Default Headers if no custom component */}
          {!headerComponent && (
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome back'}
              </h1>
              {!isSignUp && (
                <p className="text-gray-600">Sign in to your account</p>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 md:mb-6">
              {getStyledErrorMessage(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Registration Fields */}
            {isSignUp && showRegistrationFields && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedFormField
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName || ''}
                    onChange={(e) => onFormDataChange('firstName', e.target.value)}
                    icon={<User size={18} />}
                    required
                  />
                  <AnimatedFormField
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName || ''}
                    onChange={(e) => onFormDataChange('lastName', e.target.value)}
                    icon={<User size={18} />}
                    required
                  />
                </div>

                <div className="relative">
                  <AnimatedFormField
                    type="text"
                    placeholder="Company/Organization"
                    value={formData.company || ''}
                    onChange={(e) => onCompanyChange(e.target.value)}
                    icon={<Building size={18} />}
                    required
                  />
                  {showCompanySuggestions && companySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                      {companySuggestions.map((company, index) => (
                        <div
                          key={index}
                          onClick={() => onCompanySelect(company.name || company)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {company.name || company}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <AnimatedFormField
                  type="number"
                  placeholder="What cohort are you in? (e.g., 7)"
                  value={formData.cohortNumber || ''}
                  onChange={(e) => onFormDataChange('cohortNumber', e.target.value)}
                  icon={<GraduationCap size={18} />}
                  required
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800 font-medium mb-2">
                    📍 Plant/Mill Location Information
                  </p>
                  <p className="text-xs text-blue-600">
                    Please provide the location details for your plant or mill facility (not your personal address).
                  </p>
                </div>

                <AnimatedSelect
                  value={formData.country || ''}
                  onChange={(e) => onFormDataChange('country', e.target.value)}
                  options={countriesOptions}
                  placeholder="Select Plant/Mill Country"
                  icon={<MapPin size={18} />}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedFormField
                    type="text"
                    placeholder="Plant/Mill City"
                    value={formData.millCity || ''}
                    onChange={(e) => onFormDataChange('millCity', e.target.value)}
                    icon={<MapPin size={18} />}
                    required
                  />
                  <AnimatedFormField
                    type="text"
                    placeholder="State/Province/Region"
                    value={formData.millState || ''}
                    onChange={(e) => onFormDataChange('millState', e.target.value)}
                    icon={<MapPin size={18} />}
                    required
                  />
                </div>

                <AnimatedFormField
                  type="email"
                  placeholder="Email Address"
                  value={formData.email || ''}
                  onChange={(e) => onFormDataChange('email', e.target.value)}
                  icon={<Mail size={18} />}
                  required
                />

                <AnimatedSelect
                  value={formData.role || ''}
                  onChange={(e) => onFormDataChange('role', e.target.value)}
                  options={roleOptions}
                  placeholder="Select your role"
                  icon={<User size={18} />}
                  required
                />
              </>
            )}

            {/* Email Field for Login only */}
            {!isSignUp && (
              <AnimatedFormField
                type="email"
                placeholder="Email Address"
                value={formData.email || ''}
                onChange={(e) => onFormDataChange('email', e.target.value)}
                icon={<Mail size={18} />}
                required
              />
            )}

            {/* Password Field */}
            <AnimatedFormField
              type={showPassword ? "text" : "password"}
              placeholder={isSignUp ? "Create Password" : "Password"}
              value={formData.password || ''}
              onChange={(e) => onFormDataChange('password', e.target.value)}
              icon={<Lock size={18} />}
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              required
            />

            {/* Confirm Password Field for Registration */}
            {isSignUp && showRegistrationFields && formData.role !== 'admin' && (
              <AnimatedFormField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword || ''}
                onChange={(e) => onFormDataChange('confirmPassword', e.target.value)}
                icon={<Lock size={18} />}
                showToggle={true}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                showPassword={showConfirmPassword}
                required
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            {/* Status Check Button */}
            {showStatusCheck && (
              <button
                type="button"
                onClick={onCheckStatus}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Checking...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search size={18} className="mr-2" />
                    Check Application Status
                  </div>
                )}
              </button>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-4 md:mt-6 text-center space-y-2 md:space-y-3">
            {!isSignUp && onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot your password?
              </button>
            )}
            
            {onToggleMode && (
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Create Account'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloSignInComponent;
