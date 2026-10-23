
const games = [
  {
    id: "psp-homebrew-1",
    title: "PSP Homebrew Demo",
    platform: "PSP",
    category: "Homebrew",
    description: "A placeholder for a PSP homebrew game you have permission to use.",
    icon: "🎮",
    art: "art-one",
    status: "planned"
  },
  {
    id: "psp-homebrew-2",
    title: "Portable Adventure",
    platform: "PSP",
    category: "Homebrew",
    description: "A catalog entry for a compatible PSP homebrew project.",
    icon: "🗺️",
    art: "art-two",
    status: "planned"
  },
  {
    id: "psp-homebrew-3",
    title: "Pixel Quest",
    platform: "PSP",
    category: "Homebrew",
    description: "A sample listing for a retro-style homebrew game.",
    icon: "👾",
    art: "art-three",
    status: "planned"
  },
  {
    id: "psp-homebrew-4",
    title: "Pocket Racer",
    platform: "PSP",
    category: "Homebrew",
    description: "A sample listing for a racing homebrew project.",
    icon: "🏁",
    art: "art-four",
    status: "planned"
  },
  {
    id: "browser-demo-1",
    title: "Neon Worlds",
    platform: "Browser",
    category: "Web Game",
    description: "A placeholder for a game built to run directly in a browser.",
    icon: "✨",
    art: "art-five",
    status: "planned"
  },
  {
    id: "browser-demo-2",
    title: "Arcade Lab",
    platform: "Browser",
    category: "Web Game",
    description: "A sample listing for a future HTML5 arcade game.",
    icon: "🕹️",
    art: "art-six",
    status: "planned"
  }
];

const grid = document.getElementById("game-grid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const countLabel = document.getElementById("game-count");
const filterButtons = document.querySelectorAll("[data-filter]");
const dialog = document.getElementById("game-dialog");
const dialogContent = document.getElementById("dialog-content");
const closeDialog = document.getElementById("close-dialog");

let activeFilter = "all";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderGames() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedPlatform = categorySelect.value;

  const filteredGames = games.filter(game => {
    const searchableText = [
      game.title,
      game.platform,
      game.category,
      game.description
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesPlatform =
      selectedPlatform === "all" ||
      game.platform === selectedPlatform;

    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "ready" && game.status === "ready") ||
      (activeFilter === "planned" && game.status === "planned");

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  countLabel.textContent =
    `${filteredGames.length} ${filteredGames.length === 1 ? "game" : "games"}`;

  if (filteredGames.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No games found</h3>
        <p>Try a different search or platform filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filteredGames.map(game => {
    const isReady = game.status === "ready";

    return `
      <article class="game-card">
        <div class="game-art ${escapeHTML(game.art)}">
          <span class="art-icon" aria-hidden="true">
            ${escapeHTML(game.icon)}
          </span>
        </div>

        <div class="game-info">
          <div class="game-meta">
            <span class="pill">${escapeHTML(game.platform)}</span>
            <span class="pill ${isReady ? "status" : "soon"}">
              ${isReady ? "Browser-ready" : "Coming soon"}
            </span>
          </div>

          <h3>${escapeHTML(game.title)}</h3>
          <p>${escapeHTML(game.description)}</p>

          <div class="card-actions">
            <button class="card-button primary"
              data-play="${escapeHTML(game.id)}">
              ${isReady ? "Play now →" : "View details"}
            </button>
            <button class="card-button"
              data-details="${escapeHTML(game.id)}">
              Details
            </button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function openGameDetails(gameId) {
  const game = games.find(item => item.id === gameId);
  if (!game) return;

  const isReady = game.status === "ready";

  dialogContent.innerHTML = `
    <div class="dialog-symbol" aria-hidden="true">
      ${escapeHTML(game.icon)}
    </div>
    <span class="pill">${escapeHTML(game.platform)}</span>
    <h2>${escapeHTML(game.title)}</h2>
    <p class="dialog-note">${escapeHTML(game.description)}</p>

    <div class="dialog-status">
      <strong>${isReady ? "Player available" : "Player not connected yet"}</strong>
      <p class="dialog-note">
        ${isReady
          ? "This game is marked as browser-ready."
          : "This is a sample library entry. A compatible game runtime must be integrated before it can launch."}
      </p>
    </div>

    <button class="card-button primary" id="dialog-play"
      ${isReady ? "" : "disabled"}>
      ${isReady ? "Launch game" : "Not playable yet"}
    </button>
  `;

  dialogContent.querySelector("#dialog-play")
    .addEventListener("click", () => {
      if (isReady) {
        launchGame(game);
      }
    });

  if (!dialog.open) dialog.showModal();
}

function launchGame(game) {
  // A real player will be connected in a later milestone.
  // Never pretend an emulator has launched when it has not.
  dialogContent.innerHTML = `
    <div class="dialog-symbol" aria-hidden="true">🎮</div>
    <h2>Player integration needed</h2>
    <p class="dialog-note">
      The library is working, but a compatible browser game player
      has not been connected yet.
    </p>
    <div class="dialog-status">
      Selected game: <strong>${escapeHTML(game.title)}</strong>
    </div>
  `;
}

searchInput.addEventListener("input", renderGames);
categorySelect.addEventListener("change", renderGames);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    renderGames();
  });
});

grid.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const playId = button.dataset.play;
  const detailsId = button.dataset.details;

  if (playId) openGameDetails(playId);
  if (detailsId) openGameDetails(detailsId);
});

closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

renderGames();
