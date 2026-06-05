'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CopilotChat from '../components/CopilotChat';
import resumeData from '../data/resume.json';

export default function Home() {
  const [copyStatus, setCopyStatus] = useState('Copy Email');

  useEffect(() => {
    // Reveal-on-scroll animations
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 50}ms`;
      observer.observe(el);
    });

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.personal.email);
      setCopyStatus('Email Copied!');
      setTimeout(() => setCopyStatus('Copy Email'), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus('Copy Email'), 2000);
    }
  };

  return (
    <>
      {/* Dynamic Ambient Blur Highlights */}
      <div className="bg-blur bg-blur-a" aria-hidden="true"></div>
      <div className="bg-blur bg-blur-b" aria-hidden="true"></div>

      {/* Glassmorphic Navbar */}
      <header className="site-header glass">
        <div className="container nav-wrap">
          <a href="#" className="brand">SHUBH.dev</a>
          <nav>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Activities</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero container reveal">
          <p className="kicker">Computer Science Undergraduate | BITS Pilani Goa</p>
          <h1>
            I design systems across <span>GNSS signal processing</span>, <span>Full-Stack Web</span>, and <span>Mobile Development</span>.
          </h1>
          <p className="hero-copy">
            Hi, I&apos;m Shubh Shaguneet Singh. Currently pursuing my B.E. in Computer Science at BITS Pilani, K.K. Birla Goa Campus. I specialize in backend software, interactive app engineering, and optimization-oriented programming.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#projects">View Projects</a>
            <a className="btn secondary" href="#contact">Contact Me</a>
            <button className="btn tertiary" onClick={handleCopyEmail}>
              {copyStatus}
            </button>
          </div>
          <div className="social-row">
            <a href={`mailto:${resumeData.personal.email}`}>{resumeData.personal.email}</a>
            <a href={`tel:${resumeData.personal.phone.replace(/\s+/g, '')}`}>{resumeData.personal.phone}</a>
            <span className="location-tag">📍 {resumeData.personal.location}</span>
          </div>

          <ul className="hero-metrics" aria-label="Key highlights">
            <li>
              <strong>BITS Goa</strong>
              <span>Computer Science B.E.</span>
            </li>
            <li>
              <strong>8.00 CGPA</strong>
              <span>Academic standing</span>
            </li>
            <li>
              <strong>3+ Key Projects</strong>
              <span>Research & engineering</span>
            </li>
          </ul>
        </section>

        {/* About Section */}
        <section id="about" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">About</p>
            <h2>Background & Professional Focus</h2>
          </div>

          <div className="about-grid">
            <article className="glass about-panel reveal">
              <h3>Who I Am</h3>
              <p>
                I am Shubh Shaguneet Singh, a Computer Science student at BITS Pilani Goa Campus. I enjoy translating complex algorithmic logic into functional codebases, ranging from signal acquisition metrics to relational database schemas.
              </p>
              <p>
                My work spans Python-based GNSS research, full-stack library architectures, and cross-platform inventory tracking apps using Flutter.
              </p>
            </article>

            <article className="glass about-panel reveal">
              <h3>Working Philosophy</h3>
              <p>
                I approach systems by mapping data flow, optimizing query schemas, and enforcing structured layout configurations. I believe in clean code architectures, minimal placeholders, and rigorous automated validation.
              </p>
              <p>
                Whether managing stage setups for our annual technical festival or developing software modules, I strive for efficiency and high-fidelity outcomes.
              </p>
            </article>

            <article className="glass about-panel reveal">
              <h3>Core Competencies</h3>
              <ul className="bullet-list">
                <li>Data Structures & Algorithms (DSA)</li>
                <li>Object-Oriented Programming (OOP)</li>
                <li>Relational Database Management (DBMS)</li>
                <li>Research signal processing validation</li>
                <li>Cross-platform mobile client design</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">Skills</p>
            <h2>Technical Stack & Skill Grid</h2>
          </div>

          <div className="skills-layout">
            <article className="skills-block reveal">
              <h3>Technical Stack</h3>
              <div className="stack-grid" role="list" aria-label="Technology stack">
                <div className="stack-item" role="listitem"><span>C++</span><p>C++</p></div>
                <div className="stack-item" role="listitem"><span>Jv</span><p>Java</p></div>
                <div className="stack-item" role="listitem"><span>Py</span><p>Python</p></div>
                <div className="stack-item" role="listitem"><span>C</span><p>C</p></div>
                <div className="stack-item" role="listitem"><span>Fl</span><p>Flutter</p></div>
                <div className="stack-item" role="listitem"><span>SQL</span><p>MySQL</p></div>
                <div className="stack-item" role="listitem"><span>Ex</span><p>MS Excel</p></div>
                <div className="stack-item" role="listitem"><span>Wd</span><p>MS Word</p></div>
                <div className="stack-item" role="listitem"><span>Cv</span><p>Canva</p></div>
              </div>
            </article>

            <article className="glass soft-skills-panel reveal">
              <h3>Core & Spoken Languages</h3>
              <ul className="soft-skill-list">
                <li>
                  <strong>Languages spoken</strong>
                  <p>English, Punjabi, Hindi (Full working proficiency)</p>
                </li>
                <li>
                  <strong>Academic Foundations</strong>
                  <p>Strong foundations in OOP, DBMS, Logic in CS, and Microprocessors.</p>
                </li>
                <li>
                  <strong>Leadership & Execution</strong>
                  <p>Experience coordinating deployments, backstage operations, and hardware resource distributions.</p>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">Project Gallery</p>
            <h2>High-Impact Technical Work</h2>
          </div>

          <div className="project-grid">
            <article className="project-card glass reveal">
              <span className="project-tag-badge">Research</span>
              <h3>GNSS Receiver Software Development</h3>
              <p className="project-meta">Apr 2026 - Present</p>
              <p>
                Contributing to a government-sponsored research project developing Python-based software to process and analyze GNSS signals.
              </p>
              <dl>
                <dt>Objective</dt>
                <dd>Enhance receiver precision and satellite capture accuracy.</dd>
                <dt>My Work</dt>
                <dd>Implementing numerical algorithms to optimize signal acquisition and processing parameters.</dd>
                <dt>Stack</dt>
                <dd>Python, Signal Processing Libraries, Git</dd>
              </dl>
            </article>

            <article className="project-card glass reveal">
              <span className="project-tag-badge">Full-Stack</span>
              <h3>Library Management System</h3>
              <p className="project-meta">Jan 2026 - May 2026</p>
              <p>
                Developed a full-stack web application to digitize the campus library workflow.
              </p>
              <dl>
                <dt>Objective</dt>
                <dd>Replace legacy workflows and speed up catalog search times.</dd>
                <dt>My Work</dt>
                <dd>Designed the MySQL relational schema and built search indexing for book catalogs and member cards.</dd>
                <dt>Stack</dt>
                <dd>Node.js, Express, HTML/CSS, MySQL</dd>
              </dl>
            </article>

            <article className="project-card glass reveal">
              <span className="project-tag-badge">Mobile</span>
              <h3>Backstage Inventory App</h3>
              <p className="project-meta">May 2025 - Jul 2025</p>
              <p>
                Built a cross-platform mobile application from scratch to track backstage audio and lighting assets.
              </p>
              <dl>
                <dt>Objective</dt>
                <dd>Eliminate spreadsheet errors during live stage setups.</dd>
                <dt>My Work</dt>
                <dd>Wrote Dart code for local device caching and real-time category filtering of stage inventory.</dd>
                <dt>Stack</dt>
                <dd>Flutter, Dart, SQLite</dd>
              </dl>
            </article>
          </div>
        </section>

        {/* Experience & Extracurriculars Section */}
        <section id="experience" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">Activities</p>
            <h2>Leadership & Extracurricular Roles</h2>
          </div>

          <div className="timeline">
            {resumeData.extracurriculars.map((activity, index) => (
              <article key={index} className="timeline-item reveal glass">
                <span className="timeline-dot" aria-hidden="true"></span>
                <p className="timeline-date">{activity.period}</p>
                <h3>{activity.role} | {activity.organization}</h3>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">Education</p>
            <h2>Academic Timeline</h2>
          </div>

          <div className="timeline">
            {resumeData.education.map((edu, index) => (
              <article key={index} className="timeline-item reveal glass">
                <span className="timeline-dot" aria-hidden="true"></span>
                <p className="timeline-date">{edu.period}</p>
                <h3>{edu.degree} | {edu.institution}</h3>
                <p className="edu-score"><strong>{edu.score}</strong></p>
                {edu.coursework && (
                  <div className="coursework-list">
                    <strong>Coursework:</strong> {edu.coursework.join(', ')}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section container">
          <div className="section-head reveal">
            <p className="section-tag">Contact</p>
            <h2>Get In Touch</h2>
          </div>

          <div className="contact-grid">
            <aside className="glass contact-panel reveal">
              <h3>Let&apos;s build something together!</h3>
              <p>Available for project collaborations, backend systems engineering, and mobile development roles.</p>
              <ul className="contact-list">
                <li><strong>Email:</strong> <a href={`mailto:${resumeData.personal.email}`}>{resumeData.personal.email}</a></li>
                <li><strong>Phone:</strong> <a href={`tel:${resumeData.personal.phone.replace(/\s+/g, '')}`}>{resumeData.personal.phone}</a></li>
                <li><strong>Location:</strong> {resumeData.personal.location}</li>
              </ul>
              <button onClick={handleCopyEmail} className="btn primary">
                {copyStatus}
              </button>
            </aside>

            <form
              id="contact-form"
              className="glass contact-form reveal"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! This form is set up to simulate submissions. You can also email Shubh directly.');
              }}
            >
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required placeholder="Your name" />

              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" />

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required placeholder="Describe your requirement..."></textarea>

              <button type="submit" className="btn primary">Send Message</button>
            </form>
          </div>
        </section>
      </main>

      {/* Site Footer */}
      <footer className="container footer reveal">
        <p>© 2026 Shubh Shaguneet Singh. Built with Next.js & AI Copilot.</p>
      </footer>

      {/* Floating Interactive AI Copilot */}
      <CopilotChat />
    </>
  );
}
