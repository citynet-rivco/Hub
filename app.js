/* ─── UTILITIES ─────────────────────────────────────── */
function initials(n) { return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

/* ─── SCROLL REVEAL & JS COUNTER ANIMATIONS ─────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
function attachReveal() { document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      let count = 0;
      const duration = 1200; // ms
      const increment = target / (duration / 16);
      
      const update = () => {
        count += increment;
        if (count < target) {
          el.innerText = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          el.innerText = target;
        }
      };
      update();
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => countObserver.observe(c));

/* ─── TEAM STATUS ────────────────────────────────────── */
function updateStatus() {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusTxt');
  if (!dot || !txt) return;
  const pt  = new Date(new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles'}));
  const d=pt.getDay(), h=pt.getHours(), m=pt.getMinutes();
  const on = d>=1&&d<=5 && (h>7||(h===7&&m>=0)) && (h<15||(h===15&&m<30));
  dot.className = 'sdot ' + (on ? 'on' : 'off');
  txt.textContent = on ? 'Available Now' : 'Currently Offline';
  txt.style.color = on ? 'var(--signal-green)' : 'var(--text-tertiary)';
}
updateStatus();setInterval(updateStatus, 60000);

/* ─── TEAM RENDER ────────────────────────────────────── */
function renderTeam(q='') {
  const grid = document.getElementById('teamGrid');
  const cnt  = document.getElementById('cmCount');
  if (!grid) return;
  const list = caseManagers.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  if (cnt) cnt.textContent = list.length;
  grid.innerHTML = list.map(cm => `
    <div class="cm-card">
      <div class="cm-card__head">
        <div class="cm-avatar" aria-hidden="true">${initials(cm.name)}</div>
        <div>
          <div class="cm-card__name">${cm.name}</div>
          <div class="cm-card__role">${cm.role || 'Case Manager'}</div>
        </div>
       </div>
      <div class="cm-card__contacts">
        <div class="cm-contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:${cm.email}">${cm.email}</a>
        </div>
        <div class="cm-contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"></path></svg>
          <a href="tel:${cm.phone.replace(/-/g,'')}">${cm.phone}</a>
        </div>
      </div>
      <div class="cm-card__actions">
        <button class="cm-btn cm-btn--primary" onclick="location.href='mailto:${cm.email}'">Email</button>
        <button class="cm-btn cm-btn--secondary" onclick="location.href='tel:${cm.phone.replace(/-/g,'')}'">Call</button>
      </div>
    </div>`).join('');
}
document.getElementById('cmSearch')?.addEventListener('input', debounce(e => renderTeam(e.target.value), 300));
renderTeam();

/* ─── JOB ENGINE ─────────────────────────────────────── */
let activeJobs = {}, totalJobs = 0;
let empFilter = 'all';

function timeAgo(iso) {
  const h = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (h < 24) return { text: 'Updated recently', isNew: true };
  const d = Math.floor(h/24);
  return { text: `${d === 1 ? '1 day' : d+' days'} ago`, isNew: false };
}

function renderJobs() {
  const c = document.getElementById('empListings'); if (!c) return;
  let html = '';
  for (const [city, list] of Object.entries(activeJobs)) {
    const filtered = (empFilter==='all' ? [...list] : list.filter(j=>j.type===empFilter))
      .sort((a,b)=> new Date(b.posted) - new Date(a.posted));
      
    const id = city.toLowerCase().replace(/\s+/g,'-');
    
    html += `<div class="city-block" id="emp-${id}">
      <div class="city-block__header" onclick="this.closest('.city-block').classList.toggle('closed')"
           onkeydown="if(event.key==='Enter'||event.key===' ')this.closest('.city-block').classList.toggle('closed')"
           tabindex="0" role="button" aria-expanded="true">
        <div class="city-block__left"><div class="city-pip" aria-hidden="true"></div><span class="city-name">${city}</span></div>
        <div class="city-block__right">
          <span class="city-count">${filtered.length} opening${filtered.length!==1?'s':''}</span>
          <svg class="city-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      <div class="city-block__body">`;
      
    if (!filtered.length) {
      html += `<div style="padding:32px 20px;text-align:center;color:var(--text-tertiary);font-size:14px;font-weight:500;">No ${empFilter==='ft'?'full-time':'part-time'} openings listed in ${city}.</div>`;
    } else {
      filtered.forEach(j => {
        const ta = timeAgo(j.posted);
        html += `<div class="job-row" tabindex="0" role="link" aria-label="${j.title} at ${j.employer}"
                   onclick="window.open('${j.url}','_blank','noopener noreferrer')"
                   onkeydown="if(event.key==='Enter'||event.key===' ')window.open('${j.url}','_blank','noopener noreferrer')">
          <div class="job-initials" aria-hidden="true">${initials(j.employer)}</div>
          <div class="job-info">
            <div class="job-title">${j.title}<span class="job-arrow" aria-hidden="true">↗</span></div>
            <div class="job-meta">
              <span class="job-employer">${j.employer}</span>
              <span class="job-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${ta.text} <span style="margin-left:4px; opacity:0.75; font-weight:600;">via ${j.source || 'Local'}</span></span>
            </div>
          </div>
          <div class="job-right">
            <span class="job-wage">${j.wage}</span>
            <div style="display:flex;gap:6px;align-items:center">
              <span class="badge badge--${j.type}">${j.type==='ft'?'Full-Time':'Part-Time'}</span>
              ${ta.isNew?'<span class="badge badge--new">New</span>':''}
            </div>
          </div>
        </div>`;
      });
    }
    html += '</div></div>';
  }
  c.innerHTML = html;
}

/* ─── RESOURCE CARD BUILDER ──────────────────────────── */
const SVG = {
  addr:  `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"></path>`,
  email: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  web:   `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
};
const ico = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[k]}</svg>`;

function buildCard(item, colorClass, defaultLabel) {
  const badgeClass = item.special ? 'rcb--special' : `rcb--${colorClass}`;
  const label      = item.special || defaultLabel;
  return `
    <div class="rc rc--${colorClass} reveal">
      <div class="rc-badge ${badgeClass}">${label}</div>
      <div class="rc-name">${item.name}</div>
      <div class="rc-details">
        ${item.address ? `<div class="rc-row">${ico('addr')}<span>${item.address}</span></div>` : ''}
        ${item.phone   ? `<div class="rc-row">${ico('phone')}<a href="tel:${item.phone.replace(/[^0-9]/g,'')}">${item.phone}</a></div>` : ''}
        ${item.email   ? `<div class="rc-row">${ico('email')}<a href="mailto:${item.email}">${item.email}</a></div>` : ''}
        ${item.website ? `<div class="rc-row">${ico('web')}<a href="${item.website}" target="_blank" rel="noopener noreferrer">Visit Website ↗</a></div>` : ''}
      </div>
    </div>`;
}

function buildPanels(data, containerId, colorMap, labelMap, tabRowId) {
  const wrap = document.getElementById(containerId); if (!wrap) return;
  let html = '';
  let i = 0;
  for (const [type, label] of Object.entries(labelMap)) {
    const color = colorMap[type] || type;
    html += `<div class="panel ${i===0?'on':''}" id="${containerId.replace('Panels','')}panel-${type}">
      <div class="resource-grid">${(data[type]||[]).map(item=>buildCard(item,color,label)).join('')}</div>
    </div>`;
    i++;
  }
  wrap.innerHTML = html;
  
  document.querySelectorAll(`#${tabRowId} .pill`).forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(`#${tabRowId} .pill`).forEach(t=>{
        t.classList.remove('on');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('on');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll(`#${containerId} .panel`).forEach(p=>p.classList.remove('on'));
      const target = document.getElementById(`${containerId.replace('Panels','')}panel-${tab.dataset.tab}`);
      if (target) { target.classList.add('on'); attachReveal(); }
    });
  });
}

buildPanels(housing, 'housingPanels',
  {referrals:'specialty', emergency:'emergency', transitional:'transitional', psh:'medical', affordable:'affordable', sober:'behavioral'},
  {referrals:'Referrals & Outreach', emergency:'Emergency Shelters', transitional:'Transitional', psh:'Permanent Supportive', affordable:'Affordable Housing', sober:'Sober Living'},
  'housingTabs');

buildPanels(healthcare, 'hcPanels',
  {medical:'medical',behavioral:'behavioral',specialty:'specialty'},
  {medical:'Medical & Primary Care',behavioral:'Behavioral Health',specialty:'Specialty Care'},
  'hcTabs');

buildPanels(resources, 'resPanels',
  {crisis:'emergency', basic:'basic', food:'food', legal:'legal', education:'education', animals:'animals'},
  {crisis:'Crisis Support', basic:'Basic Needs', food:'Food Pantries', legal:'Social & Legal Services', education:'Education', animals:'Animal Care'},
  'resTabs');

/* STAFFING AGENCIES (Employment Page logic override) */
function renderAgencies() {
  const c = document.getElementById('agencyListings');
  if (!c) return;
  c.innerHTML = staffingAgencies.map(item => buildCard(item, 'medical', item.special)).join('');
}
renderAgencies();

document.querySelectorAll('#empFilters .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#empFilters .pill').forEach(b=>{
      b.classList.remove('on');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('on'); 
    btn.setAttribute('aria-selected', 'true');
    empFilter = btn.dataset.filter; 
    
    if (empFilter === 'agencies') {
      document.getElementById('empListings').style.display = 'none';
      document.getElementById('empSyncBar').style.display = 'none';
      document.getElementById('agencyListings').style.display = 'grid';
    } else {
      document.getElementById('empListings').style.display = 'block';
      document.getElementById('empSyncBar').style.display = 'flex';
      document.getElementById('agencyListings').style.display = 'none';
      renderJobs();
    }
  });
});

/* ─── NAVIGATION ─────────────────────────────────────── */
function goTo(page, scrollTo, activateTab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-'+page);
  if (target) target.classList.add('active');

  const resPages = ['housing','healthcare','resources'];

  // Desktop Nav Links
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    const match = l.dataset.page === page || (resPages.includes(page) && l.dataset.page === 'resources-group');
    l.classList.toggle('active', match);
  });

  // Mobile Nav Links
  document.querySelectorAll('.mobile-nav__link[data-mpage]').forEach(l => {
    l.classList.toggle('active', l.dataset.mpage === page);
  });

  closeMobileNav();

  if (scrollTo) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({top:y,behavior:'smooth'}); }
      }, 100);
    });
  } else {
    window.scrollTo({top:0, behavior:'smooth'});
  }
  setTimeout(attachReveal, 150);

  if (activateTab) {
    setTimeout(() => {
      const tabMap = { housing: 'housingTabs', healthcare: 'hcTabs', resources: 'resTabs' };
      const tabRowId = tabMap[page];
      if (tabRowId) {
         const btn = document.querySelector(`#${tabRowId} .pill[data-tab="${activateTab}"]`);
         if (btn) btn.click();
      }
    }, 200);
  }
}

/* ─── MOBILE NAV ─────────────────────────────────────── */
function openMobileNav() {
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.contains('open') ? closeMobileNav() : openMobileNav();
});
document.getElementById('mobileClose').addEventListener('click', closeMobileNav);
document.getElementById('mobileNav').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeMobileNav();
});

/* ─── DYNAMIC ISLAND SCROLL ──────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('headerWrapper').classList.toggle('scrolled', window.scrollY > 40);
}, {passive: true});

/* ─── INITIAL REVEAL ─────────────────────────────────── */
attachReveal();

/* ─── REAL-TIME API INTEGRATION (SerpAPI Google Jobs via Vercel Proxy) ─── */
const PROXY_URL = "https://hub-phi-bice.vercel.app/api/jobs";

async function fetchGoogleJobs() {
  if (!PROXY_URL) {
      console.warn('No proxy URL provided. Falling back to local data.');
      return [];
  }

  try {
    const response = await fetch(`${PROXY_URL}?action=get_cache`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    if (!data.jobs_results || !Array.isArray(data.jobs_results)) return [];

    return data.jobs_results.map(job => normalizeGoogleJob(job));

  } catch (error) {
    console.error('Failed to fetch jobs from proxy:', error);
    return [];
  }
}

function normalizeGoogleJob(data) {
  let city = 'Riverside County';
  const knownCities = ['Murrieta', 'Temecula', 'Menifee', 'Lake Elsinore', 'Wildomar'];
  if (data.location) {
      for (const known of knownCities) {
          if (data.location.toLowerCase().includes(known.toLowerCase())) {
              city = known;
              break;
          }
      }
  }

  let postedDate = new Date().toISOString();
  if (data.detected_extensions && data.detected_extensions.posted_at) {
      const postedStr = data.detected_extensions.posted_at.toLowerCase();
      const match = postedStr.match(/(\d+)\s+(day|hour|minute)s?\s+ago/);
      if (match) {
          const amount = parseInt(match[1], 10);
          const unit = match[2];
          const now = Date.now();
          if (unit === 'day') postedDate = new Date(now - amount * 86400000).toISOString();
          if (unit === 'hour') postedDate = new Date(now - amount * 3600000).toISOString();
          if (unit === 'minute') postedDate = new Date(now - amount * 60000).toISOString();
      }
  }

  let jobType = 'ft';
  if (data.detected_extensions && data.detected_extensions.schedule_type) {
      if (data.detected_extensions.schedule_type.toLowerCase().includes('part')) {
          jobType = 'pt';
      }
  }

  let wage = 'Competitive';
  if (data.detected_extensions && data.detected_extensions.salary) {
      wage = data.detected_extensions.salary;
  }

  return {
    title: data.title || 'Open Position',
    employer: data.company_name || 'Local Business',
    wage: wage,
    type: jobType,
    url: data.share_link || data.related_links?.[0]?.link || '#', 
    posted: postedDate,
    status: 'open', 
    location: city,
    source: 'Google Jobs'
  };
}

function removeDuplicates(jobArray) {
  const seen = new Set();
  return jobArray.filter(job => {
    const key = `${job.title.toLowerCase().trim()}|${job.employer.toLowerCase().trim()}|${job.location.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchAndPopulateJobs() {
  const ls = document.getElementById('lastSync');
  if (ls) ls.textContent = 'Syncing live feeds...';
  
  const liveListings = await fetchGoogleJobs();
  
  let allJobs = [...liveListings];
  for (const city in jobs) {
    allJobs.push(...jobs[city].map(j => ({ ...j, location: city })));
  }

  const now = Date.now();
  const MAX_AGE_MS = 14 * 86400000;
  
  let validJobs = allJobs.filter(j => {
    const isClosed = j.status === 'closed' || j.status === 'expired';
    const jobAge = now - new Date(j.posted).getTime();
    const isExpired = jobAge > MAX_AGE_MS;
    
    return !isClosed && !isExpired;
  });

  validJobs = removeDuplicates(validJobs);

  activeJobs = {};
  totalJobs = 0;
  
  validJobs.forEach(job => {
    const loc = job.location;
    const targetLoc = ['Murrieta', 'Temecula', 'Menifee', 'Lake Elsinore', 'Wildomar'].includes(loc) ? loc : 'Riverside County';
    
    if (!activeJobs[targetLoc]) activeJobs[targetLoc] = [];
    activeJobs[targetLoc].push(job);
    totalJobs++;
  });

  if (ls) { 
    const n = new Date(); 
    ls.textContent = 'Live • ' + n.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); 
  }
  
  renderJobs();
}

fetchAndPopulateJobs();
setInterval(fetchAndPopulateJobs, 300000);

/* ─────────────────────────────────────────────────────
   RAPID INTAKE WIZARD (Questionnaire)
───────────────────────────────────────────────────── */
const Q_STEPS = {
  need: {
    eyebrow: 'STEP 1',
    title: 'What do you need help with today?',
    sub: 'Select your most urgent need and we\'ll guide you to the right resources.',
    opts: [
      {icon:'🆘', label:'Crisis Support',          sub:'Hotlines, immediate help',          val:'crisis'},
      {icon:'🏠', label:'Housing',                 sub:'Shelters, transitional, apartments',  val:'housing'},
      {icon:'💼', label:'Employment',              sub:'Job listings, staffing agencies',     val:'employment'},
      {icon:'🏥', label:'Healthcare',              sub:'Medical, behavioral health, recovery',    val:'healthcare'},
      {icon:'🍎', label:'Food & Basics',           sub:'Food pantries, clothing, essentials', val:'food'},
      {icon:'⚖️', label:'Social & Legal', sub:'Public benefits, legal aid',          val:'legal'}
    ]
  },
  housing_sub: {
    eyebrow: 'STEP 2 OF 3 — HOUSING',
    title: 'What\'s your current situation?',
    sub: 'This helps us show you the most relevant housing options.',
    opts: [
      {icon:'🚨', label:'Need shelter tonight',   sub:'Emergency shelters',                           val:'emergency'},
      {icon:'🏘️', label:'Transitional Housing',   sub:'Stable, short-term housing support',          val:'transitional'},
      {icon:'🏡', label:'Affordable Housing',     sub:'Affordable, low-income apartments',           val:'affordable'},
      {icon:'🤝', label:'Talk to a Case Manager', sub:'Personalized, one-on-one housing navigation', val:'casemgr'}
    ]
  },
  healthcare_sub: {
    eyebrow: 'STEP 2 OF 2 — HEALTHCARE',
    title: 'What type of care do you need?',
    sub: 'We\'ll direct you to the most appropriate providers.',
    opts: [
      {icon:'🩺', label:'Medical & Primary Care',     sub:'Hospitals, clinics, urgent care',             val:'medical'},
      {icon:'🧠', label:'Behavioral Health',              sub:'Counseling, therapy, psychiatry',      val:'behavioral'},
      {icon:'💊', label:'Substance Use',     sub:'Recovery centers, treatment programs',            val:'recovery'},
      {icon:'✨', label:'Specialty Care',             sub:'Autism, IHSS, other care',          val:'specialty'}
    ]
  },
  special: {
    eyebrow: 'STEP 3 OF 3',
    title: 'Any special circumstances?',
    sub: 'We have targeted resources for specific communities.',
    opts: [
      {icon:'🌟',  label:'Adult (Single)',       sub:'Show me all matching resources',      val:'none'},
      {icon:'👨‍👩‍👧', label:'Women & Families',     sub:'Family shelter & housing resources',   val:'family'},
      {icon:'🌱',  label:'Youth (16–25)',        sub:'Youth-specific housing & support',    val:'youth'},
      {icon:'🌈',  label:'LGBTQ+',               sub:'Affirming, identity-safe services',   val:'lgbtq'},
      {icon:'🎖️',  label:'Veteran',              sub:'Veteran services & programs',         val:'veteran'}
    ]
  }
};

let qState = {step:1, need:null, sub:null, special:null};

function openQuestionnaire() {
  qState = {step:1, need:null, sub:null, special:null};
  document.getElementById('qOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderQStep();
}

function closeQuestionnaire() {
  document.getElementById('qOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function updateQDots(step, totalSteps) {
  const ind = document.querySelector('.q-step-ind');
  if(ind) {
    ind.innerHTML = Array.from({length: totalSteps}, (_, i) => 
      `<div class="q-step-dot ${i+1 === step ? 'active' : ''}" id="qDot${i+1}"></div>`
    ).join('');
  }
}

function renderQStep() {
  let stepDef, answerKey;
  let totalSteps = 1;
  
  if (qState.need === 'housing') totalSteps = 3;
  else if (qState.need === 'healthcare') totalSteps = 2;
  
  if (qState.step === 1) {
    stepDef = Q_STEPS.need; answerKey = 'need';
    stepDef.eyebrow = `STEP 1`;
    if (qState.need) stepDef.eyebrow += ` OF ${totalSteps}`;
  } else if (qState.step === 2) {
    if (qState.need === 'housing') {
      stepDef = Q_STEPS.housing_sub; answerKey = 'sub';
      stepDef.eyebrow = `STEP 2 OF 3 — HOUSING`;
    } else if (qState.need === 'healthcare') {
      stepDef = Q_STEPS.healthcare_sub; answerKey = 'sub';
      stepDef.eyebrow = `STEP 2 OF 2 — HEALTHCARE`;
    }
  } else if (qState.step === 3) {
    stepDef = Q_STEPS.special; answerKey = 'special';
    stepDef.eyebrow = `STEP 3 OF 3`;
  }
  
  updateQDots(qState.step, totalSteps);
  renderQOptions(stepDef, answerKey, totalSteps);
}

function renderQOptions(stepDef, answerKey, totalSteps) {
  const body = document.getElementById('qBody');
  const showBack = qState.step > 1;
  const isLast = qState.step === totalSteps;
  const btnText = isLast ? 'Show My Resources →' : 'Continue →';
  
  let html = `
    <div class="q-eyebrow" aria-live="polite">${stepDef.eyebrow}</div>
    <div class="q-title">${stepDef.title}</div>
    <div class="q-sub">${stepDef.sub}</div>
    <div class="q-grid" role="radiogroup">
      ${stepDef.opts.map(opt => `
        <button class="q-btn ${qState[answerKey] === opt.val ? 'selected' : ''}" 
                role="radio" aria-checked="${qState[answerKey] === opt.val}"
                onclick="qSelect('${answerKey}', '${opt.val}')">
          <div class="q-icon" aria-hidden="true">${opt.icon}</div>
          <div>
            <div class="q-label">${opt.label}</div>
            <div class="q-desc">${opt.sub}</div>
          </div>
        </button>
      `).join('')}
      </div>
    <div class="q-nav">
      ${showBack ? `<button class="btn btn--outline" onclick="qBack()" style="padding:10px 20px; border-color:transparent;">← Back</button>` : '<div></div>'}
      <button class="btn btn--solid" onclick="qNext(${totalSteps})" ${!qState[answerKey] ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>${btnText}</button>
    </div>
  `;
  body.innerHTML = html;
}

function qSelect(key, val) {
  qState[key] = val;
  renderQStep();
}

function qBack() {
  if (qState.step > 1) {
    qState.step--;
    if (qState.step === 1) {
        qState.sub = null;
        qState.special = null;
    }
    if (qState.step === 2) {
        qState.special = null;
    }
    renderQStep();
  }
}

function qNext(totalSteps) {
  if (qState.step === totalSteps) {
    finishQuestionnaire();
  } else {
    qState.step++;
    renderQStep();
  }
}

function finishQuestionnaire() {
  closeQuestionnaire();
  
  if (qState.need === 'employment') return goTo('employment');
  if (qState.need === 'food') return goTo('resources', null, 'food');
  if (qState.need === 'legal') return goTo('resources', null, 'legal');
  if (qState.need === 'crisis') return goTo('resources', null, 'crisis');
  
  if (qState.need === 'healthcare') {
    if (qState.sub === 'medical') return goTo('healthcare', null, 'medical');
    if (qState.sub === 'behavioral' || qState.sub === 'recovery') return goTo('healthcare', null, 'behavioral');
    if (qState.sub === 'specialty') return goTo('healthcare', null, 'specialty');
    return goTo('healthcare');
  }
  
  if (qState.need === 'housing') {
    if (qState.sub === 'emergency') return goTo('housing', null, 'emergency');
    if (qState.sub === 'transitional') return goTo('housing', null, 'transitional');
    if (qState.sub === 'affordable') return goTo('housing', null, 'affordable');
    if (qState.sub === 'casemgr') return goTo('home', 'team-section');
    return goTo('housing');
  }
  
  goTo('home');
}

document.getElementById('qOverlay').addEventListener('click', e => { 
    if (e.target === e.currentTarget) closeQuestionnaire(); 
});
