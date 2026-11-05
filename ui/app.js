(function () {
  const DATA = window.ACME;
  const HOOK_LIMIT = 140;
  const WORD_MIN = 150;
  const WORD_MAX = 300;
  const STORE_KEY = "acme-skin-v1";

  const state = {
    view: "studio",
    draftId: DATA.drafts[0] ? DATA.drafts[0].id : null,
    post: "",
    hook: "",
    imageOn: true,
    expanded: false,
    device: "desktop",
    ideaFilter: "all",
    query: "",
    localStatus: loadStore()
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveStore() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state.localStatus));
  }

  function currentDraft() {
    return DATA.drafts.find((d) => d.id === state.draftId) || DATA.drafts[0] || null;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function words(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }
  function firstLine(text) {
    return (text.split(/\n/)[0] || "").trim();
  }
  function hashtags(text) {
    return (text.match(/#[\p{L}\p{N}_]+/gu) || []);
  }
  function hasEmDash(text) {
    return /[—–]/.test(text);
  }
  function hasDemo(text) {
    return /\[DEMO FIGURE\]/.test(text);
  }

  function formatBody(text, collapsed) {
    let source = text;
    if (collapsed) {
      const plain = text.replace(/\n+/g, " ");
      if (plain.length > HOOK_LIMIT) {
        source = plain.slice(0, HOOK_LIMIT).replace(/\s+\S*$/, "");
      }
    }
    const html = escapeHtml(source)
      .replace(/(#[\p{L}\p{N}_]+)/gu, '<span class="hash">$1</span>')
      .replace(/\n/g, "<br>");
    if (collapsed && text.replace(/\n+/g, " ").length > HOOK_LIMIT) {
      return html + '… <button class="see-more" type="button" data-action="expand">see more</button>';
    }
    if (!collapsed && text.replace(/\n+/g, " ").length > HOOK_LIMIT) {
      return html + ' <button class="see-more" type="button" data-action="collapse">see less</button>';
    }
    return html;
  }

  function icon(name) {
    const icons = {
      like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0 4.2-7.2A2.4 2.4 0 0 1 15.3 5v4.2H21a1.8 1.8 0 0 1 1.76 2.2l-1.4 7A1.8 1.8 0 0 1 19.6 20H7"/></svg>',
      comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H8l-5 3 1.4-4.6A8.5 8.5 0 1 1 21 12z"/></svg>',
      repost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
      send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>'
    };
    return icons[name] || "";
  }

  function tintFor(pillarId) {
    const p = DATA.pillars.find((x) => x.id === pillarId);
    return p ? p.tint : "yellow";
  }

  function statusLabel(draft) {
    return state.localStatus[draft.id] || draft.status;
  }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function setView(name) {
    state.view = name;
    $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === name));
    $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.view === name));
    location.hash = name;
    const main = $("#main");
    if (main) main.focus({ preventScroll: true });
    $(".nav-links").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }

  function loadDraft(id) {
    const d = DATA.drafts.find((x) => x.id === id);
    if (!d) return;
    state.draftId = id;
    state.post = d.post;
    state.hook = d.hook;
    state.imageOn = Boolean(d.image);
    state.expanded = false;
    renderStudio();
  }

  function renderNav() {
    $("#count-drafts").textContent = DATA.drafts.length;
    $("#count-assets").textContent = DATA.assets.length + DATA.references.length;
    $("#count-ideas").textContent = DATA.ideas.length;
  }

  function renderStudio() {
    const d = currentDraft();
    const select = $("#draft-select");
    select.innerHTML = DATA.drafts.map((item) =>
      `<option value="${escapeHtml(item.id)}" ${item.id === state.draftId ? "selected" : ""}>${escapeHtml(item.title)} · ${escapeHtml(statusLabel(item))}</option>`
    ).join("");
    if (!DATA.drafts.length) {
      select.innerHTML = "<option>No drafts yet</option>";
    }
    if (!d) return;

    $("#post-editor").value = state.post;
    $("#cta-line").textContent = `CTA: ${d.cta} · ${d.format} · ${d.audience}`;
    $("#hook-list").innerHTML = [d.hook, ...d.altHooks].map((h, i) =>
      `<button type="button" class="hook-opt" data-action="use-hook" data-hook="${escapeHtml(h)}" aria-pressed="${h === state.hook}">${i === 0 ? "Chosen · " : "Alt · "}${escapeHtml(h)}</button>`
    ).join("");

    const w = words(state.post);
    const hookChars = firstLine(state.post).length;
    const tags = hashtags(state.post).length;
    const dash = hasEmDash(state.post);
    const demo = hasDemo(state.post);
    $("#metrics").innerHTML = [
      metric(hookChars, "hook chars", hookChars <= HOOK_LIMIT ? "ok" : "warn"),
      metric(w, "words", w >= WORD_MIN && w <= WORD_MAX ? "ok" : "warn"),
      metric(tags, "hashtags", tags <= 3 ? "ok" : "warn"),
      metric(dash ? "Yes" : "No", "em dash", dash ? "warn" : "ok"),
      metric(demo ? "Yes" : "No", "demo figure", demo ? "warn" : "ok"),
      metric(statusLabel(d), "status", statusLabel(d) === "reviewed" ? "ok" : "")
    ].join("");

    $("#review-notes").innerHTML = `<strong>Review notes for Amit</strong><ul>${d.review.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`;
    $("#image-toggle").checked = state.imageOn;
    $("#mark-reviewed").textContent = statusLabel(d) === "reviewed" ? "Reviewed (local)" : "Mark reviewed (local only)";

    renderPreview();
  }

  function metric(value, label, cls) {
    return `<div class="metric ${cls}"><b>${escapeHtml(String(value))}</b><span>${escapeHtml(label)}</span></div>`;
  }

  function renderPreview() {
    const d = currentDraft();
    const feed = $("#li-feed");
    feed.classList.toggle("mobile", state.device === "mobile");
    $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.device === state.device)));

    const body = formatBody(state.post, !state.expanded);
    const showImage = state.imageOn && d && d.image;
    const firstComment = d && d.firstComment && d.firstComment !== "None."
      ? `<div class="li-comment"><strong>First comment (not in the post)</strong>${escapeHtml(d.firstComment)}</div>`
      : "";

    feed.innerHTML = `
      <div class="li-chrome">
        <span class="li-dot"></span>
        LinkedIn ${state.device === "mobile" ? "mobile" : "desktop"} feed · company page
      </div>
      <article class="li-card" aria-label="LinkedIn post preview">
        <header class="li-head">
          <div class="li-avatar" aria-hidden="true">${escapeHtml(DATA.company.initials)}</div>
          <div>
            <div class="li-name">${escapeHtml(DATA.company.name)} <span class="follow">· Follow</span></div>
            <div class="li-meta">${escapeHtml(DATA.company.headline)}</div>
            <div class="li-meta">1w · <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Anyone"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg></div>
          </div>
          <button class="li-more" type="button" aria-label="More options">•••</button>
        </header>
        <div class="li-body">${body}</div>
        ${showImage ? `<div class="li-media"><img src="${encodeURI(d.image)}" alt="${escapeHtml(d.imageAlt || "")}" width="555" height="694"></div>` : ""}
        <div class="li-social">
          <div class="li-reactions">
            <span class="li-pips" aria-hidden="true"><span></span><span></span><span></span></span>
            Preview only
          </div>
          <span>Comment · Repost</span>
        </div>
        <div class="li-actions">
          <button type="button">${icon("like")} Like</button>
          <button type="button">${icon("comment")} Comment</button>
          <button type="button">${icon("repost")} Repost</button>
          <button type="button">${icon("send")} Send</button>
        </div>
      </article>
      ${firstComment}
    `;
  }

  function renderDrafts() {
    const q = state.query.toLowerCase();
    const items = DATA.drafts.filter((d) =>
      `${d.title} ${d.pillar} ${d.post} ${d.status}`.toLowerCase().includes(q)
    );
    const root = $("#draft-grid");
    if (!items.length) {
      root.innerHTML = `<div class="empty">No drafts match that search. New drafts land in content/drafts/ after the writing skill runs.</div>`;
      return;
    }
    root.innerHTML = items.map((d) => `
      <button type="button" class="draft-card" data-action="open-draft" data-id="${escapeHtml(d.id)}">
        ${d.image ? `<div class="thumb"><img src="${encodeURI(d.image)}" alt=""></div>` : ""}
        <div class="body">
          <div class="pills">
            <span class="pill pill-ink">${escapeHtml(statusLabel(d))}</span>
            <span class="pill pill-coral">${escapeHtml(d.pillar)}</span>
            <span class="pill pill-purple">${escapeHtml(d.format)}</span>
            ${d.demoFigures ? `<span class="pill pill-yellow">DEMO FIGURE</span>` : ""}
          </div>
          <h3 style="margin:0 0 6px;font-size:18px;font-weight:500">${escapeHtml(d.title)}</h3>
          <p class="muted">${escapeHtml(d.hook)}</p>
          <p class="muted" style="margin-top:8px">${escapeHtml(d.created)} · ${escapeHtml(d.cta)}</p>
        </div>
      </button>
    `).join("");
  }

  function renderAssets() {
    const generated = $("#asset-generated");
    const refs = $("#asset-refs");
    generated.innerHTML = DATA.assets.length
      ? DATA.assets.map((a) => assetCard(a.file, a.title, a.meta, a.draftId)).join("")
      : `<div class="empty">No generated visuals yet.</div>`;
    refs.innerHTML = DATA.references.length
      ? DATA.references.map((r) => assetCard(r.file, r.title, "Brand design reference")).join("")
      : `<div class="empty">No reference images yet. Add your own to brand/design-references and list them in ui/data.js.</div>`;
  }

  function assetCard(file, title, meta, draftId) {
    return `
      <button type="button" class="asset-card" data-action="lightbox" data-src="${encodeURI(file)}" data-title="${escapeHtml(title)}" ${draftId ? `data-id="${escapeHtml(draftId)}"` : ""}>
        <div class="thumb wide"><img src="${encodeURI(file)}" alt="${escapeHtml(title)}" loading="lazy"></div>
        <div class="body">
          <h3 style="margin:0 0 4px;font-size:16px;font-weight:500">${escapeHtml(title)}</h3>
          <p class="muted">${escapeHtml(meta || "")}</p>
        </div>
      </button>`;
  }

  function renderIdeas() {
    const q = state.query.toLowerCase();
    const items = DATA.ideas.filter((idea) => {
      const matchFilter = state.ideaFilter === "all" || idea.pillarId === state.ideaFilter;
      const matchQ = `${idea.hook} ${idea.pillar} ${idea.format}`.toLowerCase().includes(q);
      return matchFilter && matchQ;
    });
    $("#idea-board").innerHTML = items.map((idea) => `
      <button type="button" class="sticky ${tintFor(idea.pillarId)}" data-action="${idea.draftId ? "open-draft" : "idea-toast"}" data-id="${escapeHtml(idea.draftId || "")}">
        <div class="n">#${idea.n} · ${escapeHtml(idea.format)}${idea.check ? " · CHECK" : ""}${idea.draftId ? " · drafted" : ""}</div>
        <h3>${escapeHtml(idea.hook)}</h3>
        <div class="muted">${escapeHtml(idea.pillar)} · ${escapeHtml(idea.reader)}</div>
        <div class="muted">${escapeHtml(idea.cta)}</div>
      </button>
    `).join("");
    $$(".filters [data-filter]").forEach((b) => {
      const on = b.dataset.filter === state.ideaFilter;
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("btn-primary", on);
      b.classList.toggle("btn-secondary", !on);
    });
  }

  function renderPipeline() {
    $("#pipeline-flow").innerHTML = DATA.pipeline.map((s) => `
      <div class="step ${s.status}">
        <div class="idx">${s.step}</div>
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.note)}</p>
        <div class="pills" style="margin-top:12px"><span class="pill pill-ink">${escapeHtml(s.status)}</span></div>
      </div>
    `).join("");
  }

  function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => toast(label)).catch(() => toast("Copy failed"));
  }

  function openLightbox(src, title) {
    const dlg = $("#lightbox");
    $("#lightbox-img").src = src;
    $("#lightbox-img").alt = title;
    $("#lightbox-title").textContent = title;
    dlg.showModal();
  }

  function onClick(e) {
    const t = e.target.closest("[data-action], [data-view], [data-device], [data-filter]");
    if (!t) return;

    if (t.dataset.view) {
      e.preventDefault();
      setView(t.dataset.view);
      return;
    }
    if (t.dataset.device) {
      state.device = t.dataset.device;
      renderPreview();
      return;
    }
    if (t.dataset.filter) {
      state.ideaFilter = t.dataset.filter;
      renderIdeas();
      return;
    }

    const action = t.dataset.action;
    if (action === "expand") { state.expanded = true; renderPreview(); }
    if (action === "collapse") { state.expanded = false; renderPreview(); }
    if (action === "use-hook") {
      const hook = t.dataset.hook;
      const d = currentDraft();
      const old = d ? d.hook : firstLine(state.post);
      state.hook = hook;
      if (state.post.startsWith(old)) state.post = hook + state.post.slice(old.length);
      else state.post = hook + "\n\n" + state.post.replace(/^[^\n]+/, "").replace(/^\n+/, "");
      renderStudio();
    }
    if (action === "copy-post") copyText(state.post.replace(/\s*\[DEMO FIGURE\]\s*/g, " ").replace(/  +/g, " "), "Post copied. Demo tags stripped for paste.");
    if (action === "copy-raw") copyText(state.post, "Raw draft copied, including demo tags.");
    if (action === "open-draft") {
      loadDraft(t.dataset.id);
      setView("studio");
    }
    if (action === "idea-toast") toast("This idea is not drafted yet. Run the create-post workflow.");
    if (action === "lightbox") openLightbox(t.dataset.src, t.dataset.title);
    if (action === "close-lightbox") $("#lightbox").close();
    if (action === "preview-asset") {
      const d = currentDraft();
      if (d && d.image) openLightbox(d.image, d.visual.headline);
    }
    if (action === "mark-reviewed") {
      const d = currentDraft();
      if (!d) return;
      state.localStatus[d.id] = "reviewed";
      saveStore();
      toast("Marked reviewed in this browser only. Files are unchanged.");
      renderStudio();
      renderDrafts();
    }
    if (action === "toggle-nav") {
      const nav = $(".nav-links");
      const open = nav.classList.toggle("open");
      t.setAttribute("aria-expanded", String(open));
    }
  }

  function onInput(e) {
    if (e.target.id === "post-editor") {
      state.post = e.target.value;
      state.hook = firstLine(state.post);
      renderPreview();
      const w = words(state.post);
      const hookChars = firstLine(state.post).length;
      const tags = hashtags(state.post).length;
      $("#metrics").innerHTML = [
        metric(hookChars, "hook chars", hookChars <= HOOK_LIMIT ? "ok" : "warn"),
        metric(w, "words", w >= WORD_MIN && w <= WORD_MAX ? "ok" : "warn"),
        metric(tags, "hashtags", tags <= 3 ? "ok" : "warn"),
        metric(hasEmDash(state.post) ? "Yes" : "No", "em dash", hasEmDash(state.post) ? "warn" : "ok"),
        metric(hasDemo(state.post) ? "Yes" : "No", "demo figure", hasDemo(state.post) ? "warn" : "ok"),
        metric(statusLabel(currentDraft() || { id: "", status: "draft" }), "status", "")
      ].join("");
    }
    if (e.target.id === "draft-select") loadDraft(e.target.value);
    if (e.target.id === "image-toggle") {
      state.imageOn = e.target.checked;
      renderPreview();
    }
    if (e.target.id === "global-search" || e.target.id === "idea-search") {
      state.query = e.target.value;
      const other = e.target.id === "global-search" ? $("#idea-search") : $("#global-search");
      if (other && other.value !== state.query) other.value = state.query;
      renderDrafts();
      renderIdeas();
    }
  }

  function boot() {
    renderNav();
    const first = DATA.drafts[0];
    if (first) {
      state.draftId = first.id;
      state.post = first.post;
      state.hook = first.hook;
    }
    renderStudio();
    renderDrafts();
    renderAssets();
    renderIdeas();
    renderPipeline();

    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onInput);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const dlg = $("#lightbox");
        if (dlg.open) dlg.close();
      }
    });

    const hash = (location.hash || "#studio").slice(1);
    const known = ["studio", "drafts", "assets", "ideas", "pipeline"];
    setView(known.includes(hash) ? hash : "studio");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
