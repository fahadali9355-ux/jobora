/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BrainCircuit, Code, FileText, Zap, User, CheckCircle2,
  Search, Shield, LayoutDashboard, Cpu, Network, Briefcase,
  LineChart, SlidersHorizontal, ArrowRight, Bell
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function App() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const openAuth = (mode: 'login' | 'signup') => { 
    setIsMobileMenuOpen(false);
    navigate(`/${mode}`); 
  };

  const { scrollY, scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const abstractRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const titleY = useTransform(scrollY, [0, 800], [0, 80]);
  const mockupY = useTransform(scrollY, [0, 800], [0, -100]);

  return (
    <div className="w-full min-h-screen bg-[#FBFBF9] text-[#1A1A1A] flex flex-col font-sans relative overflow-hidden">
      {/* Parallax Background Graphics */}
      <motion.div 
         style={{ y: backgroundY, rotate: abstractRotate }}
         className="fixed top-[10%] right-[-10%] w-[800px] h-[800px] border border-black/5 rounded-full pointer-events-none z-0 hidden lg:block"
      />
      <motion.div 
         style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
         className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] border border-black/5 rounded-full pointer-events-none z-0 hidden lg:block"
      />

      {/* Decorative Editorial Grid Elements (Background) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
         <div className="absolute top-0 bottom-0 left-[33%] w-[1px] bg-black/5 hidden lg:block"></div>
      </div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 lg:px-12 py-4 border-b border-black/5 relative z-10 bg-[#FBFBF9]/95 backdrop-blur-md sticky top-0">
        <div className="flex flex-col z-20">
          <span className="font-serif italic text-xl lg:text-2xl leading-none tracking-tight text-shimmer">Jobora</span>
        </div>
        
        {/* Centered Navigation */}
        <nav className="absolute left-[50%] translate-x-[-50%] hidden md:flex items-center gap-10 text-[11px] uppercase tracking-widest font-semibold z-10">
          <a href="#" className="group relative pb-1">
            <span className="transition-colors group-hover:text-black/60">Home</span>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
          </a>
          <a href="#" className="group relative pb-1">
            <span className="transition-colors group-hover:text-black/60">About</span>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
          </a>
          <a href="#" className="group relative pb-1">
            <span className="transition-colors group-hover:text-black/60">Features</span>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
          </a>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-6 z-20">
          <button onClick={() => openAuth('login')} className="text-[11px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity">Log In</button>
          <button onClick={() => openAuth('signup')} className="btn-31">
            <span className="text-container">
              <span className="text">Get Started</span>
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden z-30">
          <input type="checkbox" id="checkbox" className="menu-checkbox" checked={isMobileMenuOpen} onChange={(e) => setIsMobileMenuOpen(e.target.checked)} />
          <label htmlFor="checkbox" className="toggle">
            <div className="bar bar--top"></div>
            <div className="bar bar--middle"></div>
            <div className="bar bar--bottom"></div>
          </label>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <aside className={`md:hidden flex flex-col w-72 bg-[#FBFBF9] border-r border-black/5 min-h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
          <span className="font-serif italic text-xl text-shimmer">Jobora</span>
          <button className="text-black/50 hover:text-black" onClick={() => setIsMobileMenuOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-6 px-8 py-8 text-sm font-bold uppercase tracking-widest flex-1">
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black/60 transition-colors">Home</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black/60 transition-colors">About</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black/60 transition-colors">Features</a>
        </nav>
        <div className="p-8 mt-auto flex flex-col gap-4 border-t border-black/5">
          <button onClick={() => openAuth('login')} className="w-full py-4 border border-black text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 transition-colors">Log In</button>
          <button onClick={() => openAuth('signup')} className="btn-31 !py-4 !w-full flex items-center justify-center">
            <span className="text-container"><span className="text">Get Started</span></span>
          </button>
        </div>
      </aside>

      {/* Application Main Wrapper */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 relative z-10 min-h-[calc(100vh-57px)] border-b border-black/5 bg-[#FBFBF9]">
        
        {/* Left Side: Content */}
        <motion.div 
          style={{ y: titleY }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-center p-8 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-black/5"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-5">
            <span className="h-[1px] w-10 bg-black/20"></span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium opacity-60">Next-Gen Recruitment</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[76px] font-bold leading-[0.88] tracking-tighter uppercase mb-5 max-w-3xl"
          >
            AI-Powered
            <span className="font-serif italic lowercase tracking-normal text-[32px] sm:text-[42px] lg:text-[54px] xl:text-[68px] opacity-80 block my-1 lg:my-2">
              Hiring,
            </span>
            <span className="relative inline-block group cursor-default">
              Smarter
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>{" "}
            <span className="relative inline-block group cursor-default">
              Than Ever
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black group-hover:w-full transition-all duration-700 ease-out"></span>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-md text-sm lg:text-base leading-relaxed text-black/65 mb-8">
            Automatically rank resumes, match candidates with the right jobs, and reduce hiring time with{" "}
            <span className="font-semibold text-black relative group cursor-default">
              intelligent AI
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black/30 group-hover:bg-black transition-colors duration-300"></span>
            </span>
            -driven recruitment.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4">
            <motion.button onClick={() => openAuth('signup')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-find">
              Find a Job
            </motion.button>
            <motion.button onClick={() => openAuth('signup')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-hire">
              Hire Talent
            </motion.button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div variants={itemVariants} className="flex items-center gap-6 mt-8 pt-8 border-t border-black/5">
            <div className="flex -space-x-2">
              {["#C4B5A0","#A89880","#8C7B65","#706050"].map((c,i) => (
                <div key={i} style={{backgroundColor: c}} className="w-7 h-7 rounded-full border-2 border-[#FBFBF9]"></div>
              ))}
            </div>
            <span className="text-[11px] text-black/50"><span className="font-bold text-black">2,400+</span> companies already hiring smarter</span>
          </motion.div>
        </motion.div>

        {/* Right Side: Mockup Placeholder */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col bg-[#F5F5F2] min-h-[400px]">
          <div className="flex-1 p-8 lg:p-12 relative overflow-hidden flex items-center justify-center">
            {/* Abstract Decorative Background Elements */}
            <motion.div style={{ y: titleY }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-[140%] border-x border-black/5 rotate-12 bg-white/40 backdrop-blur-sm shadow-2xl"></div>
            </motion.div>
            
            {/* Mobile Dashboard Mockup */}
            <motion.div style={{ y: mockupY }} className="relative z-10 w-[280px] h-[560px] bg-[#1A1A1A] rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-[#1A1A1A] overflow-hidden flex flex-col">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 inset-x-0 flex justify-center z-50">
                <div className="w-[100px] h-[24px] bg-[#1A1A1A] rounded-b-[16px]"></div>
              </div>

              {/* Status Bar */}
              <div className="h-10 w-full bg-[#FBFBF9] flex justify-between items-end px-5 pb-2 text-[10px] font-bold tracking-wider z-40 relative">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-black/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>
                  <Zap className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 bg-[#FBFBF9] flex flex-col relative overflow-hidden">
                 
                 {/* Header */}
                 <div className="px-5 pt-3 pb-4">
                   <div className="flex justify-between items-center mb-5">
                     <div>
                       <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold mb-1">Welcome back</p>
                       <h3 className="text-sm font-bold tracking-tight">Sarah Jenkins</h3>
                     </div>
                     <motion.div 
                       animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       className="w-9 h-9 rounded-full bg-[#EAE8E2] flex items-center justify-center border border-black/5"
                     >
                       <User className="w-4 h-4 text-black/60" />
                     </motion.div>
                   </div>
                   
                   <motion.div
                     animate={{ y: [0, -4, 0] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   >
                     <motion.div 
                       initial={{ scale: 0.95, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ delay: 0.2, type: "spring" }}
                       className="bg-[#1A1A1A] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
                     >
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute -right-8 -top-8 w-24 h-24 bg-white rounded-full blur-2xl"
                       ></motion.div>
                       <h4 className="text-[10px] uppercase tracking-widest opacity-60 mb-2 relative z-10">Active Roles</h4>
                       <div className="text-3xl font-serif italic flex items-baseline gap-2 relative z-10">
                         <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>12</motion.span> <span className="text-[10px] font-sans not-italic text-white/50 tracking-widest uppercase font-bold">open</span>
                       </div>
                       <div className="mt-4 flex items-center gap-2 relative z-10">
                         <motion.div 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           transition={{ delay: 0.6, staggerChildren: 0.1 }}
                           className="flex -space-x-2"
                         >
                           <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="w-6 h-6 rounded-full bg-[#C4B5A0] border border-[#1A1A1A]"></motion.div>
                           <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="w-6 h-6 rounded-full bg-[#A89880] border border-[#1A1A1A]"></motion.div>
                           <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="w-6 h-6 rounded-full bg-[#8C7B65] border border-[#1A1A1A]"></motion.div>
                         </motion.div>
                         <motion.span 
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: 0.6 }} 
                           transition={{ delay: 1.0 }}
                           className="text-[9px] ml-1"
                         >
                           +42 new applicants
                         </motion.span>
                       </div>
                     </motion.div>
                   </motion.div>
                 </div>

                 {/* Top Matches */}
                 <div className="flex-1 bg-[#EAE8E2]/50 rounded-t-[24px] px-5 pt-5 flex flex-col gap-3 relative">
                   <div className="flex justify-between items-center mb-1">
                     <h4 className="text-[10px] uppercase tracking-widest font-bold">Top AI Matches</h4>
                     <span className="text-[9px] text-black/40 uppercase font-bold tracking-wider">See All</span>
                   </div>

                   {/* Card 1 */}
                   <motion.div
                     animate={{ y: [0, -6, 0] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                   >
                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                       className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 relative z-10"
                     >
                       <motion.div 
                         initial={{ scale: 0 }} 
                         animate={{ scale: 1 }} 
                         transition={{ delay: 1.4, type: "spring", stiffness: 400, damping: 15 }}
                         className="absolute -top-3 -right-2 w-10 h-10 rounded-full border-2 border-[#FBFBF9] bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-[10px] shadow-sm z-20"
                       >
                         98%
                       </motion.div>
                       <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 rounded-full bg-[#F5F5F2] flex items-center justify-center">
                            <Code className="w-4 h-4 text-black/60" />
                         </div>
                         <div>
                           <h5 className="text-xs font-bold mb-0.5">Alex Rivera</h5>
                           <p className="text-[9px] text-black/50 uppercase tracking-widest font-medium">Sr. React Dev</p>
                         </div>
                       </div>
                       <div className="flex gap-1.5 text-[8px] uppercase tracking-widest font-bold mb-3">
                         <span className="bg-[#EAE8E2] px-2 py-1 rounded-full text-black/70">React</span>
                         <span className="bg-[#EAE8E2] px-2 py-1 rounded-full text-black/70">TypeScript</span>
                       </div>
                       <button className="w-full py-2.5 bg-[#F5F5F2] text-black text-[9px] uppercase tracking-widest font-bold rounded-xl hover:bg-black hover:text-white transition-colors">
                         Review Profile
                       </button>
                     </motion.div>
                   </motion.div>

                   {/* Card 2 (Stacked behind) */}
                   <motion.div
                     animate={{ y: [0, 5, 0] }}
                     transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                     className="absolute left-5 right-5 top-[180px] z-0"
                   >
                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 0.6 }}
                       transition={{ delay: 1.0, type: "spring", stiffness: 200, damping: 20 }}
                       className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 origin-top scale-[0.92] blur-[1px]"
                     >
                        <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#F5F5F2] flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-black/60" />
                         </div>
                         <div>
                           <h5 className="text-xs font-bold mb-0.5">Emma Chen</h5>
                         <p className="text-[9px] text-black/50 uppercase tracking-widest font-medium">UX Designer</p>
                       </div>
                     </div>
                   </motion.div>
                   </motion.div>
                 </div>

                 {/* Mobile Navigation Bar */}
                 <div className="h-16 bg-white border-t border-black/5 flex justify-around items-center px-4 relative z-50">
                   <div className="flex flex-col items-center gap-1 opacity-100">
                     <LayoutDashboard className="w-5 h-5 text-black" />
                     <div className="w-1 h-1 bg-black rounded-full"></div>
                   </div>
                   <Search className="w-5 h-5 text-black/30" />
                   <motion.div 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="w-12 h-12 bg-black rounded-full flex items-center justify-center -mt-6 shadow-xl border-4 border-white cursor-pointer transition-transform"
                   >
                     <Zap className="w-5 h-5 text-white fill-white" />
                   </motion.div>
                   <Bell className="w-5 h-5 text-black/30 relative">
                     <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white ping-slow"></div>
                   </Bell>
                   <User className="w-5 h-5 text-black/30" />
                 </div>
              </div>
            </motion.div>
          </div>
          
          <div className="h-auto lg:h-40 border-t border-black/5 p-8 flex items-center bg-[#EAE8E2]">
            <p className="text-[12px] italic font-serif leading-relaxed opacity-60">
               "Finding the perfect candidate is no longer a search—it's a calculation. Precision metrics meets human potential."
            </p>
          </div>
        </div>

        </section>

        {/* UNIFIED PLATFORM SECTION (User Management) */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="bg-[#1A1A1A] text-[#FBFBF9] border-b border-black/5"
        >  
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/5">
            <div className="col-span-1 lg:col-span-4 p-8 lg:p-16 xl:p-24 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 mb-6">User Management</span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Three Portals.<br/><span className="font-serif italic font-normal text-white/70 section-underline">One Ecosystem.</span></h2>
              <p className="text-white/50 text-sm leading-relaxed mb-10">Tailored experiences for seekers, recruiters, and administrators ensuring a seamless recruitment lifecycle from end to end.</p>
              
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white hover:text-white/70 cursor-pointer w-fit transition-colors">
                <span>View Documentation</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-3">
              {/* Job Seeker */}
              <motion.div variants={itemVariants} whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", transition: { duration: 0.2 } }} className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <User className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Job Seekers</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Registration & OAuth linked profiles</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Dynamic Resume parsing (PDF/DOC)</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Application status tracking</li>
                 </ul>
              </motion.div>
              {/* Recruiter */}
              <motion.div variants={itemVariants} whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", transition: { duration: 0.2 } }} className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <Briefcase className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Recruiters</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Advanced job posting tools</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> AI-ranked candidate shortlists</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Integrated ATS & pipelines</li>
                 </ul>
              </motion.div>
              {/* Admin */}
              <motion.div variants={itemVariants} whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", transition: { duration: 0.2 } }} className="p-8 lg:p-12 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <Shield className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Administrators</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Global access & user control</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Resume ranking algorithm refinement</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> System performance monitoring</li>
                 </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* AI RESUME RANKING CORE */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="bg-[#FBFBF9] text-[#1A1A1A] border-b border-black/5 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Visualizer */}
            <div className="col-span-1 border-b lg:border-b-0 lg:border-r border-black/5 bg-[#F5F5F2] p-8 lg:p-16 flex flex-col items-center justify-center min-h-[500px] relative">
              {/* Abstract decorative graphic representing parsing & BERT */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-[300px] h-[300px] border border-black/10 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                  <div className="w-[200px] h-[200px] border border-black/10 rounded-full border-dashed flex items-center justify-center">
                    <div className="w-[100px] h-[100px] border border-black/5 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full max-w-[400px] space-y-4">
                {/* Visualizer nodes */}
                <motion.div variants={itemVariants} className="bg-white border border-black/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4">
                  <div className="bg-[#EAE8E2] h-10 w-10 flex flex-col items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Raw Input</span>
                      <span className="text-[9px] opacity-40">PDF / DOCX</span>
                    </div>
                    <div className="w-full h-1 bg-black/5"></div>
                  </div>
                </motion.div>

                <div className="flex justify-center h-6">
                  <div className="w-[1px] h-full bg-black/20"></div>
                </div>

                <motion.div variants={itemVariants} className="bg-white border border-black/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4 ml-8">
                  <div className="bg-black text-white h-10 w-10 flex flex-col items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold">NLP Processor</span>
                      <span className="text-[9px] opacity-40">Tika / NER</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <span className="px-1.5 py-0.5 bg-[#F5F5F2] text-[8px] uppercase tracking-wider font-bold opacity-60">Entity</span>
                      <span className="px-1.5 py-0.5 bg-[#F5F5F2] text-[8px] uppercase tracking-wider font-bold opacity-60">Keyword</span>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-center h-6">
                  <div className="w-[1px] h-full bg-black/20"></div>
                </div>

                <motion.div variants={itemVariants} className="bg-white border border-[#1A1A1A] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4 ml-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-black/5 -m-2 opacity-50 rotate-45 pointer-events-none"></div>
                  <div className="bg-[#1A1A1A] text-white h-10 w-10 flex flex-col items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold">BERT Matching</span>
                      <span className="text-[9px] font-bold text-green-600">98% Match</span>
                    </div>
                     <div className="text-[10px] text-black/40 italic font-serif leading-tight">
                       "Understands context, not just keywords."
                     </div>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Explanation Content */}
            <div className="col-span-1 p-8 lg:p-16 xl:p-24 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 mb-6 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" />
                The Core Technology
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-8 max-w-lg">
                <span className="heading-hover">Contextual AI</span> <br />
                <span className="font-serif italic font-normal text-black/50 section-underline">Resume Ranking</span>
              </h2>

              <div className="space-y-12">
                {/* Parsing */}
                <motion.div variants={itemVariants}>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3">1. intelligent extraction</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Extract structured data from diverse resume formats. Identifying key entities (NER) and isolating important technical and soft skills using NLP algorithms like TF-IDF setup for immediate processing.
                  </p>
                </motion.div>

                {/* BERT */}
                <motion.div variants={itemVariants}>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                    2. Semantic Matching (BERT)
                  </h4>
                  <p className="text-sm text-black/60 leading-relaxed mb-4">
                    Replacing outdated keyword matching with Deep Learning. Bidirectional Encoder Representations from Transformers (BERT) evaluates holistic sentence meanings. 
                  </p>
                  <blockquote className="border-l border-black pl-4 text-sm font-serif italic text-black/70">
                    "Seeking expertise in cloud technologies" <br/>
                    <span className="font-sans not-italic text-[10px] font-bold uppercase tracking-wider text-black mt-2 inline-block">Matches with: AWS, Azure, Cloud Computing</span>
                  </blockquote>
                </motion.div>

                {/* skill filtering */}
                <motion.div variants={itemVariants}>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3">3. Nuanced Skill Filtering</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Automatically segregates technical hard skills (React, Python) and behavioral soft skills (Leadership) via sentiment analysis, supplemented by experience-based boundary filtering.
                  </p>
                </motion.div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* ATS, SEARCH & INSIGHTS */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="bg-[#EAE8E2] border-b border-black/5 p-6 lg:p-12 xl:p-24"
        >  
          <div className="w-full max-w-6xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div className="max-w-xl">
                 <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
                    <span className="heading-hover">Recruit Without</span> <span className="font-serif italic font-normal text-black/50 section-underline">Friction.</span>
                 </h2>
                 <p className="text-black/60 text-sm leading-relaxed">
                   Beyond ranking—an end-to-end Applicant Tracking System loaded with advanced search, actionable insights, and dynamic communications.
                 </p>
               </div>
               <button className="hidden md:flex px-6 py-4 bg-transparent border border-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold hover:bg-[#1A1A1A] hover:text-white transition-colors">
                 Explore ATS Features
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Search */}
                <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }} className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <Search className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Advanced Job Search</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Deep filtering by location, exact salary bands, and experience. Personalized AI recommendations surface opportunities perfectly aligned to seeker profiles.</p>
                   </div>
                </motion.div>

                {/* ATS */}
                <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }} className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <LayoutDashboard className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Automated ATS</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Manage shortlists populated instantly by AI. Send automated rejection/acceptance notifications and schedule interviews directly from the dashboard.</p>
                   </div>
                </motion.div>

                {/* Insights & Analytics */}
                <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }} className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <LineChart className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Data & Analytics</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Macro-level dashboard showing hiring trends, skill demand velocity, and demographic applicant data. Track platform efficacy in real-time.</p>
                   </div>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }} className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-8">
                   <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-black text-white rounded-full">
                     <Bell className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold mb-2">Smart Alerts & Upskilling</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Keep candidates engaged with real-time SMS/Email alerts for application status changes, coupled with AI-driven course recommendations to bridge identified skill gaps.</p>
                   </div>
                   <div className="shrink-0">
                     <div className="flex items-center gap-2 border border-black/10 px-4 py-2 bg-white text-[10px] font-bold uppercase tracking-widest">
                       <div className="w-2 h-2 rounded-full bg-green-500 ping-slow"></div>
                       Live Alerts
                     </div>
                   </div>
                </motion.div>

             </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="bg-[#1A1A1A] text-white py-16 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <span className="font-serif italic text-2xl leading-none">Jobora</span>
              <p className="text-white/40 text-xs mt-4 leading-relaxed">
                The next generation of AI-powered recruitment. Match smarter, hire faster.
              </p>
            </div>
            
            <div className="flex gap-16 lg:gap-32">
              <div className="flex flex-col gap-4">
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2">Platform</span>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">Job Seekers</a>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">Recruiters</a>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">AI Algorithm</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2">Company</span>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">About</a>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="text-xs text-white/80 hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-[9px] uppercase tracking-widest text-white/30">
            <span>© 2026 Jobora. All rights reserved.</span>
            <span>Built with React.js</span>
          </div>
        </footer>

      </main>

      {/* AuthModal replaced with page navigation */}
    </div>
  );
}
