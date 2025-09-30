console.log("Navigation script loaded");

function scaleWidget() {
  const wrapper = document.getElementById("widget-wrapper");
  const scaler = document.getElementById("widget-scale");
  const baseWidth = 650;
  const baseHeight = 120;

  if (!wrapper || !scaler) return;

  const scaleX = wrapper.clientWidth / baseWidth;
  const scaleY = wrapper.clientHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  scaler.style.transform = `scale(${scale})`;
}
window.addEventListener("resize", scaleWidget);
window.addEventListener("load", scaleWidget);

// Modal + Links
const modal = document.getElementById("linkModal");
const closeBtn = document.querySelector(".close-btn");
const saveBtn = document.getElementById("saveLinks");
const settingsBtn = document.getElementById("settingsBtn");

const navIds = {
  home: "nav-home",
  tasks: "nav-tasks",
  goals: "nav-goals",
  habits: "nav-habits",
  health: "nav-health",
  knowledge: "nav-knowledge",
  finance: "nav-finance",
};

// ----------------------
// Helper: prefers a notion:// version when possible
// ----------------------
function toNotionProtocol(href) {
  if (!href) return href;
  try {
    // standardize the URL (so we can handle both https://www.notion.so/... and https://notion.so/...)
    const url = new URL(href);
    if (url.hostname.endsWith("notion.so")) {
      return href.replace(/^https?:\/\//, "notion://");
    }
  } catch (err) {
    // if URL constructor fails (invalid href), just return original
  }
  return href;
}

function applyLinks(links) {
  Object.keys(navIds).forEach((key) => {
    const btn = document.getElementById(navIds[key]);
    if (!btn) return;

    btn.removeAttribute("onclick");

    if (links[key]) {
      const href = links[key].trim();

      btn.onclick = (e) => {
        e.preventDefault();

        try {
          // Browser case → same tab
          if (window.top === window) {
            window.location.href = href;
          } else {
            // Notion App case → sandbox blocks top navigation, so fallback
            window.open(href, "_blank");
          }
        } catch {
          // Absolute last resort
          window.open(href, "_blank");
        }
      };
    } else {
      btn.setAttribute("href", "#");
      btn.onclick = (e) => {
        e.preventDefault();
        modal.style.display = "flex";
      };
    }
  });
}

window.addEventListener("load", () => {
  const savedLinks = JSON.parse(localStorage.getItem("navLinks") || "{}");
  applyLinks(savedLinks);
  const allEmpty = Object.keys(navIds).every((k) => !savedLinks[k]);
  if (allEmpty) modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  const links = {
    home: document.getElementById("link-home").value.trim(),
    tasks: document.getElementById("link-tasks").value.trim(),
    goals: document.getElementById("link-goals").value.trim(),
    habits: document.getElementById("link-habits").value.trim(),
    health: document.getElementById("link-health").value.trim(),
    knowledge: document.getElementById("link-knowledge").value.trim(),
    finance: document.getElementById("link-finance").value.trim(),
  };
  localStorage.setItem("navLinks", JSON.stringify(links));
  applyLinks(links);
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

settingsBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});