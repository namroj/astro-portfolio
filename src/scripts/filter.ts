document.addEventListener("astro:page-load", () => {
  const searchInput = document.getElementById(
    "searchInput",
  ) as HTMLInputElement;
  const tagButtons = document.querySelectorAll(".tag-btn");
  const items = document.querySelectorAll(".timeline-item");
  const noMatchItemsElement = document.querySelector(
    ".no-match-items",
  ) as HTMLElement;
  const resetSearchButton = document.querySelector(".reset-search-btn");
  const clearSearchBtn = document.getElementById("clearSearch");
  const clearTagsBtn = document.getElementById("clearTags");

  let activeTags: string[] = [];
  let searchTerm = "";

  function normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function highlightText(element: Element, term: string) {
    if (!term.trim()) {
      element.innerHTML = element.innerHTML.replace(
        /<mark class="highlight">|<\/mark>/g,
        "",
      );
      return;
    }

    const originalText = element.innerHTML.replace(
      /<mark class="highlight">|<\/mark>/g,
      "",
    );
    const normalizedTerm = normalizeText(term);

    const accentInsensitivePattern = normalizedTerm
      .split("")
      .map((char) => {
        const accentedVariants: Record<string, string> = {
          a: "[aáàäâãå]",
          e: "[eéèëê]",
          i: "[iíìïî]",
          o: "[oóòöôõ]",
          u: "[uúùüû]",
          n: "[nñ]",
          c: "[cç]",
        };
        return accentedVariants[char] || char;
      })
      .join("");

    const regex = new RegExp(`(${accentInsensitivePattern})`, "gi");

    let lastIndex = 0;
    let result = "";
    let match;

    while ((match = regex.exec(originalText)) !== null) {
      const matchedText = match[0];
      result += originalText.substring(lastIndex, match.index);
      result += `<mark class="highlight">${matchedText}</mark>`;
      lastIndex = regex.lastIndex;
    }
    result += originalText.substring(lastIndex);

    element.innerHTML = result;
  }

  function filterItems() {
    const normalizedSearchTerm = normalizeText(searchTerm);
    let visibleItems = 0;

    items.forEach((item) => {
      const itemElement = item as HTMLElement;
      const itemTags = itemElement.dataset.tags?.split(",") || [];
      const titleElement = itemElement.querySelector("h3");
      const descriptionElement = itemElement.querySelector(".description");

      const title = titleElement?.textContent ?? "";
      const description = descriptionElement?.textContent ?? "";
      const normalizedTitle = normalizeText(title);
      const normalizedDescription = normalizeText(description);

      const matchesTag =
        activeTags.length === 0 ||
        activeTags.every((tag) => itemTags.includes(tag));
      const matchesSearch =
        !normalizedSearchTerm ||
        normalizedTitle.includes(normalizedSearchTerm) ||
        normalizedDescription.includes(normalizedSearchTerm);

      const isVisible = matchesTag && matchesSearch;
      itemElement.style.display = isVisible ? "flex" : "none";

      if (titleElement) highlightText(titleElement, searchTerm);
      if (descriptionElement) highlightText(descriptionElement, searchTerm);

      if (isVisible) visibleItems++;
    });

    noMatchItemsElement.style.display = visibleItems === 0 ? "block" : "none";
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = (e.target as HTMLInputElement).value;
      filterItems();
    });
  }

  function setActiveTag(newTag: string) {
    if (newTag === "all") {
      // If "all" is clicked, clear all active tags
      activeTags = [];

      // Remove the active class from all tag buttons except "all"
      tagButtons.forEach((btn) => {
        const button = btn as HTMLElement;
        button.classList.toggle("active", button.dataset.tag === "all");
      });

      // Remove the active class from all tags in timeline items
      document.querySelectorAll(".tag").forEach((tag) => {
        tag.classList.remove("active");
      });
    } else {
      // If the tag is already active, remove it
      const tagIndex = activeTags.indexOf(newTag);
      if (tagIndex > -1) {
        activeTags.splice(tagIndex, 1);
      } else {
        // Otherwise, add it to active tags
        activeTags.push(newTag);
      }

      // Update the "all" button (active only when no other tags are selected)
      const allButton = document.querySelector(
        '.tag-btn[data-tag="all"]',
      ) as HTMLElement;
      if (allButton) {
        allButton.classList.toggle("active", activeTags.length === 0);
      }

      // Update the styling of the tag buttons to reflect the active state
      tagButtons.forEach((btn) => {
        const button = btn as HTMLElement;
        if (button.dataset.tag !== "all") {
          button.classList.toggle(
            "active",
            activeTags.includes(button.dataset.tag ?? ""),
          );
        }
      });

      // Update active class on timeline item tags
      document.querySelectorAll(".tag").forEach((tag) => {
        const tagText = tag.textContent?.trim() ?? "";
        tag.classList.toggle("active", activeTags.includes(tagText));
      });
    }

    // Show/hide the clear tags button based on whether any tags are selected
    if (clearTagsBtn) {
      clearTagsBtn.style.display = activeTags.length > 0 ? "block" : "none";
    }

    // Reapply the filtering logic to show/hide items based on the active tags
    filterItems();
  }

  // Reset the search and tag filters
  function resetSearch() {
    searchInput.value = ""; // Reset search input field
    searchTerm = ""; // Clear search term
    activeTags = []; // Clear all active tags
    clearSearchBtn!.style.display = "none"; // Hide the clear search button

    if (clearTagsBtn) {
      clearTagsBtn.style.display = "none"; // Hide the clear tags button
    }

    // Update the "all" button to active
    const allButton = document.querySelector(
      '.tag-btn[data-tag="all"]',
    ) as HTMLElement;
    if (allButton) {
      allButton.classList.add("active");
    }

    // Remove the active class from all tag buttons except "all"
    tagButtons.forEach((btn) => {
      const button = btn as HTMLElement;
      if (button.dataset.tag !== "all") {
        button.classList.remove("active");
      }
    });

    // Remove an active class from all tags
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.classList.remove("active");
    });

    filterItems(); // Apply filter logic to reset visibility for all items
  }

  // Function to clear all active tags
  function clearAllTags() {
    activeTags = []; // Clear all active tags

    if (clearTagsBtn) {
      clearTagsBtn.style.display = "none"; // Hide the clear tags button
    }

    // Update the "all" button to active
    const allButton = document.querySelector(
      '.tag-btn[data-tag="all"]',
    ) as HTMLElement;
    if (allButton) {
      allButton.classList.add("active");
    }

    // Remove the active class from all tag buttons except "all"
    tagButtons.forEach((btn) => {
      const button = btn as HTMLElement;
      if (button.dataset.tag !== "all") {
        button.classList.remove("active");
      }
    });

    // Remove the active class from all tags
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.classList.remove("active");
    });

    filterItems(); // Apply filter logic to reset visibility for all items
  }

  // Attach event listeners to tag buttons
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonElement = button as HTMLButtonElement;
      setActiveTag(buttonElement.dataset.tag ?? "all");
    });
  });

  // Update existing click handlers
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonElement = button as HTMLButtonElement;
      setActiveTag(buttonElement.dataset.tag ?? "all");
    });
  });

  // Add click handler for item tags
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("tag")) {
      const tagText = target.textContent?.trim() ?? "";
      setActiveTag(tagText);
    }
  });

  // Add click handler for clear tags button
  clearTagsBtn?.addEventListener("click", clearAllTags);

  // Update reset button click handler
  resetSearchButton?.addEventListener("click", resetSearch);

  // Show/hide clear button based on input content
  searchInput?.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);

    const hasValue = (e.target as HTMLInputElement).value.length > 0;
    clearSearchBtn!.style.display = hasValue ? "block" : "none";

    debounceTimeout = setTimeout(() => {
      searchTerm = (e.target as HTMLInputElement).value;
      filterItems();
    }, 300);
  });

  tagButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const newTag = (event.currentTarget as HTMLElement).dataset.tag ?? "all";

      // Set the active tag (this will handle updating the active class on timeline item tags)
      setActiveTag(newTag);

      // OPTIONAL: Trigger a custom event to notify the rest of the application
      document.dispatchEvent(
        new CustomEvent("tagChange", { detail: { activeTags } }),
      );
    });
  });

  // Clear search on the button click
  clearSearchBtn?.addEventListener("click", resetSearch);

  let debounceTimeout: number;
});
