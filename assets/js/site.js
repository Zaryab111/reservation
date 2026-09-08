/* ==========================================================================
   ANDRES — Rooftop Smokehouse and Grill
   Original front-end. One file, modules self-guard by root element,
   no dependencies, no build step.
   ========================================================================== */

(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------
     Booking rules. Every value here is a question the client still has to
     answer — change them in this one block and the whole engine follows.
     --------------------------------------------------------------------- */
  var CONFIG = {
    turnMinutes: 105,      // how long one table is held
    slotStep: 30,          // minutes between bookable times
    maxParty: 10,          // largest party bookable online
    advanceDays: 60,       // how far ahead the book opens
    closedDays: [1],       // 0=Sun … 1=Mon closed
    hours: {               // [open, close] per weekday
      0: ["12:00", "21:00"],
      2: ["16:00", "22:00"],
      3: ["16:00", "22:00"],
      4: ["16:00", "22:00"],
      5: ["16:00", "23:00"],
      6: ["12:00", "23:00"]
    }
  };

  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

  var toMin = function (t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1]); };

  var clock = function (m) {
    var h = Math.floor(m / 60), mm = m % 60;
    var suf = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + String(mm).padStart(2, "0") + " " + suf;
  };

  var iso = function (d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
           "-" + String(d.getDate()).padStart(2, "0");
  };

  /* Deterministic stand-in for real availability, so the demo behaves
     identically every time it is shown. The real build asks the server. */
  var seatsFree = function (dateStr, time) {
    var k = dateStr + "|" + time, h = 0;
    for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    return h % 12;
  };

  /* ===================== chrome ===================== */

  (function header() {
    var head = $(".site-head");
    if (!head) return;
    var run = function () { head.classList.toggle("stuck", window.scrollY > 20); };
    run();
    window.addEventListener("scroll", run, { passive: true });
  })();

  (function drawer() {
    var burger = $(".burger"), panel = $(".drawer");
    if (!burger || !panel) return;
    var set = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      set(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  })();

  (function reveal() {
    var els = $$("[data-rev]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    els.forEach(function (el) { el.classList.add("rev"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    els.forEach(function (el) { io.observe(el); });
  })();

  (function bits() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var today = new Date().getDay();
    $$(".hours li").forEach(function (li) {
      if (Number(li.dataset.day) === today) li.classList.add("today");
    });
  })();

  /* ===================== menu ===================== */

  (function menu() {
    var root = $("[data-menu]");
    if (!root || !window.MENU) return;
    var data = window.MENU;

    var tags = function (t) {
      if (!t || !t.length) return "";
      return t.map(function (x) {
        return '<span class="tag ' + x + '">' + (data.tagNames[x] || x) + "</span>";
      }).join("");
    };

    root.innerHTML = data.courses.map(function (c) {
      var items = data.items.filter(function (i) { return i.course === c.id; });
      if (!items.length) return "";
      return '<section class="course" data-course="' + c.id + '">' +
        "<h2>" + c.name + "</h2>" +
        '<p class="note-cat">' + c.note + "</p>" +
        items.map(function (i) {
          return '<article class="item' + (i.soldOut ? " out" : "") + '"' +
            ' data-n="' + i.name.toLowerCase() + '" data-d="' + i.desc.toLowerCase() + '">' +
            '<h3 class="name">' + i.name +
              (i.soldOut ? '<span class="tag">Sold out today</span>' : "") + tags(i.tags) +
            "</h3>" +
            '<span class="cost">$' + i.price + "</span>" +
            '<p class="desc">' + i.desc + "</p>" +
          "</article>";
        }).join("") +
      "</section>";
    }).join("");

    var search = $("[data-search]"), empty = $("[data-empty]"), count = $("[data-count]");
    var buttons = $$("[data-filter]");
    var active = "all";

    var apply = function () {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      $$(".course", root).forEach(function (sec) {
        var okCourse = active === "all" || sec.dataset.course === active;
        var n = 0;
        $$(".item", sec).forEach(function (it) {
          var okText = !q || it.dataset.n.indexOf(q) > -1 || it.dataset.d.indexOf(q) > -1;
          var vis = okCourse && okText;
          it.hidden = !vis;
          if (vis) n++;
        });
        sec.hidden = n === 0;
        shown += n;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
      if (count) count.textContent = shown + (shown === 1 ? " dish" : " dishes") + " shown";
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) {
          x.classList.toggle("on", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        active = b.dataset.filter;
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();

    /* Download PDF — builds a clean print-styled menu from the same data
       and opens the print dialogue, so "Save as PDF" gives a real document. */
    var pdf = $("[data-pdf]");
    if (pdf) {
      pdf.addEventListener("click", function (e) {
        e.preventDefault();
        var old = $(".print-menu");
        if (old) old.remove();

        var wrap = document.createElement("div");
        wrap.className = "print-menu";
        var html = '<div class="ph"><h1>ANDRES</h1>' +
          "<p>Rooftop Smokehouse and Grill &middot; Menu &middot; " +
          new Date().toLocaleDateString() + "</p></div>";

        data.courses.forEach(function (c) {
          var items = data.items.filter(function (i) { return i.course === c.id; });
          if (!items.length) return;
          html += "<h2>" + c.name + "</h2>";
          items.forEach(function (i) {
            html += '<div class="pi"><span class="n">' + i.name +
                    '</span><span class="d"></span><span class="p">$' + i.price + "</span></div>";
          });
        });

        html += '<div class="pf">Please tell us about any allergies before you order. ' +
                "Prices exclude tax and gratuity.</div>";
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        window.print();
      });
    }
  })();

  /* ===================== booking ===================== */

  (function booking() {
    var root = $("[data-booking]");
    if (!root) return;

    var state = { view: new Date(), date: null, time: null, party: 2 };

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + CONFIG.advanceDays);

    var closed = function (d) { return CONFIG.closedDays.indexOf(d.getDay()) > -1; };

    /* ---- calendar ---- */
    var grid = $("[data-cal]", root),
        label = $("[data-month]", root),
        prev = $("[data-prev]", root),
        next = $("[data-next]", root);

    var drawCal = function () {
      var y = state.view.getFullYear(), m = state.view.getMonth();
      label.textContent = MONTHS[m] + " " + y;

      var pad = new Date(y, m, 1).getDay();
      var total = new Date(y, m + 1, 0).getDate();
      var html = ["S","M","T","W","T","F","S"].map(function (d) {
        return '<span class="dow">' + d + "</span>";
      }).join("");

      for (var i = 0; i < pad; i++) html += "<span></span>";

      for (var day = 1; day <= total; day++) {
        var d = new Date(y, m, day);
        var off = d < today || d > maxDate || closed(d);
        var cls = ["day"];
        if (state.date === iso(d)) cls.push("sel");
        if (iso(d) === iso(today)) cls.push("now");
        html += '<button type="button" class="' + cls.join(" ") + '" data-date="' + iso(d) + '"' +
          (off ? " disabled" : "") + ' aria-label="' + DAYS[d.getDay()] + " " + MONTHS[m] + " " + day +
          (closed(d) ? ", closed" : "") + '">' + day + "</button>";
      }
      grid.innerHTML = html;

      prev.disabled = new Date(y, m, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);
      next.disabled = new Date(y, m + 1, 1) > maxDate;
    };

    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".day");
      if (!b || b.disabled) return;
      state.date = b.dataset.date;
      state.time = null;
      drawCal(); drawSlots(); sync();
    });
    prev.addEventListener("click", function () {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() - 1, 1); drawCal();
    });
    next.addEventListener("click", function () {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 1); drawCal();
    });

    /* ---- slots ---- */
    var slotBox = $("[data-slots]", root), slotNote = $("[data-slotnote]", root);

    var drawSlots = function () {
      if (!state.date) {
        slotBox.innerHTML = "";
        slotNote.className = "note";
        slotNote.textContent = "Choose a date and we will show the tables still free that evening.";
        return;
      }
      var p = state.date.split("-");
      var d = new Date(+p[0], p[1] - 1, +p[2]);
      var hrs = CONFIG.hours[d.getDay()];
      if (!hrs) {
        slotBox.innerHTML = "";
        slotNote.className = "note warn";
        slotNote.textContent = "We are closed on " + DAYS[d.getDay()] + "s.";
        return;
      }

      var open = toMin(hrs[0]), last = toMin(hrs[1]) - CONFIG.turnMinutes;
      var html = "", free = 0;

      for (var t = open; t <= last; t += CONFIG.slotStep) {
        var lbl = clock(t);
        var full = seatsFree(state.date, lbl) < state.party;
        if (!full) free++;
        html += '<button type="button" class="slot' + (state.time === lbl ? " sel" : "") + '"' +
          ' data-time="' + lbl + '"' + (full ? " disabled" : "") +
          ' aria-label="' + lbl + (full ? ", fully booked" : ", available") + '">' + lbl + "</button>";
      }
      slotBox.innerHTML = html;

      if (!free) {
        slotNote.className = "note warn";
        slotNote.textContent = "Every table for " + state.party + " is taken that day. Try another date or a smaller party.";
      } else {
        slotNote.className = "note";
        slotNote.textContent = free + " seating" + (free === 1 ? "" : "s") + " still free for " +
          state.party + " on " + DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ".";
      }
    };

    slotBox.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b || b.disabled) return;
      state.time = b.dataset.time;
      drawSlots(); sync();
    });

    /* ---- party ---- */
    var pv = $("[data-party]", root), dec = $("[data-dec]", root),
        inc = $("[data-inc]", root), pnote = $("[data-partynote]", root);

    var drawParty = function () {
      pv.textContent = state.party;
      dec.disabled = state.party <= 1;
      inc.disabled = state.party >= CONFIG.maxParty;
      pnote.hidden = state.party < CONFIG.maxParty;
    };
    dec.addEventListener("click", function () {
      if (state.party > 1) state.party--;
      state.time = null; drawParty(); drawSlots(); sync();
    });
    inc.addEventListener("click", function () {
      if (state.party < CONFIG.maxParty) state.party++;
      state.time = null; drawParty(); drawSlots(); sync();
    });

    /* ---- summary ---- */
    var sD = $("[data-sum-date]", root), sT = $("[data-sum-time]", root),
        sP = $("[data-sum-party]", root), submit = $("[data-submit]", root);

    var pretty = function (s) {
      var p = s.split("-"), d = new Date(+p[0], p[1] - 1, +p[2]);
      return DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
    };
    var put = function (el, v) {
      el.textContent = v || "Not chosen yet";
      el.classList.toggle("pending", !v);
    };
    var sync = function () {
      put(sD, state.date ? pretty(state.date) : null);
      put(sT, state.time);
      put(sP, state.party + (state.party === 1 ? " guest" : " guests"));
      submit.disabled = !(state.date && state.time);
    };

    /* ---- submit ---- */
    var form = $("[data-form]", root), live = $("[data-live]", root), done = $("[data-done]", root);

    var mark = function (el, bad) { el.closest(".field").classList.toggle("invalid", bad); };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = $("#bk-name"), m = $("#bk-email"), t = $("#bk-phone");
      var ok = true;

      if (!n.value.trim()) { mark(n, true); ok = false; } else mark(n, false);
      if (!/^\S+@\S+\.\S+$/.test(m.value.trim())) { mark(m, true); ok = false; } else mark(m, false);
      if (t.value.replace(/\D/g, "").length < 7) { mark(t, true); ok = false; } else mark(t, false);

      if (!ok) { $(".field.invalid input", form).focus(); return; }
      if (!state.date || !state.time) return;

      /* Demo only — nothing is sent. The real build posts to the reservation
         service, which stores the booking and sends the confirmation email. */
      $("[data-ref]", done).textContent = "AN-" + Math.floor(1000 + Math.random() * 9000);
      $("[data-detail]", done).textContent =
        pretty(state.date) + " at " + state.time + " for " +
        state.party + (state.party === 1 ? " guest" : " guests");
      $("[data-mail]", done).textContent = m.value.trim();

      live.classList.add("hide");
      done.classList.add("show");
      done.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    var again = $("[data-again]", root);
    if (again) {
      again.addEventListener("click", function () {
        state.date = null; state.time = null; state.party = 2;
        form.reset();
        $$(".field.invalid", form).forEach(function (f) { f.classList.remove("invalid"); });
        done.classList.remove("show");
        live.classList.remove("hide");
        drawCal(); drawSlots(); drawParty(); sync();
        live.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    drawCal(); drawSlots(); drawParty(); sync();
  })();

  /* ===================== contact ===================== */

  (function contact() {
    var form = $("[data-contact]");
    if (!form) return;
    var done = $("[data-sent]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (i) {
        var good = i.type === "email" ? /^\S+@\S+\.\S+$/.test(i.value.trim()) : i.value.trim().length > 0;
        i.closest(".field").classList.toggle("invalid", !good);
        if (!good) ok = false;
      });
      if (!ok) { $(".field.invalid input, .field.invalid textarea", form).focus(); return; }
      form.hidden = true;
      done.classList.add("show");
      done.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  })();

})();
