(() => {
  const container = document.getElementById("archive-content");
  const labels = {
    tops: "상의",
    bottoms: "하의",
    accessories: "액세서리",
  };

  function renderCategory(category, items) {
    const wrapper = document.createElement("div");
    wrapper.className = "archive-category";

    const title = document.createElement("h2");
    title.textContent = labels[category];
    wrapper.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      const swatch = document.createElement("div");
      swatch.style.width = "100%";
      swatch.style.height = "110px";
      swatch.style.borderRadius = "18px";
      swatch.style.marginBottom = "1rem";
      swatch.style.background = item.color;

      const name = document.createElement("h3");
      name.textContent = item.label;

      const desc = document.createElement("p");
      desc.textContent = item.description;

      card.appendChild(swatch);
      card.appendChild(name);
      card.appendChild(desc);
      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  function init() {
    if (!window.DRESS_UP_ITEMS) return;
    window.DRESS_UP_ORDER.forEach((category) => {
      renderCategory(category, window.DRESS_UP_ITEMS[category]);
    });
  }

  init();
})();
