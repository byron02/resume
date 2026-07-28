(() => {
  const data = window.resumeData;
  if (!data) {
    console.error("resumeData missing — check data.js");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // —— Fill content (hidden until unlock) ——
  const firstName = data.name.split(/\s+/)[0] || data.name;
  $("gateName").textContent = firstName;
  if (data.tagline) $("gateTagline").textContent = data.tagline;

  $("year").textContent = String(new Date().getFullYear());
  $("footerName").textContent = data.name;
  $("heroName").textContent = data.name;
  $("heroSummary").textContent = data.lede || data.tagline;

  const aboutCopy = $("aboutCopy");
  if (aboutCopy) {
    aboutCopy.innerHTML = data.summary
      .split(/\n\n+/)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }
  $("profileInitials").textContent = initials(data.name);

  const photo = $("profilePhoto");
  const blob = $("profileBlob");
  if (photo && data.photo) {
    photo.src = data.photo;
    photo.alt = data.name;
    const markLoaded = () => blob.classList.add("has-photo");
    if (photo.complete && photo.naturalWidth) markLoaded();
    else photo.addEventListener("load", markLoaded);
    photo.addEventListener("error", () => blob.classList.remove("has-photo"));
  }

  $("heroChips").innerHTML = [
    `<li><a href="mailto:${escapeAttr(data.email)}"><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</a></li>`,
    `<li><a href="${escapeAttr(data.github)}" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a></li>`,
    `<li><a href="${escapeAttr(data.linkedin)}" rel="noopener noreferrer"><i class="fab fa-linkedin"></i> LinkedIn</a></li>`,
    `<li><span><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</span></li>`,
  ].join("");

  $("skillsList").innerHTML = data.skillTags
    .map(
      (tag, i) =>
        `<span class="skill-tag reveal stagger-${(i % 3) + 1}" data-magnetic>${escapeHtml(tag)}</span>`
    )
    .join("");

  $("experienceList").innerHTML = data.experience
    .map(
      (job, i) => `
      <article class="experience-item reveal stagger-${(i % 3) + 1}">
        <div class="job-header">
          <div class="job-title">${escapeHtml(job.title)}</div>
          <div class="date-range">${escapeHtml(job.dates)}</div>
        </div>
        <div class="company-name">${escapeHtml(job.company)}</div>
        <ul>${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  $("projectList").innerHTML = data.projects
    .map((proj, i) => {
      const title = proj.url
        ? `<a href="${escapeAttr(proj.url)}" rel="noopener noreferrer">${escapeHtml(proj.title)}</a>`
        : escapeHtml(proj.title);
      return `
      <article class="project-card reveal stagger-${(i % 3) + 1}" data-tilt>
        <div class="project-title">${title}</div>
        <div class="project-stack">${escapeHtml(proj.stack)}</div>
        <p>${escapeHtml(proj.description)}</p>
      </article>`;
    })
    .join("");

  $("educationList").innerHTML = data.education
    .map(
      (edu, i) => `
      <article class="education-item reveal stagger-${(i % 3) + 1}">
        <div class="job-title">${escapeHtml(edu.degree)}</div>
        <div class="company-name">${escapeHtml(edu.school)}</div>
        <div class="date-range">${escapeHtml(edu.dates)}</div>
      </article>`
    )
    .join("");

  const contacts = [
    { icon: "fas fa-envelope", label: data.email, href: `mailto:${data.email}` },
    data.phone ? { icon: "fas fa-phone", label: data.phone, href: `tel:${data.phone}` } : null,
    { icon: "fab fa-github", label: data.githubLabel, href: data.github },
    { icon: "fab fa-linkedin", label: data.linkedinLabel, href: data.linkedin },
    { icon: "fas fa-map-marker-alt", label: data.location, href: null },
  ].filter(Boolean);

  $("contactList").innerHTML = contacts
    .map((c, i) => {
      const inner = `<i class="${c.icon}" aria-hidden="true"></i><span>${escapeHtml(c.label)}</span>`;
      const cls = `contact-item reveal stagger-${(i % 3) + 1}`;
      return c.href
        ? `<a class="${cls}" href="${escapeAttr(c.href)}" rel="noopener noreferrer">${inner}</a>`
        : `<div class="${cls}">${inner}</div>`;
    })
    .join("");

  // Designed PDF markup
  const summaryHtml = data.summary
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  $("print-resume").innerHTML = `
    <div class="pdf-page">
      <aside class="pdf-sidebar">
        <img class="pdf-photo" src="${escapeAttr(data.photo || "profile.jpg")}" alt="" />
        <h1>${escapeHtml(data.name)}</h1>
        <p class="pdf-role">${escapeHtml(data.title)}</p>
        <div class="pdf-side-block">
          <h2>Contact</h2>
          <p>${escapeHtml(data.email)}</p>
          ${data.phone ? `<p>${escapeHtml(data.phone)}</p>` : ""}
          <p>${escapeHtml(data.githubLabel)}</p>
          <p>${escapeHtml(data.linkedinLabel)}</p>
          <p>${escapeHtml(data.location)}</p>
        </div>
        <div class="pdf-side-block">
          <h2>Skills</h2>
          <div>
            ${data.skillTags.map((s) => `<span class="pdf-skill">${escapeHtml(s)}</span>`).join("")}
          </div>
        </div>
        <div class="pdf-side-block">
          <h2>Education</h2>
          ${data.education
            .map(
              (edu) => `
            <div class="pdf-edu-item">
              <strong>${escapeHtml(edu.degree)}</strong>
              <span>${escapeHtml(edu.school)}</span>
              <em>${escapeHtml(edu.dates)}</em>
            </div>`
            )
            .join("")}
        </div>
      </aside>
      <div class="pdf-main">
        <section class="pdf-section">
          <h2>Profile</h2>
          ${summaryHtml}
        </section>
        <section class="pdf-section">
          <h2>Experience</h2>
          ${data.experience
            .map(
              (job) => `
            <div class="pdf-item">
              <div class="pdf-item-head">
                <span class="left">${escapeHtml(job.title)}</span>
                <span class="right">${escapeHtml(job.dates)}</span>
              </div>
              <div class="pdf-sub">${escapeHtml(job.company)}</div>
              <ul>${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
            </div>`
            )
            .join("")}
        </section>
        <section class="pdf-section">
          <h2>Projects</h2>
          <div class="pdf-projects">
          ${data.projects
            .map(
              (p) => `
            <div class="pdf-item">
              <div class="pdf-item-head">
                <span class="left">${escapeHtml(p.title)}</span>
                <span class="right">${escapeHtml(p.stack)}</span>
              </div>
              <p>${escapeHtml(p.description)}</p>
            </div>`
            )
            .join("")}
          </div>
        </section>
      </div>
    </div>`;

  // —— Gate unlock ——
  document.body.classList.add("is-gated");
  setupGateParticles();
  setupUnlock();

  document.querySelectorAll("[data-download]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });

  const pageTitle = document.title;
  window.addEventListener("beforeprint", () => {
    document.title = " ";
  });
  window.addEventListener("afterprint", () => {
    document.title = pageTitle;
  });

  function unlockSite() {
    const gate = $("gate");
    const site = $("web-site");
    if (gate.classList.contains("is-done")) return;

    gate.classList.add("is-done");
    document.body.classList.remove("is-gated");
    site.classList.remove("is-locked");
    site.classList.add("is-open");
    site.removeAttribute("inert");
    gate.setAttribute("aria-hidden", "true");

    setupCursor();
    setupReveal();
    setupNavbar();
    setupTyping();
    setupMagnetic();
    setupTilt();
    setupBlobParallax();
    setupActiveSection();
    setupReadProgress();

    // Kick hero reveals that are already in view
    requestAnimationFrame(() => {
      document.querySelectorAll(".hero .reveal, #about .reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add("active");
        }
      });
    });
  }

  function setupUnlock() {
    const btn = $("unlockBtn");
    const fill = $("unlockFill");
    const label = $("unlockLabel");
    let progress = 0;
    let holding = false;
    let raf = 0;

    const tick = () => {
      if (!holding) return;
      progress = Math.min(1, progress + 0.018);
      fill.style.transform = `scale(${progress})`;
      label.textContent = progress > 0.85 ? "Almost…" : "Hold to unlock";
      if (progress >= 1) {
        label.textContent = "Unlocked";
        unlockSite();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = (e) => {
      e.preventDefault();
      holding = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      holding = false;
      cancelAnimationFrame(raf);
      if (progress < 1) {
        progress = 0;
        fill.style.transform = "scale(0)";
        label.textContent = "Hold to unlock";
      }
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointerleave", stop);
    btn.addEventListener("pointercancel", stop);

    // Click fallback for quick unlock on mobile tap-hold issues
    btn.addEventListener("click", (e) => {
      if (progress < 0.2) {
        // brief tap → still allow unlock with animated fill
        e.preventDefault();
        progress = 0;
        const boost = () => {
          progress = Math.min(1, progress + 0.05);
          fill.style.transform = `scale(${progress})`;
          if (progress >= 1) unlockSite();
          else requestAnimationFrame(boost);
        };
        requestAnimationFrame(boost);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!$("gate").classList.contains("is-done")) {
          e.preventDefault();
          unlockSite();
        }
      }
      if (e.key === "Escape") unlockSite();
    });

    if (reduceMotion) {
      label.textContent = "Click to enter";
    }
  }

  function setupGateParticles() {
    const canvas = $("gateCanvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let particles = [];
    let raf = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = Array.from({ length: Math.min(70, Math.floor((w * h) / 18000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a: Math.random() * 0.5 + 0.15,
      }));
    };

    const draw = () => {
      if ($("gate").classList.contains("is-done")) {
        cancelAnimationFrame(raf);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${p.a})`;
        ctx.fill();
      }
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.12 * (1 - d / 110)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  function setupTyping() {
    const el = $("typedTitle");
    const caret = $("typedCaret");
    if (!el) return;
    const text = data.title;
    if (reduceMotion) {
      el.textContent = text;
      if (caret) caret.style.display = "none";
      return;
    }
    let i = 0;
    const type = () => {
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        setTimeout(type, 45 + Math.random() * 40);
      } else if (caret) {
        setTimeout(() => caret.classList.add("is-done"), 900);
      }
    };
    setTimeout(type, 350);
  }

  function setupCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ring = $("cursor");
    const dot = $("cursorDot");
    document.body.classList.add("has-cursor");
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
      },
      { passive: true }
    );

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll("a, button, .skill-tag, .project-card").forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"));
    });
  }

  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  function setupNavbar() {
    const navbar = $("navbar");
    const toggle = $("navToggle");
    const links = $("navLinks");

    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("open", !open);
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("open");
      });
    });
  }

  function setupMagnetic() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".magnetic, [data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  function setupTilt() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * 10;
        const ry = (x - 0.5) * 12;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function setupBlobParallax() {
    const blob = $("profileBlob");
    const stage = $("avatarStage");
    if (!blob || !stage || reduceMotion) return;
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      blob.style.transform = `translate(${x * 16}px, ${y * 12}px)`;
    });
    stage.addEventListener("pointerleave", () => {
      blob.style.transform = "";
    });
  }

  function setupActiveSection() {
    const sections = ["about", "skills", "experience", "projects", "education", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const navAnchors = [...document.querySelectorAll(".nav-links a")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  function setupReadProgress() {
    const bar = $("readProgress");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
