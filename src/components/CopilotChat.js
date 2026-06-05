'use client';

import { useState, useEffect, useRef } from 'react';
import resumeData from '../data/resume.json';

export default function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am Shubh's Portfolio Copilot. Ask me anything about his projects, skills, experience, or academic background!",
      isFallback: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Client-side rule-based/semantic fallback search
  const performLocalSearch = (query) => {
    const q = query.toLowerCase();
    
    // Check for contact details
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('reach') || q.includes('call') || q.includes('mail')) {
      return `You can contact Shubh Shaguneet Singh via:
- **Email:** ${resumeData.personal.email}
- **Phone:** ${resumeData.personal.phone}
- **Location:** ${resumeData.personal.location}`;
    }

    // Check for CGPA or education
    if (q.includes('cgpa') || q.includes('gpa') || q.includes('grade') || q.includes('marks') || q.includes('percentage') || q.includes('education') || q.includes('bits') || q.includes('college') || q.includes('school') || q.includes('study') || q.includes('campus') || q.includes('pilani')) {
      let eduInfo = `Shubh's academic background:\n\n`;
      resumeData.education.forEach(edu => {
        eduInfo += `• **${edu.degree}** at *${edu.institution}* (${edu.period}) — **${edu.score}**\n`;
        if (edu.coursework) {
          eduInfo += `  *Relevant Coursework:* ${edu.coursework.join(', ')}\n`;
        }
        eduInfo += `\n`;
      });
      return eduInfo.trim();
    }

    // Check for skills
    if (q.includes('skill') || q.includes('language') || q.includes('framework') || q.includes('tool') || q.includes('know') || q.includes('program') || q.includes('dsa') || q.includes('oop') || q.includes('java') || q.includes('c++') || q.includes('c ') || q.includes('excel')) {
      return `Shubh's technical skillset includes:
- **Programming Languages:** ${resumeData.skills.programmingLanguages.join(', ')}
- **Frameworks & Tools:** ${resumeData.skills.frameworksAndTools.join(', ')}
- **Core Competencies:** ${resumeData.skills.coreCompetencies.join(', ')}
- **Spoken Languages:** ${resumeData.skills.languages.join(', ')}`;
    }

    // Check for projects
    if (q.includes('project') || q.includes('work') || q.includes('develop') || q.includes('build') || q.includes('make') || q.includes('made') || q.includes('gnss') || q.includes('library') || q.includes('inventory') || q.includes('flutter') || q.includes('mysql') || q.includes('python')) {
      let projInfo = `Shubh has developed the following key projects:\n\n`;
      resumeData.projects.forEach(proj => {
        projInfo += `• **${proj.title}** (${proj.period}) - *${proj.role}*\n  ${proj.description}\n\n`;
      });
      return projInfo.trim();
    }

    // Check for extracurricular or Quark
    if (q.includes('extracurricular') || q.includes('quark') || q.includes('coordinator') || q.includes('backstage') || q.includes('infrastructure') || q.includes('management') || q.includes('fest')) {
      let extraInfo = `Shubh is active in extracurriculars at BITS Pilani Goa:\n\n`;
      resumeData.extracurriculars.forEach(item => {
        extraInfo += `• **${item.role}** at *${item.organization}* (${item.period})\n  ${item.description}\n`;
      });
      return extraInfo.trim();
    }

    // Default fallback
    return `I don't have that information in Shubh's profile. However, you can reach out directly to Shubh at **${resumeData.personal.email}** or call **${resumeData.personal.phone}** to ask him!`;
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Try calling the server API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      });

      const data = await response.json();
      
      if (response.ok && data.answer) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        // Silently run local search if API returns error (e.g. missing API key)
        const fallbackAnswer = performLocalSearch(messageText);
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: fallbackAnswer,
            isFallback: true
          }
        ]);
      }
    } catch (err) {
      console.error('Fetch error, falling back:', err);
      // Silently run local search if network fails
      const fallbackAnswer = performLocalSearch(messageText);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: fallbackAnswer,
          isFallback: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What projects has Shubh worked on?",
    "Tell me about Shubh's BITS Pilani education.",
    "What is Shubh's CGPA?",
    "Tell me about Shubh's role in Quark."
  ];

  return (
    <>
      {/* Floating Chat Bubble */}
      <button 
        className={`copilot-bubble ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Copilot Chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        <span className="pulse-glow"></span>
      </button>

      {/* Chat Window */}
      <div className={`copilot-window glass ${isOpen ? 'open' : ''}`}>
        <div className="copilot-header">
          <div className="copilot-title-group">
            <div className="copilot-avatar">AI</div>
            <div>
              <h3>Portfolio Copilot</h3>
              <p>{isLoading ? 'Typing...' : 'Grounded in Shubh\'s resume'}</p>
            </div>
          </div>
        </div>

        <div className="copilot-body">
          {messages.map((msg, i) => (
            <div key={i} className={`copilot-message ${msg.role}`}>
              <div className="message-content">
                {msg.content.split('\n').map((line, k) => {
                  // Simple markdown parser for bold and bullet lists
                  let formatted = line;
                  
                  // Bullet points
                  let isBullet = false;
                  if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
                    isBullet = true;
                    formatted = formatted.substring(2);
                  }
                  
                  // Bold tags
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  let matches = [...formatted.matchAll(boldRegex)];
                  let parts = [];
                  let lastIdx = 0;
                  
                  for (let m of matches) {
                    parts.push(formatted.substring(lastIdx, m.index));
                    parts.push(<strong key={m.index}>{m[1]}</strong>);
                    lastIdx = m.index + m[0].length;
                  }
                  parts.push(formatted.substring(lastIdx));
                  
                  // Render line
                  return (
                    <div key={k} style={{ marginBottom: line ? '6px' : '12px', paddingLeft: isBullet ? '12px' : '0' }}>
                      {isBullet && '• '}
                      {parts.length > 0 ? parts : formatted}
                    </div>
                  );
                })}
              </div>
              {msg.isFallback && i === messages.length - 1 && (
                <span className="fallback-badge">Offline Search Answer</span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="copilot-message assistant loading">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions panel */}
        {messages.length === 1 && (
          <div className="copilot-suggestions">
            <p>Try asking:</p>
            <div className="suggestions-grid">
              {suggestions.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="suggestion-chip">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input form */}
        <form 
          className="copilot-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Ask me a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </>
  );
}
