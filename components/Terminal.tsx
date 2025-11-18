
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { CommandResponse, HistoryItem, Theme, FontStyle, Layout } from '../types';
import { PROJECTS, SKILLS, TIMELINE, HIGHLIGHTS, ASCII_HEADER, ASCII_SKILLS } from '../constants';
import { askGemini } from '../services/geminiService';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Settings, Cpu } from 'lucide-react';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState<Theme>('classic');
  const [layout, setLayout] = useState<Layout>('compact');
  const [fontStyle, setFontStyle] = useState<FontStyle>('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial Greeting
    addToHistory('sys', { type: 'ascii', content: ASCII_HEADER });
    addToHistory('sys', { type: 'text', content: 'System initialized. Type "help" or "explore" to begin.' });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const addToHistory = (command: string, response: CommandResponse) => {
    setHistory(prev => [...prev, { command, response, timestamp: Date.now() }]);
  };

  const handleCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    addToHistory(trimmed, { type: 'text', content: '' }); // Echo command (empty content placeholder handled in render)
    setIsProcessing(true);
    setInput('');

    const [cmd, ...args] = trimmed.split(' ');
    const argStr = args.join(' ');

    // Simulated delay for "processing" feel
    await new Promise(r => setTimeout(r, 300));

    let response: CommandResponse = { type: 'text', content: 'Command not recognized. Type "help" for valid commands.' };

    try {
      switch (cmd.toLowerCase()) {
        case 'help':
        case 'ls':
          response = {
            type: 'component',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-yellow-500 mb-2">NAVIGATION</p>
                  <ul className="space-y-1">
                    <li><span className="font-bold text-white">home</span> - Return to start</li>
                    <li><span className="font-bold text-white">projects</span> - List all projects</li>
                    <li><span className="font-bold text-white">skills</span> - List technical skills</li>
                    <li><span className="font-bold text-white">resume</span> - View interactive resume</li>
                    <li><span className="font-bold text-white">career path</span> - View timeline</li>
                  </ul>
                </div>
                <div>
                  <p className="text-yellow-500 mb-2">INTERACTION</p>
                  <ul className="space-y-1">
                    <li><span className="font-bold text-white">view &lt;project&gt;</span> - Detail view</li>
                    <li><span className="font-bold text-white">demo &lt;project&gt;</span> - Launch live demo</li>
                    <li><span className="font-bold text-white">github &lt;project&gt;</span> - View repo</li>
                    <li><span className="font-bold text-white">ask &lt;question&gt;</span> - Ask AI assistant</li>
                    <li><span className="font-bold text-white">theme &lt;style&gt;</span> - classic/amber/cyan</li>
                    <li><span className="font-bold text-white">clear</span> - Clear terminal</li>
                  </ul>
                </div>
              </div>
            )
          };
          break;

        case 'clear':
          setHistory([]);
          setIsProcessing(false);
          return;

        case 'home':
          response = { type: 'ascii', content: ASCII_HEADER };
          break;

        case 'skills':
          response = {
            type: 'component',
            content: (
              <div className="space-y-4">
                <pre className="text-xs md:text-sm leading-none text-blue-400">{ASCII_SKILLS}</pre>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {SKILLS.map((skill) => (
                    <div key={skill.name} className="border border-current p-2 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setInput(`view ${skill.name}`)}>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-1.5">
                        <div className="bg-current h-1.5 transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{skill.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          };
          break;

        case 'projects':
          response = {
            type: 'component',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(PROJECTS).map((p) => (
                  <div key={p.id} className="border border-dashed border-current p-4 hover:scale-105 transition-transform duration-200">
                    <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                    <p className="text-xs opacity-80 mb-3 h-12 overflow-hidden">{p.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {p.tech.slice(0, 3).map(t => <span key={t} className="text-[10px] px-1 border border-current">{t}</span>)}
                    </div>
                    <div className="mt-4 text-xs font-mono text-center bg-white/10 py-1 cursor-pointer hover:bg-white/20"
                         onClick={() => handleCommand(`view ${p.id}`)}>
                       Type: view {p.id}
                    </div>
                  </div>
                ))}
              </div>
            )
          };
          break;

        case 'view':
          const pid = argStr.toLowerCase();
          const project = PROJECTS[pid] || Object.values(PROJECTS).find(p => p.name.toLowerCase().includes(pid));
          if (project) {
            response = {
              type: 'component',
              content: (
                <div className="border-2 border-current p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl font-black z-0 pointer-events-none">PROJECT</div>
                  <h2 className="text-2xl font-bold mb-2 relative z-10">{project.name}</h2>
                  <p className="mb-4 max-w-2xl relative z-10">{project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div>
                      <h4 className="font-bold border-b border-current mb-2 inline-block">TECH STACK</h4>
                      <ul className="list-disc pl-5 mb-4">
                        {project.tech.map(t => <li key={t}>{t}</li>)}
                      </ul>
                      <h4 className="font-bold border-b border-current mb-2 inline-block">PERFORMANCE</h4>
                      <p className="text-sm italic opacity-90">{project.performance}</p>
                    </div>
                    <div>
                      <h4 className="font-bold border-b border-current mb-2 inline-block">METRICS</h4>
                      <div className="flex gap-4 mb-4">
                        <div>⭐ {project.stats.stars} Stars</div>
                        <div>🍴 {project.stats.forks} Forks</div>
                      </div>
                      <h4 className="font-bold border-b border-current mb-2 inline-block">CODE SNIPPET</h4>
                      <pre className="text-xs bg-black/50 p-2 overflow-x-auto border border-gray-700 text-green-300">
                        {project.codeSnippet}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4 flex-wrap">
                    <button className="px-4 py-1 bg-current text-black font-bold hover:opacity-80" onClick={() => handleCommand(`github ${project.id}`)}>VIEW GITHUB</button>
                    {project.demoUrl && (
                        <button className="px-4 py-1 border border-current hover:bg-white/10" onClick={() => window.open(project.demoUrl, '_blank')}>LIVE DEMO</button>
                    )}
                    <button className="px-4 py-1 border border-current hover:bg-white/10" onClick={() => handleCommand(`feedback ${project.id}`)}>READ REVIEWS</button>
                  </div>
                </div>
              )
            };
          } else {
            const skill = SKILLS.find(s => s.name.toLowerCase() === pid);
            if (skill) {
              response = { type: 'text', content: `${skill.name}: ${skill.description} (Mastery: ${skill.level}%)` };
            } else {
              response = { type: 'error', content: `Entity '${argStr}' not found.` };
            }
          }
          break;
        
        case 'demo':
          const demoPid = argStr.toLowerCase();
          const demoProject = PROJECTS[demoPid] || Object.values(PROJECTS).find(p => p.name.toLowerCase().includes(demoPid));
          if (demoProject && demoProject.demoUrl) {
              window.open(demoProject.demoUrl, '_blank');
              response = { type: 'text', content: `Opening live demo for ${demoProject.name}...` };
          } else if (demoProject) {
              response = { type: 'error', content: `No live demo available for ${demoProject.name}.` };
          } else {
              response = { type: 'error', content: `Project '${argStr}' not found. Try 'projects' to list available work.` };
          }
          break;

        case 'github':
          const ghPid = argStr.toLowerCase();
           if (ghPid === 'stats') {
               response = { type: 'text', content: 'GitHub Stats: Active contributor to AI and Web Dev repos. Check github.com/3407Naveen'};
           } else {
               const ghProject = PROJECTS[ghPid] || Object.values(PROJECTS).find(p => p.name.toLowerCase().includes(ghPid));
               if (ghProject) {
                 response = { type: 'text', content: `Opening ${ghProject.githubUrl}... (Simulated navigation)` };
               } else {
                 response = { type: 'error', content: `Repo '${argStr}' not found. Try 'bharat-bazar' or 'farm-bazzar'.` };
               }
           }
           break;

        case 'feedback':
          const fbPid = argStr.toLowerCase();
          const fbProject = PROJECTS[fbPid];
          if (fbProject && fbProject.reviews) {
             response = {
                 type: 'component',
                 content: (
                     <div className="space-y-2">
                         <h3 className="font-bold">Reviews for {fbProject.name}:</h3>
                         {fbProject.reviews.map((r, i) => <p key={i} className="italic opacity-80"> &gt; {r}</p>)}
                     </div>
                 )
             }
          } else {
              response = { type: 'error', content: 'No feedback available for this entry.' };
          }
          break;

        case 'resume':
          response = {
            type: 'component',
            content: (
              <div className="p-4 border border-current">
                <div className="text-center border-b border-current pb-4 mb-4">
                  <h1 className="text-3xl font-bold uppercase">Naveen S</h1>
                  <p className="mt-1">Engineering student | MERN Stack | AI Integration</p>
                  <div className="text-xs mt-2 opacity-80 flex justify-center gap-4 flex-wrap">
                    <a href="mailto:naveens2007@outlook.com" className="hover:text-white">naveens2007@outlook.com</a>
                    <span>|</span>
                    <a href="https://github.com/3407Naveen" target="_blank" rel="noreferrer" className="hover:text-white">github.com/3407Naveen</a>
                    <span>|</span>
                    <a href="http://www.naveencodes.firebaseapp.com/" target="_blank" rel="noreferrer" className="hover:text-white underline">Portfolio Website</a>
                    <span>|</span>
                    <span>Chennai, Tamil Nadu</span>
                  </div>
                </div>
                
                <div className="mb-6">
                   <h3 className="font-bold bg-white/10 inline-block px-2 mb-2">EXECUTIVE SUMMARY</h3>
                   <p className="text-sm opacity-90">
                     Engineering student focusing on Artificial Intelligence and Data Science, with hands-on experience in MERN stack development, automation workflows, and solutions. Shows leadership in hackathons and technical events. Passionate about using technology to promote sustainability and empowerment.
                   </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold bg-white/10 inline-block px-2 mb-2">EXPERIENCE</h3>
                    {TIMELINE.slice(0, 3).map((job, i) => (
                      <div key={i} className="ml-4 mt-2">
                        <div className="flex justify-between flex-wrap">
                          <span className="font-bold text-yellow-500">{job.title}</span>
                          <span className="text-xs opacity-70">{job.year}</span>
                        </div>
                        <p className="text-sm opacity-80 mt-1">{job.detail}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                     <h3 className="font-bold bg-white/10 inline-block px-2 mb-2">EDUCATION</h3>
                     <div className="ml-4 mt-2">
                        <div className="flex justify-between">
                          <span className="font-bold">B.Tech - AI & Data Science</span>
                          <span>2024-2028</span>
                        </div>
                        <p className="text-sm opacity-80">New Prince Shri Bhavani College of Engineering and Technology (NPSBCET)</p>
                        <p className="text-xs opacity-60">CGPA: 7.5</p>
                     </div>
                  </div>
                </div>
              </div>
            )
          };
          break;

        case 'career':
          if (argStr === 'path') {
             response = {
                 type: 'component',
                 content: (
                     <div className="relative pl-8 border-l border-dashed border-current space-y-8 my-4">
                         {TIMELINE.map((item, i) => (
                             <div key={i} className="relative">
                                 <div className="absolute -left-[37px] bg-black border border-current w-4 h-4 rounded-full"></div>
                                 <span className="text-xs font-bold bg-current text-black px-1 rounded">{item.year}</span>
                                 <h4 className="text-lg font-bold mt-1">{item.title}</h4>
                                 <p className="opacity-70 text-sm">{item.detail}</p>
                             </div>
                         ))}
                     </div>
                 )
             };
          } else {
              response = { type: 'error', content: 'Usage: career path' };
          }
          break;

        case 'highlights':
          response = {
              type: 'component',
              content: (
                  <ul className="list-none space-y-2">
                      {HIGHLIGHTS.map((h, i) => <li key={i} className="flex items-center gap-2"><span className="text-yellow-400">★</span> {h}</li>)}
                  </ul>
              )
          };
          break;

        case 'theme':
          if (['classic', 'amber', 'cyan', 'cyberpunk'].includes(argStr)) {
            setTheme(argStr as Theme);
            response = { type: 'text', content: `Theme switched to ${argStr}.` };
          } else {
            response = { type: 'error', content: 'Available themes: classic, amber, cyan, cyberpunk' };
          }
          break;
          
        case 'layout':
           if (['compact', 'full'].includes(argStr)) {
               setLayout(argStr as Layout);
               response = { type: 'text', content: `Layout set to ${argStr}.` };
           } else {
               response = { type: 'error', content: 'Available layouts: compact, full' };
           }
           break;

        case 'ask':
        case 'ai':
          if (!argStr) {
             response = { type: 'text', content: 'Usage: ask <question>. Example: ask What are your main skills?' };
          } else {
             const aiResponse = await askGemini(argStr);
             response = { type: 'text', content: aiResponse };
          }
          break;

        case 'explore':
           response = { type: 'text', content: 'Initiating Exploration Mode... [Simulation: You enter a virtual lobby showcasing awards and code snippets. Try "highlights" or "projects" to inspect.]' };
           break;

        case 'font':
           if(argStr === 'retro' || argStr === 'modern') {
               setFontStyle(argStr);
               response = { type: 'text', content: `Font style updated to ${argStr}.` };
           } else {
               response = { type: 'error', content: 'Usage: font <modern/retro>' };
           }
           break;

        default:
          // Handle unknown commands or simple aliases
          if (cmd === 'hi' || cmd === 'hello') response = { type: 'text', content: 'Hello user. Type "help" to get started.' };
          else response = { type: 'error', content: `Command '${cmd}' not found. Type 'help' for a list of commands.` };
      }
    } catch (e) {
      response = { type: 'error', content: 'An internal error occurred while processing command.' };
    }

    // Remove the placeholder "echo" and replace with real command + response
    setHistory(prev => {
        const newHist = [...prev];
        newHist[newHist.length - 1] = { command: trimmed, response, timestamp: Date.now() };
        return newHist;
    });
    setIsProcessing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(input);
    }
  };
  
  // Theme Classes
  const themeClasses = {
    classic: 'text-terminal-green bg-terminal-black shadow-[0_0_20px_rgba(0,255,0,0.2)] selection:bg-green-900',
    amber: 'text-terminal-amber bg-[#1a1200] shadow-[0_0_20px_rgba(255,176,0,0.2)] selection:bg-yellow-900',
    cyan: 'text-terminal-cyan bg-[#001a1a] shadow-[0_0_20px_rgba(0,255,255,0.2)] selection:bg-cyan-900',
    cyberpunk: 'text-pink-500 bg-gray-900 shadow-[0_0_20px_rgba(236,72,153,0.4)] selection:bg-pink-900'
  };
  
  const borderColor = theme === 'cyberpunk' ? 'border-pink-500' : 'border-current';

  return (
    <div className={`w-full h-screen flex items-center justify-center p-2 md:p-8 bg-black transition-colors duration-500 ${fontStyle === 'retro' ? 'font-mono tracking-widest' : 'font-mono'}`}>
      
      {/* 3D Container Transform */}
      <div className={`
        relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col 
        ${themeClasses[theme]} 
        rounded-lg border-2 ${borderColor} 
        transition-all duration-500 transform 
        ${layout === 'compact' ? 'scale-[0.98]' : 'scale-100'}
        md:perspective-1000
      `}>
        
        {/* Scanline & CRT Effects */}
        <div className="absolute inset-0 crt-overlay rounded-lg z-50 pointer-events-none opacity-50 mix-blend-overlay"></div>
        <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-white/5 to-transparent z-40 pointer-events-none h-[10%]"></div>

        {/* Header Bar */}
        <div className={`flex justify-between items-center p-2 border-b ${borderColor} bg-white/5 z-30 select-none`}>
          <div className="flex items-center gap-2">
             <TerminalIcon size={18} />
             <span className="font-bold text-sm hidden md:inline">NAVEEN_PORTFOLIO_CLI</span>
             <span className="text-xs opacity-60 md:hidden">NAVEEN_CLI</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
                <Cpu size={14} />
                <span className="hidden sm:inline">MEM: 64TB OK</span>
            </div>
            <div className="flex gap-2">
                <Minimize2 size={14} className="cursor-pointer hover:opacity-70" onClick={() => setLayout('compact')} />
                <Maximize2 size={14} className="cursor-pointer hover:opacity-70" onClick={() => setLayout('full')} />
                <Settings size={14} className="cursor-pointer hover:opacity-70" onClick={() => setInput('theme ')} />
            </div>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 z-20 relative" onClick={focusInput}>
            {history.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="text-6xl font-bold rotate-[-15deg] border-4 border-current p-8 rounded">SYSTEM READY</div>
                </div>
            )}
          
          {history.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {/* Command Echo */}
              <div className="flex gap-2 items-start opacity-70">
                <span className="select-none">$</span>
                <span>{item.command}</span>
                <span className="text-[10px] ml-auto opacity-40 select-none">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              
              {/* Response */}
              <div className="pl-4">
                {item.response.type === 'error' && (
                  <span className="text-red-500 font-bold">Error: {item.response.content}</span>
                )}
                
                {item.response.type === 'text' && (
                   <p className="whitespace-pre-wrap leading-relaxed">{item.response.content}</p>
                )}
                
                {item.response.type === 'ascii' && (
                   <pre className="text-[10px] md:text-xs leading-none overflow-x-hidden whitespace-pre font-bold text-center md:text-left">
                       {item.response.content}
                   </pre>
                )}

                {item.response.type === 'component' && item.response.content}
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isProcessing && (
            <div className="pl-4 animate-pulse">
                <span className="inline-block w-2 h-4 bg-current mr-1"></span> Processing...
            </div>
          )}
          
          {/* Anchor for auto-scroll */}
          <div ref={bottomRef}></div>
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${borderColor} bg-black/20 z-30`}>
          <div className="flex items-center gap-2">
            <span className="animate-pulse font-bold text-lg pointer-events-none">❯</span>
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent outline-none border-none font-inherit text-inherit uppercase placeholder-white/20"
              placeholder="TYPE COMMAND..."
              spellCheck={false}
              autoComplete="off"
              disabled={isProcessing}
            />
          </div>
          {/* Mobile Hint */}
          <div className="md:hidden mt-2 text-[10px] opacity-50 text-center">
             Tap to type. Try 'help' or 'projects'.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terminal;