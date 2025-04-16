document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById(
    "searchInput"
  ) as HTMLInputElement;
  const tagButtons = document.querySelectorAll(".tag-btn");
  const educationItems = document.querySelectorAll(".timeline-item");
  const noResultsDiv = document.querySelector(".no-results") as HTMLElement;
  const resetSearchButton = document.querySelector(".reset-search-btn");
  const clearSearchBtn = document.getElementById("clearSearch");

  let activeTag = "all";
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
        ""
      );
      return;
    }

    const originalText = element.innerHTML.replace(
      /<mark class="highlight">|<\/mark>/g,
      ""
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
          n: "[nñ]"
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

      // Determine if the item matches the active tag or the search term
      const matchesTag = activeTag === "all" || itemTags.includes(activeTag);
      const matchesSearch = !normalizedSearchTerm ||
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
          if (titleElement) titleElement.innerHTML = titleElement.textContent || "";
          if (descriptionElement) descriptionElement.innerHTML = descriptionElement.textContent || "";
        }
      }
    });

    // Show or hide the "No Results" message
    noResultsDiv.style.display = visibleItems === 0 ? "block" : "none";
  }

  function setActiveTag(newTag: string) {
    if (activeTag === newTag) {
      // If the newly clicked tag is the same as the current one, no need to re-filter
      return;
    }

    // Update the active tag
    activeTag = newTag;

    // Update the styling of the tag buttons to reflect the active state
    tagButtons.forEach((btn) => {
      const button = btn as HTMLElement;
      button.classList.toggle("active", button.dataset.tag === newTag);
    });

    // Reapply the filtering logic to show/hide items based on the new tag
    filterItems();
  }

  // Reset the search and tag filters
  function resetSearch() {
    searchInput.value = ""; // Reset search input field
    searchTerm = ""; // Clear search term
    activeTag = "all"; // Reset the active tag to "all"
    clearSearchBtn!.style.display = "none"; // Hide the clear search button
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
      activeTag = (event.currentTarget as HTMLElement).dataset.tag || "all";

      // Update the active class for buttons in the Filter
      tagButtons.forEach((btn) => btn.classList.remove("active"));
      (event.currentTarget as HTMLElement).classList.add("active");

      // Trigger the main filter logic
      filterItems();

      // OPTIONAL: Trigger a custom event to notify the rest of the application
      document.dispatchEvent(
        new CustomEvent("tagChange", { detail: { activeTag } })
      );
    });
  });

// Clear search on button click
  clearSearchBtn?.addEventListener("click", resetSearch);

  let debounceTimeout: number;
});