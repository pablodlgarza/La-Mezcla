/*
  La Mezcla — App.jsx
  React/Vite component — place images in /public/
  Required files in /public/:
    logo-mark.jpg, hero-red-flower.jpg, hero-flowers.jpg,
    p_green-blur.jpg, p_dark-flowers.jpg, p_yellow-purple.jpg,
    p_green-strip.jpg, p_lilac-strip.jpg, p_pink-half.jpg, p_flowers-half.jpg
*/

import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

/* ── Image map ─────────────────────────────────────────────── */
const I = {
  logo:         "/logo-mark.png",
  roses:        "/img-2.jpg",
  flowers:      "/img-3.jpg",
  greenBlur:    "/img-1.jpg",
  darkFlowers:  "/img-2.jpg",
  yellowPurple: "/img-3.jpg",
  greenStrip:   "/img-1.jpg",
  lilac:        "/img-3.jpg",
  pink:         "/img-2.jpg",
  flowersHalf:  "/img-1.jpg",
};

/* ── Static data ────────────────────────────────────────────── */
const ARTISTS = [
  { id: 1, eye: "Painting · Sculpture — 11e", name: "Inès Duval",
    bio: "Large-format oil paintings exploring the memory of traversed places and the tension between stillness and movement.", status: "Looking for collab", img: I.darkFlowers, ig: "@ines.duval" },
  { id: 2, eye: "Music — 18e", name: "Samir K.",
    bio: "Electro-acoustic composer. Nocturnal ambiances, field recordings and sound textures from Parisian public spaces.", status: "Currently showing", img: I.greenBlur, ig: "@samir_k_son" },
  { id: 3, eye: "Dance — 20e", name: "Léa Fontaine",
    bio: "Contemporary dance and in-situ performances in gardens and public spaces. Open to cross-disciplinary collaborations.", status: "Available on commission", img: I.yellowPurple, ig: "@lea.fontaine.danse" },
  { id: 4, eye: "Photography — 3e", name: "Marie Chen",
    bio: "Analog portraits in urban settings. Looking to collaborate with a musician or dancer on an outdoor project.", status: "Looking for collab", img: I.flowers, ig: "@marie.chen.photo" },
];

const IDEAS = [
  { id: 1, type: "Music · Photography", title: "A visual album on Parisian nights",
    desc: "Looking for a photographer to document the places I record at night. Sound and image, same city.",
    pitch: "Sound is the first thing the city gives you at night. I record it obsessively, in passages, on platforms, under bridges. I want to pair this with photography that captures the same texture — the light bleed, the blur of movement, the stillness inside the noise.",
    maturity: "Concept", seeking: ["Photography", "La Mezcla support"], likes: 14 },
  { id: 2, type: "Dance · Video", title: "Filmed performance in the metro",
    desc: "A series of performances in the corridors, filmed in one take. Looking for a director and a dancer.",
    pitch: "A series of 5 performances in RER corridors — one take each, no cuts. The friction between the choreography and the commuters is the piece. I need a video director and one additional dancer.",
    maturity: "Prototype", seeking: ["Artists", "Production"], likes: 8 },
  { id: 3, type: "Painting · Poetry", title: "Exhibition: text + painting",
    desc: "Each painting accompanied by a poem written specifically for it. Looking for a poet.",
    pitch: "I paint large canvases and I want each one to exist alongside a poem written specifically for it — not as caption, but as companion. Looking for a poet who works in French or English, available for a one-month collaboration.",
    maturity: "Project in progress", seeking: ["Artists"], likes: 21 },
  { id: 4, type: "Design · Fashion", title: "Artistic capsule collection",
    desc: "Micro-collection of 5 pieces inspired by a work of art. Looking for a fashion designer.",
    pitch: "I want to create a micro-collection of 5 garments, each inspired by a specific painting. Not a print on a t-shirt — a full design conversation between the artwork and the clothing. Looking for a fashion designer to collaborate.",
    maturity: "Intuition", seeking: ["Artists", "Brand"], likes: 6 },
];

const PROCESS_STEPS = [
  { n: "01", name: "The Matter", img: I.yellowPurple,
    objective: "Understand the starting material and gather the right elements before the collaboration.",
    body: "We start with an idea, brief or intention.\n\nThen we identify what the project needs: the right artists, brand team, experts, references and conditions to set the right artistic vision for the right intention.",
    what: ["We receive an idea, brief or intention.", "We clarify what needs to be expressed.", "We identify the artistic territory.", "We select the right artist(s).", "We identify the right brand team, experts or participants.", "We prepare the creative ground before the first collaborative session."],
    output: "A clear starting point: intention, people, references and artistic direction." },
  { n: "02", name: "The Mix / La Mezcla", img: I.darkFlowers,
    objective: "Bring the right people together and allow a shared artistic territory to emerge.",
    body: "This is where the mix happens.\n\nThrough guided collaborative sessions, we bring together artists, brand teams and key participants to define a shared artistic territory.",
    what: ["Cloud Sessions: a series of guided collaborative sessions.", "First drafts: we start letting ideas become real through sketches, directions, prototypes."],
    output: "A shared creative territory and clear artistic directions." },
  { n: "03", name: "The Creation", img: I.greenBlur,
    objective: "Allow artists to transform the mix into a real artistic piece.",
    body: "The artist or artists continue the creative process to elevate the mix into an artistic piece.\n\nLa Mezcla supports the process, keeps the intention alive, and documents the key voices around the project.",
    what: ["The artist develops the piece.", "The first drafts become a stronger artistic direction.", "The work moves from shared territory to artistic form.", "La Mezcla follows the process without over-controlling it.", "We conduct curated interviews with key participants of the mix."],
    output: "A developed artistic piece and a documented creative process." },
  { n: "04", name: "The Art", img: I.flowers,
    objective: "Present the artwork and share the artistic world created during the collaboration.",
    body: "The project becomes public.\n\nThe final piece is presented through a live exhibition, performance, activation or artistic moment.\n\nThe whole process is turned into an art documentary that shares the world created during the collaboration.",
    what: ["Live expo: a live presentation of the created piece.", "Art documentary: a film of the full process — the idea, the people, the sessions, the doubts, the decisions, the creation and the final piece."],
    output: "A public artistic experience and a documentary trace of how it came to life." },
];

/* ── Reusable components ────────────────────────────────────── */

function ImgHero({ src, height = "half", children, centerTxt = false }) {
  return (
    <div
      className={`img-hero ${height}${centerTxt ? " center-txt" : ""}`}
      style={{ backgroundImage: `url('${src}')` }}
    >
      {!centerTxt && <div className="ov" />}
      <div className="tx">{children}</div>
    </div>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">La Mezcla</div>
        <div className="footer-sub">Make art with others</div>
      </div>
      <div className="footer-links">
        <a className="footer-link" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a className="footer-link" href="https://linkedin.com"  target="_blank" rel="noreferrer">LinkedIn</a>
        <button className="footer-link" onClick={() => onNav("contact")}>Contact</button>
        <button className="footer-link">Legal / Privacy</button>
      </div>
    </footer>
  );
}

/* ── Login popup ────────────────────────────────────────────── */
function LoginPopup({ onClose, onOpenReg }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg">
            <div className="check">✓</div>
            <h3>Check your inbox</h3>
            <p>We sent a login link to <strong>{email}</strong>. No password needed.</p>
          </div>
        ) : (
          <>
            <h2>Log in to La Mezcla</h2>
            <p>Receive a login link by email, without a password.</p>
            <input
              type="email" placeholder="Your email" value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="popup-submit" onClick={() => email && setSent(true)}>
              Receive the link
            </button>
            <button className="popup-link" onClick={() => { onClose(); onOpenReg(); }}>
              Create an artist profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Artist profile popup ───────────────────────────────────── */
function ArtistPopup({ artist, onClose, onRequestContact }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup artist-popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" style={{ top: ".8rem", right: ".8rem", zIndex: 10 }} onClick={onClose}>×</button>
        <div className="ap-img" style={{ backgroundImage: `url('${artist.img}')` }} />
        <div className="ap-body">
          <div className="ap-eye">{artist.eye}</div>
          <div className="ap-name">{artist.name}</div>
          <p className="ap-bio">{artist.bio}</p>
          <span className="ap-tag">{artist.status}</span>
          <p className="ap-ig">{artist.ig}</p>
          <button className="ap-contact-btn" onClick={() => { onClose(); onRequestContact(artist); }}>
            Request contact
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Request contact popup ──────────────────────────────────── */
function RequestContactPopup({ artist, onClose }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg">
            <div className="check">✓</div>
            <h3>Request sent</h3>
            <p>We'll pass your message to {artist.name} and confirm by email.</p>
          </div>
        ) : (
          <>
            <h2>Contact {artist.name}</h2>
            <p>We'll forward your message and let you know when they respond.</p>
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <textarea placeholder={`Your message to ${artist.name}…`} />
            <button className="popup-submit" onClick={() => setSent(true)}>Send request</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Idea detail popup ──────────────────────────────────────── */
function IdeaPopup({ idea, onClose, onInterest }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup idea-popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="ip-type">{idea.type}</div>
        <div className="ip-title">{idea.title}</div>
        <p className="ip-pitch">{idea.pitch}</p>
        <div className="ip-tags">
          <span className="ip-tag">{idea.maturity}</span>
          {idea.seeking.map(s => <span key={s} className="ip-tag">Looking for {s}</span>)}
          <span className="ip-tag">♡ {idea.likes}</span>
        </div>
        <button className="popup-submit" onClick={() => { onClose(); onInterest(idea); }}>
          I'm interested
        </button>
      </div>
    </div>
  );
}

/* ── "I'm interested" popup ─────────────────────────────────── */
function InterestedPopup({ idea, onClose }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg">
            <div className="check">✓</div>
            <h3>Expression sent</h3>
            <p>We'll pass it to the person behind this idea and keep you posted.</p>
          </div>
        ) : (
          <>
            <h2>I'm interested in this idea</h2>
            <p>Tell us a bit about yourself and why this idea speaks to you.</p>
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <select>
              <option value="">Your discipline</option>
              <option>Painting</option><option>Sculpture</option><option>Music</option>
              <option>Dance</option><option>Photography</option><option>Theatre</option>
              <option>Design</option><option>Fashion</option><option>Writing</option><option>Other</option>
            </select>
            <textarea placeholder="Why this idea resonates with you…" />
            <button className="popup-submit" onClick={() => setSent(true)}>Send</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Submit idea form (3-step, gate) ────────────────────────── */
function IdeaFormPopup({ onClose, isLoggedIn, onOpenReg }) {
  const [step, setStep] = useState(isLoggedIn ? 1 : 0);
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="success-msg">
          <div className="check">✓</div>
          <h3>Idea submitted</h3>
          <p>We'll review it and publish it within 48h. You'll get a confirmation by email.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>

        {step === 0 && (
          <>
            <h2>First, create your profile.</h2>
            <p>Only La Mezcla members can post an idea. Create a free artist or collaborator profile to get started.</p>
            <button className="popup-submit" onClick={() => { onClose(); onOpenReg(); }}>Open my profile</button>
            <button className="popup-link" onClick={() => setStep(1)}>I already have a profile</button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="popup-step-label">Step 1 / 3 — The pitch</div>
            <h2>Your idea</h2>
            <p>Give it a working title and describe the intention. Be yourself, not polished.</p>
            <input type="text" placeholder="A working title for your idea" />
            <textarea style={{ minHeight: 120 }} placeholder="What is the idea? Why does it exist? What kind of collaboration are you imagining?" />
            <p style={{ fontSize: ".72rem", color: "var(--soft)", margin: "-.3rem 0 .8rem" }}>
              This is what other members will read first. One strong paragraph is enough.
            </p>
            <div className="popup-actions">
              <button className="popup-btn-sec" onClick={onClose}>Cancel</button>
              <button className="popup-submit" style={{ flex: 1 }} onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="popup-step-label">Step 2 / 3 — The context</div>
            <h2>What is this idea?</h2>
            <select><option value="">Project type</option>
              <option>Installation</option><option>Performance</option><option>Music</option>
              <option>Video</option><option>Photography</option><option>Writing</option>
              <option>Fashion</option><option>Design</option><option>Hybrid project</option>
              <option>Brand project</option><option>Collective project</option><option>Other</option>
            </select>
            <select><option value="">Maturity level</option>
              <option>Intuition</option><option>Concept</option><option>Prototype</option>
              <option>Project in progress</option><option>Already developed project</option>
            </select>
            <select><option value="">What are you looking for?</option>
              <option>Artists</option><option>Place</option><option>Brand</option>
              <option>Production</option><option>Funding</option><option>Audience</option>
              <option>Collaborators</option><option>La Mezcla support</option>
            </select>
            <div className="popup-actions">
              <button className="popup-btn-sec" onClick={() => setStep(1)}>← Back</button>
              <button className="popup-submit" style={{ flex: 1 }} onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="popup-step-label">Step 3 / 3 — Publication</div>
            <h2>Almost there</h2>
            <p>Your email for notifications and contact requests.</p>
            <input type="email" placeholder="Your email" />
            <textarea placeholder="Anything else you want to add? (optional)" />
            <div className="popup-actions">
              <button className="popup-btn-sec" onClick={() => setStep(2)}>← Back</button>
              <button className="popup-submit" style={{ flex: 1 }} onClick={() => setSent(true)}>Submit idea</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Artist registration panel ──────────────────────────────── */
function RegPanel({ onClose }) {
  const [status, setStatus] = useState("");
  const [sent, setSent]     = useState(false);

  const statuses = [
    "Looking for collabs", "Exhibiting", "Available for commissions",
    "Open to brand projects", "Unavailable for now",
  ];

  return (
    <div className="reg-panel">
      <button className="reg-close" onClick={onClose}>×</button>
      <div className="reg-inner">
        {sent ? (
          <div className="success-msg">
            <div className="check">✓</div>
            <h3>Profile submitted</h3>
            <p>We'll review it and publish it within 48h. You'll receive a confirmation by email.</p>
          </div>
        ) : (
          <>
            <h1>Open your artist profile</h1>
            <p className="lead">Create a profile to join the La Mezcla network, submit ideas and connect with collaborators.</p>

            <div className="reg-section-label">Required</div>
            <div className="reg-grid">
              <input className="full" type="text" placeholder="Full name or artist name *" />
              <select className="full">
                <option value="">Discipline(s) *</option>
                <option>Painting</option><option>Sculpture</option><option>Music</option>
                <option>Dance</option><option>Photography</option><option>Theatre</option>
                <option>Design</option><option>Fashion</option><option>Writing</option><option>Other</option>
              </select>
              <textarea className="full" placeholder="Short bio — two or three sentences, in your own words *" />
              <input type="email" placeholder="Email *" />
            </div>

            <div className="reg-section-label">Essential</div>
            <div className="reg-grid">
              <select className="full">
                <option value="">District / arrondissement</option>
                <option>1e</option><option>2e</option><option>3e</option><option>4e</option>
                <option>5e</option><option>6e</option><option>7e</option><option>8e</option>
                <option>9e</option><option>10e</option><option>11e</option><option>12e</option>
                <option>13e</option><option>14e</option><option>15e</option><option>16e</option>
                <option>17e</option><option>18e</option><option>19e</option><option>20e</option>
              </select>
              <input type="url" placeholder="instagram.com/…" />
              <input type="url" placeholder="Website (optional)" />
            </div>

            <div className="reg-section-label" style={{ marginBottom: ".8rem" }}>Status</div>
            <div className="status-pills" style={{ marginBottom: "1.5rem" }}>
              {statuses.map(s => (
                <button
                  key={s}
                  className={`status-pill${status === s ? " sel" : ""}`}
                  onClick={() => setStatus(s)}
                >{s}</button>
              ))}
            </div>

            <div className="reg-section-label">Optional</div>
            <div className="reg-grid">
              <select>
                <option value="">Type of collaboration wanted</option>
                <option>Brand project</option><option>Community project</option>
                <option>Exhibition</option><option>Performance</option><option>Publication</option>
              </select>
              <select>
                <option value="">Working language(s)</option>
                <option>French</option><option>English</option><option>Both</option>
              </select>
              <textarea className="full" placeholder="What inspires me right now…" style={{ minHeight: 70 }} />
              <textarea className="full" placeholder="A past collaboration that marked me…" style={{ minHeight: 70 }} />
              <input className="full" type="text" placeholder="What I never do" />
            </div>

            <button className="reg-publish" onClick={() => setSent(true)}>
              Publish profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════════════════════════ */

/* ── HOME ───────────────────────────────────────────────────── */
function PageHome({ onNav, onOpenLogin, onOpenReg }) {
  return (
    <div className="page on" id="page-home">

      {/* Entry screen */}
      <div className="home-split">
        {/* LEFT */}
        <div className="hl" style={{ backgroundImage: `url('${I.logo}')` }}>
          <div className="hl-overlay" />
          <div className="hl-inner">
            <div className="hl-name">La Mezcla</div>
            <div className="hl-tagbar">
              <span className="hl-tag">Make art with others</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hr">
          <h1 className="hr-title">Everything you need<br />for a good collab.</h1>

          {[
            { img: I.roses,       n: "01 — Artists",     title: "Find the right artist or collaborator for your next project.", desc: "So many creative people out there. So many ways to express ourselves.",   cta: "Explore the network",  page: "artists" },
            { img: I.yellowPurple,n: "02 — The Process",  title: "Start making art with others.",                                desc: "It's art. The process needs to be real. We use strategy to guide the creative collab and we document it.", cta: "Discover the method",   page: "process" },
            { img: I.greenBlur,   n: "03 — Ideas",        title: "Get inspired and find your new art project.",                  desc: "It's not about the lack of them. Here's the proof. It's about guiding the right people to make them.",     cta: "Browse the idea bank", page: "ideas"   },
          ].map(e => (
            <div className="home-entry" key={e.n} onClick={() => onNav(e.page)}>
              <div className="estrip" style={{ backgroundImage: `url('${e.img}')` }} />
              <div className="ebody">
                <div className="enum">{e.n}</div>
                <div className="etitle">{e.title}</div>
                <div className="edesc">{e.desc}</div>
                <button className="ecta">{e.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="phi">
        <p className="phi-intro">We believe in three things.</p>
        <div className="phi-cols">
          <div className="phi-col">
            <h3>We want to<br />make more art.</h3>
            <p>By art, we mean that thing that emerges from creative endeavors. The thing that pushes us further into understanding what the hell is going on. The thing that takes courage and sometimes happens through a chaotic, fun and deep process.</p>
            <p>We want to make more art.</p>
          </div>
          <div className="phi-col">
            <h3>Art has it hard to live<br />in our capitalistic world.</h3>
            <p>Art is richer than ever. People, brands and institutions want more art than ever.</p>
            <p>Art grows in the world. Brands, media and cultural actors use art to elevate communication. The danger is diluting it by mixing it with economic ambition. The good old art vs. capitalism fight.</p>
            <p>La Mezcla is our take on making better mixes. Using advertising to elevate art, not the other way around.</p>
          </div>
          <div className="phi-col">
            <h3>It's all about<br />the process.</h3>
            <p>When mixing complex things, the process becomes crucial.</p>
            <p>Intentions and artistic visions need to be understood strategically so they can be channeled into a shared artistic territory.</p>
            <p>And mixing complex intentions is hard, so the process is key to creating sense, content and meaning. It is the living proof of the honesty and courage behind the artistic intentions.</p>
            <p>We want to use advertising to elevate art. We prove it's real.</p>
          </div>
        </div>
        <div className="phi-strip">
          <div className="phi-strip-img" style={{ backgroundImage: `url('${I.flowersHalf}')` }} />
          <div className="phi-strip-img" style={{ backgroundImage: `url('${I.darkFlowers}')` }} />
          <div className="phi-strip-img" style={{ backgroundImage: `url('${I.lilac}')` }} />
        </div>
      </div>

      {/* Win-win */}
      <div className="winwin">
        <div className="ww-left">
          <h2 className="ww-title">A better mix creates<br />value for everyone.</h2>
          <p className="ww-text">Artists get support, structure and visibility without being reduced to execution.</p>
          <p className="ww-text">Brands are associated with art development instead of simply using art for reach and visibility.</p>
          <p className="ww-text">The public gets to experience something made with intention.</p>
        </div>
        <div className="ww-right">
          <p className="ww-label">What brings you here?</p>
          <button className="ww-btn" onClick={onOpenReg}>I am an artist</button>
          <button className="ww-btn" onClick={() => onNav("artists")}>I want to work with artists</button>
          <button className="ww-btn" onClick={() => onNav("process")}>I come as a brand</button>
        </div>
      </div>

      <Footer onNav={onNav} />
    </div>
  );
}

/* ── ARTISTS ────────────────────────────────────────────────── */
function PageArtists({ onNav, onOpenReg, onOpenLogin }) {
  const [activeArtist,  setActiveArtist]  = useState(null);
  const [contactArtist, setContactArtist] = useState(null);
  const [discipline,    setDiscipline]    = useState("All");
  const [query,         setQuery]         = useState("");

  const disciplines = ["All","Painting","Music","Dance","Photography","Theatre","Design","Fashion","Writing"];

  const filtered = ARTISTS.filter(a => {
    const matchD = discipline === "All" || a.eye.toLowerCase().includes(discipline.toLowerCase());
    const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.bio.toLowerCase().includes(query.toLowerCase());
    return matchD && matchQ;
  });

  return (
    <div className="page on" id="page-artists">
      <ImgHero src={I.darkFlowers} height="tall">
        <p className="slabel">Find the artist for your next project</p>
        <h1 className="mtitle">An artistic network,<br />where projects come to life</h1>
        <p className="mpara">La Mezcla brings together the people who make art and the people who help develop it, to create new collaborative projects.</p>
      </ImgHero>

      <div className="intent-row">
        <button className="ibtn" onClick={onOpenReg}>Join the directory</button>
        <button className="ibtn" onClick={() => onNav("ideas")}>Find a project idea</button>
        <button className="ibtn" onClick={() => onNav("ideas")}>Add an idea</button>
      </div>

      <div className="search-bar">
        <input className="sinput" placeholder="Search a name, a discipline, a word in a bio…"
          value={query} onChange={e => setQuery(e.target.value)} />
        <select className="ssel"><option>All districts</option>
          {["3e","10e","11e","14e","18e","20e"].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="chips-row">
        {disciplines.map(d => (
          <button key={d} className={`chip${discipline === d ? " on" : ""}`}
            onClick={() => setDiscipline(d)}>{d}</button>
        ))}
      </div>

      <div className="artists-grid">
        {filtered.map(a => (
          <div className="artist-card" key={a.id}>
            <div className="artist-img" style={{ backgroundImage: `url('${a.img}')` }}
              onClick={() => setActiveArtist(a)} />
            <div className="artist-body">
              <div className="artist-eye">{a.eye}</div>
              <div className="artist-name">{a.name}</div>
              <p className="artist-bio">{a.bio}</p>
              <div className="artist-foot">
                <span className="artist-tag">{a.status}</span>
                <button className="artist-cta" onClick={() => setActiveArtist(a)}>View profile</button>
                <button className="artist-cta" onClick={() => setContactArtist(a)}>Request contact</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImgHero src={I.roses} height="half">
        <p className="slabel">Art rarely exists in isolation</p>
        <h2 className="mtitle" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
          Open your artist profile →
        </h2>
      </ImgHero>

      <Footer onNav={onNav} />

      {activeArtist  && <ArtistPopup   artist={activeArtist}  onClose={() => setActiveArtist(null)} onRequestContact={a => { setActiveArtist(null); setContactArtist(a); }} />}
      {contactArtist && <RequestContactPopup artist={contactArtist} onClose={() => setContactArtist(null)} />}
    </div>
  );
}

/* ── THE PROCESS ────────────────────────────────────────────── */
function PageProcess({ onNav }) {
  const [formSent, setFormSent] = useState(false);

  return (
    <div className="page on" id="page-process">

      {/* Split banner */}
      <div className="process-banner">
        <div className="pb-left">
          <p className="pb-label">The Process</p>
          <h1 className="pb-title">A brand campaign<br />as an art documentary</h1>
          <p className="pb-sub">We use advertising — strategy, content, creative direction — but this time, to elevate art. To produce it and to share it.</p>
          <p className="pb-sub">The process is where everything is played out to transmit something real.</p>
          <p className="pb-sub">It is how we make sure art can run free in the right direction. It is how we give it meaning and prove it is honest.</p>
        </div>
        <div className="pb-right">
          <h3>La Mezcla has 4 major steps:</h3>
          <ul className="step-list">
            {PROCESS_STEPS.map(s => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <span className="step-name">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4 scroll panels */}
      {PROCESS_STEPS.map((s, i) => (
        <div className={`process-step${i % 2 !== 0 ? " rev" : ""}`} key={s.n}>
          <div className="ps-text">
            <p className="ps-n">{s.n}</p>
            <h2 className="ps-h">{s.name}</h2>
            <p className="ps-obj">{s.objective}</p>
            {s.body.split("\n\n").map((p, j) => <p key={j} className="ps-body">{p}</p>)}
            <ul style={{ listStyle: "none", margin: "0 0 .8rem", padding: 0 }}>
              {s.what.map((w, j) => (
                <li key={j} style={{ fontSize: ".82rem", color: "var(--soft)", lineHeight: 1.5, marginBottom: ".3rem", paddingLeft: "1rem", borderLeft: "2px solid var(--line)" }}>
                  {w}
                </li>
              ))}
            </ul>
            <p className="ps-out">Output — {s.output}</p>
          </div>
          <div className="ps-img" style={{ backgroundImage: `url('${s.img}')` }} />
        </div>
      ))}

      {/* Closing */}
      <div className="process-close">
        <h2>A good collab does not happen by accident.</h2>
        <p>La Mezcla creates the frame, the rhythm and the conditions for artists, brands and collaborators to make something real together.</p>
        <button className="process-close-btn" onClick={() => document.getElementById("brand-form")?.scrollIntoView({ behavior: "smooth" })}>
          Start making art with others
        </button>
      </div>

      {/* Brand contact form */}
      <div className="brand-form-section" id="brand-form">
        <h3>Start a conversation</h3>
        <p>Tell us about your project. We'll come back to you within 5 days.</p>
        {formSent ? (
          <div className="success-msg" style={{ textAlign: "left", padding: "1rem 0" }}>
            <div className="check">✓</div>
            <h3>Message sent</h3>
            <p>We'll be in touch within 5 days.</p>
          </div>
        ) : (
          <div className="brand-form">
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Brand / organization" />
            <input className="full" type="email" placeholder="Email" />
            <textarea className="full" placeholder="What do you want to express?" />
            <textarea className="full" placeholder="What kind of collaboration are you imagining?" />
            <select>
              <option value="">Timeline</option>
              <option>Less than 1 month</option><option>1–3 months</option>
              <option>3–6 months</option><option>6+ months</option><option>Open</option>
            </select>
            <select>
              <option value="">Budget range (optional)</option>
              <option>Under €5k</option><option>€5k–15k</option>
              <option>€15k–50k</option><option>€50k+</option><option>To define</option>
            </select>
            <textarea className="full" placeholder="Anything else you'd like to share?" />
            <button className="brand-submit full" onClick={() => setFormSent(true)}>
              Start the conversation
            </button>
          </div>
        )}
      </div>

      <ImgHero src={I.greenBlur} height="half">
        <p className="slabel">We do not need more means.</p>
        <h2 className="mtitle" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)" }}>
          We need to make better mixes.
        </h2>
      </ImgHero>

      <Footer onNav={onNav} />
    </div>
  );
}

/* ── IDEAS ──────────────────────────────────────────────────── */
function PageIdeas({ onNav, onOpenIdeaForm }) {
  const [activeIdea,  setActiveIdea]  = useState(null);
  const [interestIdea,setInterestIdea]= useState(null);
  const [activeTab,   setActiveTab]   = useState("All");

  const tabs = ["All", "Looking for artists", "Looking for brands", "Submit an idea"];

  return (
    <div className="page on" id="page-ideas">
      <ImgHero src={I.flowers} height="tall">
        <p className="slabel">The Idea Bank</p>
        <h1 className="mtitle">Open ideas to spark<br />new projects.</h1>
        <p className="mpara">A base of creative ideas to explore, join or transform into artistic collaborations.</p>
      </ImgHero>

      <div className="intent-row">
        {tabs.map(t => (
          <button key={t} className={`ibtn${activeTab === t ? " on" : ""}`}
            onClick={() => { if (t === "Submit an idea") onOpenIdeaForm(); else setActiveTab(t); }}>
            {t}
          </button>
        ))}
      </div>

      <div className="ideas-grid">
        {IDEAS.map(idea => (
          <div className="idea-card" key={idea.id}>
            <div className="idea-type">{idea.type}</div>
            <h3 className="idea-title">{idea.title}</h3>
            <p className="idea-desc">{idea.desc}</p>
            <div className="idea-foot">
              <span className="idea-pill">{idea.maturity}</span>
              {idea.seeking.map(s => <span key={s} className="idea-pill">→ {s}</span>)}
              <span className="idea-likes">♡ {idea.likes}</span>
            </div>
            <div className="idea-actions">
              <button className="idea-btn-view" onClick={() => setActiveIdea(idea)}>View idea</button>
              <button className="idea-btn-int"  onClick={() => setInterestIdea(idea)}>I'm interested</button>
            </div>
          </div>
        ))}
      </div>

      <ImgHero src={I.pink} height="half">
        <p className="slabel">Have a project in mind?</p>
        <h2 className="mtitle" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", cursor: "pointer" }}
          onClick={onOpenIdeaForm}>
          Submit your idea →
        </h2>
      </ImgHero>

      <Footer onNav={onNav} />

      {activeIdea   && <IdeaPopup   idea={activeIdea}   onClose={() => setActiveIdea(null)}   onInterest={i => { setActiveIdea(null); setInterestIdea(i); }} />}
      {interestIdea && <InterestedPopup idea={interestIdea} onClose={() => setInterestIdea(null)} />}
    </div>
  );
}

/* ── CONTACT ────────────────────────────────────────────────── */
function PageContact({ onNav, onOpenReg, onOpenLogin }) {
  const intents = [
    { label: "I am an artist",                    action: onOpenReg },
    { label: "I am a brand",                      action: () => onNav("process") },
    { label: "I have an idea",                    action: () => onNav("ideas") },
    { label: "I am looking for an artist",         action: () => onNav("artists") },
    { label: "I want to collaborate with La Mezcla", action: onOpenLogin },
  ];

  return (
    <div className="page on" id="page-contact">
      <div className="contact-hero" style={{ backgroundImage: `url('${I.lilac}')` }}>
        <div className="ov" />
        <div className="tx">
          <p className="slabel">Contact / Join</p>
          <h1 className="mtitle" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>How can we help?</h1>
        </div>
      </div>

      <div className="contact-section">
        <h2>What brings you here?</h2>
        <p>Choose your intention and we'll send you in the right direction.</p>
        <div className="intent-buttons">
          {intents.map(i => (
            <button key={i.label} className="intent-btn" onClick={i.action}>{i.label}</button>
          ))}
        </div>
      </div>

      <Footer onNav={onNav} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════════ */
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin,   setShowLogin]  = useState(false);
  const [showReg,     setShowReg]    = useState(false);
  const [showIdeaFrm, setIdeaFrm]   = useState(false);

  const nav = useCallback(p => {
    navigate(p === "home" ? "/" : "/" + p);
    window.scrollTo(0, 0);
  }, [navigate]);

  const isOn = key =>
    key === "home"
      ? location.pathname === "/"
      : location.pathname.startsWith("/" + key);

  const props = {
    onNav:          nav,
    onOpenLogin:    () => setShowLogin(true),
    onOpenReg:      () => setShowReg(true),
    onOpenIdeaForm: () => setIdeaFrm(true),
  };

  return (
    <>
      <nav className="nav">
        <img
          className="nav-logo"
          src={I.logo}
          alt="La Mezcla"
          onClick={() => nav("home")}
        />
        <div className="nav-links">
          {[
            { key: "artists", label: "Artists"        },
            { key: "process", label: "The Process"    },
            { key: "ideas",   label: "Ideas"          },
            { key: "contact", label: "Contact / Join" },
          ].map(t => (
            <button
              key={t.key}
              className={`nav-tab${isOn(t.key) ? " on" : ""}`}
              onClick={() => nav(t.key)}
            >
              {t.label}
            </button>
          ))}
          <button className="nav-join" onClick={() => setShowReg(true)}>
            Join the network
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/"        element={<PageHome    {...props} />} />
        <Route path="/artists" element={<PageArtists {...props} />} />
        <Route path="/process" element={<PageProcess {...props} />} />
        <Route path="/ideas"   element={<PageIdeas   {...props} />} />
        <Route path="/contact" element={<PageContact {...props} />} />
      </Routes>

      {showLogin   && <LoginPopup    onClose={() => setShowLogin(false)} onOpenReg={() => { setShowLogin(false); setShowReg(true); }} />}
      {showIdeaFrm && <IdeaFormPopup isLoggedIn={false} onClose={() => setIdeaFrm(false)} onOpenReg={() => { setIdeaFrm(false); setShowReg(true); }} />}
      {showReg     && <RegPanel      onClose={() => setShowReg(false)} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
