"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clipboard,
  Download,
  FileText,
  Image,
  LayoutDashboard,
  Megaphone,
  Palette,
  Plus,
  Save,
  Sparkles,
  Workflow
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "דשבורד", icon: LayoutDashboard },
  { id: "create", label: "יצירה", icon: Plus },
  { id: "editor", label: "עריכה", icon: FileText },
  { id: "materials", label: "חומרים", icon: Sparkles },
  { id: "pipeline", label: "Pipeline", icon: Workflow }
];

const statusLabels = {
  live: "היום",
  marketing: "שיווק",
  prep: "הכנה",
  followup: "פולואפ",
  archive: "ארכיון",
  idea: "רעיון"
};

const statusColumns = ["idea", "marketing", "prep", "live", "followup"];

function dateLabel(value) {
  if (!value) return "ללא תאריך";
  return new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", weekday: "short" }).format(new Date(`${value}T12:00:00`));
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [workshops, setWorkshops] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [materials, setMaterials] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState("poster");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "סדנה חדשה עם סוכני AI",
    date: "2026-05-21",
    time: "20:00",
    audience: "בעלי עסקים ומנהלים",
    price: "₪100",
    promise: "לצאת עם תהליך עבודה שבו AI לא רק עונה, אלא מנהל איתך משימות, חומרים והמשך עבודה.",
    confirmShabbat: false
  });

  const selected = useMemo(
    () => workshops.find(item => item.slug === selectedSlug) || workshops[0],
    [selectedSlug, workshops]
  );

  const stats = useMemo(() => ({
    total: workshops.length,
    upcoming: workshops.filter(item => ["live", "marketing", "prep"].includes(item.status)).length,
    live: workshops.filter(item => item.status === "live").length,
    followup: workshops.filter(item => item.status === "followup").length
  }), [workshops]);

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function refresh() {
    setLoading(true);
    const response = await fetch("/api/workshops");
    const data = await response.json();
    setWorkshops(data.workshops || []);
    setSelectedSlug(current => current || data.workshops?.[0]?.slug || "");
    setLoading(false);
  }

  async function loadWorkshop(slug) {
    if (!slug) return;
    const response = await fetch(`/api/workshops/${encodeURIComponent(slug)}`);
    const data = await response.json();
    if (response.ok) {
      setMarkdown(data.markdown);
      setSelectedSlug(slug);
      setActive("editor");
    } else {
      flash(data.error || "לא הצלחתי לפתוח סדנה");
    }
  }

  async function createWorkshop(event) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/workshops", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      flash(data.error || "יצירה נכשלה");
      return;
    }

    await refresh();
    await loadWorkshop(data.slug);
    flash("הסדנה נוצרה בתיקיית workshops");
  }

  async function saveMarkdown() {
    if (!selectedSlug) return;
    setSaving(true);
    const response = await fetch(`/api/workshops/${encodeURIComponent(selectedSlug)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ markdown })
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      flash(data.error || "שמירה נכשלה");
      return;
    }

    await refresh();
    flash("נשמר ל-workshop.md");
  }

  async function generateMaterials(source = selected) {
    const payload = source ? {
      title: source.title,
      date: source.date,
      time: source.time,
      promise: form.promise
    } : form;

    const response = await fetch("/api/materials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setMaterials(data.materials || {});
    setActive("materials");
    flash("חומרים נוצרו");
  }

  async function copyCurrentMaterial() {
    await navigator.clipboard.writeText(materials[selectedMaterial] || "");
    flash("הועתק");
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected?.slug) {
      fetch(`/api/workshops/${encodeURIComponent(selected.slug)}`)
        .then(response => response.json())
        .then(data => setMarkdown(data.markdown || ""));
    }
  }, [selected?.slug]);

  return (
    <main className="shell">
      <aside className="rail" aria-label="ניווט ראשי">
        <div className="brand">
          <img src="/api/brand/aviz-logo.png" alt="AVIZ" />
          <div>
            <strong>AVIZ Workshop Studio</strong>
            <span>Dynamic API workspace</span>
          </div>
        </div>

        <nav className="nav" aria-label="אזורים">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} aria-selected={active === tab.id} onClick={() => setActive(tab.id)}>
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="system-card">
          <b>Live filesystem API</b>
          <span>קורא וכותב ישירות ל־workshops/*/workshop.md</span>
          <div className="meter"><i style={{ width: `${Math.min(100, stats.upcoming * 18 + 24)}%` }} /></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="hero">
          <div>
            <p className="eyebrow">ניהול אמיתי, לא מוקאפ</p>
            <h1>סטודיו דינמי לסדנאות שלך</h1>
            <p>API, יצירת תיקיות, עריכת Markdown, חומרים שיווקיים ופייפליין חי מתוך הריפו.</p>
          </div>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => setActive("create")}><Plus size={18} /> סדנה חדשה</button>
            <button className="btn" onClick={() => generateMaterials()}><Sparkles size={18} /> צור חומרים</button>
          </div>
        </header>

        {active === "dashboard" && (
          <section className="screen">
            <div className="stats">
              <article><span>סדנאות</span><b>{stats.total}</b></article>
              <article><span>פעילות</span><b>{stats.upcoming}</b></article>
              <article><span>היום</span><b>{stats.live}</b></article>
              <article><span>פולואפ</span><b>{stats.followup}</b></article>
            </div>

            <div className="grid two">
              <article className="panel">
                <div className="panel-head">
                  <h2>סדנאות מהריפו</h2>
                  <button className="btn small" onClick={refresh}><Download size={16} /> רענן</button>
                </div>
                <div className="list">
                  {loading ? <div className="empty">טוען...</div> : workshops.slice(0, 12).map(item => (
                    <button className="workshop-row" key={item.slug} onClick={() => loadWorkshop(item.slug)}>
                      <span className="datebox">{dateLabel(item.date)}</span>
                      <span>
                        <b>{item.title}</b>
                        <small dir="ltr">{item.path}</small>
                      </span>
                      <i>{statusLabels[item.status]}</i>
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel visual-panel">
                <img src="/api/brand/avatar-boss.png" alt="AVIZ Architect avatar" />
                <h2>One-click ops</h2>
                <p>בחר סדנה, צור חומרים, ערוך קובץ, שמור לריפו. זה כבר מחובר ל־filesystem.</p>
                <button className="btn primary" onClick={() => selected && loadWorkshop(selected.slug)}><FileText size={18} /> פתח נבחרת</button>
              </article>
            </div>
          </section>
        )}

        {active === "create" && (
          <section className="screen grid two">
            <form className="panel form" onSubmit={createWorkshop}>
              <div className="panel-head">
                <h2>יצירת תיקיית סדנה</h2>
                <span className="pill">POST /api/workshops</span>
              </div>
              <label>שם
                <input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
              </label>
              <div className="split">
                <label>תאריך
                  <input type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} />
                </label>
                <label>שעה
                  <input type="time" value={form.time} onChange={event => setForm({ ...form, time: event.target.value })} />
                </label>
              </div>
              <label>קהל יעד
                <input value={form.audience} onChange={event => setForm({ ...form, audience: event.target.value })} />
              </label>
              <label>מחיר
                <input value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} />
              </label>
              <label>הבטחה
                <textarea value={form.promise} onChange={event => setForm({ ...form, promise: event.target.value })} />
              </label>
              <label className="check">
                <input type="checkbox" checked={form.confirmShabbat} onChange={event => setForm({ ...form, confirmShabbat: event.target.checked })} />
                <span>יש אישור מפורש מדלית אם זה שישי/שבת</span>
              </label>
              <button className="btn primary" disabled={saving}><Plus size={18} /> {saving ? "יוצר..." : "צור בפועל"}</button>
            </form>

            <article className="poster-preview">
              <img src="/api/brand/avatar-baby-boss.jpg" alt="" />
              <span>AVIZ</span>
              <h2>{form.title}</h2>
              <p>{form.promise}</p>
              <div><b>{form.date}</b><b>{form.time}</b><b>{form.price}</b></div>
            </article>
          </section>
        )}

        {active === "editor" && (
          <section className="screen panel editor">
            <div className="panel-head">
              <div>
                <h2>עורך סדנה</h2>
                <span dir="ltr">{selectedSlug || "בחר סדנה"}</span>
              </div>
              <div className="toolbar">
                <select value={selectedSlug} onChange={event => loadWorkshop(event.target.value)}>
                  {workshops.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
                </select>
                <button className="btn small" onClick={() => downloadText("workshop.md", markdown)}><Download size={16} /> הורד</button>
                <button className="btn primary small" onClick={saveMarkdown} disabled={saving}><Save size={16} /> שמור</button>
              </div>
            </div>
            <textarea className="markdown-editor" value={markdown} onChange={event => setMarkdown(event.target.value)} spellCheck="false" />
          </section>
        )}

        {active === "materials" && (
          <section className="screen grid two">
            <article className="panel">
              <div className="panel-head">
                <h2>מחולל חומרים</h2>
                <button className="btn small" onClick={() => generateMaterials()}><Sparkles size={16} /> צור מחדש</button>
              </div>
              <div className="material-buttons">
                {[
                  ["poster", Image, "פוסטר"],
                  ["slides", FileText, "מצגת"],
                  ["whatsapp", Megaphone, "וואטסאפ"],
                  ["followup", Clipboard, "פולואפ"]
                ].map(([id, Icon, label]) => (
                  <button key={id} aria-pressed={selectedMaterial === id} onClick={() => setSelectedMaterial(id)}>
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button className="btn primary" onClick={copyCurrentMaterial}><Check size={18} /> העתק חומר</button>
            </article>
            <textarea className="material-output" value={materials[selectedMaterial] || "בחר סדנה ולחץ צור חומרים."} onChange={event => setMaterials({ ...materials, [selectedMaterial]: event.target.value })} />
          </section>
        )}

        {active === "pipeline" && (
          <section className="screen kanban">
            {statusColumns.map(status => (
              <article className="lane" key={status}>
                <h2>{statusLabels[status]}</h2>
                {workshops.filter(item => item.status === status).slice(0, 8).map(item => (
                  <button key={item.slug} className="task" onClick={() => loadWorkshop(item.slug)}>
                    <b>{item.title}</b>
                    <span>{dateLabel(item.date)} · {item.time}</span>
                  </button>
                ))}
              </article>
            ))}
          </section>
        )}
      </section>

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
