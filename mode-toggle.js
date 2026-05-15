(function () {
  var STORAGE_KEY = "akj_theme_mode";

  function getSavedMode() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || "dark";
    } catch (error) {
      return "dark";
    }
  }

  function setSavedMode(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      // Ignore storage errors.
    }
  }

  function applyMode(mode) {
    document.body.classList.toggle("light-mode", mode === "light");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    if (!body) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "mode-toggle";
    button.setAttribute("aria-label", "Switch to light mode");
    button.setAttribute("title", "Switch to light mode");
    var isSubdir = window.location.pathname.indexOf('/pages/') !== -1;
    var pathPrefix = isSubdir ? "../" : "./";

    button.innerHTML = '<img src="' + pathPrefix + 'images/sleep.png" alt="Light Bulb Toggle">';
    body.appendChild(button);

    function syncButton(mode) {
      var isLight = mode === "light";
      button.setAttribute("aria-pressed", isLight ? "true" : "false");
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");

      var img = button.querySelector("img");
      if (img) {
        img.src = isLight ? pathPrefix + "images/awake.png" : pathPrefix + "images/sleep.png";
      }
    }

    var mode = getSavedMode();
    applyMode(mode);
    syncButton(mode);

    button.addEventListener("click", function (event) {
      mode = document.body.classList.contains("light-mode") ? "dark" : "light";
      setSavedMode(mode);

      if (!document.startViewTransition) {
        applyMode(mode);
        syncButton(mode);
        return;
      }

      var rect = button.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height * 0.75;

      document.documentElement.style.setProperty('--x', x + 'px');
      document.documentElement.style.setProperty('--y', y + 'px');

      var isGoingLight = mode === "light";
      document.documentElement.classList.toggle('transitioning-to-light', isGoingLight);
      document.documentElement.classList.toggle('transitioning-to-dark', !isGoingLight);

      var transition = document.startViewTransition(function () {
        applyMode(mode);
        syncButton(mode);
      });

      transition.finished.then(function () {
        document.documentElement.classList.remove('transitioning-to-light', 'transitioning-to-dark');
      });
    });

    window.addEventListener("storage", function (event) {
      if (event.key === STORAGE_KEY) {
        var updated = getSavedMode();
        applyMode(updated);
        syncButton(updated);
      }
    });
  });
})();

