import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar, Trophy, Award, Users, Filter, X } from 'lucide-react';

export default function ChallengeFeed({ challenges, navigate, currentUser }) {
  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [prizeRange, setPrizeRange] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [type, setType] = useState('All');
  const [grade, setGrade] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Categories list
  const categories = ['All', 'Coding', 'Design', 'Business', 'Social Impact'];

  // Handle Challenge Join Click
  const handleJoinClick = (e, challenge) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('login');
      return;
    }
    // For minor students, verify if consent was approved
    if (currentUser.role === 'student' && currentUser.parentConsentStatus === 'pending') {
      navigate('consent-page');
      return;
    }
    navigate(`challenge-${challenge.id}`);
  };

  // Filtering Logic
  const filteredChallenges = challenges.filter(ch => {
    // 1. Search Query
    const query = search.toLowerCase();
    const matchesSearch = ch.title.toLowerCase().includes(query) || 
      ch.summary.toLowerCase().includes(query) ||
      ch.companyName.toLowerCase().includes(query) ||
      ch.tags.some(tag => tag.toLowerCase().includes(query));

    // 2. Category Filter
    const matchesCategory = category === 'All' || ch.category === category;

    // 3. Difficulty Filter
    const matchesDifficulty = difficulty === 'All' || ch.difficulty === difficulty;

    // 4. Type (Solo/Team) Filter
    const matchesType = type === 'All' || 
      (type === 'Individual' && ch.type.includes('Individual')) ||
      (type === 'Team' && ch.type.includes('Team'));

    // 5. Grade Filter
    const matchesGrade = grade === 'All' || 
      ch.eligibility.includes('All') || 
      ch.eligibility.toLowerCase().includes(grade.toLowerCase());

    // 6. Prize Filter
    let matchesPrize = true;
    if (prizeRange !== 'All') {
      // Extract numeric value from prize e.g. "$1,500" -> 1500
      const prizeNum = parseInt(ch.prize.replace(/[^0-9]/g, ''), 10) || 0;
      if (prizeRange === 'under-1000') matchesPrize = prizeNum < 1000;
      else if (prizeRange === '1000-2500') matchesPrize = prizeNum >= 1000 && prizeNum <= 2500;
      else if (prizeRange === 'above-2500') matchesPrize = prizeNum > 2500;
    }

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType && matchesGrade && matchesPrize;
  });

  // Sorting Logic
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'prize-value') {
      const aPrize = parseInt(a.prize.replace(/[^0-9]/g, ''), 10) || 0;
      const bPrize = parseInt(b.prize.replace(/[^0-9]/g, ''), 10) || 0;
      return bPrize - aPrize;
    }
    if (sortBy === 'popularity') {
      return b.views - a.views;
    }
    return 0;
  });

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Header and Search */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Challenge Discovery Feed</h1>
        <p className="text-secondary mb-6">Join weekly hack sprints posted by corporate engineering teams. Earn credentials, badges, and prizes.</p>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ width: '100%', paddingLeft: '48px' }} 
              placeholder="Search challenges by title, skills, tags, or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="form-select" 
            style={{ width: '200px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Recently Posted</option>
            <option value="deadline">Closing Soon</option>
            <option value="prize-value">Highest Prize Pool</option>
            <option value="popularity">Most Views</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="btn btn-outline mobile-filter-toggle"
            style={{ display: 'none' }} // Visible only in mobile media query
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="grid-feed-layout">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="glass-panel sticky-sidebar" style={{ padding: '24px', alignSelf: 'start', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignCenter: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '20px', alignItems: 'center' }}>
            <Filter size={16} className="text-gradient-violet-cyan" />
            <h3 style={{ fontSize: '1.1rem' }}>Filter Sprints</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      background: category === cat ? 'var(--color-primary)' : 'transparent',
                      border: 'none',
                      color: category === cat ? '#fff' : 'var(--text-secondary)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prize Range Filter */}
            <div>
              <label className="form-label">Prize Pools</label>
              <select className="form-select" style={{ width: '100%' }} value={prizeRange} onChange={(e) => setPrizeRange(e.target.value)}>
                <option value="All">All Ranges</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="above-2500">Above $2,500</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="form-label">Difficulty</label>
              <select className="form-select" style={{ width: '100%' }} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="All">All Levels</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Team/Individual Type Filter */}
            <div>
              <label className="form-label">Participation Type</label>
              <select className="form-select" style={{ width: '100%' }} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">Any Team Setup</option>
                <option value="Individual">Individual Only</option>
                <option value="Team">Team Only</option>
              </select>
            </div>

            {/* Grade Openings */}
            <div>
              <label className="form-label">Eligible Grade</label>
              <select className="form-select" style={{ width: '100%' }} value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="All">All Grades</option>
                <option value="9th">Freshmen (9th)</option>
                <option value="10th">Sophomores (10th)</option>
                <option value="11th">Juniors (11th)</option>
                <option value="12th">Seniors (12th)</option>
              </select>
            </div>

          </div>
        </aside>

        {/* ACTIVE CHALLENGES GRID */}
        <main>
          {sortedChallenges.length === 0 ? (
            <div className="glass-panel" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h3>No sprints match your filters.</h3>
              <p className="text-muted text-sm mt-2">Try clearing your filters or widening your search query!</p>
              <button 
                onClick={() => {
                  setSearch(''); setCategory('All'); setPrizeRange('All'); setDifficulty('All'); setType('All'); setGrade('All');
                }} 
                className="btn btn-outline mt-6"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-2">
              {sortedChallenges.map(ch => {
                const daysLeft = Math.ceil((new Date(ch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                const isClosed = ch.status === 'closed';

                return (
                  <div 
                    key={ch.id} 
                    className="glass-card cyan flex flex-col" 
                    style={{ padding: '24px', cursor: 'pointer' }}
                    onClick={() => navigate(`challenge-${ch.id}`)}
                  >
                    <div className="flex justify-between align-center mb-4">
                      <span className={`badge ${ch.category === 'Coding' ? 'badge-purple' : ch.category === 'Design' ? 'badge-cyan' : ch.category === 'Business' ? 'badge-pink' : 'badge-green'}`}>
                        {ch.category}
                      </span>
                      <span className="badge badge-amber" style={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trophy size={12} /> {ch.prize}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{ch.title}</h3>
                    <p className="text-secondary text-sm mb-6" style={{ flex: 1 }}>{ch.summary}</p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {ch.tags.map(tag => (
                        <span key={tag} className="text-xs text-muted" style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="flex align-center gap-2">
                        <span style={{ fontSize: '1.2rem' }}>{ch.companyLogo}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ch.companyName}</div>
                          <div className="text-muted text-xs" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={10} /> {ch.submissionsCount} Joined
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isClosed ? (
                          <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Closed</span>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => handleJoinClick(e, ch)}
                              className="btn btn-outline btn-sm"
                            >
                              Join Sprint
                            </button>
                            <button 
                              onClick={() => navigate(`challenge-${ch.id}`)}
                              className="btn btn-primary btn-sm"
                            >
                              View Detail
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Deadline counter warning */}
                    {!isClosed && (
                      <div style={{ 
                        marginTop: '12px', 
                        fontSize: '0.75rem', 
                        color: daysLeft <= 3 ? 'var(--color-danger)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={12} />
                        <span>
                          {daysLeft > 0 ? `${daysLeft} days remaining to submit solutions` : 'Ends in hours!'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showMobileFilters && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }} className="anim-fade-in">
          <div style={{
            width: '300px',
            background: 'var(--bg-surface)',
            height: '100%',
            padding: '24px',
            overflowY: 'auto',
            borderLeft: '1px solid var(--border-glass)'
          }} className="anim-slide-up">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignCenter: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '20px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filters (Copy structure of desktop filter panel) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" style={{ width: '100%' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Prize Pools</label>
                <select className="form-select" style={{ width: '100%' }} value={prizeRange} onChange={(e) => setPrizeRange(e.target.value)}>
                  <option value="All">All Ranges</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="above-2500">Above $2,500</option>
                </select>
              </div>

              <div>
                <label className="form-label">Difficulty</label>
                <select className="form-select" style={{ width: '100%' }} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="All">All Levels</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="form-label">Participation Type</label>
                <select className="form-select" style={{ width: '100%' }} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="All">Any Team Setup</option>
                  <option value="Individual">Individual Only</option>
                  <option value="Team">Team Only</option>
                </select>
              </div>

              <div>
                <label className="form-label">Eligible Grade</label>
                <select className="form-select" style={{ width: '100%' }} value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="All">All Grades</option>
                  <option value="9th">Freshmen (9th)</option>
                  <option value="10th">Sophomores (10th)</option>
                  <option value="11th">Juniors (11th)</option>
                  <option value="12th">Seniors (12th)</option>
                </select>
              </div>

              <button onClick={() => setShowMobileFilters(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
