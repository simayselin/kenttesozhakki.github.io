// js/app.js (FINAL - localStorage demo)

const LS = {
  user: "gkp_user",
  suggestions: "gkp_suggestions"
};

function $(sel, root = document) { return root.querySelector(sel); }

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function writeJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* -----------------------
   LOGIN / SIGNUP (opsiyonel)
------------------------ */
function initLogin() {
  const btn = $("#loginBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const u = {
      name: $("#loginName")?.value?.trim() || "Kullanıcı",
      email: $("#loginEmail")?.value?.trim() || "ornek@mail.com",
      phone: $("#loginPhone")?.value?.trim() || "+90 5xx xxx xx xx"
    };
    writeJSON(LS.user, u);
    window.location.href = "profile.html";
  });
}

function initSignup() {
  const btn = $("#signupBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const u = {
      name: $("#suName")?.value?.trim() || "Kullanıcı",
      age: $("#suAge")?.value?.trim() || "",
      email: $("#suEmail")?.value?.trim() || "ornek@mail.com",
      phone: $("#suPhone")?.value?.trim() || "+90 5xx xxx xx xx"
    };
    writeJSON(LS.user, u);
    window.location.href = "profile.html";
  });
}

/* -----------------------
   SUGGESTION NEW (FINAL)
   - id varsa id'den okur
   - yoksa name'den okur
   - form id yoksa sayfadaki ilk formu yakalar
------------------------ */
function initSuggestionNew() {
  // Önce id ile dene, yoksa sayfadaki ilk formu al (suggestion-new sayfasında tek form var)
  const form = document.getElementById("suggestionForm") || $("main form") || $("form");
  if (!form) return;

  const getVal = (id, name) => {
    const el = document.getElementById(id) || form.querySelector(`[name="${name}"]`);
    return el?.value?.trim() || "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = getVal("sgTitle", "title");
    const category = getVal("sgCategory", "category");
    const body = getVal("sgBody", "body");

    if (!title || !category || !body) {
      alert("Lütfen başlık, kategori ve detay alanlarını doldur 🙂");
      return;
    }

    const items = readJSON(LS.suggestions, []);
    items.unshift({
      id: "ONR-" + Math.random().toString(16).slice(2, 8).toUpperCase(),
      date: new Date().toLocaleDateString("tr-TR"),
      status: "İncelemede",
      category,
      title,
      body
    });

    writeJSON(LS.suggestions, items);
    window.location.href = "suggestions.html";
  });
}

/* -----------------------
   SUGGESTIONS LIST (suggestions.html)
------------------------ */
function initSuggestionsList() {
  const wrap = document.getElementById("suggestionsList");
  if (!wrap) return;

  const items = readJSON(LS.suggestions, []);
  if (!items.length) {
    wrap.innerHTML = `
      <div class="item" style="opacity:.8;font-weight:600;line-height:1.6">
        Henüz öneri yok. “Yeni Öneri” butonuyla ilk önerini ekleyebilirsin.
      </div>
    `;
    return;
  }

  wrap.innerHTML = "";
  items.slice(0, 30).forEach(it => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span class="badge">${it.category}</span>
      <h3 style="margin-top:10px">${it.title}</h3>
      <p style="margin-top:8px;opacity:.85;line-height:1.7">${it.body}</p>
      <p style="margin-top:10px;opacity:.7">Tarih: <b>${it.date}</b> • ID: <b>${it.id}</b></p>
      <p style="margin-top:6px;opacity:.7">Durum: <b>${it.status}</b></p>
    `;
    wrap.appendChild(div);
  });
}

/* -----------------------
   PROFILE (profile.html)
------------------------ */
function initProfile() {
  const nameEl = document.getElementById("pfName");
  const emailEl = document.getElementById("pfEmail");
  const phoneEl = document.getElementById("pfPhone");
  if (!nameEl && !emailEl && !phoneEl) return;

  const u = readJSON(LS.user, null);
  if (!u) return;

  if (nameEl) nameEl.textContent = u.name || "—";
  if (emailEl) emailEl.textContent = u.email || "—";
  if (phoneEl) phoneEl.textContent = u.phone || "—";
}

function initProfileSuggestions() {
  const wrap = document.getElementById("profileSuggestions");
  if (!wrap) return;

  const items = readJSON(LS.suggestions, []);

  if (!items.length) {
    wrap.innerHTML = `
      <div class="item">
        <span class="badge">Bilgi</span>
        <h3 style="margin-top:10px;font-size:16px">Henüz önerin yok</h3>
        <p style="margin-top:6px;opacity:.8;line-height:1.6">
          “Öneri paylaş” ile ilk önerini ekleyebilirsin.
        </p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = "";
  items.slice(0, 10).forEach(it => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span class="badge">${it.category}</span>
      <h3 style="margin-top:10px;font-size:16px">${it.title}</h3>
      <p style="margin-top:6px;opacity:.8;line-height:1.6">${it.body}</p>
      <p style="margin-top:10px;opacity:.7">Tarih: <b>${it.date}</b> • ID: <b>${it.id}</b></p>
      <p style="margin-top:8px;opacity:.7">Durum: <b>${it.status}</b></p>
    `;
    wrap.appendChild(div);
  });
}

function initLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem(LS.user);
  });
}

/* -----------------------
   BOOT
------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initSignup();
  initSuggestionNew();
  initSuggestionsList();
  initProfile();
  initProfileSuggestions();
  initLogout();
});