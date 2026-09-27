import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Users, AlertCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { UserRole } from '../types';
import { CivicEmblem } from '../components/CivicEmblem';
import heroVillageImg from '../assets/images/login_village_hero_1790504196144.jpg';

export const LoginPage: React.FC = () => {
  const { currentUser, login } = usePortal();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin/dashboard' : '/member/dashboard', {
        replace: true,
      });
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    const result = login(username, password, role);
    if (!result.success) {
      setError(result.error || 'Invalid login credentials.');
      return;
    }

    navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard', { replace: true });
  };

  const fillDemo = (demoRole: UserRole) => {
    setError(null);
    if (demoRole === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      setRole('admin');
    } else {
      setUsername('member');
      setPassword('member123');
      setRole('member');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F8F5] text-[#1E2925]">
      {/* LEFT SIDE: Authentic Rural Maharashtra Gram Panchayat Visual */}
      <div className="relative lg:col-span-7 min-h-[380px] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#174C3C]">
        {!imgError ? (
          <img
            src={heroVillageImg || '/images/login-village-hero.jpg'}
            alt="Lakhlgoan Gram Panchayat Karyalaya and Rural Maharashtra Landscape"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#174C3C] via-[#236A52] to-[#0E3126]" />
        )}

        {/* Measured Dark Green & Black Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2920]/90 via-[#174C3C]/65 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091F18]/90 via-transparent to-black/35" />

        {/* Top Badge */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/35 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#EEF4F0] backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-[#D99528]" />
            <span>College Prototype • Demo System</span>
          </div>
        </div>

        {/* Center / Bottom Hero Typography */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl">
          <h1 className="font-marathi text-3xl sm:text-5xl font-bold text-white tracking-wide leading-tight drop-shadow-xs">
            ग्रामपंचायत लाखलगाव
          </h1>
          <h2 className="mt-2 font-serif-display text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Lakhlgoan Gram Panchayat
          </h2>
          <p className="mt-1.5 text-base sm:text-lg font-semibold text-[#EEF4F0]">
            Digital Records &amp; Citizen Document Portal
          </p>

          <div className="my-4 h-1 w-14 rounded-full bg-[#D99528]" />

          <p className="text-sm sm:text-base text-[#EEF4F0]/90 leading-relaxed max-w-xl">
            Secure access to Gram Panchayat records, notices, bills, development documents and
            public information.
          </p>

          {/* Subtle Bottom Village Metadata Line */}
          <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#EEF4F0]/75">
            <span>Gram Panchayat Karyalaya, Lakhlgoan</span>
            <span>·</span>
            <span>State: Maharashtra</span>
            <span>·</span>
            <span>Academic Prototype — Demo Data</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[#F7F8F5] overflow-y-auto">
        <div className="my-auto w-full max-w-md mx-auto">
          {/* Top Civic Emblem & Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#174C3C] text-white shadow-xs">
                <CivicEmblem size={34} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#236A52]">
                  Gram Panchayat Digital Portal
                </p>
                <p className="text-xs text-[#69766F]">
                  Internal Administration &amp; Citizen Access
                </p>
              </div>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1E2925] tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-[#69766F]">
              Sign in to access the Gram Panchayat Digital Records Portal
            </p>
          </div>

          {/* Invalid Credentials Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#C74A4A]/40 bg-[#C74A4A]/10 p-3.5 text-xs text-[#C74A4A]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-[#1E2925] mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username (admin or member)"
                  autoComplete="username"
                  className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1E2925] placeholder-[#69766F]/70 focus:border-[#174C3C] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#1E2925] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-10 pr-10 py-2.5 text-sm text-[#1E2925] placeholder-[#69766F]/70 focus:border-[#174C3C] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#69766F] hover:text-[#1E2925] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-[#1E2925] mb-1.5">
                Role Selector
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-[#1E2925] focus:border-[#174C3C] focus:outline-none transition-colors"
                >
                  <option value="admin">Admin (Gram Sevak / Panchayat Staff)</option>
                  <option value="member">Member (Registered Villager / Citizen)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors shadow-xs cursor-pointer"
            >
              <span>Login to Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Credentials Box for Evaluator */}
          <div className="mt-6 rounded-xl border border-[#DDE5E0] bg-white p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                Demo Credentials
              </span>
              <span className="text-[11px] text-[#69766F]">Click a role to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-colors cursor-pointer ${
                  role === 'admin' && username === 'admin'
                    ? 'border-[#174C3C] bg-[#EEF4F0]'
                    : 'border-[#DDE5E0] bg-[#F7F8F5] hover:bg-[#EEF4F0]/60'
                }`}
              >
                <span className="text-xs font-bold text-[#174C3C]">Admin (Gram Sevak)</span>
                <span className="mt-1 font-mono-num text-xs text-[#1E2925]">
                  admin / admin123
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('member')}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-colors cursor-pointer ${
                  role === 'member' && username === 'member'
                    ? 'border-[#174C3C] bg-[#EEF4F0]'
                    : 'border-[#DDE5E0] bg-[#F7F8F5] hover:bg-[#EEF4F0]/60'
                }`}
              >
                <span className="text-xs font-bold text-[#236A52]">Member (Villager)</span>
                <span className="mt-1 font-mono-num text-xs text-[#1E2925]">
                  member / member123
                </span>
              </button>
            </div>
          </div>

          {/* Academic Prototype Disclaimer Card */}
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#D99528]/30 bg-[#D99528]/10 px-4 py-3">
            <GraduationCap className="h-5 w-5 shrink-0 text-[#174C3C] mt-0.5" />
            <div className="text-xs leading-relaxed text-[#1E2925]">
              <p className="font-bold">Academic Prototype — Demo Data</p>
              <p className="text-[#69766F]">
                Prototype developed for academic demonstration purposes. Not an official government
                website.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center text-xs text-[#69766F]">
          Prototype developed for academic demonstration purposes.
        </div>
      </div>
    </div>
  );
};
