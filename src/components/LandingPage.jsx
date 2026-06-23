import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Trophy, Zap, Users, GraduationCap, Building, ShieldCheck, ChevronDown, Star, ArrowUpRight } from 'lucide-react';

/* ============================================
   Intersection Observer Hook — for scroll reveals
   ============================================ */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/* ============================================
   Animated Counter Component
   ============================================ */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useInView();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="stat-number">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ============================================
   Reveal Wrapper
   ============================================ */
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ============================================
   Stagger Grid Wrapper
   ============================================ */
function StaggerGrid({ children, className = '' }) {
  const [ref, isVisible] = useInView();

  return (
    <div ref={ref} className={`stagger-grid ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ============================================
   LANDING PAGE
   ============================================ */
export default function LandingPage({ navigate, challenges }) {
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const activeChallenges = challenges.filter(c => c.status === 'active').slice(0, 3);

  return (
    <div className="page-transition">

      {/* ======== HERO ======== */}
      <section className="hero-section">
        {/* Floating ambient shapes */}
        <div className="floating-shape floating-shape-1" />
        <div className="floating-shape floating-shape-2" />
        <div className="floating-shape floating-shape-3" />

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-animate" style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-primary-muted)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#a78bfa',
              letterSpacing: '0.02em'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', animation: 'float 2s ease-in-out infinite' }} />
              Now open for high school students
            </span>
          </div>

          <h1 className="hero-title hero-animate-delay-1">
            Solve real problems.{' '}
            <br />
            <span className="text-gradient-accent">Get hired for it.</span>
          </h1>

          <p className="hero-subtitle hero-animate-delay-2">
            SolveSprint connects ambitious high school students with startups posting real business challenges. Compete weekly, build your portfolio, win prizes and internships.
          </p>

          <div className="hero-animate-delay-3 flex justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('role-selection')} className="btn btn-primary btn-lg">
              Join as Student <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('role-selection')} className="btn btn-secondary btn-lg">
              Post a Challenge <Building size={18} />
            </button>
          </div>

          {/* Preview Card */}
          <div className="hero-animate-delay-4" style={{ maxWidth: '820px', margin: '60px auto 0' }}>
            <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Competition Feed</span>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Active</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }} className="grid-2">
                {/* Challenge Card Demo */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between align-center">
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Design</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.85rem' }}>$1,500</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '12px', marginBottom: '8px' }}>Mobile Issue Tracker Redesign</h3>
                  <p className="text-muted text-xs mb-4">Design a mobile-first sprint organizer for Linear Inc.</p>
                  <div className="flex align-center justify-between mt-4">
                    <span className="text-secondary text-xs">Linear Inc</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.6rem' }}>5 Days Left</span>
                  </div>
                </div>

                {/* Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>Trending Teams</span>

                  {[
                    { name: 'CyberDevs', school: 'TJHSST', rank: '#12', xp: '2,450' },
                    { name: 'Green Minds', school: 'Stuyvesant', rank: '#3', xp: '3,820' },
                  ].map((team, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                          {team.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{team.name}</div>
                          <div className="text-muted text-xs">{team.school}</div>
                        </div>
                      </div>
                      <span className="text-secondary text-xs" style={{ fontWeight: '600' }}>Rank {team.rank}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
                    <span>Sarah Chen just earned "Impact Maker" badge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== STATS ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <StaggerGrid className="grid grid-4">
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter prefix="$" end={12000} suffix="+" />
              <p className="text-secondary text-sm" style={{ marginTop: '8px' }}>Prizes This Month</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span className="stat-number">100%</span>
              <p className="text-secondary text-sm" style={{ marginTop: '8px' }}>High School Exclusive</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter end={3500} suffix="+" />
              <p className="text-secondary text-sm" style={{ marginTop: '8px' }}>Teen Competitors</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter end={50} suffix="+" />
              <p className="text-secondary text-sm" style={{ marginTop: '8px' }}>Partner Companies</p>
            </div>
          </StaggerGrid>
        </div>
      </section>
      <div className="gradient-line" />

      {/* ======== HOW IT WORKS ======== */}
      <section id="about" style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <div className="section-header text-center">
              <h2 className="section-title">How SolveSprint Works</h2>
              <p className="section-subtitle centered">
                Four steps to build skills, establish credentials, and unlock career pathways.
              </p>
            </div>
          </Reveal>

          <StaggerGrid className="grid grid-4">
            {[
              { icon: <Zap size={22} />, color: 'primary', title: '1. Find Challenges', desc: 'Explore weekly problem sets from validated companies. Filter by coding, design, business or ecology.' },
              { icon: <Users size={22} />, color: 'info', title: '2. Build a Team', desc: 'Form alliances with other high schoolers or compete solo. Use shared workspaces and review tools.' },
              { icon: <Trophy size={22} />, color: 'warning', title: '3. Submit Solutions', desc: 'Upload slides, code, mockups or PDFs before the weekly countdown deadline runs out.' },
              { icon: <GraduationCap size={22} />, color: 'success', title: '4. Win & Rank Up', desc: 'Get scored by professional judges, win prizes, build a public portfolio, and land internships.' },
            ].map((step, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div className={`icon-box ${step.color}`}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '10px', fontWeight: '700' }}>{step.title}</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ======== FEATURED CHALLENGES ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <div className="flex justify-between align-center mb-8 flex-wrap gap-4">
              <div>
                <h2 className="section-title">Active Sprint Challenges</h2>
                <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Weekly rounds closing soon. Secure your submission.</p>
              </div>
              <button onClick={() => navigate('challenges')} className="btn btn-outline">
                View All <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>

          <StaggerGrid className="grid grid-3">
            {activeChallenges.map(ch => (
              <div key={ch.id} className="card flex flex-col" style={{ padding: '24px' }}>
                <div className="flex justify-between align-center mb-4">
                  <span className="badge badge-purple">{ch.category}</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.9rem' }}>{ch.prize.split(' ')[0]}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', fontWeight: '700' }}>{ch.title}</h3>
                <p className="text-secondary text-sm mb-6" style={{ flex: 1, lineHeight: '1.6' }}>{ch.summary}</p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {ch.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-muted" style={{ padding: '2px 8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    {ch.companyLogo} {ch.companyName}
                  </span>
                  <button onClick={() => navigate(`challenge-${ch.id}`)} className="btn btn-primary btn-sm">
                    View <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ======== PRIZES ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <div className="section-header text-center">
              <h2 className="section-title">Prizes That Matter</h2>
              <p className="section-subtitle centered">
                No plastic trophies. Real rewards that accelerate your career.
              </p>
            </div>
          </Reveal>

          <StaggerGrid className="grid grid-3">
            {[
              { icon: '💰', title: 'Cash Awards', desc: 'Weekly pools up to $5,000. Funded directly into student team accounts.' },
              { icon: '🚀', title: 'Summer Internships', desc: 'Skip the HR queue. Win challenges and join startups as paid associates.' },
              { icon: '🎯', title: 'Executive Mentorship', desc: 'Recurring 1-on-1 calls with founders, engineering leads, and VCs.' },
            ].map((prize, i) => (
              <div key={i} className="card text-center" style={{ padding: '36px 28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{prize.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '700' }}>{prize.title}</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>{prize.desc}</p>
              </div>
            ))}
          </StaggerGrid>

          {/* Partners */}
          <Reveal>
            <div style={{ marginTop: '64px', textAlign: 'center' }}>
              <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', fontWeight: '600' }}>
                Trusted by teams at
              </p>
              <div className="partner-logos">
                <span className="partner-logo">Linear</span>
                <span className="partner-logo">OpenAI</span>
                <span className="partner-logo">Patagonia</span>
                <span className="partner-logo">SpaceX</span>
                <span className="partner-logo">Figma</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== TESTIMONIALS ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <div className="section-header text-center">
              <h2 className="section-title">From SolveSprint to the World</h2>
              <p className="section-subtitle centered">
                Real students who turned challenge wins into career-defining opportunities.
              </p>
            </div>
          </Reveal>

          <StaggerGrid className="grid grid-3">
            {[
              {
                quote: "Won the Linear Mobile challenge. Two weeks later, I was on a call with their product VP. Now I have a remote UI internship lined up.",
                name: "Alex Rivera",
                detail: "TJHSST, Grade 11",
                badge: "Linear Winner",
                badgeClass: "badge-purple",
                initial: "A"
              },
              {
                quote: "Our school eco club won the Patagonia sustainability sprint. Highlighting this in my college app helped me get into Stanford.",
                name: "Sarah Chen",
                detail: "Stuyvesant HS, Grade 12",
                badge: "Stanford Commit",
                badgeClass: "badge-green",
                initial: "S"
              },
              {
                quote: "Submitting weekly project mockups has completely transformed my skills. The community feedback is lightning fast.",
                name: "Marcus Vance Jr.",
                detail: "Exeter Academy, Grade 10",
                badge: "Active Competitor",
                badgeClass: "badge-amber",
                initial: "M"
              }
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.name}</div>
                    <div className="text-muted text-xs">{t.detail}</div>
                  </div>
                  <span className={`badge ${t.badgeClass}`} style={{ fontSize: '0.6rem' }}>{t.badge}</span>
                </div>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ======== TRUST / MINOR PROTECTION ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <Reveal>
            <div className="card" style={{ padding: '36px', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div className="icon-box info" style={{ width: '56px', height: '56px', flexShrink: 0, borderRadius: '14px' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: '700' }}>Minor Protection & Consent</h3>
                <p className="text-secondary text-sm mb-4" style={{ lineHeight: '1.6' }}>
                  SolveSprint enforces parent/guardian consent before any student under 18 can participate. We take student safety seriously.
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <a href="#guardian" onClick={(e) => { e.preventDefault(); navigate('consent-page'); }} style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    How it works <ArrowRight size={14} />
                  </a>
                  <a href="#terms" onClick={(e) => { e.preventDefault(); navigate('terms-page'); }} style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Terms of Service <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== FAQ ======== */}
      <div className="gradient-line" />
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <div className="section-header text-center">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle centered">
                Everything you need to know about SolveSprint.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                {
                  q: "Who is eligible to participate?",
                  a: "SolveSprint is exclusively for current high school students (Grades 9-12). Students under 18 need parent or guardian consent during sign-up."
                },
                {
                  q: "Can I compete on a team?",
                  a: "Yes! Some challenges are individual, some are team-only, and others allow both. You can create a team and invite fellow students from any school."
                },
                {
                  q: "What types of prizes are available?",
                  a: "Prizes include cash awards, 1-on-1 mentorship with founders, software licenses, tech gear vouchers, and paid summer internships."
                },
                {
                  q: "How does company verification work?",
                  a: "Companies submit business registration and credentials. Every sponsor passes administrative review before their challenges are published."
                },
                {
                  q: "Is SolveSprint free?",
                  a: "Yes — 100% free for students to build profiles, join teams, message peers, and submit solutions."
                }
              ].map((item, idx) => (
                <div key={idx} className={`faq-item ${faqOpen[idx] ? 'open' : ''}`}>
                  <button className="faq-header" onClick={() => toggleFaq(idx)}>
                    <span>{item.q}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  <div className="faq-content">
                    <p className="text-secondary text-sm" style={{ lineHeight: '1.7' }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <div className="gradient-line" />
      <section className="cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.03em' }}>Ready to compete?</h2>
            <p className="text-secondary" style={{ maxWidth: '460px', margin: '0 auto 32px', fontSize: '1rem' }}>
              Join thousands of ambitious high schoolers building real skills and winning real opportunities.
            </p>
            <button onClick={() => navigate('role-selection')} className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={18} />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
