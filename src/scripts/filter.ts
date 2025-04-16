document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById(
    "searchInput",
  ) as HTMLInputElement;
  const tagButtons = document.querySelectorAll(".tag-btn");
  const educationItems = document.querySelectorAll(".timeline-item");
  const noResultsDiv = document.querySelector(".no-results") as HTMLElement;
  const resetSearchButton = document.querySelector(".reset-search-btn");
  const clearSearchBtn = document.getElementById("clearSearch");
  const clearTagsBtn = document.getElementById("clearTags");

  let activeTags: string[] = [];
  let searchTerm = "";

  // Function to normalize text (remove accents and convert to lowercase)
  function normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .toLowerCase()
      .trim();
  }

  function highlightText(element: Element, term: string) {
    if (!term.trim()) {
      // Restore original text by removing highlight spans
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

    // Create a regex pattern that matches the normalized version of the search term
    const normalizedTerm = normalizeText(term);

    // Use a regex pattern that matches accented and non-accented characters
    const accentInsensitivePattern = normalizedTerm
      .split("")
      .map((char) => {
        const accentedVariants: Record<string, string> = {
          a: "[aáà]",
          e: "[eéè]",
          i: "[iíì]",
          o: "[oóò]",
          u: "[uúù]",
          n: "[nñ]",
        };
        return accentedVariants[char] || char;
      })
      .join("");

    const regex = new RegExp(`(${accentInsensitivePattern})`, "gi");

    // Replace while preserving the original case and accents
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
    const normalizedSearchTerm = normalizeText(searchTerm); // Normalize the search term
    let visibleItems = 0; // To track how many items should be visible

    educationItems.forEach((item) => {
      const itemElement = item as HTMLElement;
      const itemTags = itemElement.dataset.tags?.split(",") || [];
      const titleElement = itemElement.querySelector("h3");
      const descriptionElement = itemElement.querySelector(".description");

      // Extract the title & description and normalize for matching
      const title = titleElement?.textContent || "";
      const description = descriptionElement?.textContent || "";
      const normalizedTitle = normalizeText(title);
      const normalizedDescription = normalizeText(description);

      // Determine if the item matches ALL of the active tags or the search term
      const matchesTag =
        activeTags.length === 0 ||
        activeTags.every((tag) => itemTags.includes(tag));
      const matchesSearch =
        !normalizedSearchTerm ||
        normalizedTitle.includes(normalizedSearchTerm) ||
        normalizedDescription.includes(normalizedSearchTerm);

      // The item is visible if it matches both the tag and the search
      const isVisible = matchesTag && matchesSearch;

      // Update visible/hidden styles
      itemElement.style.display = isVisible ? "flex" : "none";

      if (isVisible) {
        visibleItems++;

        // Highlight matching terms if the search term exists
        if (searchTerm && titleElement && descriptionElement) {
          highlightText(titleElement, searchTerm);
          highlightText(descriptionElement, searchTerm);
        } else {
          // Remove existing highlights if no search term is provided
          if (titleElement)
            titleElement.innerHTML = titleElement.textContent || "";
          if (descriptionElement)
            descriptionElement.innerHTML = descriptionElement.textContent || "";
        }
      }
    });

    // Show or hide the "No Results" message
    noResultsDiv.style.display = visibleItems === 0 ? "block" : "none";
  }

  function setActiveTag(newTag: string) {
    if (newTag === "all") {
      // If "all" is clicked, clear all active tags
      activeTags = [];

      // Remove active class from all tag buttons except "all"
      tagButtons.forEach((btn) => {
        const button = btn as HTMLElement;
        button.classList.toggle("active", button.dataset.tag === "all");
      });

      // Remove active class from all tags in timeline items
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
            activeTags.includes(button.dataset.tag || ""),
          );
        }
      });

      // Update active class on timeline item tags
      document.querySelectorAll(".tag").forEach((tag) => {
        const tagText = tag.textContent?.trim() || "";
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

    // Remove active class from all tag buttons except "all"
    tagButtons.forEach((btn) => {
      const button = btn as HTMLElement;
      if (button.dataset.tag !== "all") {
        button.classList.remove("active");
      }
    });

    // Remove active class from all tags
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

    // Remove active class from all tag buttons except "all"
    tagButtons.forEach((btn) => {
      const button = btn as HTMLElement;
      if (button.dataset.tag !== "all") {
        button.classList.remove("active");
      }
    });

    // Remove active class from all tags
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.classList.remove("active");
    });

    filterItems(); // Apply filter logic to reset visibility for all items
  }

  // Attach event listeners to tag buttons
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonElement = button as HTMLButtonElement;
      setActiveTag(buttonElement.dataset.tag || "all");
    });
  });

  // Update existing click handlers
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonElement = button as HTMLButtonElement;
      setActiveTag(buttonElement.dataset.tag || "all");
    });
  });

  // Add click handler for item tags
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("tag")) {
      const tagText = target.textContent?.trim() || "";
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
      const newTag = (event.currentTarget as HTMLElement).dataset.tag || "all";

      // Set the active tag (this will handle updating the active class on timeline item tags)
      setActiveTag(newTag);

      // OPTIONAL: Trigger a custom event to notify the rest of the application
      document.dispatchEvent(
        new CustomEvent("tagChange", { detail: { activeTag } }),
      );
    });
  });

  // Clear search on button click
  clearSearchBtn?.addEventListener("click", resetSearch);

  let debounceTimeout: number;
});
