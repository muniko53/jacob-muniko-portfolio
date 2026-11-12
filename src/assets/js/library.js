/* Project register filtering. Works only when the register is on the page. */
(() => {
  const list = document.getElementById("library-list");
  if (!list) return;

  const rows = Array.from(list.querySelectorAll(".lib-row"));
  const search = document.getElementById("project-search");
  const category = document.getElementById("category-filter");
  const status = document.getElementById("status-filter");
  const clear = document.getElementById("clear-filters");
  const count = document.getElementById("library-count");
  const empty = document.getElementById("empty-state");

  if (!rows.length || !search || !category || !status) return;

  const apply = () => {
    const query = search.value.trim().toLowerCase();
    const chosenCategory = category.value;
    const chosenStatus = status.value;
    let visible = 0;

    rows.forEach((row) => {
      const haystack = row.dataset.search || "";
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = !chosenCategory || row.dataset.category === chosenCategory;
      const matchesStatus = !chosenStatus || row.dataset.status === chosenStatus;
      const show = matchesQuery && matchesCategory && matchesStatus;

      row.hidden = !show;
      if (show) visible += 1;
    });

    if (count) {
      count.textContent = `${visible} ${visible === 1 ? "project" : "projects"} in the register`;
    }
    if (empty) {
      empty.hidden = visible !== 0;
    }
  };

  [search, category, status].forEach((control) => {
    control.addEventListener("input", apply);
    control.addEventListener("change", apply);
  });

  clear?.addEventListener("click", () => {
    search.value = "";
    category.value = "";
    status.value = "";
    apply();
    search.focus();
  });

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      search.value = "";
      apply();
    }
  });

  apply();
})();
