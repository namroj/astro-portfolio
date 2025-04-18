import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";
import { showLineNumbers } from "../stores/lineNumbersStore.ts";
import "../styles/line-number-toggle.css";

const LineNumberToggle = () => {
  const lineNumbersVisible = useStore(showLineNumbers); // Subscribe to the line numbers state

  // Function to handle the line numbers visibility toggle
  const handleLineNumbersToggle = () => {
    const newValue = !lineNumbersVisible;
    showLineNumbers.set(newValue); // Update the state
    localStorage.setItem("showLineNumbers", newValue.toString()); // Save to localStorage

    // Apply the visibility setting to the document
    if (newValue) {
      document.documentElement.classList.remove("hide-line-numbers");
    } else {
      document.documentElement.classList.add("hide-line-numbers");
    }
  };

  // Synchronize the line numbers visibility on the component mount
  useEffect(() => {
    // Get the stored preference from localStorage, default to true if not set
    const storedPreference = localStorage.getItem("showLineNumbers");
    const shouldShowLineNumbers =
      storedPreference === null ? true : storedPreference === "true";

    // Set the initial state
    showLineNumbers.set(shouldShowLineNumbers);

    // Apply the stored preference
    if (!shouldShowLineNumbers) {
      document.documentElement.classList.add("hide-line-numbers");
    } else {
      document.documentElement.classList.remove("hide-line-numbers");
    }
  }, []); // Runs only once on mount

  return (
    <div class="line-number-toggle">
      <button
        class={`toggle-btn ${lineNumbersVisible ? "active" : ""}`}
        onClick={handleLineNumbersToggle}
        title={
          lineNumbersVisible
            ? "Ocultar números de línea"
            : "Mostrar números de línea"
        }
      >
        <span class="toggle-label">Mostrar números de línea</span>
        <span class="toggle-switch">
          <span class="toggle-slider"></span>
        </span>
      </button>
    </div>
  );
};

export default LineNumberToggle;
