/* Makes each card in the portfolio's #skills section open its notes page.
   Add this to your portfolio's index.html, just before </body>:
     <script src="notes/skills-links.js" defer></script>
   It finds each skill by its label text, so you don't need to change your HTML. */
(function () {
  "use strict";
  var BASE = "notes/";
  var LINKS = {
    "python": "python.html",
    "algorithms": "algorithms.html",
    "data structures": "data-structures.html",
    "html / css": "html.html",
    "html": "html.html",
    "css": "css.html",
    "linux / cli": "linux.html",
    "mathematics": "mathematics.html"
  };

  function init() {
    var section = document.getElementById("skills");
    if (!section) return;
    var all = section.querySelectorAll("*");
    var done = [];

    Array.prototype.forEach.call(all, function (el) {
      if (el.children.length) return;                     // only leaf elements hold the label
      var label = (el.textContent || "").trim().toLowerCase();
      if (!LINKS[label]) return;

      // climb up to the card: the largest ancestor that contains only this one skill label
      var card = el;
      while (card.parentElement && card.parentElement !== section) {
        var parent = card.parentElement;
        var labels = 0;
        Array.prototype.forEach.call(parent.querySelectorAll("*"), function (n) {
          if (!n.children.length && LINKS[(n.textContent || "").trim().toLowerCase()]) labels++;
        });
        if (labels > 1) break;
        card = parent;
      }
      if (done.indexOf(card) !== -1) return;
      done.push(card);

      var url = BASE + LINKS[label];
      card.style.cursor = "pointer";
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.setAttribute("title", "Open " + el.textContent.trim() + " notes");
      card.addEventListener("click", function () { window.location.href = url; });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.href = url; }
      });

      var hint = document.createElement("div");
      hint.textContent = "Open notes →";
      hint.style.cssText = "margin-top:8px;font-size:.8rem;opacity:.75;";
      card.appendChild(hint);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
