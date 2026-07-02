(() => {
  const registerServiceWorker = () => {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // Service worker registration can fail on file:// or unsupported local environments.
      });
    });
  };

  const initInstallPrompt = () => {
    let deferredPrompt = null;
    let installButton = null;

    const createButton = () => {
      if (installButton) return installButton;
      installButton = document.createElement("button");
      installButton.type = "button";
      installButton.className = "install-app-button";
      installButton.hidden = true;
      installButton.textContent = "Install App";
      installButton.setAttribute("aria-label", "Install LuxEstate app");
      document.body.appendChild(installButton);

      installButton.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        installButton.hidden = true;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      });

      return installButton;
    };

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
      createButton().hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      if (installButton) installButton.hidden = true;
    });
  };

  registerServiceWorker();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInstallPrompt);
  } else {
    initInstallPrompt();
  }
})();
