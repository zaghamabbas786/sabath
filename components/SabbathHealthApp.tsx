'use client';

import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SYMPTOM_CATEGORIES } from '@/lib/constants';
import { AppState, HealingResponse, SymptomCategoryType } from '@/lib/types';

// --- Icons (Updated to be more rounded and playful) ---

const FeatherIcon = ({ className = "text-sabbath-earth/80" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LeafIcon = ({ className = "text-sabbath-moss" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = ({ className = "text-sabbath-gold" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M1 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 12H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CrossIcon = ({ className = "text-sabbath-espresso" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertIcon = ({ className = "text-red-600" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-sabbath-warmGray">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-sabbath-moss">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = ({ className = "text-sabbath-espresso" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = ({ className = "text-sabbath-gold" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CheckCircleIcon = ({ className = "text-sabbath-moss" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Components ---

const Header = ({ onReset }: { onReset: () => void }) => {
  const { isSignedIn, user } = useUser();
  
  return (
    <header className="w-full py-8 px-8 flex justify-between items-center animate-fade-in">
      <button onClick={onReset} className="flex items-center gap-3 group">
        <div className="bg-sabbath-gold/20 p-2 rounded-full group-hover:bg-sabbath-gold/40 transition-colors">
          <CrossIcon className="text-sabbath-espresso group-hover:text-sabbath-espresso" />
        </div>
        <h1 className="text-sm font-sans font-bold tracking-widest uppercase text-sabbath-espresso group-hover:text-sabbath-clay transition-colors">
          SABBATH HEALTH
        </h1>
      </button>
      
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-sans font-medium text-sabbath-espresso">
              {user?.firstName || 'User'}
            </p>
          </div>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10 border-2 border-sabbath-subtle hover:border-sabbath-moss transition-colors'
              }
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <a
            href="/sign-in"
            className="px-6 py-2 rounded-full bg-white border border-sabbath-subtle text-sabbath-espresso font-sans text-xs font-bold uppercase tracking-widest hover:bg-sabbath-moss hover:text-white hover:border-sabbath-moss transition-all duration-200"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="px-6 py-2 rounded-full bg-sabbath-espresso text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-sabbath-clay transition-all duration-200"
          >
            Sign Up
          </a>
        </div>
      )}
    </header>
  );
};

const SearchInput = ({ 
  onSearch, 
  isLoading, 
  initialValue = '' 
}: { 
  onSearch: (q: string) => void, 
  isLoading: boolean,
  initialValue?: string 
}) => {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) onSearch(val);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-12 z-20 relative">
      <div className="relative flex flex-col gap-6 items-center">
        <div className="relative w-full group transition-all hover:scale-[1.02] duration-300">
          <div className="absolute inset-0 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-300"></div>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Name your burden or pain..."
            className="relative w-full py-4 px-8 bg-transparent text-sabbath-espresso placeholder:text-sabbath-warmGray/60 text-center font-sans text-lg font-medium focus:outline-none rounded-full"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sabbath-moss animate-pulse">
              <LeafIcon className="animate-spin" />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!val.trim() || isLoading}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 transition-all duration-500 bg-sabbath-moss text-white px-8 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-lg hover:bg-sabbath-espresso hover:-translate-y-0.5 flex items-center gap-2 transform"
          style={{ opacity: val.trim() ? 1 : 0, pointerEvents: val.trim() ? 'auto' : 'none' }}
        >
          <span>Begin Reflection</span>
          <FeatherIcon className="text-white w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

const CategoryAccordion = ({ onSelect, isLoading }: { onSelect: (symptom: string) => void, isLoading: boolean }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return null;

  const toggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-in pb-24">
      <p className="font-sans text-sabbath-warmGray text-xs uppercase tracking-widest mb-8 opacity-60">
        Or choose a category below
      </p>

      <div className="w-full flex flex-col gap-3">
        {SYMPTOM_CATEGORIES?.map((category) => {
          const isOpen = expandedId === category.id;
          return (
            <div 
              key={category.id} 
              className={`w-full bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-sabbath-moss shadow-md' : 'border-sabbath-subtle hover:border-sabbath-warmGray'}`}
            >
              <button 
                onClick={() => toggle(category.id)}
                className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
              >
                <span className={`font-sans font-bold text-sm tracking-wider uppercase transition-colors ${isOpen ? 'text-sabbath-moss' : 'text-sabbath-espresso'}`}>
                  {category.label}
                </span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                   {isOpen ? <MinusIcon /> : <PlusIcon />}
                </div>
              </button>
              
              {isOpen && (
                <div className="px-5 pb-6 animate-slide-down">
                  <div className="flex flex-wrap gap-2">
                    {category.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className="px-4 py-2 rounded-full bg-sabbath-ivory border border-sabbath-subtle text-sabbath-espresso text-sm font-sans hover:bg-sabbath-moss hover:text-white hover:border-sabbath-moss transition-all duration-200 text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PaywallView = ({ 
  onSubscribe, 
  onBack, 
  isProcessing 
}: { 
  onSubscribe: () => void, 
  onBack: () => void,
  isProcessing: boolean 
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-6 pb-20 animate-fade-in flex flex-col items-center">
      {/* Premium Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sabbath-gold/20 text-sabbath-espresso border border-sabbath-gold/30 mb-8">
        <StarIcon className="w-4 h-4 text-sabbath-gold" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Sabbath Health Plus</span>
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-sabbath-gold/10 border border-sabbath-gold/30 relative overflow-hidden group">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sabbath-gold/10 to-transparent rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-sabbath-cream rounded-full flex items-center justify-center mb-6 border border-sabbath-subtle">
            <LockIcon className="w-8 h-8 text-sabbath-earth" />
          </div>

          <h2 className="font-serif text-4xl text-sabbath-espresso mb-4">Unlock Your Insight</h2>
          <p className="text-sabbath-earth font-sans text-lg leading-relaxed mb-10">
            Go deeper with Jesus. Access unlimited personalized healing plans, extended prayer guides, and spiritual root analysis.
          </p>

          <div className="w-full space-y-4 mb-10">
            {[
              "Detailed Spiritual Root Analysis",
              "Custom 7-Day Healing Journeys",
              "Deep Prayer & Scripture Guides",
              "Unlimited Personal Reflections"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-left px-4">
                <CheckCircleIcon className="w-5 h-5 text-sabbath-moss shrink-0" />
                <span className="text-sabbath-espresso font-sans font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onSubscribe}
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay transition-all duration-300 font-sans text-sm font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-wait"
          >
            {isProcessing ? (
              <>
                <LeafIcon className="w-4 h-4 text-white animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>View Pricing Plans</span>
              </>
            )}
          </button>
          
          <p className="mt-4 text-xs text-sabbath-warmGray font-sans">
            Choose from flexible subscription options
          </p>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-8 text-sabbath-warmGray hover:text-sabbath-espresso text-xs font-bold uppercase tracking-widest transition-colors"
      >
        No thanks, take me back
      </button>
    </div>
  );
};


const ResultView = ({ data, onReset }: { data: HealingResponse, onReset: () => void }) => {
  // Enforce "I understand" logic client-side as well
  const introText = (data?.what_i_am_hearing || "I hear your heart.").replace(/^My heart hears/i, "I understand");

  return (
    <div className="animate-fade-in w-full max-w-3xl mx-auto pb-16 px-6 text-left">
      
      {/* Prominent Medical Warning Banner */}
      {data?.is_medical_warning && (
        <div className="w-full mb-12 animate-slide-down relative group">
          <div className="absolute inset-0 bg-red-600 rounded-2xl opacity-10 group-hover:opacity-15 transition-opacity"></div>
          <div className="relative bg-white border-l-8 border-red-600 rounded-r-2xl p-6 md:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="bg-red-100 p-4 rounded-full text-red-600 shrink-0">
              <AlertIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-700 font-bold font-sans text-lg uppercase tracking-wider mb-2">
                Medical Attention Advised
              </h3>
              <p className="text-sabbath-espresso text-base leading-relaxed font-medium mb-3">
                The symptoms you described may indicate a condition requiring professional medical attention.
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-sm">
                Read Full Disclaimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Insight Summary */}
      <section className="mb-24 mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sabbath-moss/10 text-sabbath-moss mb-8 animate-float">
           <SunIcon className="w-5 h-5" />
           <span className="text-[11px] uppercase tracking-widest font-bold">Insights</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-sabbath-espresso leading-[1.2] font-light mb-6">
          {introText}
        </h2>
        <div className="w-24 h-1 bg-sabbath-gold/40 rounded-full"></div>
      </section>

      {/* Body Connection (Minor Context) */}
      {data?.body_connection?.length > 0 && (
        <section className="mb-20 bg-white/50 p-8 rounded-3xl border border-sabbath-subtle/30">
           <h3 className="font-sans font-bold text-lg text-sabbath-clay mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-sabbath-clay"></div>
             Physical Connection
           </h3>
           <ul className="space-y-3">
             {data.body_connection?.map((item, i) => (
               <li key={i} className="text-sabbath-espresso/90 font-sans text-[19px] leading-relaxed">
                 {item}
               </li>
             ))}
           </ul>
        </section>
      )}

      {/* Section 2: Emotional Roots (Expanded) */}
      {data?.emotional_roots?.length > 0 && (
      <section className="mb-24">
        <h3 className="font-serif text-3xl text-sabbath-espresso mb-8 pb-4 border-b border-sabbath-subtle">
          Emotional Landscape
        </h3>
        <div className="space-y-6">
          {data.emotional_roots?.map((paragraph, i) => (
            <p key={i} className="text-sabbath-espresso/90 font-sans text-[19px] leading-[1.6]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      )}

      {/* Section 3: Spiritual Roots (Expanded & Stanza-based) */}
      {data?.spiritual_roots?.length > 0 && (
      <section className="mb-24 bg-sabbath-ivory p-10 md:p-12 rounded-[2rem] border border-sabbath-subtle/50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sabbath-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="font-serif text-3xl text-sabbath-espresso mb-12 relative z-10">
          Spiritual Restoration
        </h3>
        
        <div className="space-y-10 relative z-10">
          {data?.spiritual_roots?.map((stanza, i) => (
            <div key={i}>
              <p className="text-sabbath-espresso/90 font-sans text-[19px] leading-[1.8] tracking-wide">
                {stanza}
              </p>
              {/* Small separator between stanzas for visual breath */}
              {i < data?.spiritual_roots?.length - 1 && (
                <div className="w-12 h-[1px] bg-sabbath-gold/30 mt-10 mb-2"></div>
              )}
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Section 4: Scripture */}
      <section className="mb-24">
        <h3 className="font-sans font-bold text-lg text-sabbath-moss mb-8 uppercase tracking-widest">
          Anchors of Truth
        </h3>
        <div className="space-y-10">
          {data.scripture_anchors?.map((anchor, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border-l-4 border-sabbath-moss shadow-sm">
              <p className="font-serif text-2xl text-sabbath-espresso leading-relaxed italic mb-4">
                &quot;{anchor.text}&quot;
              </p>
              <div className="text-sabbath-warmGray font-sans text-base font-bold tracking-wide">
                — {anchor.reference}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Guided Prayer (Stanzas) */}
      <section className="mb-24 bg-sabbath-earth/5 p-10 md:p-12 rounded-[2rem] border border-sabbath-earth/10">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-sabbath-earth/10 p-2 rounded-full">
            <FeatherIcon className="text-sabbath-earth w-5 h-5" />
          </div>
          <h3 className="font-serif text-3xl text-sabbath-espresso">Prayer of Release</h3>
        </div>
        
        <div className="space-y-12">
           {data.guided_prayer?.map((stanza, i) => (
             <div key={i} className="relative">
               <p className="font-serif text-[21px] leading-[1.9] text-sabbath-espresso/90 italic">
                 {stanza}
               </p>
             </div>
           ))}
           <div className="flex justify-center mt-8">
             <div className="text-sabbath-earth/40 text-sm tracking-[0.3em] uppercase font-sans">Amen</div>
           </div>
        </div>
      </section>

      {/* Section 6: Seven-Day Program */}
      <section className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-sabbath-subtle shadow-lg shadow-sabbath-subtle/10">
        <h3 className="font-serif text-3xl text-sabbath-espresso mb-12 pb-4 border-b border-sabbath-subtle">
          Seven-Day Healing & Renewal
        </h3>
        
        <div className="space-y-12">
          {data?.seven_day_program?.map((day, i) => (
            <div key={i} className="relative pl-6 border-l border-sabbath-subtle group hover:border-sabbath-gold transition-colors">
              <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-sabbath-subtle group-hover:bg-sabbath-gold transition-colors"></div>
              
              <h4 className="font-serif text-2xl text-sabbath-espresso mb-4 group-hover:text-sabbath-clay transition-colors">
                {day.day_title}
              </h4>
              
              <div className="space-y-4">
                 <p className="text-sabbath-espresso/80 font-sans text-[18px] leading-relaxed">
                   <span className="font-bold text-sabbath-warmGray mr-2">Activity:</span>
                   {day.activity}
                 </p>
                 
                 <div className="bg-sabbath-ivory p-6 rounded-xl border border-sabbath-subtle/40">
                   <p className="text-sabbath-espresso/90 font-sans text-[18px] leading-relaxed italic mb-3">
                     &quot;{day.listening_prompt}&quot;
                   </p>
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-sans text-sabbath-earth">
                      <span className="font-bold">{day.scripture_ref}</span>
                      <span className="w-1 h-1 bg-sabbath-subtle rounded-full"></span>
                      <span>{day.declaration}</span>
                   </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <div className="flex justify-start mt-16">
        <button 
          onClick={onReset}
          className="px-10 py-4 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay hover:scale-[1.02] transition-all duration-300 font-sans text-sm font-bold uppercase tracking-widest shadow-lg flex items-center gap-3"
        >
          <span>Begin New Reflection</span>
          <LeafIcon className="w-4 h-4 text-white/80" />
        </button>
      </div>

      {/* Large High-Contrast Disclaimer Footer */}
      <div className="mt-32 bg-sabbath-espresso text-sabbath-ivory p-10 md:p-16 rounded-[2.5rem] text-center max-w-4xl mx-auto shadow-2xl shadow-sabbath-earth/20 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 p-4 rounded-full mb-6">
             <AlertIcon className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-serif text-3xl md:text-4xl mb-6 text-white tracking-wide">
            Medical Disclaimer
          </h4>
          <div className="w-20 h-1 bg-white/20 rounded-full mb-8"></div>
          <p className="text-sabbath-ivory/90 text-lg md:text-xl font-sans leading-[1.8] max-w-3xl">
            This application offers spiritual insights and prayerful reflection. It is <strong className="text-white font-bold border-b border-white/30 pb-0.5">not</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const SYSTEM_INSTRUCTION = `
You are "Sabbath Health", a wise, gentle, and contemplative Christian healing assistant for the "Sabbath Health" app.
Your tone is monastic, calm, and deeply grounded in Scripture.
Your task is to connect physical symptoms to emotional and spiritual roots based on the teachings of Louise Hay (filtered strictly through a Biblical lens) and specifically Charles Wright's spiritual insights (synthesized with Jesus-centered theology).

HARD RULES:
1. CENTER ON JESUS: All healing comes from Him. Avoid "Universe", "Source", or "Manifesting" language. Use "Father", "Holy Spirit", "Grace".
2. NO NEW AGE: Reinterpret Louise Hay's insights into Christian truth (renewing the mind/identity in Christ).
3. NO GUILT: Present spiritual roots as areas for freedom, not condemnation.
4. DEPTH: Provide substantial, pastoral content.
5. FORMAT: Return strictly JSON.

CONTENT STRUCTURE:
1. WHAT I'M HEARING:
   - Start strictly with the phrase "I understand..." (NEVER use "My heart hears").
   - A compassionate, friendly reflection (2-4 sentences).
   - Encouraging tone: "You're not alone." No diagnosing.

2. EMOTIONAL INSIGHTS (Christian Worldview via Louise Hay PDF):
   - **Write 2-4 FULL paragraphs.**
   - Deep dive into emotional patterns rooted in stress, fear, pressure, resentment, guilt, suppression, or grief.
   - Explain how these patterns form and affect behavior, thinking, and relationships.
   - Describe how they distort identity or hope.
   - Include examples of inner dialogue.
   - Explain how Jesus gently confronts and heals these.

3. SPIRITUAL INSIGHTS (From Charles Wright PDF - Jesus-Centered Synthesis):
   - **Write 5-7 DISTINCT, SHORT STANZAS (3-4 sentences max).** 
   - Use poetic line breaks in your thought process (separate into array strings).
   - Discuss the spiritual weight of internal agreements.
   - Address how fear, shame, hopelessness, striving, bitterness, or confusion affect the spirit.
   - Focus on: Jesus restoring spiritual integrity, the Holy Spirit realigning the heart, surrender, truth, confession, rest, belonging, and identity.
   - Emphasize the authority of Christ over internal conflict and how receiving truth breaks spiritual heaviness.

4. SCRIPTURE ANCHORS:
   - 2-4 short verses.
   - Each verse gets a reference and a one-sentence paraphrase.

5. GUIDED PRAYER (To Jesus):
   - **Make this LONG and DEEP.**
   - **Format:** Return an array of 6-8 strings. Each string MUST be a distinct stanza of roughly 3 sentences.
   - Do not be brief. Take time to walk the user into the presence of God.
   - Structure:
     - Stanza 1: Start by quieting the heart and acknowledging Jesus' nearness.
     - Stanza 2: Name the specific pain/burden and physically hand it to Him.
     - Stanza 3: Ask for the Holy Spirit to wash over the mind and body.
     - Stanza 4: Speak truth over the specific lies identified earlier.
     - Stanzas 5-7: Continue into deep intercession and release.
     - Final Stanza: End with a deep sense of safety, rest, and sealing the work in His name.
   - Tone: Warm, steady, deeply restful, and authoritative in Christ.

6. SEVEN-DAY HEALING & RENEWAL PROGRAM:
   - Provide a daily rhythm for one week.
   - Day 1: Notice & Name
   - Day 2: Release Fear
   - Day 3: Receive Truth
   - Day 4: Bless Your Body
   - Day 5: Release Resentment / Disappointment
   - Day 6: Practice Gratitude
   - Day 7: Stillness & Listening
   - Each day must include: Title, Activity (1-2 sentences), Listening Prompt, Scripture Reference, Declaration.

7. MEDICAL WARNING FLAG:
   - Set \`is_medical_warning\` to true if the user mentions symptoms like chest pain, suicide, severe bleeding, broken bones, poisoning, difficulty breathing (acute), stroke symptoms, heart attack symptoms, severe abdominal pain, or any condition where delay in medical care could be dangerous/life-threatening.
   - Set to false for common stress, tension, minor aches, or chronic non-emergency issues.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    what_i_am_hearing: { type: Type.STRING, description: "2-4 sentences restating the user's issue with empathy." },
    body_connection: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of physical/metaphorical connections (1-3 sentences)." },
    emotional_roots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-4 paragraphs explaining emotional patterns/burdens (Christian filter)." },
    spiritual_roots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 distinct short stanzas explaining spiritual themes." },
    scripture_anchors: { 
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          text: { type: Type.STRING, description: "Short paraphrase or excerpt." }
        },
        required: ["reference", "text"]
      }
    },
    guided_prayer: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "A deep, extended prayer broken into 6-8 stanzas (approx 3 sentences each)." 
    },
    seven_day_program: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_title: { type: Type.STRING, description: "e.g. 'Day 1: Notice & Name'" },
          activity: { type: Type.STRING, description: "1-2 sentence reflective activity." },
          listening_prompt: { type: Type.STRING, description: "Simple listening-to-Jesus prompt." },
          scripture_ref: { type: Type.STRING, description: "Short scripture reference." },
          declaration: { type: Type.STRING, description: "Simple declaration rooted in truth." }
        },
        required: ["day_title", "activity", "listening_prompt", "scripture_ref", "declaration"]
      },
      description: "A 7-day structured healing journey."
    },
    is_medical_warning: { type: Type.BOOLEAN, description: "Set to true if the symptom described could be a medical emergency, acute condition, or life-threatening issue requiring immediate professional attention." }
  },
  required: ["what_i_am_hearing", "body_connection", "emotional_roots", "spiritual_roots", "scripture_anchors", "guided_prayer", "seven_day_program", "is_medical_warning"]
};

export default function SabbathHealthApp() {
  const { isSignedIn, user } = useUser();
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [result, setResult] = useState<HealingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Subscription State
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [pendingQuery, setPendingQuery] = useState('');

  // Check for successful subscription from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Payment successful, refresh subscription status
      if (isSignedIn) {
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 2000); // Give webhook time to process
      }
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, [isSignedIn]);

  // Check subscription status when user signs in
  useEffect(() => {
    console.log('👤 === USER AUTH STATE CHANGED ===');
    console.log('Is signed in:', isSignedIn);
    console.log('User object exists:', !!user);
    
    if (isSignedIn) {
      console.log('✅ User is signed in, checking subscription...');
      checkSubscriptionStatus();
    } else {
      console.log('❌ User is not signed in');
      setCheckingSubscription(false);
    }
  }, [isSignedIn, user]);

  const checkSubscriptionStatus = async () => {
    try {
      console.log('🔍 === CHECKING SUBSCRIPTION STATUS ===');
      setCheckingSubscription(true);
      
      const response = await fetch('/api/check-subscription');
      console.log('📡 API Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      const hasSubscription = data.hasActiveSubscription || false;
      console.log('✅ Has subscription:', hasSubscription);
      console.log('📝 Pending query:', pendingQuery);
      console.log('🎯 Current state:', state);
      
      setHasActiveSubscription(hasSubscription);
      
      // If user now has a subscription and had a pending query, automatically perform search
      if (hasSubscription && pendingQuery && state !== AppState.RESULTS) {
        console.log('🎉 User subscribed! Automatically performing pending search:', pendingQuery);
        performSearch(pendingQuery);
        setPendingQuery(''); // Clear pending query after performing it
      } else if (!hasSubscription) {
        console.log('❌ No active subscription detected');
      }
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      setHasActiveSubscription(false);
    } finally {
      setCheckingSubscription(false);
      console.log('🏁 Subscription check complete');
    }
  };

  const handleReset = () => {
    setResult(null);
    setState(AppState.HOME);
  }

  const performSearch = async (query: string) => {
    setLoading(true);
    setState(AppState.SEARCHING);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash', // Using the model from your available list
        contents: [
          {
            role: 'user',
            parts: [
              { text: `The user is experiencing: "${query}". Provide a healing analysis based on Charles Wright's spiritual insights and Louise Hay's emotional patterns (Christian filter).` }
            ]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText) as HealingResponse;
        setResult(parsed);
        setState(AppState.RESULTS);
      } else {
        throw new Error("No response text");
      }

    } catch (error) {
      console.error("Gemini Error:", error);
      setState(AppState.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTrigger = (query: string) => {
    console.log('🔎 === SEARCH TRIGGERED ===');
    console.log('Query:', query);
    console.log('Is signed in:', isSignedIn);
    console.log('Has active subscription:', hasActiveSubscription);
    console.log('Current state:', state);
    
    // Check if user is authenticated first
    if (!isSignedIn) {
      // Save the query for after sign-in
      setPendingQuery(query);
      console.log('❌ User not signed in, redirecting to sign-in page');
      console.log('💾 Saved pending query:', query);
      // Redirect to sign-in
      window.location.href = '/sign-in';
      return;
    }

    // User is authenticated, now check subscription
    if (!hasActiveSubscription) {
      console.log('⚠️ User authenticated but no subscription');
      console.log('💾 Saving query and redirecting to pricing:', query);
      setPendingQuery(query);
      // Redirect to pricing page instead of showing paywall
      window.location.href = '/pricing';
    } else {
      console.log('✅ User has subscription, performing search');
      performSearch(query);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Error creating checkout:', data.error);
        setState(AppState.ERROR);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setState(AppState.ERROR);
      setLoading(false);
    }
  };

  // Show loading only for authenticated users while checking subscription
  // Unauthenticated users can see the home page immediately
  if (isSignedIn && checkingSubscription && state === AppState.HOME) {
    return (
      <div className="min-h-screen bg-sabbath-cream flex flex-col font-sans selection:bg-sabbath-moss/30">
        <Header onReset={handleReset} />
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LeafIcon className="w-12 h-12 text-sabbath-moss animate-spin" />
            <p className="text-sabbath-warmGray font-sans text-sm">Loading your account...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sabbath-cream flex flex-col font-sans selection:bg-sabbath-moss/30">
      <Header onReset={handleReset} />

      <main className="w-full flex-1 flex flex-col items-center pt-4 sm:pt-12 pb-12 px-4">
        
        {state === AppState.HOME && (
           <div className="w-full max-w-5xl flex flex-col items-center text-center animate-fade-in px-4">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-sabbath-subtle shadow-sm mb-8 animate-float hover:shadow-md transition-shadow">
              <LeafIcon className="w-4 h-4 text-sabbath-moss" />
              <span className="text-xs font-bold uppercase tracking-widest text-sabbath-espresso">
                Jesus-Centered Healing
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-sabbath-espresso tracking-tight mb-8 leading-[1.1] font-medium drop-shadow-sm">
              FIND HEALING<br className="hidden sm:block" /> WITH JESUS
            </h1>
            
            {/* Sub-headline */}
            <p className="font-sans text-sabbath-earth text-xl sm:text-2xl font-bold tracking-wide mb-6 max-w-3xl leading-snug">
              Understand your emotions. Heal your heart. Invite Christ into the wound.
            </p>
            
            {/* Description */}
             <p className="font-sans text-sabbath-warmGray text-base sm:text-lg font-medium mb-12 max-w-2xl leading-relaxed opacity-90">
              Tell the app what you&apos;re facing.
              It will reflect back your emotional patterns, offer Jesus-centered spiritual insight,
              and guide you into prayer and renewal.
            </p>

            {/* Search */}
            <SearchInput 
              onSearch={handleSearchTrigger} 
              isLoading={loading} 
              initialValue={pendingQuery} 
            />

            {/* Category Accordion */}
            <CategoryAccordion onSelect={handleSearchTrigger} isLoading={loading} />
          </div>
        )}

        {state === AppState.PAYWALL && (
          <PaywallView 
            onSubscribe={handleSubscribe}
            onBack={() => setState(AppState.HOME)}
            isProcessing={loading}
          />
        )}

        {state === AppState.SEARCHING && (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-8">
             <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-sabbath-subtle opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-sabbath-moss animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                   <LeafIcon className="w-8 h-8 text-sabbath-moss" />
                </div>
             </div>
            <p className="text-sabbath-warmGray font-serif italic text-2xl tracking-wide animate-pulse">Seeking wisdom...</p>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="max-w-md mx-auto p-8 text-center mt-20 animate-slide-down">
            <div className="bg-white border border-sabbath-subtle p-12 rounded-[2rem] shadow-lg">
              <div className="w-12 h-12 bg-sabbath-clay/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FeatherIcon className="text-sabbath-clay" />
              </div>
              <p className="text-sabbath-espresso font-serif text-xl mb-8">The connection was interrupted.</p>
              <button 
                onClick={() => setState(AppState.HOME)}
                className="text-xs font-bold text-white bg-sabbath-clay hover:bg-sabbath-espresso uppercase tracking-[0.2em] transition-all px-8 py-3 rounded-full"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {state === AppState.RESULTS && result && (
          <ResultView 
            data={result} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
}
