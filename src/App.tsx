import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const A = "/assets/";

const icons = {
  arrow: `${A}landing-arrow.svg`,
  arrowDark: `${A}landing-arrow-dark.svg`,
  award: `${A}acd8c.svg`,
  bell: `${A}ddd83.svg`,
  bookmark: `${A}e5aa3.svg`,
  chevron: `${A}9fe35.svg`,
  chevronSort: `${A}a76b5.svg`,
  device: `${A}bc6e4.svg`,
  flask: `${A}36b07.svg`,
  flaskDark: `${A}e6519.svg`,
  heart: `${A}6c993.svg`,
  heartLanding: `${A}landing-heart-b.svg`,
  heartDark: `${A}landing-heart-a.svg`,
  heartPopular: `${A}5b94a.svg`,
  heartFeed: `${A}ea78e.svg`,
  heartFeedMuted: `${A}1121f.svg`,
  heroMask: `${A}landing-hero-mask.svg`,
  home: `${A}fa874.svg`,
  image: `${A}fae44.svg`,
  map: `${A}19bae.svg`,
  mapDark: `${A}332e6.svg`,
  nail: `${A}landing-nail.svg`,
  nailDark: `${A}9eae9.svg`,
  palette: `${A}3723e.svg`,
  pagination: `${A}f04c1.svg`,
  search: `${A}e83af.svg`,
  searchDark: `${A}ca9d4.svg`,
  settings: `${A}5ef03.svg`,
  sparkle: `${A}4a425.svg`,
  user: `${A}6419a.svg`,
};

type Navigate = (route: string) => void;
const getRoute = () => window.location.hash.replace(/^#\/?/, "");

function Brand({ onClick, compact = false }: { onClick?: () => void; compact?: boolean }) {
  return (
    <button className={`brand ${compact ? "brand-compact" : ""}`} onClick={onClick} aria-label="Home">
      <span className="brand-mark">T</span>
      {!compact && (
        <span className="brand-copy">
          <strong>NailBoard</strong>
          <small>Find your next nail look</small>
        </span>
      )}
    </button>
  );
}

const GENERIC_TAGS = ["Shape", "Style", "Occasion"] as const;

const landingCollections = [
  { key: "halloween", title: "Halloween · playful", subtitle: "Find the perfect nail look for your special day" },
  { key: "french", title: "French · minimal", subtitle: "Creative nail art that makes a statement" },
  { key: "floral", title: "Floral · sheer", subtitle: "Versatile looks for every day" },
] as const;

function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function CollectionCard({ index, onOpen }: { index: number; onOpen: () => void }) {
  return (
    <article className="collection-card" onClick={onOpen} role="link" tabIndex={0}>
      <div className={`placeholder cover shade-${index % 4}`}>image</div>
      <div className="collection-info">
        <strong>Nail Design Title</strong>
        <Tags tags={GENERIC_TAGS} />
        <div className="card-meta">
          <UserHover className="author"><i>U</i>Username</UserHover>
          <span className="likes"><img src={index === 0 ? icons.heartDark : icons.heartLanding} alt="" />1.2K</span>
        </div>
      </div>
    </article>
  );
}

type AuthMode = "login" | "register";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate(email: string, password: string) {
  if (!emailOk(email)) return "Please enter a valid email address";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
}

function AuthModal({ mode, onMode, onClose, onDone }: { mode: AuthMode; onMode: (m: AuthMode) => void; onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => setError(""), [mode]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = !email.trim()
      ? `Please enter your ${register ? "phone number or email" : "email address"}`
      : password.length < 8 || password.length > 20
        ? "Password must be 8–20 characters"
        : register && !agreed
            ? "Please agree to the User Agreement and Privacy Policy"
            : "";
    setError(msg);
    if (!msg) onDone();
  };
  const register = mode === "register";
  const benefits = [
    ["✦", "Endless nail inspiration"],
    ["◈", "Make a design your own"],
    ["◇", "Save your inspiration"],
  ];
  return (
    <div className="auth-overlay" onMouseDown={onClose}>
      <form className={`auth-dialog ${register ? "register" : "login"}`} role="dialog" aria-modal="true" aria-label={register ? "Sign up" : "Log in"} onMouseDown={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <aside className="auth-brand-panel">
          <div className="auth-brand-intro"><i>T</i><strong>Brand name</strong><small>Tagline</small></div>
          <div className="auth-preview-grid">{[0, 1, 2, 3].map((item) => <span key={item}>image</span>)}</div>
          <div className="auth-benefits">{benefits.map(([icon, title]) => <div key={title}><i>{icon}</i><strong>{title}</strong></div>)}</div>
        </aside>
        <section className="auth-content">
          <button type="button" className="auth-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="auth-tabs">
            <button type="button" className={!register ? "active" : ""} onClick={() => onMode("login")}>Log in</button>
            <button type="button" className={register ? "active" : ""} onClick={() => onMode("register")}>Sign up</button>
          </div>
          <header><h2>{register ? "Create your account" : "Welcome back"}</h2><p>{register ? "Sign up to save inspiration, follow creators, and share designs" : "Log in to explore more inspiration and start creating"}</p></header>
          <div className="auth-fields">
            <label><span>{register ? "Phone / email" : "Email address"}</span><input autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder={register ? "Enter your phone number or email" : "Enter your email"} /></label>
            <label>
              <span>Password{!register && <button type="button">Forgot password?</button>}</span>
              <div className="auth-password"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={register ? "Create a password (8–20 characters)" : "Enter your password"} />{!register && <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>○</button>}</div>
            </label>
          </div>
          {register ? (
            <label className="auth-check"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />I agree to the User Agreement and Privacy Policy</label>
          ) : (
            <div className="auth-assists"><label className="auth-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label><button type="button">Log in with a code</button></div>
          )}
          {error && <span className="auth-error" role="alert">{error}</span>}
          <button type="submit" className="auth-submit">{register ? "Sign up" : "Log in"}</button>
          <div className="auth-or"><span />or<span /></div>
          <button type="button" className="auth-google">Continue with Google</button>
          <p className="auth-switch">{register ? "Already have an account? " : "New here? "}<button type="button" onClick={() => onMode(register ? "login" : "register")}>{register ? "Log in" : "Sign up"}</button></p>
          <small className="auth-legal">By {register ? "signing up" : "logging in"}, you agree to our Terms of Service and Privacy Policy</small>
        </section>
      </form>
    </div>
  );
}

function Landing({ navigate }: { navigate: Navigate }) {
  const featureCards = [
    {
      icon: icons.search,
      title: "Discover inspiration",
      text: "Explore nail art by creators. Find inspiration by style, occasion, and nail shape.",
      sample: ["Example: gradient French tips", "Example: nude almond nails"],
      action: "Explore designs",
    },
    {
      icon: icons.nail,
      title: "Design your own",
      text: "Create your own nail designs in Design Studio.",
      note: "Sign up to get started. No hardware required.",
      sample: ["Example: Studio canvas (screenshot coming soon)"],
      action: "Start designing",
    },
    {
      icon: icons.flask,
      title: "Bring designs to life",
      text: "See how companion hardware turns your digital designs into finished nail art.",
      sample: ["Software-to-hardware workflow (to be confirmed)"],
      action: "Explore hardware",
    },
  ];

  const [auth, setAuth] = useState<AuthMode | null>(null);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const requireLogin = (action: () => void) => {
    if (loggedIn) return action();
    setPending(() => action);
    setAuth("register");
  };
  const goStudio = () => requireLogin(() => navigate("community"));
  const goDevice = () => document.getElementById("device-setup")?.scrollIntoView({ behavior: "smooth", block: "center" });
  const goHardware = () => requireLogin(goDevice);
  const actions: Record<string, () => void> = { "Explore designs": () => navigate("community"), "Start designing": goStudio, "Explore hardware": goHardware };
  const finishAuth = () => {
    setLoggedIn(true);
    setAuth(null);
    pending?.();
    setPending(null);
  };
  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(email, password);
    setFormError(msg);
    if (!msg) finishAuth();
  };

  return (
    <div className="landing-page">
      {auth && <AuthModal mode={auth} onMode={setAuth} onClose={() => { setAuth(null); setPending(null); }} onDone={finishAuth} />}
      <header className="landing-header">
        <Brand />
        <div className="auth-actions">
          {loggedIn ? (
            <button className="button primary" onClick={() => navigate("community")}>Go to community</button>
          ) : (
            <>
              <button className="button secondary" onClick={() => setAuth("login")}>Log in</button>
              <button className="button primary" onClick={() => setAuth("register")}>Sign up free</button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1>Find your next nail look</h1>
              <p>
                Explore nail art, create your own looks in Design Studio, and bring them to life with companion hardware.
                <br />
                Browse freely. Sign up to start designing.
              </p>
              <div className="hero-actions">
                <button className="button hero-primary" onClick={() => navigate("community")}>Explore designs</button>
                <button className="button hero-secondary" onClick={goHardware}>Explore companion hardware</button>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-intro centered">
            <h2>Discover, design, create</h2>
            <p>From inspiration to your own designs—bring them to life with companion hardware.</p>
          </div>
          <div className="feature-grid">
            {featureCards.map((item) => (
              <article className="feature-card" key={item.title} id={item.action === "Explore hardware" ? "device-setup" : undefined}>
                <div className="feature-title"><span><img src={item.icon} alt="" /></span><strong>{item.title}</strong></div>
                <div><p>{item.text}</p>{item.note && <small>{item.note}</small>}</div>
                <div className={`feature-samples ${item.sample.length === 1 ? "single" : ""}`}>
                  {item.sample.map((text) => <span key={text}>image</span>)}
                </div>
                <button className="text-link" onClick={actions[item.action]}>
                  {item.action}<img src={icons.arrow} alt="" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="collections">
          {landingCollections.map((collection, sectionIndex) => (
            <div className="collection-section" key={collection.title}>
              <div className="collection-heading">
                <div><h2>{collection.title}</h2><p>{collection.subtitle}</p></div>
                <button className="text-link" onClick={() => navigate(`collection/${collection.key}`)}>View all<img src={icons.arrowDark} alt="" /></button>
              </div>
              <div className="collection-grid">
                {[0, 1, 2, 3].map((index) => <CollectionCard key={index} index={index + sectionIndex} onOpen={() => navigate(`design/${collection.key}-${index}`)} />)}
              </div>
            </div>
          ))}
          <div className="collections-fade" />
        </section>

        <section className="signup">
          <div className="style-wall">
            <h2>Discover your own nail style</h2>
            <div className="style-row">
              {["French ombre", "Amethyst cat-eye", "Nude almond", "Silver & black lines"].map((x) => <span key={x}>image</span>)}
            </div>
            <div className="style-row five">
              {["Minimal cream", "Red & gold heritage", "Punk crystals", "White bridal crystals", "Sheer gray square"].map((x) => <span key={x}>image</span>)}
            </div>
          </div>
          <form className="signup-form" onSubmit={submitSignup} noValidate>
            <h2>Welcome to Tint</h2>
            <p>Sign up free to explore nail inspiration and create your own looks in Design Studio.</p>
            <input aria-label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input aria-label="Password" placeholder="Create a password (8+ characters)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {formError && <span className="form-error" role="alert">{formError}</span>}
            <button type="submit">{loggedIn ? "Signed up · Go to community" : "Sign up free"}</button>
            <div className="or"><span />or<span /></div>
            <button type="button" className="google-button" onClick={() => setAuth("register")}>Continue with Google</button>
            <p className="login-note">Already have an account? <b role="button" tabIndex={0} onClick={() => setAuth("login")}>Log in</b></p>
            <small>By signing up, you agree to our Terms of Service and Privacy Policy.</small>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const columns = [
    ["Explore", "Weddings & celebrations", "Bold & expressive", "Everyday & minimal", "All designs"],
    ["Tools & creation", "Design Studio", "Companion hardware", "Become a creator", "Design upload guide"],
    ["About", "About NailBoard", "Help & support", "Contact us"],
    ["Policies", "Terms of Service", "Privacy Policy", "Cookie settings"],
  ];
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand"><strong><i>T</i>Tint Nail Printer</strong><p>Find your next nail look.<br />Explore and create nail inspiration.</p></div>
        {columns.map(([title, ...items]) => (
          <div className="footer-column" key={title}><strong>{title}</strong>{items.map((x) => <span key={x}>{x}</span>)}</div>
        ))}
      </div>
      <div className="copyright">© 2026 Tint Nail Printer</div>
    </footer>
  );
}

const C = {
  back: `${A}c2c4c.svg`,
  heart: `${A}849d2.svg`,
  cardHeart: `${A}1989c.svg`,
  cardHeartFilled: `${A}card-heart-filled.svg`,
  cardSave: `${A}9b93d.svg`,
  cardSaveFilled: `${A}card-bookmark-filled.svg`,
  userPlus: `${A}e66d7.svg`,
  heartLg: `${A}1e41e.svg`,
  message: `${A}d9d55.svg`,
  save: `${A}76ba1.svg`,
  share: `${A}3acdf.svg`,
  heartSm: `${A}6d796.svg`,
  heartXs: `${A}4bd8f.svg`,
  close: `${A}4f2fa.svg`,
  left: `${A}62df6.svg`,
  right: `${A}56c77.svg`,
  chevron: `${A}45aee.svg`,
};

const M = {
  inbox: `${A}20d4b.svg`,
  heart: `${A}2bee3.svg`,
  comment: `${A}722d9.svg`,
  userPlus: `${A}7cac4.svg`,
  system: `${A}c519d.svg`,
  message: `${A}2d902.svg`,
  plus: `${A}90460.svg`,
  user: `${A}885b1.svg`,
  more: `${A}81a30.svg`,
  image: `${A}aa20e.svg`,
  close: `${A}993c4.svg`,
  search: `${A}51d78.svg`,
  sendLight: `${A}33981.svg`,
  sendDark: `${A}a9db5.svg`,
};

type Design = readonly [string, readonly string[], string, string, string];

const collections: Record<string, { title: string; cards: readonly Design[] }> = {
  halloween: {
    title: "Halloween · playful",
    cards: [
      ["Classic French Tips", ["Classic", "Everyday", "Solid color"], "A", "Username", "128"],
      ["Romantic Florals", ["Floral", "Wedding", "3D"], "B", "Username", "256"],
      ["Minimal Geometry", ["Geometric", "Everyday", "Line art"], "C", "Username", "89"],
      ["Fresh Seaside Nails", ["Fresh", "Seaside", "Rhinestones"], "D", "Username", "342"],
      ["Dark punk", ["Punk", "Night out", "Chrome"], "E", "Username", "57"],
      ["Elegant Rhinestones", ["Elegant", "Evening", "Rhinestones"], "F", "Username", "203"],
    ],
  },
  french: {
    title: "French · minimal",
    cards: [
      ["Moonlight Almond Ombre", ["Almond", "Ombre", "Everyday"], "A", "Luna Nail Lab", "128"],
      ["Minimal White Square Nails", ["Square", "Minimal", "Work"], "B", "Mia Studio", "256"],
      ["Everyday Pink Round Nails", ["Round", "Everyday", "Travel"], "C", "Coco Nail", "89"],
      ["Earth-Tone Square Nails", ["Square", "Earth tones", "Fall / winter"], "D", "Nana Art", "342"],
      ["Fresh Mint Flared Nails", ["Flared", "Fresh", "Spring / summer"], "E", "Olive Studio", "57"],
      ["After-Dark Squoval Nails", ["Mixed shape", "After dark", "Evening"], "F", "Ruby Nail", "203"],
    ],
  },
  floral: {
    title: "Floral · sheer",
    cards: [
      ["Seaside Bridal Nails", ["Seaside", "Fresh", "Almond"], "A", "Luna Nail Lab", "128"],
      ["Night-Market Street Style", ["Night market", "Punk", "Square"], "B", "Urban Nail", "256"],
      ["Scenic Getaway Nails", ["Travel", "Fresh", "Square"], "C", "Horizon Studio", "89"],
      ["Workday Nail Look", ["Office", "Understated", "Square"], "D", "Office Chic", "342"],
      ["Evening Gala Nails", ["Evening", "Elegant", "Almond"], "E", "Gala Beauty", "57"],
      ["Travel Street Style", ["Travel", "Casual", "Square"], "F", "Travel Nail", "203"],
    ],
  },
};
collections.wedding = { title: "Wedding", cards: collections.floral.cards };

const popular: readonly Design[] = [
  ["Popular Nail Design", ["Almond", "French"], "A", "Username", "1,024"],
  ["Recommended Nail Design", ["Wedding", "Elegant"], "B", "Username", "856"],
  ["New Nail Design", ["Seaside", "Fresh"], "C", "Username", "612"],
];
const feed: readonly Design[] = [
  ["Nail Design Title", ["Elements", "Style", "Occasion", "Shape"], "A", "Username", "128"],
  ["Nail Design Title", ["Elements", "Style", "Occasion"], "B", "Username", "256"],
  ["Nail Design Title", ["Elements", "Style", "Occasion"], "C", "Username", "89"],
  ["Nail Design Title", ["Elements", "Style"], "D", "Username", "342"],
  ["Nail Design Title", ["Elements", "Style", "Occasion", "Shape"], "E", "Username", "57"],
  ["Nail Design Title", ["Elements", "Style", "Occasion", "Shape"], "F", "Username", "203"],
];

function ProfilePopover({ floating = false }: { floating?: boolean }) {
  const [following, setFollowing] = useState(false);
  const openCreator = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if ("key" in event && (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " "))) return;
    event.preventDefault();
    event.stopPropagation();
    window.location.hash = "/creator/username";
  };
  return (
    <div className={floating ? "profile-pop floating" : "profile-pop"} role="link" tabIndex={0} onClick={openCreator} onKeyDown={openCreator}>
      <div className="profile-top">
        <div className="profile-id"><i>U</i><div><strong>Username</strong><small>@username</small></div></div>
        <div className="profile-stats">
          {[["2.4k", "Followers"], ["8.1k", "Likes"], ["36", "Designs"]].map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <button className={following ? "follow on" : "follow"} onClick={(event) => { event.stopPropagation(); setFollowing(!following); }}>
          {!following && <img src={C.userPlus} alt="" />}{following ? "Following" : "Follow"}
        </button>
      </div>
      <div className="profile-recent"><p>Recent Designs</p><div>{[0, 1, 2].map((n) => <span key={n}><em>Image</em></span>)}</div></div>
    </div>
  );
}

function UserHover({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const target = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number; above: boolean } | null>(null);
  const openCreator = (event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
    if ("key" in event && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    window.location.hash = "/creator/username";
  };
  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  };
  const open = () => {
    cancelClose();
    const rect = target.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      left: Math.max(12, Math.min(rect.left - 4, window.innerWidth - 292)),
      top: rect.top > 300 ? rect.top - 8 : rect.bottom + 8,
      above: rect.top > 300,
    });
  };
  const close = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setPosition(null), 120);
  };
  useEffect(() => () => cancelClose(), []);
  return (
    <>
      <span
        ref={target}
        className={`user-hover-target ${className}`.trim()}
        role="link"
        tabIndex={0}
        onClick={openCreator}
        onKeyDown={openCreator}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
      >
        {children}
      </span>
      {position && createPortal(
        <div className={position.above ? "global-profile-pop above" : "global-profile-pop"} style={{ left: position.left, top: position.top }} onMouseEnter={cancelClose} onMouseLeave={close}>
          <ProfilePopover floating />
        </div>,
        document.body,
      )}
    </>
  );
}

function DesignCard({ prominent = false, onOpen }: { item?: Design; prominent?: boolean; onOpen: () => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <article className={prominent ? "community-card popular-card" : "community-card"} onClick={onOpen} role="link" tabIndex={0} onKeyDown={(e) => e.target === e.currentTarget && e.key === "Enter" && onOpen()}>
      <div className="community-image img-ph">
        <em>Image</em>
        <button
          aria-label={saved ? "Remove from saved" : "Save design"}
          aria-pressed={saved}
          className={saved ? "card-save on" : "card-save"}
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          type="button"
        >
          <img src={saved ? C.cardSaveFilled : C.cardSave} alt="" />
        </button>
      </div>
      <div className="community-info">
        <strong>Nail Design Title</strong>
        <Tags tags={GENERIC_TAGS} />
        <div className="card-meta">
          <UserHover className="author"><i>U</i>Username</UserHover>
          <button
            aria-label={liked ? "Unlike design" : "Like design"}
            aria-pressed={liked}
            className={liked ? "likes card-like on" : "likes card-like"}
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            type="button"
          >
            <img src={liked ? C.cardHeartFilled : C.cardHeart} alt="" />1.2K
          </button>
        </div>
      </div>
    </article>
  );
}

type FilterKind = "shape" | "style" | "occasion";
type SearchState = Record<FilterKind, string> & { query: string };

const emptySearchState: SearchState = { query: "", shape: "", style: "", occasion: "" };

function SearchBar({ initial = emptySearchState, navigate }: { initial?: SearchState; navigate: Navigate }) {
  const [open, setOpen] = useState<"search" | FilterKind | null>(null);
  const [query, setQuery] = useState(initial.query);
  const [recent, setRecent] = useState(["French ombre", "Cat-eye nails", "Fall / winter colors", "Creamy tones", "Japanese short nails"]);
  const [selected, setSelected] = useState<Record<FilterKind, string>>({ shape: initial.shape, style: initial.style, occasion: initial.occasion });
  const trending = ["French ombre", "Spring cherry blossom nails", "Sheer nude", "Miniature sculpted details", "Mirror silver", "Balletcore", "Vintage plaid", "Soft gray"];
  const filters: { kind: FilterKind; icon: string; label: string }[] = [
    { kind: "shape", icon: `${A}account-fc96a.svg`, label: "Shape" },
    { kind: "style", icon: `${A}account-4b14a.svg`, label: "Style" },
    { kind: "occasion", icon: `${A}account-f7b2e.svg`, label: "Occasion" },
  ];
  useEffect(() => {
    setQuery(initial.query);
    setSelected({ shape: initial.shape, style: initial.style, occasion: initial.occasion });
  }, [initial.query, initial.shape, initial.style, initial.occasion]);
  const run = (q: string) => {
    const next = { query: q.trim(), ...selected };
    if (!next.query && !Object.values(selected).some(Boolean)) return;
    setQuery(next.query);
    if (next.query) setRecent((r) => [next.query, ...r.filter((x) => x !== next.query)].slice(0, 8));
    setOpen(null);
    navigate(`search/${encodeURIComponent(JSON.stringify(next))}`);
  };
  const clearFilters = () => setSelected({ shape: "", style: "", occasion: "" });
  const selectedFilters = Object.entries(selected).filter((entry): entry is [FilterKind, string] => Boolean(entry[1]));
  return (
    <div className="search-wrap" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(null)}>
      <form className={`search-filter${open ? " active" : ""}${open === "search" ? " search-active" : ""}${selectedFilters.length ? " has-filters" : ""}`} onSubmit={(e) => { e.preventDefault(); run(query); }}>
        <label><img src={`${A}account-af6ef.svg`} alt="" /><input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen("search")} placeholder="Search designs, styles, creators" /></label>
        {filters.map((filter) => (
          <div className="filter-anchor" key={filter.kind}>
            <Filter
              active={open === filter.kind}
              chevronIcon={icons.chevron}
              icon={filter.icon}
              onClick={() => setOpen(open === filter.kind ? null : filter.kind)}
              selected={Boolean(selected[filter.kind])}
              text={selected[filter.kind] || filter.label}
            />
            {open === filter.kind && (
              <FilterPanel
                kind={filter.kind}
                selected={selected[filter.kind]}
                onApply={() => setOpen(null)}
                onClear={() => setSelected((current) => ({ ...current, [filter.kind]: "" }))}
                onSelect={(value) => setSelected((current) => ({ ...current, [filter.kind]: value }))}
              />
            )}
          </div>
        ))}
        <button className={`search-button${query.trim() || selectedFilters.length ? " selected" : ""}`} type="submit">Search</button>
      </form>
      {open === "search" && (
        <div className="search-drop" tabIndex={-1}>
          {selectedFilters.length > 0 && (
            <div className="drop-block selected-block">
              <div className="drop-head">
                <span>Selected filters</span>
                <div className="drop-actions">
                  <button className="clear-pill" type="button" onClick={clearFilters}>Clear</button>
                  <button className="apply-pill" type="button" onClick={() => setOpen(null)}>Apply</button>
                </div>
              </div>
              <div className="drop-chips">
                {selectedFilters.map(([kind, value]) => (
                  <span className="chip selected-chip" key={kind}>
                    {value}
                    <button type="button" aria-label={`Remove ${value}`} onClick={() => setSelected((current) => ({ ...current, [kind]: "" }))}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="drop-block">
            <div className="drop-head"><span>Recent searches</span>{recent.length > 0 && <button type="button" onClick={() => setRecent([])}>Clear</button>}</div>
            <div className="drop-chips">
              {recent.length ? recent.map((r) => (
                <span className="chip recent" key={r}><button type="button" onClick={() => run(r)}>{r}</button><button type="button" aria-label={`Remove ${r}`} className="x" onClick={() => setRecent(recent.filter((x) => x !== r))}>×</button></span>
              )) : <small>No recent searches</small>}
            </div>
          </div>
          <div className="drop-block">
            <div className="drop-head"><span>Trending searches</span></div>
            <div className="drop-chips">{trending.map((t) => <button type="button" className="chip trend" key={t} onClick={() => run(t)}>{t}</button>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const shapeOptions = ["All shapes", "Almond", "Square", "Stiletto", "Round", "Duck nails", "Medium", "Long"];
const styleOptions = ["Elegant", "Fresh", "Understated", "Punk", "Vintage", "Minimal", "Sweet", "Casual"];
const occasionOptions = ["Seaside", "Wedding", "Office", "Evening", "Travel", "Everyday"];

function FilterPanel({ kind, selected, onSelect, onClear, onApply }: {
  kind: "shape" | "style" | "occasion";
  selected: string;
  onSelect: (value: string) => void;
  onClear: () => void;
  onApply: () => void;
}) {
  const options = kind === "shape" ? shapeOptions : kind === "style" ? styleOptions : occasionOptions;
  return (
    <div className={`filter-panel ${kind}`} tabIndex={-1}>
      <div className="filter-panel-head">
        <div>{selected && <span className="filter-summary">{selected}<button type="button" aria-label={`Remove ${selected}`} onClick={onClear}>×</button></span>}</div>
        <div className="drop-actions">
          <button className="clear-pill" type="button" onClick={onClear}>Clear</button>
          <button className="apply-pill" type="button" onClick={onApply}>Apply</button>
        </div>
      </div>
      {kind === "shape" ? (
        <div className="shape-options">
          {options.map((option, index) => {
            const active = selected === option || (!selected && index === 0);
            return (
              <button className={active ? "shape-option active" : "shape-option"} type="button" key={option} onClick={() => onSelect(index === 0 ? "" : option)}>
                <span className={`nail-shape n${index}`}>{index === 0 && <img src={icons.sparkle} alt="" />}</span>
                <span>{option}</span>
                {active && index !== 0 && <i>✓</i>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="pill-options">
          {options.map((option) => <button className={selected === option ? "active" : ""} type="button" key={option} onClick={() => onSelect(option)}>{option}</button>)}
        </div>
      )}
    </div>
  );
}

function Shell({ navigate, children, account = false, searchState = emptySearchState }: { navigate: Navigate; children: React.ReactNode; account?: boolean; searchState?: SearchState }) {
  const savedActive = getRoute() === "saved";
  return (
    <div className={account ? "community-page account-shell" : "community-page"}>
      <aside className="side-nav">
        <Brand compact onClick={() => navigate("landing")} />
        <div className="side-divider" />
        <nav>
          <button className={!account && !savedActive ? "active" : ""} onClick={() => navigate("community")} aria-label="Home"><img src={`${A}account-4fffb.svg`} alt="" /></button>
          <button className={savedActive ? "active" : ""} onClick={() => navigate("saved")} aria-label="Saved"><img src={`${A}account-17dcc.svg`} alt="" /></button>
          <button aria-label="Design Studio"><img src={`${A}account-e11e9.svg`} alt="" /></button>
          <button aria-label="Device management"><img className="side-device-icon" src={`${A}account-device-machine.svg`} alt="" /></button>
          <button aria-label="Nail artists"><img src={`${A}account-5ae22.svg`} alt="" /></button>
          <button aria-label="Lab"><img src={`${A}account-b0c8a.svg`} alt="" /></button>
        </nav>
        <button className="settings" aria-label="Settings" onClick={() => navigate("account/edit")}><img src={`${A}account-1b14d.svg`} alt="" /></button>
      </aside>
      <div className="community-main">
        <header className="community-header">
          <SearchBar initial={searchState} navigate={navigate} />
          <div className="community-actions">
            <button className="upload">Upload design</button>
            <button className="circle-button" aria-label="Achievements"><img src={`${A}account-e6ce1.svg`} alt="" /></button>
            <button className="circle-button" aria-label="Notifications" onClick={() => navigate("notifications/all")}><img src={`${A}account-48ef5.svg`} alt="" /></button>
            <button className="circle-button" aria-label="Profile" onClick={() => navigate("profile/published")}><img src={`${A}97eda.svg`} alt="" /></button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function CategoryDesignCard({ index, navigate, tags = GENERIC_TAGS, heartIcon }: { index: number; navigate: Navigate; tags?: readonly string[]; heartIcon?: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="category-design-card" role="link" tabIndex={0} onClick={() => navigate("design/Nail Design Title")} onKeyDown={(event) => event.key === "Enter" && navigate("design/Nail Design Title")}>
      <div className="category-design-image">image</div>
      <div className="category-design-copy">
        <strong>Nail Design Title</strong>
        <div className="category-design-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="category-design-footer">
          <UserHover><button type="button" className="category-author" onClick={(event) => { event.stopPropagation(); navigate("creator/username"); }}><i>U</i>Username</button></UserHover>
          <button type="button" className={liked ? "category-like active" : "category-like"} onClick={(event) => { event.stopPropagation(); setLiked(!liked); }}><img src={heartIcon || `${A}category-heart-${index % 2 ? "b" : "a"}.svg`} alt="" />{liked ? "1.3K" : "1.2K"}</button>
        </div>
      </div>
    </article>
  );
}

function SearchResultsPage({ initial, navigate }: { initial: SearchState; navigate: Navigate }) {
  const [searchState, setSearchState] = useState(initial);
  const [sort, setSort] = useState("Most relevant");
  const [sortOpen, setSortOpen] = useState(false);
  const applied = (["shape", "style", "occasion"] as const).filter((kind) => searchState[kind]);
  const labels: Record<FilterKind, string> = { shape: "Shape", style: "Style", occasion: "Occasion" };
  const tags = (["shape", "style", "occasion"] as const).map((kind) => searchState[kind] || labels[kind]);
  const clear = (kind: FilterKind) => setSearchState((current) => ({ ...current, [kind]: "" }));
  return (
    <Shell navigate={navigate} searchState={searchState}>
      <main className="search-results-page">
        <div className="search-results-heading">
          <div><h1>Search results</h1><span>6 designs</span></div>
          <div className="search-results-sort" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setSortOpen(false)}>
            <span>Sort by</span>
            <div className="result-sort">
              <button type="button" aria-expanded={sortOpen} onClick={() => setSortOpen(!sortOpen)}>{sort}<img src={`${A}76246.svg`} alt="" /></button>
              {sortOpen && <div>{["Most relevant", "Newest", "Most popular"].map((option) => <button type="button" className={sort === option ? "active" : ""} onClick={() => { setSort(option); setSortOpen(false); }} key={option}>{option}</button>)}</div>}
            </div>
          </div>
        </div>
        {applied.length > 0 && (
          <div className="applied-filters">
            <span>Applied filters</span>
            {applied.map((kind) => (
              <span className="applied-filter" key={kind}><small>{labels[kind]}:</small><strong>{searchState[kind]}</strong><button type="button" aria-label={`Remove ${labels[kind]} filter`} onClick={() => clear(kind)}><img src={`${A}25784.svg`} alt="" /></button></span>
            ))}
            <button type="button" className="clear-applied" onClick={() => setSearchState((current) => ({ ...current, shape: "", style: "", occasion: "" }))}>Clear all</button>
          </div>
        )}
        <div className="search-results-grid">
          {Array.from({ length: 6 }, (_, index) => <CategoryDesignCard index={index} navigate={navigate} tags={tags} heartIcon={`${A}7bf2b.svg`} key={index} />)}
        </div>
      </main>
    </Shell>
  );
}

function Community({ navigate }: { navigate: Navigate }) {
  const [activeCategory, setActiveCategory] = useState("Featured");
  const [slide, setSlide] = useState(0);
  const [feedCount, setFeedCount] = useState(feed.length);
  const feedSentinel = useRef<HTMLDivElement>(null);
  const categories = ["Featured", "Trending", "Wedding", "Almond", "Seaside", "Dark punk", "Artists", "All"];
  const open = (item: Design) => navigate(`design/${encodeURIComponent(item[0])}`);
  useEffect(() => {
    if (activeCategory !== "Featured" || !feedSentinel.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setFeedCount((count) => count + feed.length);
    }, { rootMargin: "240px 0px" });
    observer.observe(feedSentinel.current);
    return () => observer.disconnect();
  }, [activeCategory]);
  return (
    <Shell navigate={navigate}>
      <main className="community-content">
        <div className="categories">
          {categories.map((category) => (
            <button className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)} key={category}>{category}</button>
          ))}
        </div>
        {activeCategory === "Featured" ? (
          <>
            <section className="showcase">
              <div className="carousel placeholder">
                <em className="ph-label">Image</em>
                <div className="carousel-control">
                  {[0, 1, 2, 3].map((n) => <button key={n} aria-label={`Slide ${n + 1}`} className={slide === n ? "dot on" : "dot"} onClick={() => setSlide(n)} />)}
                </div>
              </div>
              <div className="showcase-side">
                {([["Minimal French", "french"], ["Sheer florals", "floral"], ["Playful Halloween", "halloween"]] as const).map(([label, key]) => (
                  <button className="mini-showcase" key={label} onClick={() => navigate(`collection/${key}`)}>
                    <span><img src={icons.image} alt="" /></span><p>{label}</p>
                  </button>
                ))}
              </div>
            </section>
            <section className="community-section">
              <SectionHeading title="Trending designs" subtitle="Discover the community's latest favorites" action="View all →" />
              <div className="popular-grid">{popular.map((item) => <DesignCard item={item} prominent key={item[0]} onOpen={() => open(item)} />)}</div>
            </section>
            <section className="community-section">
              <SectionHeading title="Fresh from the community" subtitle="See what the community is creating" action="Sort by" actionIcon={icons.chevronSort} />
              <div className="feed-grid infinite-feed">
                {Array.from({ length: feedCount }, (_, index) => {
                  const item = feed[index % feed.length];
                  return <DesignCard item={item} key={index} onOpen={() => open(item)} />;
                })}
                <div className="feed-sentinel" ref={feedSentinel}><span>Scroll for more inspiration</span></div>
              </div>
            </section>
          </>
        ) : (
          <section className="category-feed-grid" aria-label={`${activeCategory} designs`}>
            {Array.from({ length: 15 }, (_, index) => <CategoryDesignCard index={index} navigate={navigate} key={`${activeCategory}-${index}`} />)}
          </section>
        )}
      </main>
    </Shell>
  );
}

function CollectionPage({ id, navigate }: { id: string; navigate: Navigate }) {
  const c = collections[id] ?? collections.floral;
  return (
    <Shell navigate={navigate}>
      <main className="community-content sub-page">
        <button className="back-link" onClick={() => navigate("community")}><img src={C.back} alt="" />Back to home</button>
        <div className="page-title"><h1>{c.title}</h1><p>xxxxxxxxxxxxxxxxxxx</p></div>
        <div className="feed-grid">{c.cards.map((item) => <DesignCard item={item} key={item[0]} onOpen={() => navigate(`design/${encodeURIComponent(item[0])}`)} />)}</div>
      </main>
    </Shell>
  );
}

function Lightbox({ index, setIndex, onClose }: { index: number; setIndex: (n: number) => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((index + 3) % 4);
      if (e.key === "ArrowRight") setIndex((index + 1) % 4);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, setIndex, onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lb-close" aria-label="Close" onClick={onClose}><img src={C.close} alt="" /></button>
      <div className="lb-stage" onClick={(e) => e.stopPropagation()}><span>Nail design preview{index ? ` ${index + 1}` : ""}</span></div>
      <button className="lb-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIndex((index + 3) % 4); }}><img src={C.left} alt="" /></button>
      <button className="lb-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % 4); }}><img src={C.right} alt="" /></button>
      <div className="lb-thumbs" onClick={(e) => e.stopPropagation()}>
        {[0, 1, 2, 3].map((n) => <button key={n} className={n === index ? "on" : ""} onClick={() => setIndex(n)}>N</button>)}
      </div>
    </div>
  );
}

function ShareDialog({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setStatus("Link copied");
  };
  const share = async (platform: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Nail Design Title", text: "Take a look at this nail design on Tint.", url: window.location.href });
        setStatus(`Shared via ${platform}`);
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    await copyLink();
    setStatus(`Link copied for ${platform}`);
  };
  const options = [
    ["Platform A", "share-29c01.svg"],
    ["Platform B", "share-4106b.svg"],
    ["Platform C", "share-dc154.svg"],
    ["Platform D", "share-72ad9.svg"],
  ] as const;
  return (
    <div className="share-overlay" role="dialog" aria-modal="true" aria-label="Share design" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="share-dialog">
        <header><h2>Share design</h2><button type="button" aria-label="Close" onClick={onClose}><img src={`${A}share-6804f.svg`} alt="" /></button></header>
        <div className="share-options">
          {options.map(([label, icon]) => (
            <button type="button" onClick={() => share(label)} key={label}><i><img src={`${A}${icon}`} alt="" /></i><span>{label}</span></button>
          ))}
          <div className="share-separator" />
          <button type="button" className="copy-link" onClick={copyLink}><i><img src={`${A}share-f47f6.svg`} alt="" /></i><span>{status || "Copy link"}</span></button>
        </div>
      </section>
    </div>
  );
}

type DetailReply = { id: number; name: string; text: string; time: string; likes: number; creator?: boolean };
type DetailComment = { id: number; name: string; text: string; time: string; likes: number; images?: number; liked?: boolean; replies?: DetailReply[] };
type ModerationView = "report" | "submitted" | "block";

const reportReasons = [
  "Spam or misleading content",
  "Harassment or bullying",
  "Inappropriate or harmful content",
  "Intellectual property infringement",
  "Other",
] as const;

function ModerationDialog({ view, onClose, onSubmit, onManage, target = "design" }: {
  view: ModerationView;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  onManage: () => void;
  target?: "design" | "creator";
}) {
  const [reason, setReason] = useState<string>(reportReasons[0]);
  const [details, setDetails] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const submitted = view === "submitted";
  const blocked = view === "block";
  return (
    <div className="moderation-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="moderation-dialog" role="dialog" aria-modal="true" aria-labelledby="moderation-title">
        <header>
          <div>
            <h2 id="moderation-title">{submitted ? "Report submitted" : blocked ? "Block Luna Nail Lab?" : target === "creator" ? "Report Luna Nail Lab?" : "Report design"}</h2>
            <p>{submitted ? "We’ve received your report." : blocked ? "Choose what you see and who can contact you." : `Tell us why you’re reporting this ${target}.`}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><img src={`${A}c1bc2.svg`} alt="" /></button>
        </header>
        <div className="moderation-body">
          {blocked ? (
            <>
              <div className="moderation-creator"><i>L</i><span><strong>Luna Nail Lab</strong><small>@luna_naillab</small></span></div>
              <div className="moderation-impact"><img src={`${A}bb880.svg`} alt="" /><p>You won’t see content from Luna Nail Lab.</p></div>
              <div className="moderation-impact"><img src={`${A}e9d5d.svg`} alt="" /><p>You won’t receive new messages from Luna Nail Lab.</p></div>
              <p className="moderation-note">Blocking this creator does not submit a report.</p>
            </>
          ) : (
            <>
              {submitted && <div className="moderation-confirm"><i><img src={`${A}12d06.svg`} alt="" /></i><p>Thank you for helping keep the community welcoming.</p></div>}
              {target === "creator"
                ? <div className="moderation-creator"><i>L</i><span><strong>Luna Nail Lab</strong><small>@luna_naillab</small></span></div>
                : <div className="moderation-target"><span>image</span><div><strong>Moonlight Almond Ombre</strong><small>By Luna Nail Lab</small></div></div>}
              {submitted ? (
                <div className="moderation-record"><div><strong>Submitted</strong><small>Just now</small></div><p>{reason}</p></div>
              ) : (
                <>
                  <fieldset className="moderation-reasons">
                    <legend>Reason</legend>
                    {reportReasons.map((item) => <label key={item}><input type="radio" name="report-reason" value={item} checked={reason === item} onChange={() => setReason(item)} /><span>{item}</span></label>)}
                  </fieldset>
                  <label className="moderation-details"><strong>Additional details (optional)</strong><textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Share any details that may help us understand your report." /></label>
                </>
              )}
            </>
          )}
        </div>
        <footer>
          {submitted ? (
            <><button type="button" onClick={onManage}>Manage in settings</button><button type="button" className="primary" onClick={onClose}>Done</button></>
          ) : (
            <><button type="button" onClick={onClose}>Cancel</button><button type="button" className="primary" onClick={() => blocked ? onClose() : onSubmit(reason)}>{blocked ? "Block creator" : "Submit report"}</button></>
          )}
        </footer>
      </section>
    </div>
  );
}

function DesignDetail({ navigate, own = false, editMode = false, focusComments = false }: { navigate: Navigate; own?: boolean; editMode?: boolean; focusComments?: boolean }) {
  const [thumb, setThumb] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(editMode);
  const [makerDialog, setMakerDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [moderationView, setModerationView] = useState<ModerationView | null>(null);
  const [draft, setDraft] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [sortLatest, setSortLatest] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [postedCount, setPostedCount] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<DetailComment[]>([
    { id: 1, name: "Username", text: "XXXXXXXXXXXXXXXXXXXXXXXXXXXX", time: "2 days ago", likes: 24, images: 2 },
    { id: 2, name: "Username", text: "XXXXXXXXXXXXXXXX", time: "1 day ago", likes: 11, replies: [{ id: 21, name: "Username", text: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", time: "20 hours ago", likes: 8, creator: true }] },
    { id: 3, name: "Username", text: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", time: "3 days ago", likes: 37, images: 1 },
  ]);
  const beginReply = (id: number) => {
    setReplyTo(id);
    setComposerOpen(true);
    window.setTimeout(() => textarea.current?.focus(), 0);
  };
  const cancelComment = () => {
    setDraft("");
    setAttachments([]);
    setReplyTo(null);
    setComposerOpen(false);
  };
  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    if (replyTo) {
      setComments((current) => current.map((comment) => comment.id === replyTo
        ? { ...comment, replies: [...(comment.replies || []), { id: Date.now(), name: "Username", text, time: "Just now", likes: 0 }] }
        : comment));
    } else {
      setComments((current) => [{ id: Date.now(), name: "Username", text, time: "Just now", likes: 0, images: attachments.length || undefined }, ...current]);
    }
    setPostedCount((current) => current + 1);
    cancelComment();
  };
  const loadMoreComments = () => {
    setComments((current) => [...current,
      { id: 4, name: "Username", text: "XXXXXXXXXXXXXXXXXXXX", time: "4 days ago", likes: 18 },
      { id: 5, name: "Username", text: "XXXXXXXXXXXXXXXXXXXXXXXX", time: "5 days ago", likes: 9 },
    ]);
    setShowMore(true);
  };
  const visibleComments = [...comments];
  if (!sortLatest) visibleComments.reverse();
  useEffect(() => {
    if (!focusComments) return;
    window.requestAnimationFrame(() => document.getElementById("design-comments")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [focusComments]);
  return (
    <Shell navigate={navigate}>
      <main className="detail-page">
        <button className="back-link" onClick={() => navigate("community")}><img src={C.back} alt="" />Back to community</button>
        <section className="detail-card">
          <div className="detail-media">
            <button className="detail-preview" onClick={() => setLightbox(true)} aria-label="View large image"><span>Nail design preview</span></button>
            <div className="detail-thumbs">{[0, 1, 2, 3].map((n) => <button key={n} className={n === thumb ? "on" : ""} onClick={() => setThumb(n)} aria-label={`Image ${n + 1}`} />)}</div>
          </div>
          <div className="detail-info">
            <div className="detail-title-row">
              <h1>Moonlight Almond Ombre</h1>
              {own ? (
                <div className="owner-design-actions"><span>Published</span><button type="button" onClick={() => setEditorOpen(!editorOpen)}>Edit & publish</button></div>
              ) : (
                <div className="detail-more-wrap">
                  <button type="button" className="detail-more" aria-label="More options" aria-expanded={moreMenu} onClick={() => setMoreMenu(!moreMenu)}><img src={`${A}48a1a.svg`} alt="" /></button>
                  {moreMenu && (
                    <div className="detail-more-menu">
                      <button type="button" onClick={() => { setMoreMenu(false); setModerationView("report"); }}><img src={`${A}d0478.svg`} alt="" />Report design</button>
                      <button type="button" onClick={() => { setMoreMenu(false); setModerationView("block"); }}><img src={`${A}74961.svg`} alt="" />Block creator</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {own && editorOpen && <div className="owner-publish-panel"><div><strong>Edit & publish</strong><small>Published · Public</small></div><button type="button" onClick={() => setEditorOpen(false)}>Save & publish</button></div>}
            <div className="detail-author">
              {own
                ? <button type="button" className="creator-entry" onClick={() => navigate("profile/published")}><i>L</i><span><strong>Luna Nail Lab</strong><small>3 days ago <b>·</b> Shanghai <b>·</b> 86 designs</small></span></button>
                : <UserHover><button type="button" className="creator-entry" onClick={() => navigate("creator/username")}><i>L</i><span><strong>Luna Nail Lab</strong><small>3 days ago <b>·</b> Shanghai <b>·</b> 86 designs</small></span></button></UserHover>}
              {own ? <span className="owner-design-label">Your design</span> : <button className="follow-sm" onClick={() => setFollowing(!following)}>{following ? "Following" : "+ Follow"}</button>}
            </div>
            <div className="detail-stats">
              <div>
                <button onClick={() => setLiked(!liked)} className={liked ? "on" : ""}><img src={C.heartLg} alt="" />{liked ? "2,487" : "2,486"}</button>
                <button onClick={() => document.getElementById("design-comments")?.scrollIntoView({ behavior: "smooth", block: "start" })}><img src={C.message} alt="" />{128 + postedCount}</button>
              </div>
              <div>
                <button onClick={() => setSaved(!saved)} className={saved ? "on" : ""}><img src={C.save} alt="" />{saved ? "Saved" : "Save"}</button>
                <button onClick={() => setShareDialog(true)}><img src={C.share} alt="" />Share</button>
              </div>
            </div>
            <div className="detail-tags">{["Moonlight ombre", "Soft French", "Workwear", "Almond"].map((t) => <span key={t}>{t}</span>)}</div>
            <div className="detail-about"><h3>About this design</h3><p>XXXXXXXX<br />XXXXXXXXXXXXXXXXXXXX<br />XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p></div>
            <div className="detail-specs"><h3>Design details</h3><div>{[["Shape", "Almond"], ["Length", "Medium-long"], ["Base color", "Cream almond gray"], ["Finish", "Sheer ombre"]].map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}</div></div>
            <div className="detail-create">
              <div><h3>Create from this design</h3><p>Keep this design and make it your own.</p></div>
              <button className="primary">Open in Design Studio <span>→</span></button>
              <button className="secondary" onClick={() => setMakerDialog(true)}>Send to maker</button>
            </div>
          </div>
        </section>
        <div className="detail-lower">
          <section className="comments" id="design-comments">
            <div className="comments-head"><h2>Comments <span>{128 + postedCount}</span></h2><button type="button" onClick={() => setSortLatest(!sortLatest)}>{sortLatest ? "Latest" : "Oldest"}<img src={C.chevron} alt="" /></button></div>
            <div className={composerOpen ? "comment-form focused" : "comment-form"}>
              <div><i>U</i><textarea ref={textarea} value={draft} onFocus={() => setComposerOpen(true)} onChange={(event) => setDraft(event.target.value)} placeholder={replyTo ? "Write a reply…" : "Write a comment…"} /></div>
              {attachments.length > 0 && <div className="composer-images">{attachments.map((name, index) => <span key={`${name}-${index}`}>image<button type="button" aria-label={`Remove ${name}`} onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button></span>)}</div>}
              {composerOpen ? (
                <div className="comment-form-actions">
                  <button type="button" className="add-images" onClick={() => fileInput.current?.click()}><img src={`${A}comment-add-image.svg`} alt="" />Add images</button>
                  <input ref={fileInput} hidden type="file" accept="image/*" multiple onChange={(event) => setAttachments(Array.from(event.target.files || []).slice(0, 4).map((file) => file.name))} />
                  <div><button type="button" onClick={cancelComment}>Cancel</button><button type="button" className="post-comment" disabled={!draft.trim()} onClick={postComment}>{replyTo ? "Post reply" : "Post comment"}</button></div>
                </div>
              ) : <small>Be kind. Keep the community welcoming.</small>}
            </div>
            {visibleComments.map((c) => (
              <div className="comment" key={c.id}>
                <UserHover className="comment-user-avatar"><i>{c.name[0]}</i></UserHover>
                <div className="comment-body">
                  <UserHover><strong>{c.name}</strong></UserHover>
                  <p>{c.text}</p>
                  {c.images && <div className={`comment-imgs n${c.images}`}>{Array.from({ length: c.images }, (_, k) => <span key={k} />)}</div>}
                  <div className="comment-meta"><small>{c.time}</small><div><button type="button" className={c.liked ? "comment-like on" : "comment-like"} onClick={() => setComments((current) => current.map((comment) => comment.id === c.id ? { ...comment, liked: !comment.liked } : comment))}><img src={C.heartSm} alt="" />{c.likes + (c.liked ? 1 : 0)}</button><button type="button" onClick={() => beginReply(c.id)}>Reply</button></div></div>
                  {c.replies?.map((reply) => (
                    <div className="comment reply" key={reply.id}>
                      <UserHover className="comment-user-avatar"><i>U</i></UserHover>
                      <div className="comment-body">
                        <UserHover><strong>{reply.name}{reply.creator && <em>Creator</em>}</strong></UserHover>
                        <p>{reply.text}</p>
                        <div className="comment-meta"><small>{reply.time}</small><div><span><img src={C.heartXs} alt="" />{reply.likes}</span><button type="button" onClick={() => beginReply(c.id)}>Reply</button></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!showMore && <div className="comments-more"><button type="button" onClick={loadMoreComments}>View more comments</button></div>}
          </section>
          <aside className="related">
            <h2>Related designs</h2>
            <div>{feed.slice(0, 3).map((item, i) => <DesignCard item={item} key={i} onOpen={() => navigate(`design/${encodeURIComponent(item[0])}`)} />)}</div>
          </aside>
        </div>
      </main>
      {lightbox && <Lightbox index={thumb} setIndex={setThumb} onClose={() => setLightbox(false)} />}
      {makerDialog && <ContactDialog mode="maker" onClose={() => setMakerDialog(false)} onChoose={(name) => navigate(`messages/${encodeURIComponent(name)}`)} />}
      {shareDialog && <ShareDialog onClose={() => setShareDialog(false)} />}
      {moderationView && <ModerationDialog view={moderationView} onClose={() => setModerationView(null)} onSubmit={() => setModerationView("submitted")} onManage={() => navigate("account/privacy")} />}
    </Shell>
  );
}

const contacts = [
  { name: "Luna Nail Lab", role: "Nail studio" },
  { name: "Mia Beauty", role: "Nail consultant" },
  { name: "Nail Studio", role: "Nail studio" },
  { name: "Mia Nail Studio", role: "Nail studio" },
  { name: "Mia Nail Lab", role: "Nail studio" },
] as const;

function Avatar({ size = 44 }: { size?: number }) {
  return <i className="dm-avatar" style={{ width: size, height: size, fontSize: Math.round(size * .4) }}>U</i>;
}

function ContactDialog({ mode, onClose, onChoose }: {
  mode: "maker" | "new";
  onClose: () => void;
  onChoose: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const publisher = { name: "Username", role: "XXXXXX" };
  const frequent = mode === "maker" ? contacts.slice(0, 2) : contacts.slice(0, 3);
  const results = contacts.filter((contact) => contact.name.toLowerCase().includes(query.trim().toLowerCase()));
  const ContactButton = ({ contact }: { contact: { name: string; role: string } }) => (
    <div className="contact-card">
      <Avatar />
      <span><strong>{contact.name}</strong><small>{contact.role}</small></span>
      <button className="contact-send" type="button" aria-label={`Start a chat with ${contact.name}`} onClick={() => onChoose(contact.name)}><img src={M.sendDark} alt="" /></button>
    </div>
  );
  return (
    <div className="dm-overlay" role="dialog" aria-modal="true" aria-label={mode === "maker" ? "Send to maker" : "New message"} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="contact-dialog">
        <header>
          <div><h2>{mode === "maker" ? "Send to maker" : "New message"}</h2><p>{mode === "maker" ? "Find a maker and start a chat" : "Find a contact and start a chat"}</p></div>
          <button type="button" onClick={onClose} aria-label="Close"><img src={M.close} alt="" /></button>
        </header>
        <div className="contact-dialog-body">
          <label className={query ? "contact-search active" : "contact-search"}><img src={M.search} alt="" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people or studios" /></label>
          {query ? (
            <div className="contact-results">
              {results.length ? results.map((contact) => <ContactButton contact={contact} key={contact.name} />) : <p className="contact-empty">No contacts found</p>}
            </div>
          ) : mode === "maker" ? (
            <>
              <div className="contact-columns-head"><span>Publisher</span><span>Frequent contacts</span></div>
              <div className="contact-grid maker-grid">
                <ContactButton contact={publisher} />
                {frequent.map((contact) => <ContactButton contact={contact} key={contact.name} />)}
              </div>
            </>
          ) : (
            <>
              <p className="contact-section-title">Frequent contacts</p>
              <div className="contact-grid">{frequent.map((contact) => <ContactButton contact={contact} key={contact.name} />)}</div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

type Conversation = { name: string; time: string; preview: string; unread?: boolean };
const initialConversations: Conversation[] = [
  { name: "Luna Nail Lab", time: "10:24", preview: "I’d like to book ombre nails next Friday." },
  { name: "Mia Beauty", time: "09:18", preview: "The ombre base color is confirmed." },
  { name: "Nail Studio", time: "08:42", preview: "One weekend appointment is still available.", unread: true },
];

type NotificationSection = "all" | "likes" | "comments" | "followers" | "system";
type NotificationKind = "like" | "save" | "comment" | "follow" | "system";
type NotificationEntry = {
  id: number;
  kind: NotificationKind;
  message: string;
  time: string;
  group: "Today" | "Yesterday";
  unread: boolean;
  thumbnail?: boolean;
  following?: boolean;
  target?: {
    type: "own-design" | "other-design" | "creator";
    id: string;
    anchor?: "comments";
  };
};

const notificationNav: readonly [NotificationSection, string, string][] = [
  ["all", "All notifications", "notify-fe4ef.svg"],
  ["likes", "Likes & saves", "notify-29efd.svg"],
  ["comments", "Comments & replies", "notify-9ade9.svg"],
  ["followers", "New followers", "notify-29a71.svg"],
  ["system", "System updates", "notify-c519d.svg"],
];

const initialNotifications: NotificationEntry[] = [
  { id: 1, kind: "like", message: "Username liked your design “Nail Design Title”", time: "Just now", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 2, kind: "save", message: "Username saved your design “Nail Design Title”", time: "10 minutes ago", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 3, kind: "comment", message: "Username commented on your design: “XXXXXXXXXX”", time: "10 minutes ago", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title", anchor: "comments" } },
  { id: 4, kind: "follow", message: "Username followed you", time: "1 hour ago", group: "Today", unread: true, target: { type: "creator", id: "username" } },
  { id: 5, kind: "system", message: "System update: Your design was approved and is now public.", time: "1 hour ago", group: "Today", unread: false, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 6, kind: "system", message: "System update: Your design was approved and is now public.", time: "Yesterday, 14:30", group: "Yesterday", unread: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 7, kind: "like", message: "Username liked your design “Nail Design Title”", time: "Yesterday, 09:15", group: "Yesterday", unread: false, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 8, kind: "save", message: "Username saved your design “Nail Design Title”", time: "Yesterday, 08:42", group: "Yesterday", unread: false, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 9, kind: "comment", message: "Username replied to your comment: “XXXXXXXX”", time: "Yesterday, 08:42", group: "Yesterday", unread: false, thumbnail: true, target: { type: "other-design", id: "Nail Design Title", anchor: "comments" } },
  { id: 10, kind: "follow", message: "Username followed you", time: "Yesterday, 09:15", group: "Yesterday", unread: false, following: true, target: { type: "creator", id: "username" } },
  { id: 11, kind: "follow", message: "Username followed you", time: "Yesterday, 08:42", group: "Yesterday", unread: false, target: { type: "creator", id: "username" } },
  { id: 12, kind: "like", message: "Username liked your comment on “Nail Design Title”", time: "Yesterday, 08:10", group: "Yesterday", unread: false, thumbnail: true, target: { type: "other-design", id: "Nail Design Title", anchor: "comments" } },
];

function NotificationSidebar({ active, navigate }: { active: NotificationSection | "messages"; navigate: Navigate }) {
  const counts = active === "all" ? ["5", "3", "2", "", ""] : ["5", "2", "1", "1", "1"];
  return (
    <aside className="notification-panel">
      <p>Notifications</p>
      {notificationNav.map(([key, label, icon], index) => (
        <button type="button" className={active === key ? "active" : ""} onClick={() => navigate(`notifications/${key}`)} key={key}>
          <img src={`${A}${icon}`} alt="" /><span>{label}</span>{counts[index] && <i>{counts[index]}</i>}
        </button>
      ))}
      <div className="notification-divider" />
      <p>Messages</p>
      <button type="button" className={active === "messages" ? "active" : ""} onClick={() => navigate("messages")}>
        <img src={`${A}notify-a268d.svg`} alt="" /><span>Messages</span>
      </button>
    </aside>
  );
}

const kindIcon: Record<NotificationKind, string> = {
  like: "notify-c4bf6.svg",
  save: "notify-bookmark.svg",
  comment: "notify-15991.svg",
  follow: "notify-ed332.svg",
  system: "notify-48ef5.svg",
};

function NotificationRow({ item, onRead, onFollow, onOpen }: { item: NotificationEntry; onRead: () => void; onFollow: () => void; onOpen: () => void }) {
  const [following, setFollowing] = useState(Boolean(item.following));
  const follow = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFollowing(!following);
    onFollow();
  };
  return (
    <button type="button" className={item.unread ? "notification-row unread" : "notification-row"} onClick={() => { onOpen(); onRead(); }}>
      <span className="notification-dot"><img src={`${A}${item.unread ? "notify-9063e.svg" : "notify-46e2e.svg"}`} alt="" /></span>
      <span className="notification-type"><img src={`${A}${kindIcon[item.kind]}`} alt="" /></span>
      {item.kind === "system" ? <span className="notification-avatar system">T</span> : <span className="notification-avatar">U</span>}
      <span className="notification-copy"><strong>{item.message}</strong><small>{item.time}</small></span>
      {item.thumbnail && <span className="notification-thumbnail">image</span>}
      {item.kind === "follow" && <span role="button" className={following ? "follow-back following" : "follow-back"} onClick={follow}>{following ? "Following" : "Follow back"}</span>}
    </button>
  );
}

function NotificationsPage({ section, navigate }: { section: NotificationSection; navigate: Navigate }) {
  const [items, setItems] = useState(initialNotifications);
  const allIds = [1, 3, 4, 6, 7, 9, 12];
  const filter = (item: NotificationEntry) => (section === "all" && allIds.includes(item.id))
    || (section === "likes" && (item.kind === "like" || item.kind === "save"))
    || (section === "comments" && item.kind === "comment")
    || (section === "followers" && item.kind === "follow")
    || (section === "system" && item.kind === "system");
  const visible = items.filter(filter);
  const titles: Record<NotificationSection, string> = {
    all: "All notifications",
    likes: "Likes & saves",
    comments: "Comments & replies",
    followers: "New followers",
    system: "System updates",
  };
  const unread = visible.filter((item) => item.unread).length;
  const markAll = () => setItems((current) => current.map((item) => filter(item) ? { ...item, unread: false } : item));
  const clearAll = () => setItems((current) => current.filter((item) => !filter(item)));
  const openNotification = (item: NotificationEntry) => {
    if (!item.target) return;
    if (item.target.type === "creator") return navigate(`creator/${item.target.id}`);
    const section = item.target.type === "own-design" ? "my-design" : "design";
    navigate(`${section}/${encodeURIComponent(item.target.id)}${item.target.anchor ? `/${item.target.anchor}` : ""}`);
  };
  return (
    <Shell navigate={navigate} account>
      <main className="notification-center">
        <NotificationSidebar active={section} navigate={navigate} />
        <section className="notification-list">
          <header>
            <div><h1>{titles[section]}</h1><p>{section === "all" ? "X unread" : `${unread} unread`}</p></div>
            <div><button type="button" onClick={markAll}>Mark all as read</button><button type="button" onClick={clearAll}>Clear all</button></div>
          </header>
          {(["Today", "Yesterday"] as const).map((group) => {
            const grouped = visible.filter((item) => item.group === group);
            return grouped.length ? (
              <div className="notification-group" key={group}>
                <h2>{group}</h2>
                {grouped.map((item) => (
                  <NotificationRow
                    item={item}
                    key={item.id}
                    onFollow={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, following: !entry.following } : entry))}
                    onOpen={() => openNotification(item)}
                    onRead={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}
                  />
                ))}
              </div>
            ) : null;
          })}
          {!visible.length && <div className="notification-empty">No notifications</div>}
        </section>
      </main>
    </Shell>
  );
}

function MessagesPage({ navigate, initialContact }: { navigate: Navigate; initialContact?: string }) {
  const isNewContact = Boolean(initialContact && !initialConversations.some((item) => item.name === initialContact));
  const [selected, setSelected] = useState(initialContact || "");
  const [dialog, setDialog] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [moderationView, setModerationView] = useState<ModerationView | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [failed, setFailed] = useState<Record<string, string>>({});
  const currentSent = selected ? sent[selected] || [] : [];
  const failedMessage = selected ? failed[selected] : "";
  const conversations: Conversation[] = isNewContact && initialContact
    ? [{
      name: initialContact,
        time: "New",
        preview: failed[initialContact] ? `Not sent: ${failed[initialContact]}` : sent[initialContact]?.at(-1) || "Start a chat",
      }, ...initialConversations]
    : initialConversations;
  const choose = (name: string) => {
    setDialog(false);
    navigate(`messages/${encodeURIComponent(name)}`);
  };
  const send = () => {
    if (!selected || !draft.trim()) return;
    const message = draft.trim();
    if (isNewContact && currentSent.length >= 1) {
      setFailed((current) => ({ ...current, [selected]: message }));
    } else {
      setSent((current) => ({ ...current, [selected]: [...(current[selected] || []), message] }));
    }
    setDraft("");
  };
  return (
    <Shell navigate={navigate} account>
      <main className="notification-center messages-center">
        <NotificationSidebar active="messages" navigate={navigate} />
        <div className={selected ? "dm-page has-chat" : "dm-page"}>
          <section className="conversation-list">
            <header><h1>Messages</h1><button type="button" onClick={() => setDialog(true)} aria-label="New message"><img src={M.plus} alt="" /></button></header>
            <div>
              {conversations.map((conversation) => (
                <button type="button" className={selected === conversation.name ? "conversation active" : "conversation"} key={conversation.name} onClick={() => choose(conversation.name)}>
                  <Avatar />
                  <span><b>{conversation.name}<small>{conversation.time}</small></b><em>{conversation.preview}{conversation.unread && <i />}</em></span>
                </button>
              ))}
            </div>
          </section>
          <section className="chat-panel">
            {selected ? (
              <>
                <header className="chat-head">
                  <div><Avatar size={40} /><span><strong>{selected}</strong><small>{isNewContact ? "Shanghai · 86 designs" : "Online"}</small></span></div>
                  <div className="chat-head-actions">
                    <button type="button" aria-label="View profile" onClick={() => navigate("creator/username")}><img src={M.user} alt="" /></button>
                    <div className="chat-more-wrap" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setMoreMenu(false)}>
                      <button type="button" className={moreMenu ? "active" : ""} aria-label="More" aria-expanded={moreMenu} onClick={() => setMoreMenu(!moreMenu)}><img src={M.more} alt="" /></button>
                      {moreMenu && (
                        <div className="chat-user-menu">
                          <button type="button" onClick={() => { setMoreMenu(false); setModerationView("report"); }}><img src={`${A}d0478.svg`} alt="" />Report creator</button>
                          <button type="button" onClick={() => { setMoreMenu(false); setModerationView("block"); }}><img src={`${A}74961.svg`} alt="" />Block creator</button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>
                <div className="chat-messages" aria-live="polite">
                  {!isNewContact && (
                    <>
                      <div className="incoming"><Avatar size={36} /><span>Do you have an appointment for ombre nails next Friday?</span></div>
                      <div className="outgoing"><span>Yes, next Friday is available. You’re welcome to book!</span></div>
                    </>
                  )}
                  {isNewContact && (currentSent.length > 0 || failedMessage) && <time>10:30</time>}
                  {currentSent.map((message, index) => <div className="outgoing" key={`${message}-${index}`}><span>{message}</span></div>)}
                  {failedMessage && <div className="outgoing failed" role="status"><span>{failedMessage}<small>Not sent</small></span></div>}
                  {failedMessage && <p className="message-limit">You can send at most 1 text message until the other party follows or replies to you</p>}
                </div>
                <form className="chat-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
                  <button type="button" aria-label="Add image"><img src={M.image} alt="" /></button>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <div className="chat-empty"><strong>( ˶ˆᗜˆ˵ )</strong><p>Your next nail set awaits~</p></div>
            )}
          </section>
        </div>
      </main>
      {dialog && <ContactDialog mode="new" onClose={() => setDialog(false)} onChoose={choose} />}
      {moderationView && <ModerationDialog target="creator" view={moderationView} onClose={() => setModerationView(null)} onSubmit={() => setModerationView("submitted")} onManage={() => navigate("account/privacy")} />}
    </Shell>
  );
}

function Filter({ active, chevronIcon = icons.chevron, icon, text, selected, onClick }: { active: boolean; chevronIcon?: string; icon: string; text: string; selected: boolean; onClick: () => void }) {
  return <button type="button" className={active || selected ? "filter selected" : "filter"} onClick={onClick}><span><img src={icon} alt="" /><b>{text}</b><img className={active ? "chevron up" : "chevron"} src={chevronIcon} alt="" /></span></button>;
}

function SectionHeading({ title, subtitle, action, actionIcon }: { title: string; subtitle: string; action: string; actionIcon?: string }) {
  return (
    <div className="section-heading">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      <button>{action}{actionIcon && <img src={actionIcon} alt="" />}</button>
    </div>
  );
}

type AccountSection = "edit" | "security" | "notifications" | "privacy";

const accountSections: readonly [AccountSection, string, string][] = [
  ["edit", "Edit profile", "account-8fe35.svg"],
  ["security", "Account & security", "account-af91c.svg"],
  ["notifications", "Notification preferences", "account-5dd4c.svg"],
  ["privacy", "Privacy settings", "account-8625f.svg"],
];

function AccountField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="account-field">
      <div className="account-label"><strong>{label}</strong>{hint && <small>{hint}</small>}</div>
      <div className="account-control">{children}</div>
    </div>
  );
}

function TextInput({ value, placeholder, type = "text" }: { value?: string; placeholder?: string; type?: string }) {
  const [current, setCurrent] = useState(value || "");
  return <input type={type} value={current} placeholder={placeholder} onChange={(event) => setCurrent(event.target.value)} />;
}

function PreferenceToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  return (
    <div className={enabled ? "account-switch-state" : "account-switch-state off"}>
      <span>{enabled ? "On" : "Off"}</span>
      <button type="button" role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)}>
        <img src={`${A}account-toggle-${enabled ? "on" : "off"}.svg`} alt="" />
      </button>
    </div>
  );
}

function PreferenceRow({ title, description, initial = true }: { title: string; description: string; initial?: boolean }) {
  return (
    <div className="preference-row">
      <div><strong>{title}</strong><p>{description}</p></div>
      <PreferenceToggle initial={initial} />
    </div>
  );
}

function EditProfileForm() {
  return (
    <div className="account-card edit-profile-card">
      <AccountField label="Avatar">
        <div className="avatar-setting">
          <span className="account-avatar">U</span>
          <div><button type="button">Change avatar</button><small>JPG or PNG, up to 5 MB. Recommended: 200 × 200 px.</small></div>
        </div>
      </AccountField>
      <AccountField label="ID"><TextInput value="100000001" /></AccountField>
      <AccountField label="Username"><TextInput value="@luna_naillab" /></AccountField>
      <AccountField label="Email"><TextInput value="luna@example.com" type="email" /></AccountField>
      <AccountField label="Location">
        <select defaultValue="Shanghai"><option>Shanghai</option><option>Beijing</option><option>Shenzhen</option></select>
      </AccountField>
      <AccountField label="Bio" hint="Up to 200 characters"><textarea maxLength={200} placeholder="Tell the community a little about yourself…" /></AccountField>
      <AccountField label="Social links" hint="Shown on your public profile">
        <label className="social-input"><img src={`${A}account-ebd9d.svg`} alt="" /><TextInput placeholder="Instagram URL" /></label>
      </AccountField>
    </div>
  );
}

function AccountSecurityForm() {
  return (
    <div className="account-card security-card">
      <div className="account-note"><strong>Luna Nail Lab · @luna_naillab</strong><p>Demo form. Leave email or password fields blank to keep those settings unchanged.</p></div>
      <div className="account-group"><strong>Email settings</strong><p>Used to log in and reset your password. Verify your new email to update it.</p></div>
      <AccountField label="Current email"><TextInput value="luna@example.com" type="email" /></AccountField>
      <AccountField label="New email"><TextInput placeholder="Enter your new email address" type="email" /></AccountField>
      <AccountField label="Email verification code"><div className="verification-control"><TextInput placeholder="Enter the code sent to your new email" /><button type="button">Send code</button></div></AccountField>
      <div className="account-group"><strong>Change password</strong><p>Enter your current password, then choose a new one. Passwords are hidden.</p></div>
      <AccountField label="Current password"><TextInput placeholder="Enter your current password" type="password" /></AccountField>
      <AccountField label="New password"><TextInput placeholder="Create a new password" type="password" /></AccountField>
      <AccountField label="Confirm new password"><TextInput placeholder="Re-enter your new password" type="password" /></AccountField>
      <div className="account-note security-tips"><strong>Security tips</strong><p>Use at least 8 characters with letters and numbers. Choose a password you do not use elsewhere.<br />Never share your password or verification codes. Check your details before saving.</p></div>
    </div>
  );
}

function NotificationsForm() {
  return (
    <div className="account-card preference-card">
      <div className="account-group notification-heading"><strong>Community notifications</strong><p>Preferences for Luna Nail Lab (@luna_naillab). These settings apply to in-app notifications only.</p></div>
      <PreferenceRow title="Likes & saves" description="Get notified when someone likes or saves your nail designs." />
      <PreferenceRow title="Comments & replies" description="Get notified about new comments on your designs and replies to your comments." />
      <PreferenceRow title="New followers" description="Get notified when someone follows Luna Nail Lab." />
      <PreferenceRow title="System updates" description="Receive general updates about community events, new features, and publishing." initial={false} />
      <div className="account-note notification-note"><strong>About notifications</strong><p>Turning a category off stops new alerts. Existing notifications are not deleted.<br />Account security alerts and essential service messages are always delivered.<br />Demo preferences. Select Save changes to confirm your choices.</p></div>
    </div>
  );
}

function PrivacyForm() {
  return (
    <div className="account-card preference-card privacy-card">
      <div className="account-group"><strong>Profile visibility</strong><p>Your display name, username, and avatar identify you in the community. Your email and password stay private.</p></div>
      <div className="account-note"><strong>Public profile basics</strong><p>Luna Nail Lab · @luna_naillab<br />Your avatar, display name, and username are public. Update them in Edit profile.</p></div>
      <PreferenceRow title="Show location" description="Show Shanghai on your profile. Turning this off hides your location without deleting it." />
      <PreferenceRow title="Show bio & social links" description="Show your bio, Instagram URL, and website or other links on your profile." />
      <div className="account-group activity-heading"><strong>Activity visibility</strong></div>
      <PreferenceRow title="Public saved designs" description="Let others view your saved nail designs from your profile. Turn off to keep them private." initial={false} />
      <PreferenceRow title="Public following list" description="Let others see who you follow. This does not change your follows or browsing." />
      <div className="account-note privacy-note"><strong>Unsaved demo preferences. These settings do not change the visibility of published designs, comments, or replies.</strong></div>
    </div>
  );
}

function PendingAccountSection() {
  return (
    <div className="account-card account-pending">
      <strong>To be determined</strong>
      <p>This section is not available yet.</p>
    </div>
  );
}

function AccountPage({ section, navigate }: { section: AccountSection; navigate: Navigate }) {
  const details = {
    edit: ["Edit profile", "Manage your public profile so the community can get to know you."],
    security: ["Account & security", "To be determined."],
    notifications: ["Notification preferences", "To be determined."],
    privacy: ["Privacy settings", "To be determined."],
  } as const;
  const [saved, setSaved] = useState(false);
  return (
    <Shell navigate={navigate} account>
      <div className="account-layout">
        <aside className="account-sidebar">
          <p>Account settings</p>
          <nav>
            {accountSections.map(([key, label, icon]) => (
              <button type="button" className={section === key ? "active" : ""} onClick={() => navigate(`account/${key}`)} key={key}>
                <img src={`${A}${icon}`} alt="" /><span>{label}</span>
              </button>
            ))}
          </nav>
          <div />
        </aside>
        <main className="account-main">
          <h1>{details[section][0]}</h1>
          <p className="account-subtitle">{details[section][1]}</p>
          {section === "edit" && <EditProfileForm />}
          {section !== "edit" && <PendingAccountSection />}
          {section === "edit" && (
            <div className="account-actions">
              {saved && <span>Changes saved</span>}
              <button type="button" onClick={() => window.location.reload()}>Cancel</button>
              <button type="button" className="save" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}>Save changes</button>
            </div>
          )}
        </main>
      </div>
    </Shell>
  );
}

type CreatorTab = "published" | "collections" | "likes" | "about";

function CreatorSummary({ navigate }: { navigate: Navigate }) {
  const [following, setFollowing] = useState(false);
  return (
    <aside className="creator-summary">
      <div className="creator-main">
        <span className="creator-avatar">U</span>
        <div className="creator-name"><strong>Username</strong><i>✓</i></div>
        <p className="creator-handle">@luna_naillab</p>
        <p className="creator-bio">Original nail designs · New looks weekly ·<br />DM for collaborations</p>
        <p className="creator-location"><img src={`${A}creator-location.svg`} alt="" />Shanghai <b>·</b> Joined in 2022</p>
        <div className="creator-actions">
          <button type="button" className={following ? "following" : ""} onClick={() => setFollowing(!following)}>{following ? "Following" : "+ Follow"}</button>
          <button type="button" onClick={() => navigate("messages/Username")}>Message</button>
        </div>
      </div>
      <div className="creator-relations">
        <div><b>1,368</b><span>Followers</span></div>
        <div><b>204</b><span>Following</span></div>
      </div>
      <div className="creator-counts">
        {[["86", "Designs"], ["24K", "Likes"], ["5,801", "Saves"]].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
      </div>
    </aside>
  );
}

function CreatorDesignCard({ navigate, collection = false }: { navigate: Navigate; collection?: boolean }) {
  return (
    <article className="creator-design-card" role="link" tabIndex={0} onClick={() => navigate("design/Nail Design Title")} onKeyDown={(event) => event.key === "Enter" && navigate("design/Nail Design Title")}>
      <div className="creator-design-image">image</div>
      <div className="creator-design-copy">
        <strong>{collection ? "Collection Title" : "Nail Design Title"}</strong>
        <div>
          {collection ? <span className="creator-description">XXXXX</span> : <span className="creator-tags"><i>Shape</i><i>Style</i><i>Occasion</i></span>}
          <span className="creator-card-stats"><i><img src={`${A}creator-heart.svg`} alt="" />1.2K</i><i><img src={`${A}creator-bookmark.svg`} alt="" />1.2K</i></span>
        </div>
      </div>
    </article>
  );
}

function CreatorProfilePage({ navigate }: { navigate: Navigate }) {
  const [tab, setTab] = useState<CreatorTab>("published");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"Latest" | "Most popular">("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(6);
  const cards = Array.from({ length: visible }, (_, index) => index).filter(() => `${tab} nail design title collection`.includes(query.trim().toLowerCase()));
  const count = tab === "collections" ? "12 collections" : tab === "likes" ? "24K likes" : "86 designs";
  return (
    <Shell navigate={navigate}>
      <main className="creator-page">
        <CreatorSummary navigate={navigate} />
        <section className="creator-content">
          <header className="creator-tabs">
            <nav>{(["published", "collections", "likes", "about"] as const).map((key) => <button type="button" className={tab === key ? "active" : ""} onClick={() => { setTab(key); setVisible(6); }} key={key}>{key[0].toUpperCase() + key.slice(1)}</button>)}</nav>
            {tab !== "about" && <label className={query.trim() ? "active" : ""}><img src={`${A}creator-search.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search designs" /></label>}
          </header>
          {tab === "about" ? (
            <div className="creator-about">
              <h2>About Username</h2>
              <p>Original nail designs · New looks weekly · DM for collaborations</p>
              <dl><div><dt>Location</dt><dd>Shanghai</dd></div><div><dt>Joined</dt><dd>2022</dd></div></dl>
            </div>
          ) : (
            <>
              <div className="creator-toolbar">
                <strong>{count}</strong>
                <div className="creator-sort">
                  <button type="button" onClick={() => setSortOpen(!sortOpen)}>{sort}<img src={`${A}creator-chevron.svg`} alt="" /></button>
                  {sortOpen && <div><button type="button" className={sort === "Latest" ? "active" : ""} onClick={() => { setSort("Latest"); setSortOpen(false); }}>Latest</button><button type="button" className={sort === "Most popular" ? "active" : ""} onClick={() => { setSort("Most popular"); setSortOpen(false); }}>Most popular</button></div>}
                </div>
              </div>
              <div className="creator-design-grid">{cards.map((index) => <CreatorDesignCard collection={tab === "collections"} navigate={navigate} key={index} />)}</div>
              {visible < 9 && <button type="button" className="creator-more" onClick={() => setVisible(9)}>View more designs</button>}
            </>
          )}
        </section>
      </main>
    </Shell>
  );
}

type ProfileSection = "published" | "liked" | "collections" | "history" | "following" | "followers";

function ProfileSummary({ navigate }: { navigate: Navigate }) {
  return (
    <aside className="profile-summary">
      <div className="profile-summary-main">
        <span className="profile-avatar">U</span>
        <div className="profile-name"><strong>Username</strong><i>✓</i></div>
        <p className="profile-handle">@luna_naillab</p>
        <p className="profile-bio">Original nail designs · New looks weekly · DM for collaborations</p>
        <p className="profile-location"><img src={`${A}profile-location.svg`} alt="" />Shanghai <b>·</b> Joined in 2022</p>
        <div className="profile-summary-actions">
          <button type="button" onClick={() => navigate("account/edit")}>Edit profile</button>
          <button type="button" onClick={() => navigate("profile/published")}>My designs</button>
        </div>
      </div>
      <div className="profile-badge">
        <div><strong><img src={`${A}profile-badge.svg`} alt="" />Badge level</strong><button type="button">Details →</button></div>
        <p><b>X</b> Rating</p>
        <small>XXXXXXXXXXX</small>
      </div>
      <div className="profile-relations">
        <button type="button" onClick={() => navigate("profile/following")}><b>XXX</b><span>Following</span></button>
        <button type="button" onClick={() => navigate("profile/followers")}><b>XXX</b><span>Followers</span></button>
      </div>
      <div className="profile-totals">
        {[["XXX", "Designs"], ["XXX", "Likes"], ["XXX", "Saves"]].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
      </div>
    </aside>
  );
}

function ProfileDesignCard({ index, editable, navigate }: { index: number; editable: boolean; navigate: Navigate }) {
  const [hidden, setHidden] = useState(false);
  const [toolsDismissed, setToolsDismissed] = useState(false);
  const cardClass = `profile-design-card${hidden ? " hidden-design" : ""}${toolsDismissed ? " tools-dismissed" : ""}`;
  return (
    <article className={cardClass} onMouseLeave={() => setToolsDismissed(false)} onClick={() => !hidden && navigate(editable ? "my-design/Nail Design Title" : "design/Nail Design Title")} role="link" aria-disabled={hidden} tabIndex={0}>
      <div className="profile-design-image">
        <span>image</span>
        {editable && (
          <div className="profile-card-tools">
            <button className={hidden ? "active" : ""} type="button" aria-label={hidden ? "Show design" : "Hide design"} aria-pressed={hidden} onClick={(event) => { event.stopPropagation(); if (hidden) { setHidden(false); setToolsDismissed(true); event.currentTarget.blur(); } else { setHidden(true); } }}><img src={`${A}${hidden ? "profile-hide.svg" : "profile-visible.svg"}`} alt="" /></button>
            <button type="button" aria-label="Edit design" onClick={(event) => { event.stopPropagation(); navigate("my-design/Nail Design Title/edit"); }}><img src={`${A}profile-edit.svg`} alt="" /></button>
          </div>
        )}
      </div>
      <div className="profile-design-info">
        <strong>Nail Design Title</strong>
        <div className="profile-design-tags"><span>Shape</span><span>Style</span><span>Occasion</span></div>
        {(index < 3 || index === 8) && <div className="profile-design-meta"><UserHover className="profile-meta-user"><i>U</i>Username</UserHover><span><img src={`${A}profile-heart-small.svg`} alt="" />1.2K</span></div>}
      </div>
    </article>
  );
}

function ProfileDesignGrid({ section, query, navigate }: { section: "published" | "liked" | "history"; query: string; navigate: Navigate }) {
  const count = section === "history" ? 6 : 9;
  const visible = Array.from({ length: count }, (_, index) => index).filter(() => "nail design title".includes(query.toLowerCase()));
  return (
    <>
      <strong className="profile-result-count">{visible.length} designs</strong>
      <div className="profile-design-grid">{visible.map((index) => <ProfileDesignCard index={index} editable={section === "published"} navigate={navigate} key={index} />)}</div>
    </>
  );
}

function ProfileCollections({ query }: { query: string }) {
  const [albums, setAlbums] = useState(false);
  const [created, setCreated] = useState(false);
  const collectionNames = ["Spring Ombre Collection", "Short French Nail Ideas", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration"];
  const filtered = collectionNames.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  if (!albums) return (
    <div className="profile-collection-content">
      <div className="profile-subtabs"><button className="active" type="button">Saved designs</button><button type="button" onClick={() => setAlbums(true)}>Collection albums</button></div>
      <strong className="profile-result-count">9 designs</strong>
      <div className="profile-design-grid">{Array.from({ length: 9 }, (_, index) => <div className="profile-design-card" key={index}><div className="profile-design-image"><span>image</span></div><div className="profile-design-info"><strong>Nail Design Title</strong><div className="profile-design-tags"><span>Shape</span><span>Style</span><span>Occasion</span></div></div></div>)}</div>
    </div>
  );
  return (
    <div className="profile-collection-content">
      <div className="profile-subtabs"><button type="button" onClick={() => setAlbums(false)}>Saved designs</button><button className="active" type="button">Collection albums</button></div>
      <strong className="profile-result-count">{20 + (created ? 1 : 0)} albums</strong>
      <div className="profile-album-grid">
        <button type="button" className="profile-new-album" onClick={() => setCreated(true)}><i><img src={`${A}profile-plus.svg`} alt="" /></i>{created && <span>New Collection created</span>}</button>
        {filtered.map((name, index) => (
          <article className="profile-album" key={`${name}-${index}`}><div>image</div><section><strong>{name}</strong><p>{[12, 8, 15, 9, 18][index % 5]} designs</p><small>Updated {index % 2 ? "Mar 28" : "Apr 12"}, 2025</small></section></article>
        ))}
      </div>
    </div>
  );
}

function ProfileConnections({ section, navigate }: { section: "following" | "followers"; navigate: Navigate }) {
  const [query, setQuery] = useState("");
  const people = Array.from({ length: 15 }, (_, index) => ({ id: index, name: "Username" }));
  const [following, setFollowing] = useState(() => new Set(people.map((person) => person.id)));
  const toggle = (id: number) => setFollowing((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  return (
    <div className="profile-connections">
      <header>
        <nav><button className={section === "following" ? "active" : ""} onClick={() => navigate("profile/following")}>Following</button><button className={section === "followers" ? "active" : ""} onClick={() => navigate("profile/followers")}>Followers</button></nav>
        <span>{people.length}</span>
        <label className={query.trim() ? "active" : ""}><img src={`${A}profile-search.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search following or followers" /></label>
      </header>
      <div className="profile-people-grid">
        {people.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())).map((person) => (
          <article className="profile-person-card" key={person.id} role="link" tabIndex={0} onClick={() => navigate("creator/username")} onKeyDown={(event) => event.target === event.currentTarget && event.key === "Enter" && navigate("creator/username")}>
            <div className="profile-person-head"><i>U</i><span><strong>{person.name}</strong><small>@username</small></span></div>
            <div className="profile-person-stats">{[["2.4k", "Followers"], ["8.1k", "Likes"], ["36", "Designs"]].map(([value, label]) => <span key={label}><b>{value}</b><small>{label}</small></span>)}</div>
            <button type="button" className={following.has(person.id) ? "following" : ""} onClick={(event) => { event.stopPropagation(); toggle(person.id); }}>{following.has(person.id) && <img src={`${A}profile-check.svg`} alt="" />}{following.has(person.id) ? "Following" : "Follow"}</button>
            <div className="profile-recent-designs"><small>Recent Designs</small><div><span>image</span><span>image</span><span>image</span></div></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ section, navigate }: { section: ProfileSection; navigate: Navigate }) {
  const [query, setQuery] = useState("");
  const mainSection = section === "following" || section === "followers" ? "published" : section;
  const placeholders: Record<"published" | "liked" | "collections" | "history", string> = {
    published: "Search published designs",
    liked: "Search liked or saved designs",
    collections: "Search liked or saved designs",
    history: "Search browsing history",
  };
  return (
    <Shell navigate={navigate} account>
      <main className="profile-page">
        <ProfileSummary navigate={navigate} />
        <section className="profile-content">
          {section === "following" || section === "followers" ? <ProfileConnections section={section} navigate={navigate} /> : (
            <>
              <header className="profile-tabs">
                <nav>{(["published", "liked", "collections", "history"] as const).map((key) => <button type="button" className={mainSection === key ? "active" : ""} onClick={() => navigate(`profile/${key}`)} key={key}>{key[0].toUpperCase() + key.slice(1)}</button>)}</nav>
                <label className={query.trim() ? "active" : ""}><img src={`${A}profile-search.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholders[mainSection]} /></label>
              </header>
              {mainSection === "collections" ? <ProfileCollections query={query} /> : <ProfileDesignGrid section={mainSection} query={query} navigate={navigate} />}
            </>
          )}
        </section>
      </main>
    </Shell>
  );
}

function parseSearchState(value: string): SearchState {
  try {
    const parsed = JSON.parse(value) as Partial<SearchState>;
    return {
      query: typeof parsed.query === "string" ? parsed.query : "",
      shape: typeof parsed.shape === "string" ? parsed.shape : "",
      style: typeof parsed.style === "string" ? parsed.style : "",
      occasion: typeof parsed.occasion === "string" ? parsed.occasion : "",
    };
  } catch {
    return { query: "", shape: "Almond", style: "Elegant", occasion: "Seaside" };
  }
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate: Navigate = (next) => {
    const target = next === "landing" ? "" : next;
    if (getRoute() === target) return window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.hash = target ? `/${target}` : "";
  };

  const [section, ...rest] = route.split("/");
  const param = decodeURIComponent(rest.join("/"));
  if (section === "community") return <Community navigate={navigate} />;
  if (section === "search") return <SearchResultsPage key={param} initial={parseSearchState(param)} navigate={navigate} />;
  if (section === "collection") return <CollectionPage key={param} id={param} navigate={navigate} />;
  if (section === "design") return <DesignDetail key={route} focusComments={rest.at(-1) === "comments"} navigate={navigate} />;
  if (section === "my-design") return <DesignDetail key={route} own editMode={rest.at(-1) === "edit"} focusComments={rest.at(-1) === "comments"} navigate={navigate} />;
  if (section === "messages") return <MessagesPage key={param} initialContact={param || undefined} navigate={navigate} />;
  if (section === "notifications") {
    const notificationSection = (rest[0] || "all") as NotificationSection;
    return <NotificationsPage section={notificationNav.some(([key]) => key === notificationSection) ? notificationSection : "all"} navigate={navigate} />;
  }
  if (section === "account") {
    const accountSection = (rest[0] || "edit") as AccountSection;
    return <AccountPage section={accountSections.some(([key]) => key === accountSection) ? accountSection : "edit"} navigate={navigate} />;
  }
  if (section === "creator") return <CreatorProfilePage navigate={navigate} />;
  if (section === "saved") return <ProfilePage section="collections" navigate={navigate} />;
  if (section === "profile") {
    const profileSection = (rest[0] || "published") as ProfileSection;
    const sections: ProfileSection[] = ["published", "liked", "collections", "history", "following", "followers"];
    return <ProfilePage section={sections.includes(profileSection) ? profileSection : "published"} navigate={navigate} />;
  }
  return <Landing navigate={navigate} />;
}
