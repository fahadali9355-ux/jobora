/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BrainCircuit, Code, FileText, Zap, User, CheckCircle2,
  Search, Shield, LayoutDashboard, Cpu, Network, Briefcase,
  LineChart, SlidersHorizontal, ArrowRight, Bell
} from 'lucide-react';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#FBFBF9] text-[#1A1A1A] flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Editorial Grid Elements (Background) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
         <div className="absolute top-0 bottom-0 left-[33%] w-[1px] bg-black/5 hidden lg:block"></div>
      </div>

      {/* Navbar */}
      <header className="flex justify-between items-end px-6 lg:px-12 py-8 border-b border-black/5 relative z-10 bg-[#FBFBF9]">
        <div className="flex flex-col z-20">
          <span className="font-serif italic text-2xl lg:text-3xl leading-none">Jobora</span>
        </div>
        
        {/* Centered Navigation */}
        <nav className="absolute left-[50%] translate-x-[-50%] bottom-8 hidden md:flex items-center gap-10 text-[11px] uppercase tracking-widest font-semibold z-10">
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
        <div className="hidden md:flex items-center gap-8 z-20">
          <button className="btn-31">
            <span className="text-container">
              <span className="text">Get Started</span>
            </span>
          </button>
        </div>
      </header>

      {/* Application Main Wrapper */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 relative z-10 lg:min-h-[calc(100vh-[113px])] border-b border-black/5 bg-[#FBFBF9]">
        
        {/* Left Side: Content */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-center p-8 lg:p-16 xl:p-24 border-b lg:border-b-0 lg:border-r border-black/5">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-black/20"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] font-medium opacity-60">Next-Gen Recruitment</span>
          </div>

          <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[96px] font-bold leading-[0.85] tracking-tighter uppercase mb-10 max-w-4xl">
            AI-Powered <br />
            <span className="font-serif italic lowercase tracking-normal text-[36px] sm:text-[48px] lg:text-[64px] xl:text-[84px] opacity-80 block my-2 lg:my-4">
              Hiring,
            </span>
            Smarter Than Ever
          </h1>

          <p className="max-w-lg text-[16px] lg:text-lg leading-relaxed text-black/70 mb-12">
            Automatically rank resumes, match candidates with the right jobs, and reduce hiring time with intelligent AI-driven recruitment.
          </p>

          <div className="flex items-center flex-wrap gap-4">
            <button className="btn-find">
              Find a Job
            </button>
            <button className="btn-hire">
              Hire Talent
            </button>
          </div>
        </div>

        {/* Right Side: Mockup Placeholder */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col bg-[#F5F5F2] min-h-[400px]">
          <div className="flex-1 p-8 lg:p-12 relative overflow-hidden flex items-center justify-center">
            {/* Abstract Decorative Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-[140%] border-x border-black/5 rotate-12 bg-white/40 backdrop-blur-sm shadow-2xl"></div>
            </div>
            
            {/* Mockup Card UI representing AI matching */}
            <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] bg-white border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/5">
                 <div className="flex items-center gap-2">
                   <BrainCircuit className="w-4 h-4 text-black/40" />
                   <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">AI Candidate Match</div>
                 </div>
                 <div className="h-6 w-8 rounded-full border border-black/10 flex items-center justify-center bg-[#EAE8E2]">
                   <span className="text-[9px] font-bold opacity-80">94</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-5">
                {/* Candidate Info */}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 bg-[#F5F5F2] rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                    <User className="w-4 h-4 text-black/30" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-0.5">Eleanor Weaver</div>
                    <div className="text-[9px] text-black/50 uppercase tracking-widest font-medium">Senior Frontend Engineer</div>
                  </div>
                </div>

                {/* Match Analysis */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                       <span className="text-black/60 flex items-center gap-1.5"><Code className="w-3 h-3" /> Technical Skills</span>
                       <span>98%</span>
                    </div>
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black/80 rounded-full w-[98%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                       <span className="text-black/60 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Experience</span>
                       <span>92%</span>
                    </div>
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black/80 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                       <span className="text-black/60 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Culture Fit</span>
                       <span>88%</span>
                    </div>
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black/80 rounded-full w-[88%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-black/5 flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                 <div className="flex gap-1.5">
                   <span className="px-2 py-1 bg-[#EAE8E2] text-black/80 rounded-full">React</span>
                   <span className="px-2 py-1 bg-[#EAE8E2] text-black/80 rounded-full">TypeScript</span>
                 </div>
                 <div className="flex items-center gap-1 text-[#1A1A1A]">
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <span>Top Match</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="h-auto lg:h-40 border-t border-black/5 p-8 flex items-center bg-[#EAE8E2]">
            <p className="text-[12px] italic font-serif leading-relaxed opacity-60">
               "Finding the perfect candidate is no longer a search—it's a calculation. Precision metrics meets human potential."
            </p>
          </div>
        </div>

        </section>

        {/* UNIFIED PLATFORM SECTION (User Management) */}
        <section className="bg-[#1A1A1A] text-[#FBFBF9] border-b border-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/5">
            <div className="col-span-1 lg:col-span-4 p-8 lg:p-16 xl:p-24 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 mb-6">User Management</span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Three Portals.<br/><span className="font-serif italic font-normal text-white/70">One Ecosystem.</span></h2>
              <p className="text-white/50 text-sm leading-relaxed mb-10">Tailored experiences for seekers, recruiters, and administrators ensuring a seamless recruitment lifecycle from end to end.</p>
              
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white hover:text-white/70 cursor-pointer w-fit transition-colors">
                <span>View Documentation</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-3">
              {/* Job Seeker */}
              <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <User className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Job Seekers</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Registration & OAuth linked profiles</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Dynamic Resume parsing (PDF/DOC)</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Application status tracking</li>
                 </ul>
              </div>
              {/* Recruiter */}
              <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <Briefcase className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Recruiters</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Advanced job posting tools</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> AI-ranked candidate shortlists</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Integrated ATS & pipelines</li>
                 </ul>
              </div>
              {/* Admin */}
              <div className="p-8 lg:p-12 flex flex-col">
                 <div className="h-12 w-12 bg-white/5 flex items-center justify-center mb-8">
                   <Shield className="w-5 h-5 text-white/80" />
                 </div>
                 <h3 className="text-[13px] uppercase tracking-widest font-bold mb-4">Administrators</h3>
                 <ul className="space-y-4 text-[13px] text-white/50 leading-relaxed">
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Global access & user control</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> Resume ranking algorithm refinement</li>
                   <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-40"/> System performance monitoring</li>
                 </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI RESUME RANKING CORE */}
        <section className="bg-[#FBFBF9] text-[#1A1A1A] border-b border-black/5 overflow-hidden">
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
                <div className="bg-white border border-black/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4">
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
                </div>

                <div className="flex justify-center h-6">
                  <div className="w-[1px] h-full bg-black/20"></div>
                </div>

                <div className="bg-white border border-black/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4 ml-8">
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
                </div>

                <div className="flex justify-center h-6">
                  <div className="w-[1px] h-full bg-black/20"></div>
                </div>

                <div className="bg-white border border-[#1A1A1A] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] p-5 flex items-center gap-4 ml-16 relative overflow-hidden">
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
                </div>
              </div>

            </div>

            {/* Explanation Content */}
            <div className="col-span-1 p-8 lg:p-16 xl:p-24 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 mb-6 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" />
                The Core Technology
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-8 max-w-lg">
                Contextual AI <br />
                <span className="font-serif italic font-normal text-black/50">Resume Ranking</span>
              </h2>

              <div className="space-y-12">
                {/* Parsing */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3">1. intelligent extraction</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Extract structured data from diverse resume formats. Identifying key entities (NER) and isolating important technical and soft skills using NLP algorithms like TF-IDF setup for immediate processing.
                  </p>
                </div>

                {/* BERT */}
                <div>
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
                </div>

                {/* skill filtering */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3">3. Nuanced Skill Filtering</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Automatically segregates technical hard skills (React, Python) and behavioral soft skills (Leadership) via sentiment analysis, supplemented by experience-based boundary filtering.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ATS, SEARCH & INSIGHTS */}
        <section className="bg-[#EAE8E2] border-b border-black/5 p-6 lg:p-12 xl:p-24">
          <div className="w-full max-w-6xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div className="max-w-xl">
                 <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
                    Recruit Without <span className="font-serif italic font-normal text-black/50">Friction.</span>
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
                <div className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <Search className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Advanced Job Search</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Deep filtering by location, exact salary bands, and experience. Personalized AI recommendations surface opportunities perfectly aligned to seeker profiles.</p>
                   </div>
                </div>

                {/* ATS */}
                <div className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <LayoutDashboard className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Automated ATS</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Manage shortlists populated instantly by AI. Send automated rejection/acceptance notifications and schedule interviews directly from the dashboard.</p>
                   </div>
                </div>

                {/* Insights & Analytics */}
                <div className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6">
                   <div className="h-10 w-10 flex items-center justify-center bg-black/5">
                     <LineChart className="w-4 h-4 opacity-70" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold mb-2">Data & Analytics</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Macro-level dashboard showing hiring trends, skill demand velocity, and demographic applicant data. Track platform efficacy in real-time.</p>
                   </div>
                </div>

                {/* Notifications */}
                <div className="bg-[#FBFBF9] p-8 border border-black/5 shadow-sm space-y-6 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-8">
                   <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-black text-white rounded-full">
                     <Bell className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold mb-2">Smart Alerts & Upskilling</h4>
                     <p className="text-[13px] text-black/60 leading-relaxed">Keep candidates engaged with real-time SMS/Email alerts for application status changes, coupled with AI-driven course recommendations to bridge identified skill gaps.</p>
                   </div>
                   <div className="shrink-0">
                     <div className="flex items-center gap-2 border border-black/10 px-4 py-2 bg-white text-[10px] font-bold uppercase tracking-widest">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       Live Alerts
                     </div>
                   </div>
                </div>

             </div>
          </div>
        </section>

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
    </div>
  );
}
