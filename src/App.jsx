import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  X,
  Mail,
  Link as LinkIcon,
  Image as ImageIcon,
  LogIn,
  LogOut,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./App.css";

const DISCIPLINES = [
  "Peinture",
  "Sculpture",
  "Musique",
  "Danse",
  "Photographie",
  "Théâtre",
  "Design",
  "Mode",
  "Écriture",
  "Autre",
];

const AVAILABILITY = [
  { value: "collab", label: "Cherche collab" },
  { value: "expose", label: "Expose en ce moment" },
  { value: "commande", label: "Dispo sur commande" },
  { value: "indisponible", label: "Indisponible" },
];

const ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => i + 1);

function AvailabilityTag({ value }) {
  const item = AVAILABILITY.find((a) => a.value === value);
  if (!item) return null;
  const tone = value === "indisponible" ? "off" : "on";
  return <span className={`avail-tag avail-${tone}`}>{item.label}</span>;
}

function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <p className="empty-eyebrow">000 résultats</p>
      <h3>Rien par ici, encore.</h3>
      <p>Changez les filtres, ou soyez le premier nom du dossier.</p>
      <button className="btn btn-primary" onClick={onAdd}>
        Ajouter un artiste <ArrowUpRight size={15} />
      </button>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast">{message}</div>;
}

function LoginPanel({ onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendLink = async () => {
    setSending(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setSending(false);
    if (error) setError("Une erreur est survenue. Réessayez.");
    else setSent(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card login-card" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
        {sent ? (
          <>
            <CheckCircle2 size={28} color="var(--coral-deep)" />
            <h2>Vérifiez votre boîte mail</h2>
            <p className="muted">
              On a envoyé un lien de connexion à <strong>{email}</strong>. Cliquez-le pour revenir
              ici, connecté·e.
            </p>
          </>
        ) : (
          <>
            <span className="eyebrow">Connexion</span>
            <h2>Identifiez-vous</h2>
            <p className="muted">
              Recevez un lien de connexion par e-mail, sans mot de passe. Il vous ramènera
              directement ici.
            </p>
            <label className="field">
              <span>Nom</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button
              className="btn btn-primary full"
              disabled={!email.includes("@") || !name.trim() || sending}
              onClick={sendLink}
            >
              {sending ? "Envoi…" : "Recevoir le lien"} <LogIn size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ArtistForm({ onSave, onClose, contributorName, saving }) {
  const [form, setForm] = useState({
    name: "",
    disciplines: [],
    arrondissement: 1,
    bio: "",
    email: "",
    social: "",
    availability: "collab",
    cover: "",
    gallery: ["", "", ""],
  });

  const toggleDiscipline = (d) =>
    setForm((f) => ({
      ...f,
      disciplines: f.disciplines.includes(d)
        ? f.disciplines.filter((x) => x !== d)
        : [...f.disciplines, d],
    }));

  const setGalleryItem = (i, val) =>
    setForm((f) => {
      const g = [...f.gallery];
      g[i] = val;
      return { ...f, gallery: g };
    });

  const canSave = form.name.trim() && form.disciplines.length > 0 && form.email.includes("@");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card form-card" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
        <span className="eyebrow">Connecté·e comme {contributorName}</span>
        <h2>Ouvrez votre fiche</h2>

        <label className="field">
          <span>Nom de l'artiste</span>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nom complet ou nom de scène"
          />
        </label>

        <div className="field">
          <span>Discipline</span>
          <div className="chip-row">
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                type="button"
                className={`chip ${form.disciplines.includes(d) ? "chip-active" : ""}`}
                onClick={() => toggleDiscipline(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Arrondissement</span>
            <select
              value={form.arrondissement}
              onChange={(e) => setForm((f) => ({ ...f, arrondissement: Number(e.target.value) }))}
            >
              {ARRONDISSEMENTS.map((n) => (
                <option key={n} value={n}>
                  {n}e
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Disponibilité</span>
            <select
              value={form.availability}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
            >
              {AVAILABILITY.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Bio courte</span>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Deux ou trois phrases, dans vos mots"
            rows={3}
            maxLength={280}
          />
          <span className="hint">{280 - form.bio.length} caractères restants</span>
        </label>

        <div className="field-row">
          <label className="field">
            <span>E-mail de contact</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="contact@artiste.com"
            />
          </label>
          <label className="field">
            <span>Réseaux / site</span>
            <input
              value={form.social}
              onChange={(e) => setForm((f) => ({ ...f, social: e.target.value }))}
              placeholder="instagram.com/..."
            />
          </label>
        </div>

        <label className="field">
          <span>Photo de couverture (URL)</span>
          <input
            value={form.cover}
            onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
            placeholder="https://..."
          />
        </label>

        <div className="field">
          <span>Série d'œuvres (jusqu'à 3 URLs)</span>
          {form.gallery.map((g, i) => (
            <input
              key={i}
              className="gallery-input"
              value={g}
              onChange={(e) => setGalleryItem(i, e.target.value)}
              placeholder={`https://... (image ${i + 1})`}
            />
          ))}
        </div>

        <button
          className="btn btn-primary full"
          disabled={!canSave || saving}
          onClick={() => onSave({ ...form, gallery: form.gallery.filter(Boolean) })}
        >
          {saving ? "Publication…" : "Publier la fiche"} <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

function ArtistDetail({ artist, onClose, onDelete, isOwner, deleting }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
        <span className="eyebrow">
          {artist.disciplines.join(" · ")} — {artist.arrondissement}e
        </span>
        <h2>{artist.name}</h2>
        <AvailabilityTag value={artist.availability} />
        {artist.cover && (
          <img className="detail-cover" src={artist.cover} alt={`Photo de couverture de ${artist.name}`} />
        )}
        {artist.bio && <p className="detail-bio">{artist.bio}</p>}
        <div className="detail-contact">
          {artist.email && (
            <a href={`mailto:${artist.email}`} className="contact-link">
              <Mail size={14} /> {artist.email}
            </a>
          )}
          {artist.social && (
            <span className="contact-link">
              <LinkIcon size={14} /> {artist.social}
            </span>
          )}
        </div>
        {artist.gallery && artist.gallery.length > 0 && (
          <div className="detail-gallery">
            {artist.gallery.map((g, i) => (
              <img key={i} src={g} alt={`Œuvre ${i + 1} de ${artist.name}`} />
            ))}
          </div>
        )}
        {isOwner && (
          <button className="btn btn-ghost danger" disabled={deleting} onClick={() => onDelete(artist.id)}>
            <Trash2 size={14} /> {deleting ? "Suppression…" : "Retirer ma fiche"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDisciplines, setActiveDisciplines] = useState([]);
  const [arrFilter, setArrFilter] = useState("all");
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Auth: récupère la session existante, puis écoute les changements (ex: clic sur le lien magique)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) {
        setShowLogin(false);
        setShowForm(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Données : chargement initial + recharge après mutation
  const fetchArtists = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setArtists(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filtered = useMemo(() => {
    return artists.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.bio?.toLowerCase().includes(search.toLowerCase());
      const matchesDiscipline =
        activeDisciplines.length === 0 || a.disciplines?.some((d) => activeDisciplines.includes(d));
      const matchesArr = arrFilter === "all" || a.arrondissement === Number(arrFilter);
      return matchesSearch && matchesDiscipline && matchesArr;
    });
  }, [artists, search, activeDisciplines, arrFilter]);

  const toggleFilterDiscipline = (d) =>
    setActiveDisciplines((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const handleAddClick = () => (session ? setShowForm(true) : setShowLogin(true));

  const contributorName =
    session?.user?.user_metadata?.full_name || session?.user?.email || "vous";

  const handleSave = async (form) => {
    setSaving(true);
    const { error } = await supabase.from("artists").insert([
      {
        ...form,
        contributor_id: session.user.id,
        contributor_name: contributorName,
      },
    ]);
    setSaving(false);
    if (error) {
      setToast("Échec de la publication. Réessayez.");
      return;
    }
    setShowForm(false);
    setToast(`Fiche de ${form.name} publiée`);
    fetchArtists();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const { error } = await supabase.from("artists").delete().eq("id", id);
    setDeleting(false);
    if (error) {
      setToast("Échec de la suppression.");
      return;
    }
    setSelected(null);
    setToast("Fiche retirée");
    fetchArtists();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="lm-root">
      <div className="grain-overlay" />

      <nav className="nav">
        <img className="nav-logo" src="/logo.png" alt="La Mezcla" />
        <div className="nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Galerie</button>
          <button className="nav-cta" onClick={handleAddClick}>
            Ajouter <Plus size={13} />
          </button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-photo" />
        <div className="hero-duotone" />
        <div className="hero-vignette" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Annuaire ouvert · Paris</p>
          <h1>
            Des artistes qui <em>font</em> Paris,<br /><span className="hero-italic">en mouvement</span>
          </h1>
          <p>
            La Mezcla rassemble les voix créatives de la ville — peinture, musique, danse, et tout le reste.
            Parcourez le catalogue, ou ouvrez votre propre fiche.
          </p>
        </div>
      </header>

      <div className="controls">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Chercher un nom, un mot dans une bio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="arr-select" value={arrFilter} onChange={(e) => setArrFilter(e.target.value)}>
          <option value="all">Tous arrondissements</option>
          {ARRONDISSEMENTS.map((n) => (
            <option key={n} value={n}>
              {n}e arrondissement
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Ajouter un artiste <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="discipline-filters">
        {DISCIPLINES.map((d) => (
          <button
            key={d}
            className={`chip ${activeDisciplines.includes(d) ? "chip-active" : ""}`}
            onClick={() => toggleFilterDiscipline(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {session && (
        <div className="contributor-bar">
          <span>Connecté·e comme {contributorName}</span>
          <button className="icon-btn" onClick={handleLogout} title="Se déconnecter">
            <LogOut size={15} />
          </button>
        </div>
      )}

      {!loading && filtered.length === 0 && <EmptyState onAdd={handleAddClick} />}

      <div className="catalog">
        {filtered.map((a, i) => (
          <div className={`card ${i === 0 ? "feature" : ""}`} key={a.id} onClick={() => setSelected(a)}>
            {a.cover ? (
              <img className="card-media" src={a.cover} alt={`Couverture de ${a.name}`} />
            ) : (
              <div className="card-media-fallback">
                <ImageIcon size={28} />
              </div>
            )}
            <div className="card-caption">
              <span className="card-eyebrow">
                {a.disciplines?.join(" · ")} — {a.arrondissement}e
              </span>
              <h3 className="card-name">{a.name}</h3>
              {a.bio && <p className="card-bio">{a.bio}</p>}
              <AvailabilityTag value={a.availability} />
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <h2>De nouvelles voix<br />commencent par un message.</h2>
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); handleAddClick(); }}>Rejoindre l'annuaire</a>
          <span>Paris, FR</span>
        </div>
      </footer>

      {showLogin && <LoginPanel onClose={() => setShowLogin(false)} />}
      {showForm && session && (
        <ArtistForm
          contributorName={contributorName}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
      {selected && (
        <ArtistDetail
          artist={selected}
          isOwner={session?.user?.id === selected.contributor_id}
          deleting={deleting}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
