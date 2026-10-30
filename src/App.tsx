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

function usePageBlankDismiss(active: boolean, onDismiss: () => void) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useEffect(() => {
    if (!active) return;
    const dismissOnBlank = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("button, a, input, textarea, select, label, [role='button'], [role='dialog'], [data-keep-active]")) return;
      dismissRef.current();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    };
    document.addEventListener("pointerdown", dismissOnBlank);
    return () => document.removeEventListener("pointerdown", dismissOnBlank);
  }, [active]);
}

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
  const [liked, setLiked] = useState(false);
  return (
    <article className="collection-card">
      <button type="button" className={`placeholder cover shade-${index % 4} design-image-link`} onClick={onOpen} aria-label="Open Nail Design Title">image</button>
      <div className="collection-info">
        <strong>Nail Design Title</strong>
        <Tags tags={GENERIC_TAGS} />
        <div className="card-meta">
          <UserHover className="author"><i>U</i>Username</UserHover>
          <button type="button" aria-label={liked ? "Unlike design" : "Like design"} aria-pressed={liked} className={liked ? "likes card-like like-control on" : "likes card-like like-control"} onClick={() => setLiked(!liked)}><img src={liked ? C.cardHeartFilled : index === 0 ? icons.heartDark : icons.heartLanding} alt="" />{liked ? "1.3K" : "1.2K"}</button>
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
    ["◇", "Collect your inspiration"],
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
          <header><h2>{register ? "Create your account" : "Welcome back"}</h2><p>{register ? "Sign up to collect inspiration, follow creators, and share designs" : "Log in to explore more inspiration and start creating"}</p></header>
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
    <article className={prominent ? "community-card popular-card" : "community-card"}>
      <div className="community-image img-ph">
        <button type="button" className="design-image-link" onClick={onOpen} aria-label="Open Nail Design Title"><em>Image</em></button>
        <button
          aria-label={saved ? "Remove from collected" : "Collect design"}
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
            className={liked ? "likes card-like like-control on" : "likes card-like like-control"}
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
  usePageBlankDismiss(Boolean(open), () => setOpen(null));
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
  const uploadActive = getRoute() === "upload";
  return (
    <div className={account ? "community-page account-shell" : "community-page"}>
      <aside className="side-nav">
        <Brand compact onClick={() => navigate("landing")} />
        <div className="side-divider" />
        <nav>
          <button className={!account && !savedActive && !uploadActive ? "active" : ""} onClick={() => navigate("community")} aria-label="Home"><img src={`${A}account-4fffb.svg`} alt="" /></button>
          <button className={savedActive ? "active" : ""} onClick={() => navigate("saved")} aria-label="Collected"><img src={`${A}account-17dcc.svg`} alt="" /></button>
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
            <button className="upload" onClick={() => navigate("upload")}>Upload design</button>
            <button className="circle-button" aria-label="Achievements"><img src={`${A}account-e6ce1.svg`} alt="" /></button>
            <NotificationQuickMenu navigate={navigate} />
            <ProfileQuickMenu navigate={navigate} />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

const uploadPhotoSlots = [
  ["Front view", "Required"],
  ["Side view", "Required"],
  ["5-nail detail", "Group 1 · Required"],
  ["5-nail detail", "Group 2 · Required"],
  ["Add photo", "Optional"],
  ["Add photo", "Optional"],
  ["Add photo", "Optional"],
  ["Add photo", "Optional"],
  ["Add photo", "Optional"],
] as const;

function UploadTagSelect({ label, placeholder, options, max = 1, initialSelected = [], onSelectionChange }: { label: string; placeholder: string; options: readonly string[]; max?: number; initialSelected?: string[]; onSelectionChange: (selected: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  usePageBlankDismiss(open, () => setOpen(false));
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      const next = selected.filter((item) => item !== option);
      setSelected(next);
      onSelectionChange(next);
      return;
    }
    if (selected.length >= max) return;
    const next = [...selected, option];
    setSelected(next);
    onSelectionChange(next);
    if (next.length === max) setOpen(false);
  };
  return (
    <div className="upload-tag-field" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}>
      <span className="upload-tag-label">{label}{max > 1 && <small>Up to {max}</small>}</span>
      <div
        className={open ? "upload-tag-control open" : "upload-tag-control"}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setOpen(!open)}
      >
        <div className="upload-selected-tags">
          {selected.length ? selected.map((item) => (
            <button type="button" className="upload-tag-chip" aria-label={`Remove ${item}`} onClick={(event) => { event.stopPropagation(); toggle(item); }} key={item}>
              {item}<i>×</i>
            </button>
          )) : <span>{placeholder}</span>}
        </div>
        <img className={open ? "open" : ""} src={`${A}70f7e.svg`} alt="" />
      </div>
      {open && (
        <div className="upload-tag-menu">
          {options.map((option) => {
            const active = selected.includes(option);
            const disabled = !active && selected.length >= max;
            return <button type="button" className={active ? "active" : ""} disabled={disabled} onClick={() => toggle(option)} key={option}><span>{option}</span>{active && <i>✓</i>}</button>;
          })}
        </div>
      )}
    </div>
  );
}

function UploadDesignPage({ navigate, editing = false, studioEdited = false }: { navigate: Navigate; editing?: boolean; studioEdited?: boolean }) {
  const hasStudioDesign = studioEdited;
  const initialTags = editing
    ? { shape: ["Almond"], style: ["Elegant"], occasion: ["Everyday"] }
    : { shape: [] as string[], style: [] as string[], occasion: [] as string[] };
  const fileInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>(editing ? ["existing-cover", "existing-front", "existing-side", "existing-detail"] : []);
  const [name, setName] = useState(editing ? "Moonlight Almond Ombre" : "");
  const [description, setDescription] = useState(editing ? "A soft almond ombre with a clean, sheer finish." : "");
  const [tags, setTags] = useState(initialTags);
  const [source, setSource] = useState(editing ? "original" : "");
  const [referenceLink, setReferenceLink] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorLink, setCreatorLink] = useState("");
  const [remakePermission, setRemakePermission] = useState<"allow" | "deny">("allow");
  const [status, setStatus] = useState("");
  const sourceComplete = source === "original"
    || (source === "online" && Boolean(referenceLink.trim()))
    || (source === "repost" && Boolean(creatorName.trim()) && Boolean(creatorLink.trim()));
  const canSubmit = photos.length >= 4
    && Boolean(name.trim())
    && Boolean(description.trim())
    && tags.shape.length > 0
    && tags.style.length > 0
    && tags.occasion.length > 0
    && (hasStudioDesign || sourceComplete);
  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotos((current) => [...current, ...Array.from(files).map((file) => URL.createObjectURL(file))].slice(0, 9));
  };
  const removePhoto = (index: number) => {
    setPhotos((current) => {
      const photo = current[index];
      if (photo?.startsWith("blob:")) URL.revokeObjectURL(photo);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  };
  return (
    <Shell navigate={navigate}>
      <main className="upload-workspace">
        <div className="upload-scroll">
          <header className="upload-page-header">
            <h1>{editing ? "Edit published design" : "Upload a nail design"}</h1>
            <p>{editing ? "Update the details of your published work." : "Share a nail look with the community."}</p>
          </header>
          <div className="upload-layout">
            <section className="upload-photos">
              <div className="upload-section-heading"><strong>Design photos</strong><span>{photos.length} / 9</span></div>
              <p>Upload 4–9 photos, including your cover.</p>
              <div className="upload-cover">
                {photos[0]?.startsWith("existing-") ? <span className="upload-existing-photo">Existing cover</span> : photos[0] ? <img className="upload-cover-photo" src={photos[0]} alt="Cover preview" /> : <img src={`${A}286e8.svg`} alt="" />}
                {!photos[0] && <><strong>Cover preview</strong><span>Upload photos first, then choose one as cover.</span></>}
                <small>Cover</small>
              </div>
              <input ref={fileInput} hidden type="file" accept="image/*" multiple onChange={(event) => addPhotos(event.target.files)} />
              <div className="upload-photo-grid">
                {uploadPhotoSlots.map(([label, hint], index) => (
                  <button type="button" className={index < 4 ? "upload-photo-slot required" : "upload-photo-slot"} onClick={() => fileInput.current?.click()} key={index}>
                    {photos[index]?.startsWith("existing-") ? <span className="upload-existing-photo">Existing photo</span> : photos[index] ? <img className="upload-slot-photo" src={photos[index]} alt={`${label} preview`} /> : <img src={`${A}${index < 4 ? "80c7c.svg" : "cdb63.svg"}`} alt="" />}
                    {!photos[index] && <span>{label}<small>{hint}</small></span>}
                    {photos[index] && <span className="upload-photo-remove" role="button" tabIndex={0} aria-label={`Remove ${label} photo`} onClick={(event) => { event.stopPropagation(); removePhoto(index); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); removePhoto(index); } }}>×</span>}
                  </button>
                ))}
              </div>
            </section>
            <section className={hasStudioDesign ? "upload-form-panel" : "upload-form-panel source-mode"}>
              <div className="upload-form-group">
                <h2>Post information</h2>
                <label className="upload-field"><span>Style name</span><div><input maxLength={50} value={name} onChange={(event) => setName(event.target.value)} placeholder="Name this nail style" /><small>{name.length}/50</small></div></label>
                <label className="upload-field upload-description"><span>Description</span><div><textarea maxLength={150} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Briefly describe the look." /><small>{description.length}/150</small></div></label>
              </div>
              <div className="upload-form-group">
                <h2>Tags</h2>
                <div className="upload-tags-row">
                  <UploadTagSelect label="Shape" placeholder="Select shapes" max={4} options={["Almond", "Square", "Round", "Stiletto"]} initialSelected={initialTags.shape} onSelectionChange={(selected) => setTags((current) => ({ ...current, shape: selected }))} />
                  <UploadTagSelect label="Style" placeholder="Select styles" max={2} options={["Minimalist", "Glitter", "Elegant", "Fresh", "Punk", "Vintage"]} initialSelected={initialTags.style} onSelectionChange={(selected) => setTags((current) => ({ ...current, style: selected }))} />
                  <UploadTagSelect label="Occasion" placeholder="Select occasions" max={2} options={["Everyday", "Party", "Wedding", "Office", "Evening", "Travel"]} initialSelected={initialTags.occasion} onSelectionChange={(selected) => setTags((current) => ({ ...current, occasion: selected }))} />
                </div>
              </div>
              {!hasStudioDesign && <div className="upload-origin-grid">
                <section className="upload-origin-card">
                  <h2>Creation source</h2>
                  <p>Choose the option that best describes where this design came from.</p>
                  <fieldset className="upload-source">
                    <div className="upload-source-row">
                      <label className={source === "original" ? "selected" : ""}><input type="radio" name="image-source" checked={source === "original"} onChange={() => setSource("original")} /><span><strong>Original work</strong></span></label>
                      {source === "original" && <p className="upload-original-note"><span>I confirm that this design and the uploaded images are my original work.</span></p>}
                    </div>
                    <div className="upload-source-row">
                      <label className={source === "online" ? "selected" : ""}><input type="radio" name="image-source" checked={source === "online"} onChange={() => setSource("online")} /><span><strong>Online reference</strong></span></label>
                      {source === "online" && <input className="upload-source-link" type="url" value={referenceLink} onChange={(event) => setReferenceLink(event.target.value)} placeholder="Add the reference link" />}
                    </div>
                    <div className="upload-source-row">
                      <label className={source === "repost" ? "selected" : ""}><input type="radio" name="image-source" checked={source === "repost"} onChange={() => setSource("repost")} /><span><strong>Repost with credit</strong></span></label>
                      {source === "repost" && <div className="upload-credit-fields"><input type="text" value={creatorName} onChange={(event) => setCreatorName(event.target.value)} placeholder="Original creator name" /><input type="url" value={creatorLink} onChange={(event) => setCreatorLink(event.target.value)} placeholder="Original post or creator link" /></div>}
                    </div>
                  </fieldset>
                </section>
              </div>}
              {hasStudioDesign && (
                <fieldset className="upload-remake-permission">
                  <legend>One-click remake</legend>
                  <div>
                    <label><input type="radio" name="remake-permission" checked={remakePermission === "allow"} onChange={() => setRemakePermission("allow")} />Allow other users to remake this design</label>
                      <label><input type="radio" name="remake-permission" checked={remakePermission === "deny"} onChange={() => setRemakePermission("deny")} />Don’t allow</label>
                  </div>
                </fieldset>
              )}
              <div className="upload-studio-group">
                {hasStudioDesign && (
                  <section className="upload-design-details">
                    <h2>Design details</h2>
                    <div>
                      {[["Shape", "Almond"], ["Length", "Medium-long"], ["Base color", "Cream almond gray"], ["Finish", "Sheer ombre"]].map(([label, value]) => (
                        <div key={label}><small>{label}</small><strong>{value}</strong></div>
                      ))}
                    </div>
                  </section>
                )}
                <section className="upload-studio">
                  <div>
                    <div className="upload-studio-title"><h2>{hasStudioDesign ? "Edit this design" : "Create with this design"}</h2>{!hasStudioDesign && <span>Try it · Optional</span>}</div>
                    <p>{hasStudioDesign ? "Continue editing the linked design in Design Studio." : "Use your photos as references to build an editable nail design."}</p>
                    <button type="button" disabled={!photos.length}>{hasStudioDesign ? "Edit in Design Studio" : "Open in Design Studio"}</button>
                  </div>
                  {hasStudioDesign ? (
                    <div className="upload-studio-preview generated" aria-label="Generated Design Studio preview">
                      <div className="studio-preview-placeholder"><img src={`${A}286e8.svg`} alt="" /><span>Design preview</span></div>
                    </div>
                  ) : (
                    <div className="upload-studio-preview"><i><img src={`${A}aab04.svg`} alt="" /></i><strong>Studio highlights</strong><small>GIF preview</small></div>
                  )}
                </section>
              </div>
            </section>
          </div>
        </div>
        <footer className="upload-footer">
          {status && <span role="status">{status}</span>}
          <button type="button" onClick={() => navigate(editing ? "profile/published" : "community")}>Cancel</button>
          {!editing && <button type="button" onClick={() => setStatus("Saved to Unpublished")}>Save to Unpublished</button>}
          <button type="button" className="primary" disabled={!canSubmit} onClick={() => navigate("upload/success")}>{editing ? "Save changes" : "Submit"}</button>
        </footer>
      </main>
    </Shell>
  );
}

function UploadSuccessPage({ navigate }: { navigate: Navigate }) {
  useEffect(() => {
    const redirect = window.setTimeout(() => navigate("profile"), 3000);
    return () => window.clearTimeout(redirect);
  }, [navigate]);

  return (
    <Shell navigate={navigate}>
      <main className="upload-success">
        <section role="status" aria-live="polite">
          <i><img src={`${A}12d06.svg`} alt="" /></i>
          <h1>Submitted successfully</h1>
          <p>Your design is waiting for review.</p>
          <small>We’ll notify you of the review result in Message Center. Taking you to your profile shortly.</small>
        </section>
      </main>
    </Shell>
  );
}

function CategoryDesignCard({ index, navigate, tags = GENERIC_TAGS, heartIcon }: { index: number; navigate: Navigate; tags?: readonly string[]; heartIcon?: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="category-design-card">
      <button type="button" className="category-design-image design-image-link" onClick={() => navigate(index === 0 ? "design/photo-upload-example" : "design/Nail Design Title")} aria-label="Open Nail Design Title">image</button>
      <div className="category-design-copy">
        <strong>Nail Design Title</strong>
        <div className="category-design-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="category-design-footer">
          <UserHover><button type="button" className="category-author" onClick={(event) => { event.stopPropagation(); navigate("creator/username"); }}><i>U</i>Username</button></UserHover>
          <button type="button" aria-label={liked ? "Unlike design" : "Like design"} aria-pressed={liked} className={liked ? "category-like like-control active" : "category-like like-control"} onClick={(event) => { event.stopPropagation(); setLiked(!liked); }}><img src={liked ? C.cardHeartFilled : heartIcon || `${A}category-heart-${index % 2 ? "b" : "a"}.svg`} alt="" />{liked ? "1.3K" : "1.2K"}</button>
        </div>
      </div>
    </article>
  );
}

function SearchResultsPage({ initial, navigate }: { initial: SearchState; navigate: Navigate }) {
  const [searchState, setSearchState] = useState(initial);
  const [sort, setSort] = useState("Most relevant");
  const [sortOpen, setSortOpen] = useState(false);
  usePageBlankDismiss(sortOpen, () => setSortOpen(false));
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
              <SectionHeading title="Studio Spotlight" subtitle="Official tutorials and exclusive designs from featured creators." action="View all →" />
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

type DetailReply = { id: number; name: string; text: string; time: string; likes: number; liked?: boolean; creator?: boolean };
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

type ProfileReturnSection = "liked" | "collections" | "history";

function DesignDetail({ navigate, own = false, focusComments = false, photoOnly = false, returnSection }: { navigate: Navigate; own?: boolean; focusComments?: boolean; photoOnly?: boolean; returnSection?: ProfileReturnSection }) {
  const [thumb, setThumb] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [makerDialog, setMakerDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [ownHidden, setOwnHidden] = useState(false);
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
  usePageBlankDismiss(moreMenu, () => setMoreMenu(false));
  usePageBlankDismiss(composerOpen, () => {
    setComposerOpen(false);
    setReplyTo(null);
    textarea.current?.blur();
  });
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
  const toggleReplyLike = (commentId: number, replyId: number) => {
    setComments((current) => current.map((comment) => comment.id === commentId
      ? { ...comment, replies: comment.replies?.map((reply) => reply.id === replyId ? { ...reply, liked: !reply.liked } : reply) }
      : comment));
  };
  const visibleComments = [...comments];
  const designDetails: readonly (readonly [string, string])[] | "" = photoOnly
    ? ""
    : [["Shape", "Almond"], ["Length", "Medium-long"], ["Base color", "Cream almond gray"], ["Finish", "Sheer ombre"]];
  const backRoute = own ? "profile" : returnSection ? `profile/${returnSection}` : "community";
  const backLabel = own
    ? "Back to my profile"
    : returnSection === "liked"
      ? "Back to liked designs"
      : returnSection === "collections"
        ? "Back to collected designs"
        : returnSection === "history"
          ? "Back to history"
          : "Back to community";
  if (!sortLatest) visibleComments.reverse();
  useEffect(() => {
    if (!focusComments) return;
    window.requestAnimationFrame(() => document.getElementById("design-comments")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [focusComments]);
  return (
    <Shell navigate={navigate}>
      <main className="detail-page">
        <button className="back-link" onClick={() => navigate(backRoute)}><img src={C.back} alt="" />{backLabel}</button>
        <section className="detail-card">
          <div className="detail-media">
            <button className="detail-preview" onClick={() => setLightbox(true)} aria-label="View large image"><span>Nail design preview</span></button>
            <div className="detail-thumbs">{[0, 1, 2, 3].map((n) => <button key={n} className={n === thumb ? "on" : ""} onClick={() => setThumb(n)} aria-label={`Image ${n + 1}`} />)}</div>
          </div>
          <div className="detail-info">
            <div className="detail-title-row">
              <h1>Moonlight Almond Ombre</h1>
              <div className="detail-more-wrap">
                <button type="button" className="detail-more" aria-label="More options" aria-expanded={moreMenu} onClick={() => setMoreMenu(!moreMenu)}><img src={`${A}48a1a.svg`} alt="" /></button>
                {moreMenu && (
                  <div className="detail-more-menu">
                    {own ? (
                      <>
                        <button type="button" onClick={() => { setOwnHidden(!ownHidden); setMoreMenu(false); }}><img src={`${A}${ownHidden ? "profile-hide.svg" : "profile-visible.svg"}`} alt="" />{ownHidden ? "Show design" : "Hide design"}</button>
                        <button type="button" onClick={() => navigate("my-design/Nail Design Title/edit")}><img src={`${A}profile-edit.svg`} alt="" />Edit design</button>
                        <button type="button" onClick={() => navigate("profile/published")}><img src={`${A}d0478.svg`} alt="" />Delete design</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => { setMoreMenu(false); setModerationView("report"); }}><img src={`${A}d0478.svg`} alt="" />Report design</button>
                        <button type="button" onClick={() => { setMoreMenu(false); setModerationView("block"); }}><img src={`${A}74961.svg`} alt="" />Block creator</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="detail-author">
              {own
                ? <button type="button" className="creator-entry" onClick={() => navigate("profile/published")}><i>L</i><span><strong>Luna Nail Lab</strong><small>3 days ago <b>·</b> Shanghai <b>·</b> 86 designs</small></span></button>
                : <UserHover><button type="button" className="creator-entry" onClick={() => navigate("creator/username")}><i>L</i><span><strong>Luna Nail Lab</strong><small>3 days ago <b>·</b> Shanghai <b>·</b> 86 designs</small></span></button></UserHover>}
              {!own && <button className="follow-sm" onClick={() => setFollowing(!following)}>{following ? "Following" : "+ Follow"}</button>}
            </div>
            <div className="detail-stats">
              <div>
                <button aria-label={liked ? "Unlike design" : "Like design"} aria-pressed={liked} onClick={() => setLiked(!liked)} className={liked ? "like-control on" : "like-control"}><img src={liked ? C.cardHeartFilled : C.heartLg} alt="" />{liked ? "2,487" : "2,486"}</button>
                <button onClick={() => document.getElementById("design-comments")?.scrollIntoView({ behavior: "smooth", block: "start" })}><img src={C.message} alt="" />{128 + postedCount}</button>
              </div>
              <div>
                <button aria-label={saved ? "Remove from collected" : "Collect design"} aria-pressed={saved} onClick={() => setSaved(!saved)} className={saved ? "save-control on" : "save-control"}><img src={saved ? C.cardSaveFilled : C.save} alt="" />{saved ? "Collected" : "Collect"}</button>
                <button onClick={() => setShareDialog(true)}><img src={C.share} alt="" />Share</button>
              </div>
            </div>
            <div className="detail-metadata">
              <div className="detail-overview">
                <div className="detail-tags">{GENERIC_TAGS.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="detail-about"><h3>About this design</h3><p>XXXXXXXX<br />XXXXXXXXXXXXXXXXXXXX<br />XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p></div>
                <div className="detail-origin">
                  <div><small>Originality</small><strong>Original work</strong></div>
                  <div><small>Source</small><strong>{photoOnly ? "Uploaded photos" : "Design Studio"}</strong></div>
                </div>
              </div>
              <div className={designDetails ? "detail-specs" : "detail-specs empty"}><h3>Design details</h3>{designDetails ? <div>{designDetails.map(([key, value]) => <div key={key}><small>{key}</small><b>{value}</b></div>)}</div> : <div className="detail-details-empty"><span>—</span><p>This design was uploaded as photos and has no linked Design Studio details.</p></div>}</div>
            </div>
            <div className="detail-create">
              <div><h3>{photoOnly ? "Create with these photos" : "Create from this design"}</h3><p>{photoOnly ? "Use the uploaded photos as references for a new editable design." : "Keep this design and make it your own."}</p></div>
              <button className="primary">{photoOnly ? "Start in Design Studio" : "Open in Design Studio"} <span>→</span></button>
              <button className="secondary" onClick={() => setMakerDialog(true)}>Send to maker</button>
            </div>
          </div>
        </section>
        <div className="detail-lower">
          <section className="comments" id="design-comments">
            <div className="comments-head"><h2>Comments <span>{128 + postedCount}</span></h2><button type="button" onClick={() => setSortLatest(!sortLatest)}>{sortLatest ? "Latest" : "Oldest"}<img src={C.chevron} alt="" /></button></div>
            <div className={composerOpen ? "comment-form focused" : "comment-form"}>
              <div><i>U</i><div className="comment-input-wrap"><textarea ref={textarea} maxLength={300} value={draft} onFocus={() => setComposerOpen(true)} onChange={(event) => setDraft(event.target.value)} placeholder={replyTo ? "Write a reply…" : "Write a comment…"} /><small className="comment-count">{draft.length}/300</small></div></div>
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
                  <div className="comment-meta"><small>{c.time}</small><div><button type="button" aria-label={c.liked ? "Unlike comment" : "Like comment"} aria-pressed={Boolean(c.liked)} className={c.liked ? "comment-like like-control on" : "comment-like like-control"} onClick={() => setComments((current) => current.map((comment) => comment.id === c.id ? { ...comment, liked: !comment.liked } : comment))}><img src={c.liked ? C.cardHeartFilled : C.heartSm} alt="" />{c.likes + (c.liked ? 1 : 0)}</button><button type="button" onClick={() => beginReply(c.id)}>Reply</button></div></div>
                  {c.replies?.map((reply) => (
                    <div className="comment reply" key={reply.id}>
                      <UserHover className="comment-user-avatar"><i>U</i></UserHover>
                      <div className="comment-body">
                        <UserHover><strong>{reply.name}{reply.creator && <em>Creator</em>}</strong></UserHover>
                        <p>{reply.text}</p>
                        <div className="comment-meta"><small>{reply.time}</small><div><button type="button" aria-label={reply.liked ? "Unlike reply" : "Like reply"} aria-pressed={Boolean(reply.liked)} className={reply.liked ? "comment-like like-control on" : "comment-like like-control"} onClick={() => toggleReplyLike(c.id, reply.id)}><img src={reply.liked ? C.cardHeartFilled : C.heartXs} alt="" />{reply.likes + (reply.liked ? 1 : 0)}</button><button type="button" onClick={() => beginReply(c.id)}>Reply</button></div></div>
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
      {makerDialog && <ContactDialog mode="maker" onClose={() => setMakerDialog(false)} onChoose={(name) => navigate(`messages/${encodeURIComponent(name)}/share-design`)} />}
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

type NotificationSection = "all" | "likes" | "comments" | "followers" | "system" | "device";
type NotificationKind = "like" | "save" | "comment" | "follow" | "system" | "device";
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
  ["likes", "Likes & collections", "notify-29efd.svg"],
  ["comments", "Comments & replies", "notify-9ade9.svg"],
  ["followers", "New followers", "notify-29a71.svg"],
  ["system", "System updates", "notify-c519d.svg"],
];

const initialNotifications: NotificationEntry[] = [
  { id: 1, kind: "like", message: "Username liked your design “Nail Design Title”", time: "Just now", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 2, kind: "save", message: "Username collected your design “Nail Design Title”", time: "10 minutes ago", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 3, kind: "comment", message: "Username commented on your design: “XXXXXXXXXX”", time: "10 minutes ago", group: "Today", unread: true, thumbnail: true, target: { type: "own-design", id: "Nail Design Title", anchor: "comments" } },
  { id: 4, kind: "follow", message: "Username followed you", time: "1 hour ago", group: "Today", unread: true, target: { type: "creator", id: "username" } },
  { id: 5, kind: "system", message: "System update: Your design was approved and is now public.", time: "1 hour ago", group: "Today", unread: false, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 6, kind: "system", message: "System update: Your design was approved and is now public.", time: "Yesterday, 14:30", group: "Yesterday", unread: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 7, kind: "like", message: "Username liked your design “Nail Design Title”", time: "Yesterday, 09:15", group: "Yesterday", unread: false, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 8, kind: "save", message: "Username collected your design “Nail Design Title”", time: "Yesterday, 08:42", group: "Yesterday", unread: false, thumbnail: true, target: { type: "own-design", id: "Nail Design Title" } },
  { id: 9, kind: "comment", message: "Username replied to your comment: “XXXXXXXX”", time: "Yesterday, 08:42", group: "Yesterday", unread: false, thumbnail: true, target: { type: "other-design", id: "Nail Design Title", anchor: "comments" } },
  { id: 10, kind: "follow", message: "Username followed you", time: "Yesterday, 09:15", group: "Yesterday", unread: false, following: true, target: { type: "creator", id: "username" } },
  { id: 11, kind: "follow", message: "Username followed you", time: "Yesterday, 08:42", group: "Yesterday", unread: false, target: { type: "creator", id: "username" } },
  { id: 12, kind: "like", message: "Username liked your comment on “Nail Design Title”", time: "Yesterday, 08:10", group: "Yesterday", unread: false, thumbnail: true, target: { type: "other-design", id: "Nail Design Title", anchor: "comments" } },
  { id: 13, kind: "device", message: "Device update: Tint Nail Printer is connected and ready to use.", time: "Just now", group: "Today", unread: true },
];

function NotificationQuickMenu({ navigate }: { navigate: Navigate }) {
  const counts = ["5", "2", "1", "1", "1"];
  return (
    <div className="header-notification-wrap">
      <button className="circle-button" aria-label="Notifications" onClick={() => navigate("notifications/all")}><img src={`${A}account-48ef5.svg`} alt="" /></button>
      <div className="header-notification-menu" role="menu" aria-label="Notification shortcuts">
        <section>
          <strong>Notifications</strong>
          {notificationNav.map(([key, label, icon], index) => <button type="button" role="menuitem" onClick={() => navigate(`notifications/${key}`)} key={key}><img src={`${A}${icon}`} alt="" /><span>{label}</span><i>{counts[index]}</i></button>)}
        </section>
        <section>
          <strong>Messages</strong>
          <button type="button" role="menuitem" onClick={() => navigate("messages")}><img src={`${A}notify-a268d.svg`} alt="" /><span>Messages</span></button>
        </section>
        <section>
          <strong>Device</strong>
          <button type="button" role="menuitem" onClick={() => navigate("notifications/device")}><img src={`${A}account-device-machine.svg`} alt="" /><span>Device information</span><i>1</i></button>
        </section>
      </div>
    </div>
  );
}

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
      <div className="notification-divider" />
      <p>Device</p>
      <button type="button" className={active === "device" ? "active" : ""} onClick={() => navigate("notifications/device")}>
        <img src={`${A}account-device-machine.svg`} alt="" /><span>Device information</span><i>1</i>
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
  device: "account-device-machine.svg",
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
      {item.kind === "system" ? <span className="notification-avatar system">T</span> : item.kind === "device" ? <span className="notification-avatar device">D</span> : <span className="notification-avatar">U</span>}
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
    || (section === "system" && item.kind === "system")
    || (section === "device" && item.kind === "device");
  const visible = items.filter(filter);
  const titles: Record<NotificationSection, string> = {
    all: "All notifications",
    likes: "Likes & collections",
    comments: "Comments & replies",
    followers: "New followers",
    system: "System updates",
    device: "Device information",
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

function ChatDesignCard() {
  return (
    <div className="chat-design-card">
      <span>image</span>
      <div><strong>Nail Design Title</strong><small>Shape · Style · Occasion</small></div>
    </div>
  );
}

function MessagesPage({ navigate, initialContact, sharedDesign = false }: { navigate: Navigate; initialContact?: string; sharedDesign?: boolean }) {
  const isNewContact = Boolean(initialContact && !initialConversations.some((item) => item.name === initialContact));
  const [selected, setSelected] = useState(initialContact || "");
  const [dialog, setDialog] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [moderationView, setModerationView] = useState<ModerationView | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [failed, setFailed] = useState<Record<string, string>>({});
  const [pendingDesign, setPendingDesign] = useState(sharedDesign);
  const [designSent, setDesignSent] = useState(false);
  usePageBlankDismiss(moreMenu, () => setMoreMenu(false));
  const currentSent = selected ? sent[selected] || [] : [];
  const failedMessage = selected ? failed[selected] : "";
  const conversations: Conversation[] = isNewContact && initialContact
    ? [{
      name: initialContact,
        time: "New",
        preview: failed[initialContact] ? `Not sent: ${failed[initialContact]}` : sent[initialContact]?.at(-1) || (designSent ? "Design shared" : "Start a chat"),
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
                  <div><Avatar size={40} /><span><strong>{selected}</strong>{isNewContact && <small>Shanghai · 86 designs</small>}</span></div>
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
                  {isNewContact && (designSent || currentSent.length > 0 || failedMessage) && <time>10:30</time>}
                  {designSent && <div className="outgoing design-share-message"><ChatDesignCard /></div>}
                  {designSent && currentSent.length === 0 && !failedMessage && <p className="message-limit">You can send 1 more text message until the other party follows or replies to you</p>}
                  {currentSent.map((message, index) => <div className="outgoing" key={`${message}-${index}`}><span>{message}</span></div>)}
                  {failedMessage && <div className="outgoing failed" role="status"><span>{failedMessage}<small>Not sent</small></span></div>}
                  {failedMessage && <p className="message-limit">You’ve reached the 1-message limit. You can send another message after the other party follows or replies to you.</p>}
                </div>
                {pendingDesign && <section className="chat-share-confirm"><header><div><strong>Send this design?</strong><small>Confirm before sharing it in this conversation.</small></div></header><ChatDesignCard /><div className="chat-share-actions"><button type="button" onClick={() => setPendingDesign(false)}>Cancel</button><button type="button" onClick={() => { setPendingDesign(false); setDesignSent(true); }}>Send design</button></div></section>}
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
      <PreferenceRow title="Likes & collections" description="Get notified when someone likes or collects your nail designs." />
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
      <PreferenceRow title="Public collected designs" description="Let others view the nail designs you’ve collected from your profile. Turn off to keep them private." initial={false} />
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

type CreatorTab = "published" | "collections" | "about";

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
        {[["86", "Designs"], ["5,801", "Collections"]].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
      </div>
    </aside>
  );
}

function CreatorProfilePage({ navigate }: { navigate: Navigate }) {
  const [tab, setTab] = useState<CreatorTab>("published");
  const [collectionView, setCollectionView] = useState<"designs" | "albums">("designs");
  const [selectedPublicAlbum, setSelectedPublicAlbum] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"Latest" | "Most popular">("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(6);
  usePageBlankDismiss(sortOpen, () => setSortOpen(false));
  const cards = Array.from({ length: visible }, (_, index) => index).filter(() => `${tab} nail design title collection`.includes(query.trim().toLowerCase()));
  const collectedCards = Array.from({ length: 9 }, (_, index) => index).filter(() => "nail design title collection".includes(query.trim().toLowerCase()));
  const publicAlbums = ["Spring Ombre Collection", "Short French Nail Ideas", "Minimal Wedding Nails", "Soft Chrome Favorites", "Everyday Almond Looks", "Summer Color Ideas", "French Tip Inspiration", "Evening Shimmer"];
  const visiblePublicAlbums = publicAlbums.map((name, index) => ({ name, index, designCount: [12, 8, 15, 9, 18][index % 5] })).filter((album) => album.name.toLowerCase().includes(query.trim().toLowerCase()));
  const activePublicAlbum = selectedPublicAlbum === null ? null : { name: publicAlbums[selectedPublicAlbum], index: selectedPublicAlbum, designCount: [12, 8, 15, 9, 18][selectedPublicAlbum % 5] };
  return (
    <Shell navigate={navigate}>
      <main className="creator-page">
        <CreatorSummary navigate={navigate} />
        <section className="creator-content">
          <header className="creator-tabs">
            <nav>{(["published", "collections", "about"] as const).map((key) => <button type="button" className={tab === key ? "active" : ""} onClick={() => { setTab(key); setVisible(6); setSelectedPublicAlbum(null); }} key={key}>{key[0].toUpperCase() + key.slice(1)}</button>)}</nav>
            {tab !== "about" && <label className={query.trim() ? "active" : ""}><img src={`${A}creator-search.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "collections" && collectionView === "albums" ? "Search collection albums" : "Search designs"} /></label>}
          </header>
          {tab === "collections" && selectedPublicAlbum === null && (
            <div className="profile-subtabs">
              <button type="button" className={collectionView === "designs" ? "active" : ""} onClick={() => setCollectionView("designs")}>Collected designs</button>
              <button type="button" className={collectionView === "albums" ? "active" : ""} onClick={() => setCollectionView("albums")}>Collection albums</button>
            </div>
          )}
          {tab === "about" ? (
            <div className="creator-about">
              <h2>About Username</h2>
              <p>Original nail designs · New looks weekly · DM for collaborations</p>
              <dl><div><dt>Location</dt><dd>Shanghai</dd></div><div><dt>Joined</dt><dd>2022</dd></div></dl>
            </div>
          ) : activePublicAlbum ? (
            <div className="profile-collection-detail creator-collection-detail">
              <header><button type="button" onClick={() => setSelectedPublicAlbum(null)}>← Collection albums</button><div><h2>{activePublicAlbum.name}</h2><small>Public · {activePublicAlbum.designCount} designs</small></div></header>
              <div className="profile-design-grid">{Array.from({ length: Math.min(activePublicAlbum.designCount, 9) }, (_, index) => <ProfileDesignCard index={index} editable={false} initiallyLiked={false} initiallySaved removeOnUnsave={false} navigate={navigate} onDelete={() => {}} key={index} />)}</div>
            </div>
          ) : tab === "collections" && collectionView === "albums" ? (
            <>
              <strong className="profile-result-count">{visiblePublicAlbums.length} public collection albums</strong>
              <div className="profile-album-grid">
                {visiblePublicAlbums.map((album) => (
                  <article className="profile-album" role="link" tabIndex={0} onClick={() => setSelectedPublicAlbum(album.index)} onKeyDown={(event) => event.target === event.currentTarget && event.key === "Enter" && setSelectedPublicAlbum(album.index)} key={album.name}>
                    <div className="profile-album-image"><span>image</span></div>
                    <section><strong>{album.name}</strong><p>{album.designCount} designs</p><small>Public · Updated Apr 12, 2025</small></section>
                  </article>
                ))}
              </div>
            </>
          ) : tab === "collections" ? (
            <>
              <strong className="profile-result-count">{collectedCards.length} collected designs</strong>
              <div className="profile-design-grid">{collectedCards.map((index) => <ProfileDesignCard index={index} editable={false} initiallyLiked={false} initiallySaved removeOnUnsave={false} navigate={navigate} onDelete={() => {}} key={index} />)}</div>
            </>
          ) : (
            <>
              <div className="creator-toolbar">
                <strong>86 designs</strong>
                <div className="creator-sort">
                  <button type="button" onClick={() => setSortOpen(!sortOpen)}>{sort}<img src={`${A}creator-chevron.svg`} alt="" /></button>
                  {sortOpen && <div><button type="button" className={sort === "Latest" ? "active" : ""} onClick={() => { setSort("Latest"); setSortOpen(false); }}>Latest</button><button type="button" className={sort === "Most popular" ? "active" : ""} onClick={() => { setSort("Most popular"); setSortOpen(false); }}>Most popular</button></div>}
                </div>
              </div>
              <div className="creator-design-grid">{cards.map((index) => <ProfileDesignCard index={index} editable={false} publishedInfo initiallyLiked={false} initiallySaved={false} removeOnUnsave={false} navigate={navigate} onDelete={() => {}} key={index} />)}</div>
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
        <div className="profile-rating"><i>X</i><div><strong>Rating</strong><small>XXXXXXXXXXX</small></div></div>
      </div>
      <div className="profile-relations">
        <button type="button" onClick={() => navigate("profile/following")}><b>XXX</b><span>Following</span></button>
        <button type="button" onClick={() => navigate("profile/followers")}><b>XXX</b><span>Followers</span></button>
      </div>
      <div className="profile-totals">
        {[["XXX", "Designs"], ["XXX", "Likes"], ["XXX", "Collections"]].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
      </div>
    </aside>
  );
}

function ProfileQuickMenu({ navigate }: { navigate: Navigate }) {
  return (
    <div className="header-profile-wrap">
      <button className="circle-button" aria-label="Profile" onClick={() => navigate("profile")}><img src={`${A}97eda.svg`} alt="" /></button>
      <section className="header-profile-card" aria-label="Profile preview">
        <header>
          <span className="header-profile-avatar">U</span>
          <div><strong>Username <i>✓</i></strong><small>@luna_naillab</small></div>
        </header>
        <p className="header-profile-bio">Original nail designs · New looks weekly · DM for collaborations</p>
        <p className="header-profile-location"><img src={`${A}profile-location.svg`} alt="" />Shanghai <b>·</b> Joined in 2022</p>
        <div className="header-profile-stats">
          {[["XXX", "Designs"], ["XXX", "Likes"], ["XXX", "Collections"]].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
        </div>
        <div className="header-profile-actions">
          <button type="button" onClick={() => navigate("profile")}>View profile</button>
          <button type="button" onClick={() => navigate("account/edit")}>Edit profile</button>
        </div>
      </section>
    </div>
  );
}

type PublicationStatus = "Draft";

function ProfileDesignCard({ index, editable, unpublishedTools = false, publishedInfo = false, publicationStatus, initiallyLiked, initiallySaved, removeOnUnsave, returnSection, navigate, onDelete }: { index: number; editable: boolean; unpublishedTools?: boolean; publishedInfo?: boolean; publicationStatus?: PublicationStatus; initiallyLiked: boolean; initiallySaved: boolean; removeOnUnsave: boolean; returnSection?: ProfileReturnSection; navigate: Navigate; onDelete: (index: number) => void }) {
  const [hidden, setHidden] = useState(false);
  const [toolsDismissed, setToolsDismissed] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [liked, setLiked] = useState(initiallyLiked);
  const [saved, setSaved] = useState(initiallySaved);
  const [unsaving, setUnsaving] = useState(false);
  usePageBlankDismiss(removeConfirm && !removing, () => setRemoveConfirm(false));
  const cardClass = `profile-design-card${hidden ? " hidden-design" : ""}${toolsDismissed ? " tools-dismissed" : ""}${removeConfirm ? " delete-confirming" : ""}${exiting ? " deleting" : ""}`;
  const confirmRemove = () => {
    if (removing) return;
    setRemoving(true);
    window.setTimeout(() => setExiting(true), 180);
    window.setTimeout(() => onDelete(index), 520);
  };
  const toggleSaved = () => {
    if (unsaving) return;
    if (saved && removeOnUnsave) {
      setSaved(false);
      setUnsaving(true);
      window.setTimeout(() => setExiting(true), 120);
      window.setTimeout(() => onDelete(index), 500);
      return;
    }
    setSaved(!saved);
  };
  return (
    <article className={cardClass} onMouseLeave={() => setToolsDismissed(false)}>
      <div className="profile-design-image">
        <button type="button" className="profile-design-open design-image-link" disabled={hidden || removing || unsaving} onClick={() => navigate(editable || publicationStatus ? "my-design/Nail Design Title/edit" : `design/Nail Design Title${returnSection ? `/from-${returnSection}` : ""}`)} aria-label={publicationStatus ? "Open publishing draft" : "Open Nail Design Title"}><span>image</span></button>
        {!editable && !publicationStatus && <button type="button" disabled={unsaving} aria-label={saved ? "Remove from collected" : "Collect design"} aria-pressed={saved} className={saved ? "card-save on" : "card-save"} onClick={toggleSaved}><img src={saved ? C.cardSaveFilled : C.cardSave} alt="" /></button>}
        {(editable || unpublishedTools) && (
          <div className="profile-card-tools">
            {editable && <button className={hidden ? "active" : ""} type="button" aria-label={hidden ? "Show design" : "Hide design"} aria-pressed={hidden} onClick={(event) => { event.stopPropagation(); if (hidden) { setHidden(false); setToolsDismissed(true); event.currentTarget.blur(); } else { setHidden(true); } }}><img src={`${A}${hidden ? "profile-hide.svg" : "profile-visible.svg"}`} alt="" /></button>}
            <button type="button" aria-label="Edit design" onClick={(event) => { event.stopPropagation(); navigate("my-design/Nail Design Title/edit"); }}><img src={`${A}profile-edit.svg`} alt="" /></button>
            <button type="button" className="profile-card-delete" aria-label={unpublishedTools ? "Delete draft" : "Unpublish design"} aria-expanded={removeConfirm} onClick={(event) => { event.stopPropagation(); setRemoveConfirm(true); }}><img src={`${A}${unpublishedTools ? "profile-delete.svg" : "profile-unpublish.svg"}`} alt="" /></button>
            {removeConfirm && (
              <div className="profile-delete-popover" role="dialog" aria-label={unpublishedTools ? "Confirm draft deletion" : "Confirm design unpublishing"} onClick={(event) => event.stopPropagation()}>
                <strong>{unpublishedTools ? "Are you sure you want to delete this draft?" : "Are you sure you want to unpublish this design?"}</strong>
                <small>{unpublishedTools ? "This action cannot be undone." : "You can find it in Unpublished."}</small>
                <div><button type="button" disabled={removing} onClick={() => setRemoveConfirm(false)}>Cancel</button><button type="button" className={removing ? "confirm-delete is-deleting" : "confirm-delete"} disabled={removing} aria-live="polite" onClick={confirmRemove}>{removing ? unpublishedTools ? "Deleting…" : "Unpublishing…" : unpublishedTools ? "Delete" : "Unpublish"}</button></div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="profile-design-info">
        <strong>Nail Design Title</strong>
        <div className="profile-design-tags"><span>Shape</span><span>Style</span><span>Occasion</span></div>
        {publicationStatus ? null : editable || publishedInfo ? <div className="profile-design-stats"><button type="button" aria-label={liked ? "Unlike design" : "Like design"} aria-pressed={liked} className={liked ? "profile-like like-control on" : "profile-like like-control"} onClick={() => setLiked(!liked)}><img src={liked ? C.cardHeartFilled : `${A}profile-heart-small.svg`} alt="" />1.2K</button><span className="profile-save-stat"><img src={C.cardSave} alt="" />1.2K</span></div> : <div className="profile-design-meta"><UserHover className="profile-meta-user"><i>U</i>Username</UserHover><button type="button" aria-label={liked ? "Unlike design" : "Like design"} aria-pressed={liked} className={liked ? "profile-like like-control on" : "profile-like like-control"} onClick={() => setLiked(!liked)}><img src={liked ? C.cardHeartFilled : `${A}profile-heart-small.svg`} alt="" />1.2K</button></div>}
      </div>
    </article>
  );
}

function ProfileDesignGrid({ section, query, navigate, excluded, onUnpublish }: { section: "published" | "liked" | "history"; query: string; navigate: Navigate; excluded?: ReadonlySet<number>; onUnpublish?: (index: number) => void }) {
  const count = section === "history" ? 6 : 9;
  const [deleted, setDeleted] = useState(() => new Set<number>());
  const visible = Array.from({ length: count }, (_, index) => index).filter((index) => !deleted.has(index) && !excluded?.has(index) && "nail design title".includes(query.toLowerCase()));
  const deleteDesign = (index: number) => {
    setDeleted((current) => new Set(current).add(index));
    onUnpublish?.(index);
  };
  return (
    <>
      <strong className="profile-result-count">{visible.length} designs</strong>
      <div className="profile-design-grid">{visible.map((index) => <ProfileDesignCard index={index} editable={section === "published"} initiallyLiked={section === "liked"} initiallySaved={false} removeOnUnsave={false} returnSection={section === "published" ? undefined : section} navigate={navigate} onDelete={deleteDesign} key={index} />)}</div>
    </>
  );
}

function ProfilePublished({ query, navigate }: { query: string; navigate: Navigate }) {
  const [unpublishedView, setUnpublishedView] = useState(false);
  const [movedDrafts, setMovedDrafts] = useState(() => new Set<number>());
  const [removedUnpublished, setRemovedUnpublished] = useState(() => new Set<number>());
  const [visibleDrafts, setVisibleDrafts] = useState(6);
  const draftSentinel = useRef<HTMLDivElement>(null);
  const drafts = [
    ...Array.from(movedDrafts, (index) => ({ key: `moved-${index}`, index, status: "Draft" as const })),
    ...Array.from({ length: 12 }, (_, index) => ({ key: `draft-${index}`, index: index + 30, status: "Draft" as const })),
  ].filter((draft) => !removedUnpublished.has(draft.index) && "nail design title".includes(query.toLowerCase()));
  useEffect(() => setVisibleDrafts(6), [query]);
  useEffect(() => {
    if (!unpublishedView || visibleDrafts >= drafts.length || !draftSentinel.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleDrafts((current) => Math.min(current + 3, drafts.length));
    }, { rootMargin: "120px" });
    observer.observe(draftSentinel.current);
    return () => observer.disconnect();
  }, [drafts.length, unpublishedView, visibleDrafts]);
  return (
    <div className="profile-published-content">
      <div className="profile-subtabs"><button className={!unpublishedView ? "active" : ""} type="button" onClick={() => setUnpublishedView(false)}>Published</button><button className={unpublishedView ? "active" : ""} type="button" onClick={() => setUnpublishedView(true)}>Unpublished</button></div>
      {unpublishedView ? (
        <div className="profile-unpublished-groups">
          <section className="profile-unpublished-group">
            <header><div><strong>Drafts</strong><span>{drafts.length}</span></div><small>Continue editing or submit a draft for review.</small></header>
            <div className="profile-design-grid">{drafts.slice(0, visibleDrafts).map((draft) => <ProfileDesignCard index={draft.index} editable={false} unpublishedTools publicationStatus={draft.status} initiallyLiked={false} initiallySaved={false} removeOnUnsave={false} navigate={navigate} onDelete={(draftIndex) => setRemovedUnpublished((current) => new Set(current).add(draftIndex))} key={draft.key} />)}</div>
            {visibleDrafts < drafts.length && <div className="profile-draft-sentinel" ref={draftSentinel}>Scroll to view more</div>}
          </section>
        </div>
      ) : <ProfileDesignGrid section="published" query={query} navigate={navigate} excluded={movedDrafts} onUnpublish={(index) => setMovedDrafts((current) => new Set(current).add(index))} />}
    </div>
  );
}

type CollectionAlbumDraft = {
  name: string;
  description: string;
  visibility: "public" | "private";
};

function CreateCollectionDialog({ defaultName, initialAlbum, onClose, onCreate }: {
  defaultName: string;
  initialAlbum?: CollectionAlbumDraft;
  onClose: () => void;
  onCreate: (album: CollectionAlbumDraft) => void;
}) {
  const [name, setName] = useState(initialAlbum?.name ?? "");
  const [description, setDescription] = useState(initialAlbum?.description ?? "");
  const [visibility, setVisibility] = useState<CollectionAlbumDraft["visibility"]>(initialAlbum?.visibility ?? "public");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({
      name: name.trim() || defaultName,
      description: description.trim(),
      visibility,
    });
  };
  return (
    <div className="collection-dialog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="collection-dialog" role="dialog" aria-modal="true" aria-labelledby="collection-dialog-title" onSubmit={submit}>
        <header>
          <div>
            <h2 id="collection-dialog-title">{initialAlbum ? "Edit collection album" : "Create collection album"}</h2>
            <p>{initialAlbum ? "Update this collection album’s details and visibility." : "Organize your favorite nail designs in one collection album."}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><img src={`${A}c1bc2.svg`} alt="" /></button>
        </header>
        <div className="collection-dialog-body">
          <label className="collection-field">
            <span>Collection album name</span>
            <input autoFocus maxLength={50} value={name} onChange={(event) => setName(event.target.value)} placeholder={defaultName} />
            <small>{name.length}/50</small>
          </label>
          <label className="collection-field">
            <span>Description <small>Optional</small></span>
            <textarea maxLength={200} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you’re collecting and why." />
            <small>{description.length}/200</small>
          </label>
          <fieldset className="collection-visibility" aria-label="Collection album visibility">
            <label>
              <input type="radio" name="collection-visibility" value="public" checked={visibility === "public"} onChange={() => setVisibility("public")} />
              <span><strong>Public</strong><small>Anyone can view this collection album.</small></span>
            </label>
            <label>
              <input type="radio" name="collection-visibility" value="private" checked={visibility === "private"} onChange={() => setVisibility("private")} />
              <span><strong>Private</strong><small>Only you can view this collection album.</small></span>
            </label>
          </fieldset>
        </div>
        <footer>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">{initialAlbum ? "Save changes" : "Create collection album"}</button>
        </footer>
      </form>
    </div>
  );
}

type CollectionAlbumItem = CollectionAlbumDraft & {
  id: string;
  created: boolean;
  designCount: number;
};

function ProfileAlbumCard({ album, onOpen, onEdit, onDelete, onVisibilityChange }: {
  album: CollectionAlbumItem;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVisibilityChange: (visibility: CollectionAlbumDraft["visibility"]) => void;
}) {
  const [hidden, setHidden] = useState(album.visibility === "private");
  const [toolsDismissed, setToolsDismissed] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [exiting, setExiting] = useState(false);
  useEffect(() => setHidden(album.visibility === "private"), [album.visibility]);
  usePageBlankDismiss(removeConfirm && !removing, () => setRemoveConfirm(false));
  const confirmRemove = () => {
    if (removing) return;
    setRemoving(true);
    window.setTimeout(() => setExiting(true), 180);
    window.setTimeout(onDelete, 520);
  };
  return (
    <article
      className={`profile-album${hidden ? " hidden-album" : ""}${toolsDismissed ? " tools-dismissed" : ""}${removeConfirm ? " delete-confirming" : ""}${exiting ? " deleting" : ""}`}
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => event.target === event.currentTarget && event.key === "Enter" && onOpen()}
      onMouseLeave={() => setToolsDismissed(false)}
    >
      <div className="profile-album-image">
        <span>image</span>
        <div className="profile-card-tools">
          <button className={hidden ? "active" : ""} type="button" aria-label={hidden ? "Make collection album public" : "Make collection album private"} aria-pressed={hidden} onClick={(event) => { event.stopPropagation(); const nextHidden = !hidden; setHidden(nextHidden); onVisibilityChange(nextHidden ? "private" : "public"); if (!nextHidden) { setToolsDismissed(true); event.currentTarget.blur(); } }}><img src={`${A}${hidden ? "profile-hide.svg" : "profile-visible.svg"}`} alt="" /></button>
          <button type="button" aria-label="Edit collection album" onClick={(event) => { event.stopPropagation(); onEdit(); }}><img src={`${A}profile-edit.svg`} alt="" /></button>
          <button type="button" className="profile-card-delete" aria-label="Delete collection album" aria-expanded={removeConfirm} onClick={(event) => { event.stopPropagation(); setRemoveConfirm(true); }}><img src={`${A}profile-delete.svg`} alt="" /></button>
          {removeConfirm && (
            <div className="profile-delete-popover" role="dialog" aria-label="Confirm collection album deletion" onClick={(event) => event.stopPropagation()}>
              <strong>Are you sure you want to delete this collection album?</strong>
              <small>The designs inside it will remain collected.</small>
              <div><button type="button" disabled={removing} onClick={() => setRemoveConfirm(false)}>Cancel</button><button type="button" className={removing ? "confirm-delete is-deleting" : "confirm-delete"} disabled={removing} onClick={confirmRemove}>{removing ? "Deleting…" : "Delete"}</button></div>
            </div>
          )}
        </div>
      </div>
      <section><strong>{album.name}</strong><p>{album.designCount} designs</p><small>{hidden ? "Private" : "Public"} · {album.created ? "Created just now" : "Updated Apr 12, 2025"}</small></section>
    </article>
  );
}

function ProfileCollections({ query, navigate }: { query: string; navigate: Navigate }) {
  const [albums, setAlbums] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [createdAlbums, setCreatedAlbums] = useState<CollectionAlbumDraft[]>([]);
  const [albumOverrides, setAlbumOverrides] = useState<Record<string, CollectionAlbumDraft>>({});
  const [deletedAlbums, setDeletedAlbums] = useState(() => new Set<string>());
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [removedDesigns, setRemovedDesigns] = useState(() => new Set<number>());
  const collectionNames = ["Spring Ombre Collection", "Short French Nail Ideas", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration", "Cat-Eye Shimmer Collection", "Almond Nail Looks", "Seaside Nail Inspiration"];
  const albumItems: CollectionAlbumItem[] = [
    ...createdAlbums.map((album, index) => ({ ...album, id: `created-${index}`, created: true, designCount: 0 })),
    ...collectionNames.map((name, index) => ({ name, description: "", visibility: "public" as const, id: `album-${index}`, created: false, designCount: [12, 8, 15, 9, 18][index % 5] })),
  ].map((album) => ({ ...album, ...albumOverrides[album.id] }));
  const filtered = albumItems.filter((album) => !deletedAlbums.has(album.id) && album.name.toLowerCase().includes(query.toLowerCase()));
  const selectedAlbum = albumItems.find((album) => album.id === selectedAlbumId);
  const editingAlbum = albumItems.find((album) => album.id === editingAlbumId);
  const collectedDesigns = Array.from({ length: 9 }, (_, index) => index).filter((index) => !removedDesigns.has(index) && "nail design title".includes(query.toLowerCase()));
  if (selectedAlbum) {
    const visibleDesigns = Array.from({ length: Math.min(selectedAlbum.designCount, 9) }, (_, index) => index).filter(() => "nail design title".includes(query.toLowerCase()));
    return (
      <div className="profile-collection-detail">
        <header><button type="button" onClick={() => setSelectedAlbumId(null)}>← Collection albums</button><div><h2>{selectedAlbum.name}</h2><small>{selectedAlbum.visibility === "private" ? "Private" : "Public"} · {selectedAlbum.designCount} designs</small></div></header>
        {visibleDesigns.length ? <div className="profile-design-grid">{visibleDesigns.map((index) => <ProfileDesignCard index={index} editable={false} initiallyLiked={false} initiallySaved removeOnUnsave={false} returnSection="collections" navigate={navigate} onDelete={() => {}} key={index} />)}</div> : <div className="profile-collection-empty"><strong>No designs yet</strong><p>Collected designs added to this collection album will appear here.</p></div>}
      </div>
    );
  }
  if (!albums) return (
    <div className="profile-collection-content">
      <div className="profile-subtabs"><button className="active" type="button">Collected designs</button><button type="button" onClick={() => setAlbums(true)}>Collection albums</button></div>
      <strong className="profile-result-count">{collectedDesigns.length} designs</strong>
      <div className="profile-design-grid">{collectedDesigns.map((index) => <ProfileDesignCard index={index} editable={false} initiallyLiked={false} initiallySaved removeOnUnsave returnSection="collections" navigate={navigate} onDelete={(designIndex) => setRemovedDesigns((current) => new Set(current).add(designIndex))} key={index} />)}</div>
    </div>
  );
  return (
    <div className="profile-collection-content">
      <div className="profile-subtabs"><button type="button" onClick={() => setAlbums(false)}>Collected designs</button><button className="active" type="button">Collection albums</button></div>
      <strong className="profile-result-count">{20 + createdAlbums.length - deletedAlbums.size} albums</strong>
      <div className="profile-album-grid">
        <button type="button" className="profile-new-album" onClick={() => setCreateDialog(true)} aria-label="Create a new collection album"><i><img src={`${A}profile-plus.svg`} alt="" /></i></button>
        {filtered.map((album) => <ProfileAlbumCard album={album} onOpen={() => setSelectedAlbumId(album.id)} onEdit={() => setEditingAlbumId(album.id)} onDelete={() => setDeletedAlbums((current) => new Set(current).add(album.id))} onVisibilityChange={(visibility) => setAlbumOverrides((current) => ({ ...current, [album.id]: { name: album.name, description: album.description, visibility } }))} key={album.id} />)}
      </div>
      {createDialog && <CreateCollectionDialog defaultName={`Default collection album ${createdAlbums.length + 1}`} onClose={() => setCreateDialog(false)} onCreate={(album) => { setCreatedAlbums((current) => [...current, album]); setCreateDialog(false); }} />}
      {editingAlbum && <CreateCollectionDialog defaultName={editingAlbum.name} initialAlbum={editingAlbum} onClose={() => setEditingAlbumId(null)} onCreate={(album) => { setAlbumOverrides((current) => ({ ...current, [editingAlbum.id]: album })); setEditingAlbumId(null); }} />}
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
    published: "Search your designs",
    liked: "Search liked designs",
    collections: "Search collected designs",
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
              {mainSection === "published" ? <ProfilePublished query={query} navigate={navigate} /> : mainSection === "collections" ? <ProfileCollections query={query} navigate={navigate} /> : <ProfileDesignGrid section={mainSection} query={query} navigate={navigate} />}
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
    const blurActiveControlOnBlank = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("button, a, input, textarea, select, label, [role='button'], [role='dialog'], [data-keep-active]")) return;
      if (document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
    };
    document.addEventListener("pointerdown", blurActiveControlOnBlank);
    return () => document.removeEventListener("pointerdown", blurActiveControlOnBlank);
  }, []);

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
  if (section === "upload" && rest[0] === "success") return <UploadSuccessPage navigate={navigate} />;
  if (section === "upload") return <UploadDesignPage navigate={navigate} />;
  if (section === "search") return <SearchResultsPage key={param} initial={parseSearchState(param)} navigate={navigate} />;
  if (section === "collection") return <CollectionPage key={param} id={param} navigate={navigate} />;
  if (section === "design") {
    const returnToken = rest.find((part) => part.startsWith("from-"))?.replace("from-", "");
    const returnSection = (["liked", "collections", "history"] as const).find((item) => item === returnToken);
    return <DesignDetail key={route} photoOnly={rest[0] === "photo-upload-example"} returnSection={returnSection} focusComments={rest.at(-1) === "comments"} navigate={navigate} />;
  }
  if (section === "my-design") {
    if (rest.at(-1) === "edit") return <UploadDesignPage key={route} navigate={navigate} editing studioEdited />;
    return <DesignDetail key={route} own photoOnly={rest[0] === "photo-upload-example"} focusComments={rest.at(-1) === "comments"} navigate={navigate} />;
  }
  if (section === "messages") return <MessagesPage key={route} initialContact={rest[0] ? decodeURIComponent(rest[0]) : undefined} sharedDesign={rest[1] === "share-design"} navigate={navigate} />;
  if (section === "notifications") {
    const notificationSection = (rest[0] || "all") as NotificationSection;
    return <NotificationsPage section={notificationSection === "device" || notificationNav.some(([key]) => key === notificationSection) ? notificationSection : "all"} navigate={navigate} />;
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
