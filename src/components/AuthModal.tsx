import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Github } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full max-w-4xl bg-[#FBFBF9] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ minHeight: 540 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[100] p-2.5 rounded-full bg-black/10 hover:bg-black/20 text-black/70 hover:text-black transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ── Left: Branding Panel ── */}
            <div className="hidden md:flex md:w-[42%] bg-[#1A1A1A] text-white p-12 flex-col justify-between relative overflow-hidden shrink-0">
              {/* Abstract bg circles */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none">
                <div className="absolute -top-32 -left-32 w-80 h-80 border border-white rounded-full" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 border border-white rounded-full" />
                <div className="absolute -bottom-20 left-10 w-48 h-48 border border-white rounded-full" />
              </div>

              <div className="relative z-10">
                <span className="font-serif italic text-3xl tracking-tight">Jobora</span>
              </div>

              <div className="relative z-10 space-y-4">
                <motion.h3
                  key={mode + '-title'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold tracking-tight leading-tight"
                >
                  {mode === 'signup' ? 'Start your journey.' : 'Welcome back.'}
                </motion.h3>
                <motion.p
                  key={mode + '-desc'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-white/55 text-sm leading-relaxed"
                >
                  {mode === 'signup'
                    ? 'Join forward-thinking companies and top-tier talent. The future of AI-powered recruitment starts here.'
                    : 'Log back in to your AI-powered hiring dashboard and pick up right where you left off.'}
                </motion.p>

                {/* Stats row */}
                <div className="flex gap-8 pt-4 border-t border-white/10">
                  {[['2.4k+', 'Companies'], ['18k+', 'Placed'], ['94%', 'Match Rate']].map(([n, l]) => (
                    <div key={l}>
                      <div className="text-lg font-bold">{n}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Form Panel ── */}
            <div className="flex-1 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#FBFBF9]">
              <div className="max-w-sm w-full mx-auto">

                {/* Mode switch */}
                <div className="flex gap-1 mb-8 p-1 bg-black/5 rounded-full w-fit">
                  {(['signup', 'login'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`relative px-5 py-2 text-[11px] uppercase tracking-widest font-bold rounded-full transition-colors duration-200 ${
                        mode === m ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      {m === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                  ))}
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-1">
                  {mode === 'signup' ? 'Create an account' : 'Log in to Jobora'}
                </h2>
                <p className="text-sm text-black/50 mb-7">
                  {mode === 'signup'
                    ? 'Free forever. No credit card required.'
                    : 'Enter your credentials to continue.'}
                </p>

                {/* OAuth */}
                <div className="flex flex-col gap-3 mb-6">
                  <button className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-black/12 bg-white hover:bg-black/[0.03] hover:border-black/20 transition-all text-sm font-semibold shadow-sm rounded-sm">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-black/12 bg-white hover:bg-black/[0.03] hover:border-black/20 transition-all text-sm font-semibold shadow-sm rounded-sm">
                    <Github className="w-4 h-4 shrink-0" />
                    Continue with GitHub
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center mb-6">
                  <div className="flex-1 border-t border-black/10" />
                  <span className="mx-4 text-[10px] uppercase tracking-widest font-bold text-black/35">or email</span>
                  <div className="flex-1 border-t border-black/10" />
                </div>

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  {mode === 'signup' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/50">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        className="w-full bg-transparent border-b border-black/20 focus:border-black py-2 outline-none transition-colors text-sm"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/50">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="w-full bg-transparent border-b border-black/20 focus:border-black py-2 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/50">Password</label>
                      {mode === 'login' && (
                        <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors">
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent border-b border-black/20 focus:border-black py-2 outline-none transition-colors text-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    className="mt-2 w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                  >
                    {mode === 'signup' ? 'Create Free Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                <p className="mt-5 text-[10px] text-black/35 text-center leading-relaxed">
                  By continuing, you agree to Jobora's{' '}
                  <span className="underline cursor-pointer hover:text-black transition-colors">Terms</span>{' '}
                  and{' '}
                  <span className="underline cursor-pointer hover:text-black transition-colors">Privacy Policy</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
