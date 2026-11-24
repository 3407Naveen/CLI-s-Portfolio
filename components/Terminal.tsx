import React, { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import { CommandResponse, HistoryItem, Theme } from '../types';
import { ASCII_HEADER, VERSION, BOOT_MESSAGES } from '../constants';
import { COMMAND_LIST, getAutocompleteSuggestions } from '../commands/index';
import { PROFILE } from '../data/profile';
import { SKILL_CATEGORIES } from '../data/skills';
import { EXPERIENCES } from '../data/experience';
import { PROJECTS } from '../data/projects';
import { INITIATIVES } from '../data/leadership';
import { ACHIEVEMENTS, EDUCATION, CERTIFICATIONS, CURRENTLY_BUILDING } from '../data/achievements';
import { askGemini } from '../services/geminiService';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Cpu, ChevronRight } from 'lucide-react';

// ── Status badge helper ──────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    active: 'bg-green-900 text-green-300 border-green-700',
    completed: 'bg-blue-900 text-blue-300 border-blue-700',
    ongoing: 'bg-orange-900 text-orange-300 border-orange-700',
    planning: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    concept: 'bg-cyan-900 text-cyan-300 border-cyan-700',
    'early-stage': 'bg-purple-900 text-purple-300 border-purple-700',
    'in-progress': 'bg-yellow-900 text-yellow-300 border-yellow-700',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 border rounded uppercase font-bold ${colors[status] || 'bg-gray-800 text-gray-400 border-gray-600'}`}>
      {status}
    </span>
  );
};

// ── Main Terminal Component ──────────────────────────────────
const Terminal: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState<Theme>('classic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Boot sequence ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const items: HistoryItem[] = [];
      // ASCII header first
      items.push({ command: 'sys', response: { type: 'ascii', content: ASCII_HEADER }, timestamp: Date.now() });
      setHistory([...items]);
      await new Promise(r => setTimeout(r, 200));

      for (const msg of BOOT_MESSAGES) {
        if (cancelled) return;
        items.push({ command: 'sys', response: { type: 'text', content: msg }, timestamp: Date.now() });
        setHistory([...items]);
        await new Promise(r => setTimeout(r, 80));
      }
      setIsBooting(false);
    };
    boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Always maintain keyboard focus on terminal input
  useEffect(() => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  }, [isBooting, history.length, isProcessing]);

  useEffect(() => {
    // Global click listener: clicking anywhere in the terminal refocuses input
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [role="button"]')) {
        return;
      }
      inputRef.current?.focus();
    };

    // Global keydown listener: typing immediately redirects to the input field
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.startsWith('F') || e.key === 'Tab' || e.key === 'Escape') {
        return;
      }
      if (document.activeElement === inputRef.current) {
        return;
      }
      if (document.activeElement?.tagName === 'A' || document.activeElement?.tagName === 'BUTTON') {
        if (e.key === 'Enter' || e.key === ' ') return;
      }
      inputRef.current?.focus();
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const addToHistory = useCallback((command: string, response: CommandResponse) => {
    setHistory(prev => [...prev, { command, response, timestamp: Date.now() }]);
  }, []);

  // ── Autocomplete ────────────────────────────────────────
  useEffect(() => {
    if (input.length > 0) {
      const s = getAutocompleteSuggestions(input);
      setSuggestions(s);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  // ── Command handler ─────────────────────────────────────
  const handleCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [trimmed, ...prev.filter(c => c !== trimmed)].slice(0, 50));
    setHistoryIndex(-1);
    setSuggestions([]);
    setIsProcessing(true);
    setInput('');

    await new Promise(r => setTimeout(r, 150));

    let response: CommandResponse = { type: 'error', content: `Command '${trimmed}' not recognized. Type "help" for available commands.` };

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const argStr = parts.slice(1).join(' ');

    try {
      switch (cmd) {
        // ── HELP ──
        case 'help':
        case 'ls': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm mb-2">╔══ AVAILABLE COMMANDS ══╗</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-yellow-500 font-bold mb-2 border-b border-current pb-1">NAVIGATION</p>
                    <ul className="space-y-1">
                      <li><span className="font-bold text-white">home</span> <span className="opacity-60">— Return to start</span></li>
                      <li><span className="font-bold text-white">about</span> <span className="opacity-60">— Who I am</span></li>
                      <li><span className="font-bold text-white">projects</span> <span className="opacity-60">— List all projects</span></li>
                      <li><span className="font-bold text-white">skills</span> <span className="opacity-60">— Technical skills</span></li>
                      <li><span className="font-bold text-white">experience</span> <span className="opacity-60">— Work history</span></li>
                      <li><span className="font-bold text-white">education</span> <span className="opacity-60">— Academic background</span></li>
                      <li><span className="font-bold text-white">achievements</span> <span className="opacity-60">— Hackathons & awards</span></li>
                      <li><span className="font-bold text-white">certifications</span> <span className="opacity-60">— Certifications</span></li>
                      <li><span className="font-bold text-white">career path</span> <span className="opacity-60">— Timeline view</span></li>
                      <li><span className="font-bold text-white">resume</span> <span className="opacity-60">— Full resume view</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-bold mb-2 border-b border-current pb-1">PROJECTS</p>
                    <ul className="space-y-1">
                      <li><span className="font-bold text-white">view &lt;project&gt;</span> <span className="opacity-60">— Detail view</span></li>
                      <li><span className="font-bold text-white">github &lt;project&gt;</span> <span className="opacity-60">— Open repo</span></li>
                      <li><span className="font-bold text-white">demo &lt;project&gt;</span> <span className="opacity-60">— Live demo</span></li>
                      <li className="opacity-50 text-xs mt-2">Projects: aegis, buildvisor, bharat-bazar, nidhi, farmbazzar</li>
                    </ul>
                    <p className="text-yellow-500 font-bold mb-2 mt-4 border-b border-current pb-1">LEADERSHIP</p>
                    <ul className="space-y-1">
                      <li><span className="font-bold text-white">leadership</span> <span className="opacity-60">— All initiatives</span></li>
                      <li><span className="font-bold text-white">leadership &lt;id&gt;</span> <span className="opacity-60">— Detail view</span></li>
                      <li className="opacity-50 text-xs mt-2">IDs: campusx, markathon, zero-ai, aavishkar, fundamentals, stitch24</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-bold mb-2 border-b border-current pb-1">INTERACTION</p>
                    <ul className="space-y-1">
                      <li><span className="font-bold text-white">ask &lt;question&gt;</span> <span className="opacity-60">— Ask AI assistant</span></li>
                      <li><span className="font-bold text-white">contact</span> <span className="opacity-60">— Contact info</span></li>
                      <li><span className="font-bold text-white">currently building</span> <span className="opacity-60">— What I'm working on</span></li>
                      <li><span className="font-bold text-white">theme &lt;style&gt;</span> <span className="opacity-60">— classic/amber/cyan</span></li>
                      <li><span className="font-bold text-white">clear</span> <span className="opacity-60">— Clear terminal</span></li>
                    </ul>
                    <div className="mt-4 text-xs opacity-40 border border-current p-2">
                      <p>TIP: Use ↑↓ for history</p>
                      <p>TAB for autocomplete</p>
                    </div>
                  </div>
                </div>
              </div>
            ),
          };
          break;
        }

        // ── HOME ──
        case 'home': {
          response = { type: 'ascii', content: ASCII_HEADER };
          break;
        }

        // ── ABOUT ──
        case 'about': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-4 animate-fadeIn max-w-4xl">
                <div className="border border-current p-4">
                  <h2 className="text-xl font-bold mb-1">{PROFILE.name}</h2>
                  <p className="text-yellow-500 text-sm font-bold mb-3">{PROFILE.title}</p>
                  <p className="italic opacity-90 mb-4 border-l-2 border-current pl-3">"{PROFILE.headline}"</p>
                  {PROFILE.summary.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm opacity-80 mb-2 leading-relaxed">{para}</p>
                  ))}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <span>📍 {PROFILE.location}</span>
                    <span>📧 {PROFILE.email}</span>
                    <a href={PROFILE.github} target="_blank" rel="noreferrer" className="underline hover:text-white">GitHub</a>
                    <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="underline hover:text-white">LinkedIn</a>
                  </div>
                </div>
              </div>
            ),
          };
          break;
        }

        // ── PROJECTS ──
        case 'projects': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ PROJECT REGISTRY ══╗</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(PROJECTS).map((p) => (
                    <div key={p.id} className={`border ${p.flagship ? 'border-yellow-500' : 'border-current'} p-3 hover:bg-white/5 transition-colors`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm">{p.name}</h3>
                        <div className="flex gap-1">
                          {p.flagship && <span className="text-[9px] px-1 bg-yellow-900 text-yellow-300 border border-yellow-700 rounded">FLAGSHIP</span>}
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                      <p className="text-xs opacity-70 mb-2 line-clamp-2">{p.description}</p>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {p.tech.slice(0, 4).map(t => <span key={t} className="text-[10px] px-1 border border-current opacity-60">{t}</span>)}
                      </div>
                      <div className="text-[10px] opacity-50 font-mono cursor-pointer hover:opacity-80" onClick={() => handleCommand(`view ${p.id}`)}>
                        → view {p.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          };
          break;
        }

        // ── SKILLS ──
        case 'skills': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ TECHNICAL SKILLS ══╗</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="border border-current p-3">
                      <div className="text-yellow-500 text-xs font-bold mb-2 border-b border-current pb-1">{cat.name}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map(item => (
                          <span key={item} className="text-xs px-2 py-0.5 border border-current hover:bg-white/10 transition-colors">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          };
          break;
        }

        // ── EXPERIENCE ──
        case 'experience': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ PROFESSIONAL EXPERIENCE ══╗</div>
                <div className="relative pl-6 border-l border-dashed border-current space-y-6">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="relative animate-fadeIn">
                      <div className="absolute -left-[29px] bg-black border-2 border-current w-3 h-3 rounded-full"></div>
                      <div className="border border-current p-4">
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-sm">{exp.position}</h3>
                            <p className="text-yellow-500 text-xs">{exp.company}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-white/10 font-mono">{exp.duration}</span>
                        </div>
                        <ul className="space-y-1 mt-2">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-xs opacity-80 flex items-start gap-2">
                              <span className="text-current opacity-50 mt-0.5">▸</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          };
          break;
        }

        // ── EDUCATION ──
        case 'education': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ EDUCATION ══╗</div>
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="border border-current p-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                        <p className="text-xs opacity-70">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] px-2 py-0.5 bg-white/10 font-mono">{edu.duration}</span>
                        <p className="text-xs text-yellow-500 mt-1 font-bold">{edu.score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          };
          break;
        }

        // ── ACHIEVEMENTS ──
        case 'achievements': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ ACHIEVEMENTS & COMPETITIONS ══╗</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((a, i) => (
                    <div key={i} className="border border-current p-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{a.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm">{a.title}</h4>
                          <p className="text-xs opacity-70 mt-1">{a.detail}</p>
                          {a.year && <span className="text-[10px] opacity-50 font-mono">{a.year}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          };
          break;
        }

        // ── LEADERSHIP ──
        case 'leadership': {
          if (argStr && INITIATIVES[argStr]) {
            const init = INITIATIVES[argStr];
            response = {
              type: 'component',
              content: (
                <div className="space-y-4 animate-fadeIn max-w-4xl">
                  <div className="border-2 border-current p-5">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <h2 className="text-xl font-bold">{init.name}</h2>
                        <p className="text-yellow-500 text-sm">{init.position}</p>
                        {init.tagline && <p className="text-xs italic opacity-70 mt-1">"{init.tagline}"</p>}
                      </div>
                      <StatusBadge status={init.status} />
                    </div>
                    <p className="text-sm opacity-80 mb-4 leading-relaxed">{init.description}</p>
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-yellow-500 mb-2 border-b border-current pb-1">KEY ACTIVITIES</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {init.highlights.map((h, i) => (
                          <li key={i} className="text-xs opacity-80 flex items-start gap-2">
                            <span className="text-current opacity-50 mt-0.5">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {init.achievements && init.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-yellow-500 mb-2 border-b border-current pb-1">ACHIEVEMENTS</h4>
                        <ul className="space-y-1">
                          {init.achievements.map((a, i) => (
                            <li key={i} className="text-xs opacity-80 flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap mt-3">
                      {init.website && (
                        <a href={init.website} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 border border-current hover:bg-white/10 transition-colors">
                          🌐 Website
                        </a>
                      )}
                      {init.registrationUrl && (
                        <a href={init.registrationUrl} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 border border-current hover:bg-white/10 transition-colors">
                          📝 Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ),
            };
          } else if (!argStr) {
            response = {
              type: 'component',
              content: (
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-yellow-500 font-bold text-sm">╔══ LEADERSHIP & STRATEGIC INITIATIVES ══╗</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(INITIATIVES).map((init) => (
                      <div key={init.id} className="border border-current p-3 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm">{init.name}</h3>
                          <StatusBadge status={init.status} />
                        </div>
                        <p className="text-xs text-yellow-500 mb-1">{init.position}</p>
                        <p className="text-xs opacity-70 mb-2 line-clamp-2">{init.description}</p>
                        <div className="text-[10px] opacity-50 font-mono cursor-pointer hover:opacity-80" onClick={() => handleCommand(`leadership ${init.id}`)}>
                          → leadership {init.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            };
          } else {
            response = { type: 'error', content: `Initiative '${argStr}' not found. Available: campusx, markathon, zero-ai, aavishkar, fundamentals, stitch24` };
          }
          break;
        }

        // ── CAREER PATH ──
        case 'career': {
          if (argStr === 'path') {
            const timeline = [
              ...EXPERIENCES.map(e => ({ date: e.startDate, title: e.position, detail: `${e.company} — ${e.duration}`, type: 'work' as const })),
              ...EDUCATION.map(e => ({ date: e.duration.split('–')[0], title: e.degree, detail: `${e.institution} — ${e.duration}`, type: 'edu' as const })),
            ].sort((a, b) => b.date.localeCompare(a.date));

            response = {
              type: 'component',
              content: (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-yellow-500 font-bold text-sm">╔══ CAREER PATH ══╗</div>
                  <div className="relative pl-8 border-l border-dashed border-current space-y-6">
                    {timeline.map((item, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[37px] border-2 w-4 h-4 rounded-full bg-black ${item.type === 'work' ? 'border-green-400' : 'border-yellow-400'}`}></div>
                        <span className={`text-[10px] font-bold px-1 rounded ${item.type === 'work' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                          {item.type === 'work' ? 'WORK' : 'EDUCATION'}
                        </span>
                        <h4 className="font-bold text-sm mt-1">{item.title}</h4>
                        <p className="text-xs opacity-70">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            };
          } else {
            response = { type: 'error', content: 'Usage: career path' };
          }
          break;
        }

        // ── RESUME ──
        case 'resume': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-5 animate-fadeIn max-w-4xl border-2 border-current p-5">
                {/* Header */}
                <div className="text-center border-b border-current pb-4">
                  <h1 className="text-2xl font-bold uppercase">{PROFILE.name}</h1>
                  <p className="text-sm text-yellow-500 mt-1">{PROFILE.title}</p>
                  <div className="text-[10px] mt-2 opacity-70 flex justify-center gap-3 flex-wrap">
                    <span>{PROFILE.email}</span>
                    <span>|</span>
                    <span>{PROFILE.phone}</span>
                    <span>|</span>
                    <a href={PROFILE.github} target="_blank" rel="noreferrer" className="underline">GitHub</a>
                    <span>|</span>
                    <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>
                    <span>|</span>
                    <span>{PROFILE.location}</span>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">PROFESSIONAL SUMMARY</h3>
                  <p className="text-xs opacity-80 leading-relaxed">{PROFILE.summary.split('\n\n')[0]}</p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">EDUCATION</h3>
                  {EDUCATION.map((edu, i) => (
                    <div key={i} className="ml-3 mt-1 flex justify-between flex-wrap">
                      <div>
                        <span className="text-xs font-bold">{edu.degree}</span>
                        <p className="text-[10px] opacity-60">{edu.institution}</p>
                      </div>
                      <div className="text-right text-[10px] opacity-70">
                        <div>{edu.duration}</div>
                        <div className="text-yellow-500">{edu.score}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">TECHNICAL SKILLS</h3>
                  <div className="ml-3 space-y-1">
                    {SKILL_CATEGORIES.map(cat => (
                      <div key={cat.name} className="text-[10px]">
                        <span className="text-yellow-500 font-bold">{cat.name}:</span>{' '}
                        <span className="opacity-70">{cat.items.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">PROFESSIONAL EXPERIENCE</h3>
                  {EXPERIENCES.map((exp, i) => (
                    <div key={i} className="ml-3 mt-2">
                      <div className="flex justify-between flex-wrap">
                        <span className="text-xs font-bold">{exp.position}</span>
                        <span className="text-[10px] opacity-60">{exp.duration}</span>
                      </div>
                      <p className="text-[10px] text-yellow-500">{exp.company}</p>
                      <ul className="mt-1 space-y-0.5">
                        {exp.highlights.slice(0, 4).map((h, j) => (
                          <li key={j} className="text-[10px] opacity-70 flex items-start gap-1">
                            <span>•</span><span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">SELECTED PROJECTS</h3>
                  {Object.values(PROJECTS).slice(0, 3).map((p) => (
                    <div key={p.id} className="ml-3 mt-1">
                      <span className="text-xs font-bold">{p.fullName}</span>
                      <p className="text-[10px] opacity-70">{p.description}</p>
                      <p className="text-[10px] opacity-50">[{p.tech.join(', ')}]</p>
                    </div>
                  ))}
                </div>

                {/* Leadership */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">LEADERSHIP & INITIATIVES</h3>
                  {Object.values(INITIATIVES).slice(0, 4).map((init) => (
                    <div key={init.id} className="ml-3 mt-1 text-[10px]">
                      <span className="font-bold">{init.name}</span> — <span className="text-yellow-500">{init.position}</span>
                    </div>
                  ))}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">COMPETITIONS & ACHIEVEMENTS</h3>
                  <ul className="ml-3 space-y-0.5">
                    {ACHIEVEMENTS.slice(0, 4).map((a, i) => (
                      <li key={i} className="text-[10px] opacity-70">• {a.title} — {a.detail}</li>
                    ))}
                  </ul>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="font-bold text-xs bg-white/10 inline-block px-2 mb-2">CERTIFICATIONS</h3>
                  <ul className="ml-3 space-y-0.5">
                    {CERTIFICATIONS.map((c, i) => (
                      <li key={i} className="text-[10px] opacity-70">• {c.name} — {c.issuer}</li>
                    ))}
                  </ul>
                </div>

                {/* Download PDF & Contact */}
                <div className="text-center border-t border-current pt-3 flex flex-col items-center gap-2">
                  <a href="/resume.pdf" target="_blank" download="Naveen_S_Resume.pdf" className="text-xs px-4 py-1.5 bg-current text-black font-bold hover:opacity-80 transition-opacity">
                    DOWNLOAD PDF RESUME
                  </a>
                  <p className="text-[10px] opacity-50">{PROFILE.email} | {PROFILE.phone} | {PROFILE.location}</p>
                </div>
              </div>
            ),
          };
          break;
        }

        // ── CERTIFICATIONS ──
        case 'certifications': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-yellow-500 font-bold text-sm">╔══ CERTIFICATIONS ══╗</div>
                {CERTIFICATIONS.map((c, i) => (
                  <div key={i} className="border border-current p-3 flex items-center gap-3">
                    <span className="text-xl">📜</span>
                    <div>
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className="text-xs opacity-60">{c.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ),
          };
          break;
        }

        // ── CURRENTLY BUILDING ──
        case 'currently': {
          if (argStr === 'building') {
            response = {
              type: 'component',
              content: (
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-yellow-500 font-bold text-sm">╔══ CURRENTLY BUILDING ══╗</div>
                  <div className="space-y-2">
                    {CURRENTLY_BUILDING.map((item, i) => (
                      <div key={i} className="border border-current p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-current opacity-30 font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <p className="text-xs opacity-60">{item.description}</p>
                          </div>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            };
          } else {
            response = { type: 'error', content: 'Usage: currently building' };
          }
          break;
        }

        // ── CONTACT ──
        case 'contact': {
          response = {
            type: 'component',
            content: (
              <div className="space-y-3 animate-fadeIn max-w-md">
                <div className="text-yellow-500 font-bold text-sm">╔══ CONTACT ══╗</div>
                <div className="border border-current p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span>📧</span>
                    <a href={`mailto:${PROFILE.email}`} className="text-sm underline hover:text-white">{PROFILE.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>📱</span>
                    <a href={`tel:${PROFILE.phone}`} className="text-sm underline hover:text-white">{PROFILE.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>💻</span>
                    <a href={PROFILE.github} target="_blank" rel="noreferrer" className="text-sm underline hover:text-white">{PROFILE.github}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>🔗</span>
                    <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="text-sm underline hover:text-white">{PROFILE.linkedin}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>📍</span>
                    <span className="text-sm">{PROFILE.location}</span>
                  </div>
                </div>
              </div>
            ),
          };
          break;
        }

        // ── VIEW PROJECT ──
        case 'view': {
          const pid = argStr;
          const project = PROJECTS[pid];
          if (project) {
            response = {
              type: 'component',
              content: (
                <div className="space-y-4 animate-fadeIn max-w-4xl">
                  <div className={`border-2 ${project.flagship ? 'border-yellow-500' : 'border-current'} p-5 relative overflow-hidden`}>
                    {project.flagship && (
                      <div className="absolute top-0 right-0 bg-yellow-900 text-yellow-300 text-[9px] px-3 py-1 font-bold">★ FLAGSHIP PROJECT</div>
                    )}
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <h2 className="text-xl font-bold">{project.fullName}</h2>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm opacity-80 mb-4 leading-relaxed">{project.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-xs font-bold text-yellow-500 mb-2 border-b border-current pb-1">TECH STACK</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map(t => <span key={t} className="text-xs px-2 py-0.5 border border-current">{t}</span>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-yellow-500 mb-2 border-b border-current pb-1">HIGHLIGHTS</h4>
                        <ul className="space-y-1">
                          {project.highlights.map((h, i) => (
                            <li key={i} className="text-xs opacity-80 flex items-start gap-2">
                              <span className="text-green-400">▸</span><span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-yellow-500 mb-2 border-b border-current pb-1">CAPABILITIES</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {project.capabilities.map((c, i) => (
                          <div key={i} className="text-xs opacity-70 flex items-start gap-2">
                            <span className="text-current opacity-50">●</span><span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3 flex-wrap">
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs px-4 py-1.5 bg-current text-black font-bold hover:opacity-80 transition-opacity">
                          VIEW GITHUB
                        </a>
                      ) : (
                        <span className="text-xs px-4 py-1.5 border border-dashed border-current opacity-60">
                          REPO PENDING CONFIRMATION
                        </span>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-xs px-4 py-1.5 border border-current hover:bg-white/10 transition-colors">
                          LIVE DEMO
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ),
            };
          } else {
            response = { type: 'error', content: `Project '${argStr}' not found. Available: aegis, buildvisor, bharat-bazar, nidhi, farmbazzar` };
          }
          break;
        }

        // ── GITHUB ──
        case 'github': {
          const ghPid = argStr;
          const ghProject = PROJECTS[ghPid];
          if (ghProject && ghProject.githubUrl) {
            window.open(ghProject.githubUrl, '_blank');
            response = { type: 'text', content: `Opening GitHub repository for ${ghProject.name}... → ${ghProject.githubUrl}` };
          } else if (ghProject) {
            response = { type: 'text', content: `Repository for ${ghProject.name} is currently pending confirmation / private.` };
          } else {
            response = { type: 'error', content: `Project '${argStr}' not found. Available: aegis, buildvisor, bharat-bazar, nidhi, farmbazzar` };
          }
          break;
        }

        // ── DEMO ──
        case 'demo': {
          const demoPid = argStr;
          const demoProject = PROJECTS[demoPid];
          if (demoProject && demoProject.demoUrl) {
            window.open(demoProject.demoUrl, '_blank');
            response = { type: 'text', content: `Opening live demo for ${demoProject.name}... → ${demoProject.demoUrl}` };
          } else if (demoProject) {
            response = { type: 'error', content: `No live demo available for ${demoProject.name}.` };
          } else {
            response = { type: 'error', content: `Project '${argStr}' not found. Try 'projects' to list available work.` };
          }
          break;
        }

        // ── ASK AI ──
        case 'ask':
        case 'ai': {
          if (!argStr) {
            response = { type: 'text', content: 'Usage: ask <question>. Example: ask What are your main skills?' };
          } else {
            const aiResponse = await askGemini(argStr);
            response = { type: 'text', content: aiResponse };
          }
          break;
        }

        // ── THEME ──
        case 'theme': {
          if (['classic', 'amber', 'cyan'].includes(argStr)) {
            setTheme(argStr as Theme);
            response = { type: 'text', content: `Theme switched to ${argStr}.` };
          } else {
            response = { type: 'error', content: 'Available themes: classic, amber, cyan' };
          }
          break;
        }

        // ── CLEAR ──
        case 'clear': {
          setHistory([]);
          setIsProcessing(false);
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
          return;
        }

        // ── ALIASES ──
        default: {
          if (cmd === 'hi' || cmd === 'hello') {
            response = { type: 'text', content: `Hello! Welcome to ${PROFILE.name}'s portfolio. Type "help" to explore.` };
          } else if (cmd === 'explore') {
            response = { type: 'text', content: 'Exploration mode initialized. Try "projects", "experience", "leadership", or "currently building" to explore.' };
          } else if (cmd === 'highlights') {
            // Alias for achievements
            await handleCommand('achievements');
            setIsProcessing(false);
            requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
            return;
          }
        }
      }
    } catch (e) {
      response = { type: 'error', content: 'An internal error occurred while processing command.' };
    }

    addToHistory(trimmed, response);
    setIsProcessing(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // ── Keyboard handler ────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isProcessing && !isBooting && input.trim()) {
        handleCommand(input);
      } else if (!input.trim() && !isProcessing && !isBooting) {
        addToHistory('', { type: 'text', content: '' });
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const idx = selectedSuggestion >= 0 ? selectedSuggestion : 0;
        setInput(suggestions[idx]);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => Math.max(0, prev - 1));
      } else if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => Math.min(suggestions.length - 1, prev + 1));
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  // ── Theme styles ────────────────────────────────────────
  const themeClasses: Record<Theme, string> = {
    classic: 'text-[#0f0] bg-[#0c0c0c] shadow-[0_0_35px_rgba(0,255,0,0.12)]',
    amber: 'text-[#ffb000] bg-[#1a1200] shadow-[0_0_35px_rgba(255,176,0,0.12)]',
    cyan: 'text-[#00ffff] bg-[#001a1a] shadow-[0_0_35px_rgba(0,255,255,0.12)]',
  };

  const getThemeAccentColor = () => {
    if (theme === 'amber') return '#ffb000';
    if (theme === 'cyan') return '#00ffff';
    return '#00ff00';
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black font-mono overflow-hidden" onClick={focusInput}>
      <div className={`
        relative w-[94vw] h-[95vh] max-w-[95vw] max-h-[95vh] flex flex-col
        ${themeClasses[theme]}
        rounded-lg border border-current/25
        transition-all duration-300
        ${isFullscreen ? '' : 'w-[85vw] h-[85vh]'}
        shadow-[0_0_35px_rgba(0,0,0,0.85)]
      `}>
        {/* CRT Effects */}
        <div className="absolute inset-0 crt-overlay rounded-lg z-50 pointer-events-none opacity-15 mix-blend-overlay"></div>
        <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-white/[0.015] to-transparent z-40 pointer-events-none h-[6%]"></div>

        {/* Header Bar */}
        <div className="flex justify-between items-center px-4 py-2.5 border-b border-current/20 bg-white/[0.03] z-30 select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <TerminalIcon size={15} />
            <span className="font-bold text-xs sm:text-sm tracking-wide hidden sm:inline">NAVEEN_PORTFOLIO_OS v{VERSION}</span>
            <span className="text-xs font-bold tracking-wide sm:hidden">NAVEEN_OS</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 opacity-60">
              <Cpu size={13} />
              <span>SYS OK</span>
            </div>
            <div className="flex gap-2.5 opacity-70">
              <Minimize2 size={13} className="cursor-pointer hover:opacity-100 transition-opacity" onClick={() => setIsFullscreen(false)} title="Compact Window" />
              <Maximize2 size={13} className="cursor-pointer hover:opacity-100 transition-opacity" onClick={() => setIsFullscreen(true)} title="Maximize Window" />
            </div>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 z-20 relative" onClick={focusInput}>
          {history.map((item, idx) => (
            <div key={idx} className="animate-fadeIn">
              {/* Command echo */}
              {item.command !== 'sys' && (
                <div className="flex gap-2 items-baseline text-xs mb-1.5 opacity-60">
                  <span className="select-none shrink-0 text-yellow-500/70">visitor@naveen-os:~$</span>
                  <span className="font-bold">{item.command}</span>
                  <span className="text-[9px] ml-auto opacity-40 select-none hidden sm:inline">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              )}

              {/* Response */}
              <div className={item.command !== 'sys' ? 'pl-2 md:pl-4' : ''}>
                {item.response.type === 'error' && (
                  <span className="text-red-400 text-sm">✗ Error: {item.response.content as string}</span>
                )}
                {item.response.type === 'text' && (
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{item.response.content}</p>
                )}
                {item.response.type === 'ascii' && (() => {
                  const contentStr = typeof item.response.content === 'string' ? item.response.content : '';
                  const subtitleText = 'Software Developer | Applied AI Engineer';
                  const hasSubtitle = contentStr.includes(subtitleText);

                  if (hasSubtitle) {
                    const nameAscii = contentStr.replace(subtitleText, '').trimEnd();
                    return (
                      <div className="py-1">
                        <pre className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm leading-tight overflow-x-auto whitespace-pre font-bold select-none opacity-95">
                          {nameAscii}
                        </pre>
                        <div
                          className="mt-3 sm:mt-3.5 text-xs sm:text-sm md:text-base font-mono font-bold tracking-wide select-none"
                          style={{
                            color: getThemeAccentColor(),
                            textShadow: `0 0 2px ${getThemeAccentColor()}66`,
                          }}
                        >
                          {subtitleText}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <pre className="text-[9px] sm:text-xs md:text-sm leading-tight overflow-x-auto whitespace-pre font-bold opacity-90 select-none">
                      {contentStr}
                    </pre>
                  );
                })()}
                {item.response.type === 'component' && item.response.content}
              </div>
            </div>
          ))}

          {/* Loading */}
          {isProcessing && (
            <div className="pl-4 animate-pulse flex items-center gap-2 text-sm">
              <span className="inline-block w-2 h-3 bg-current"></span>
              <span>Processing...</span>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && !isProcessing && (
          <div className="mx-3 mb-0 border border-current/30 bg-black/95 z-30 max-h-40 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={s}
                className={`px-3 py-1.5 text-xs cursor-pointer flex items-center gap-2 ${i === selectedSuggestion ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}
              >
                <ChevronRight size={10} className="opacity-40" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-3 py-3 border-t border-current/20 bg-black/30 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="animate-blink font-bold text-sm pointer-events-none select-none shrink-0">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                if (!isProcessing && !isBooting) {
                  setInput(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent outline-none border-none text-inherit text-sm md:text-base font-mono placeholder-current/25"
              placeholder={isBooting ? "Booting..." : isProcessing ? "Processing..." : "Type command..."}
              spellCheck={false}
              autoComplete="off"
              readOnly={isBooting}
            />
          </div>
          <div className="md:hidden mt-1.5 text-[9px] opacity-30 text-center">
            Tap to type · Try 'help' or 'projects'
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
