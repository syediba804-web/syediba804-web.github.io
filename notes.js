/* Shared behaviour for all skill notes pages.
   Each page may define:  window.QUIZ = [{q, opts:[...], a:index, why}]  and  window.PAGE_ID = "python"  */
(function () {
  "use strict";
  var KEY = "ib-notes:";
  function load(k, d) { try { var v = localStorage.getItem(KEY + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var theme = load("theme", "dark");
  root.setAttribute("data-theme", theme);
  document.addEventListener("DOMContentLoaded", function () {
    var tb = document.getElementById("themeBtn");
    if (tb) {
      tb.textContent = theme === "dark" ? "☀" : "☾";
      tb.addEventListener("click", function () {
        theme = theme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", theme);
        tb.textContent = theme === "dark" ? "☀" : "☾";
        save("theme", theme);
      });
    }

    /* ---------- reading progress bar ---------- */
    var bar = document.getElementById("progress");
    if (bar) {
      window.addEventListener("scroll", function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      }, { passive: true });
    }

    /* ---------- table of contents ---------- */
    var toc = document.getElementById("toc");
    var topics = document.querySelectorAll("section.topic");
    if (toc && topics.length) {
      var h = document.createElement("h4"); h.textContent = "On this page"; toc.appendChild(h);
      topics.forEach(function (s) {
        var h2 = s.querySelector("h2"); if (!h2) return;
        var a = document.createElement("a");
        a.href = "#" + s.id;
        a.textContent = (h2.getAttribute("data-short") || h2.firstChild.textContent).trim();
        toc.appendChild(a);
      });
      var links = toc.querySelectorAll("a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      topics.forEach(function (s) { io.observe(s); });
    }

    /* ---------- copy buttons on code blocks ---------- */
    document.querySelectorAll("pre").forEach(function (pre) {
      var b = document.createElement("button");
      b.className = "copy"; b.textContent = "Copy";
      b.addEventListener("click", function () {
        var t = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1200); };
        if (navigator.clipboard) { navigator.clipboard.writeText(t).then(done, function () {}); }
      });
      pre.appendChild(b);
    });

    /* ---------- quiz ---------- */
    var qbox = document.getElementById("quiz");
    var pageId = window.PAGE_ID || "page";
    if (qbox && window.QUIZ) {
      var answered = 0, correct = 0;
      var total = window.QUIZ.length;
      var scoreEl = document.createElement("div");
      scoreEl.className = "score";
      var best = load("best:" + pageId, null);
      scoreEl.textContent = best === null ? "Answer all " + total + " questions to see your score." : "Best score so far: " + best + " / " + total + ". Try to beat it!";
      window.QUIZ.forEach(function (item, i) {
        var wrap = document.createElement("div"); wrap.className = "quiz-q";
        var q = document.createElement("h4"); q.textContent = (i + 1) + ". " + item.q; wrap.appendChild(q);
        var why = document.createElement("div"); why.className = "why";
        why.textContent = item.why || "";
        var buttons = [];
        item.opts.forEach(function (o, j) {
          var b = document.createElement("button"); b.className = "opt"; b.textContent = o;
          b.addEventListener("click", function () {
            buttons.forEach(function (x) { x.disabled = true; });
            answered++;
            if (j === item.a) { b.classList.add("right"); correct++; }
            else { b.classList.add("wrong"); buttons[item.a].classList.add("right"); }
            why.classList.add("show");
            if (answered === total) {
              var msg = "Score: " + correct + " / " + total + ". ";
              msg += correct === total ? "Perfect! 🎉" : correct >= total * 0.7 ? "Nice work — review the ones you missed." : "Re-read the notes above and try again.";
              scoreEl.textContent = msg;
              if (best === null || correct > best) save("best:" + pageId, correct);
            }
          });
          buttons.push(b); wrap.appendChild(b);
        });
        wrap.appendChild(why); qbox.appendChild(wrap);
      });
      qbox.appendChild(scoreEl);
      var retry = document.createElement("button"); retry.className = "btn"; retry.textContent = "Retake quiz";
      retry.addEventListener("click", function () { location.hash = "#quiz-section"; location.reload(); });
      qbox.appendChild(retry);
    }

    /* ---------- assignments with saved progress ---------- */
    var tasks = document.querySelectorAll(".task input[type=checkbox]");
    if (tasks.length) {
      var state = load("tasks:" + pageId, {});
      tasks.forEach(function (cb, i) {
        var box = cb.closest(".task");
        if (state[i]) { cb.checked = true; box.classList.add("done"); }
        cb.addEventListener("change", function () {
          box.classList.toggle("done", cb.checked);
          state[i] = cb.checked; save("tasks:" + pageId, state);
          updateCount();
        });
      });
      var cnt = document.getElementById("taskCount");
      function updateCount() {
        if (!cnt) return;
        var d = 0; tasks.forEach(function (c) { if (c.checked) d++; });
        cnt.textContent = d + " of " + tasks.length + " assignments done";
      }
      updateCount();
    }
  });
})();
