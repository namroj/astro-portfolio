import { matches } from "../utils/search";
function initFilters() {
  document
    .querySelectorAll<HTMLElement>("[data-filter-list]")
    .forEach((root) => {
      if (root.dataset.initialized) return;
      root.dataset.initialized = "true";
      const items = [
        ...root.querySelectorAll<HTMLElement>("[data-filter-item]"),
      ];
      const query = root.querySelector<HTMLInputElement>(
        "[data-filter-query]",
      )!;
      const tags = new Set<string>();
      const buttons = [
        ...root.querySelectorAll<HTMLButtonElement>("[data-filter-tag]"),
      ];
      const prev = root.querySelector<HTMLButtonElement>("[data-filter-prev]")!;
      const next = root.querySelector<HTMLButtonElement>("[data-filter-next]")!;
      const pageSize = 10;
      let page = 1;
      function update() {
        const filtered = items.filter(
          (item) =>
            matches(item.textContent || "", query.value) &&
            (!tags.size ||
              [...tags].some((tag) =>
                (item.dataset.tags || "").split(",").includes(tag),
              )),
        );
        const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
        page = Math.min(page, pages);
        items.forEach((item) => {
          item.hidden = true;
        });
        filtered
          .slice((page - 1) * pageSize, page * pageSize)
          .forEach((item) => {
            item.hidden = false;
          });
        buttons.forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(tags.has(button.dataset.filterTag!)),
          ),
        );
        root.querySelector<HTMLElement>("[data-filter-empty]")!.hidden =
          filtered.length > 0;
        root.querySelector<HTMLElement>("[data-filter-pagination]")!.hidden =
          filtered.length <= pageSize;
        root.querySelector<HTMLElement>("[data-filter-count]")!.textContent =
          `${page} / ${pages}`;
        prev.disabled = page <= 1;
        next.disabled = page >= pages;
      }
      query.addEventListener("input", () => {
        page = 1;
        update();
      });
      buttons.forEach((button) =>
        button.addEventListener("click", () => {
          const tag = button.dataset.filterTag!;
          tags.has(tag) ? tags.delete(tag) : tags.add(tag);
          page = 1;
          update();
        }),
      );
      root
        .querySelector("[data-filter-reset]")!
        .addEventListener("click", () => {
          query.value = "";
          tags.clear();
          page = 1;
          update();
          query.focus();
        });
      prev.addEventListener("click", () => {
        page--;
        update();
        query.focus();
      });
      next.addEventListener("click", () => {
        page++;
        update();
        query.focus();
      });
      update();
    });
}
initFilters();
document.addEventListener("astro:page-load", initFilters);
