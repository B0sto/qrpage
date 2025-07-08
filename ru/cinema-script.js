const trailerModal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailerFrame");
const closeModal = document.querySelector(".close-modal");

async function loadMoviesData() {
  try {
    const response = await fetch('../data/dataRu.json');
    console.log(response);
    
    if (!response.ok) throw new Error('Failed to load movies data');
    const moviesData = await response.json();

    renderMovieCards(moviesData);
    initializeMenuSelectors(moviesData);
    initializeTrailerButtons();
    initializeModalHandlers();
    initializeAnimations();

  } catch (error) {
    console.error('Error loading movies data:', error);
  }
}

function renderMovieCards(moviesData) {
  const container = document.querySelector(".movies-grid");
  container.innerHTML = "";

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  Object.entries(moviesData).forEach(([key, movie], index) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.movie = key;

    const daysHTML = days
      .map(
        (day) =>
          `<span class="day${movie.availableDays && movie.availableDays[day] ? " active" : ""}">${day}</span>`
      )
      .join("");

    card.innerHTML = `
      <div class="movie-poster">
        <img src="${movie.image}" alt="${movie.title}" />
        <div class="movie-overlay">
          <button class="play-trailer" data-trailer-url="${movie.url}">
            ▶ ტრეილერი
          </button>
        </div>
      </div>

      <button class="mobile-trailer-btn" data-trailer-url="${movie.url}">
        ▶ ტრეილერი
      </button>

      <div class="date_btn">${movie.date} | ${movie.showtime}</div>
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="movie-schedule">${daysHTML}</div>
        <div class="combo-menu">
          <h4>Комбо Меню:</h4>
          <select class="menu-selector" data-menu-index="${index + 1}">
            <option value="">Выберите Меню</option>
            <option value="single">На одного - ${movie.menu.single.newPrice}</option>
            <option value="double">На двоих - ${movie.menu.double.newPrice}</option>
          </select>
          <div class="menu-details" id="menu-details-${index + 1}"></div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function initializeMenuSelectors(moviesData) {
  document.querySelectorAll(".menu-selector").forEach((selector) => {
    selector.addEventListener("change", function () {
      const selectedValue = this.value;
      const menuIndex = this.getAttribute("data-menu-index");
      const menuDetails = document.getElementById(`menu-details-${menuIndex}`);
      const movieKey = Object.keys(moviesData)[menuIndex - 1];
      const menuData = moviesData[movieKey].menu;

      if (selectedValue && menuData[selectedValue]) {
        showMenuDetails(menuDetails, menuData[selectedValue]);
      } else {
        hideMenuDetails(menuDetails);
      }
    });
  });
}

function showMenuDetails(menuDetails, menuInfo) {
  menuDetails.innerHTML = `
    <h5>${menuInfo.title}</h5>
    <div class="menu-prices">
      ${menuInfo.oldPrice ? `<span class="old-price">${menuInfo.oldPrice}</span>` : ""}
      <span class="new-price">${menuInfo.newPrice}</span>
    </div>
    <ul>${menuInfo.items.map(item => `<li>${item}</li>`).join("")}</ul>
  `;
  menuDetails.classList.add("show");
}

function hideMenuDetails(menuDetails) {
  menuDetails.classList.remove("show");
  setTimeout(() => (menuDetails.innerHTML = ""), 300);
}

function initializeTrailerButtons() {
  document.querySelectorAll(".play-trailer, .mobile-trailer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openTrailerModal(button.dataset.trailerUrl);
    });
  });
}

function openTrailerModal(url) {
  trailerFrame.src = url;
  trailerModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeTrailerModal() {
  trailerModal.classList.remove("show");
  trailerFrame.src = "";
  document.body.style.overflow = "auto";
}

function initializeModalHandlers() {
  closeModal.addEventListener("click", closeTrailerModal);
  trailerModal.addEventListener("click", e => {
    if (e.target === trailerModal) closeTrailerModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && trailerModal.classList.contains("show")) closeTrailerModal();
  });
}

function initializeAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".movie-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.3s ease`;
    observer.observe(card);

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadMoviesData);
