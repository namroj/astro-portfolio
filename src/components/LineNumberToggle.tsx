import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";
import { showLineNumbers } from "../stores/lineNumbersStore.ts";
import "../styles/line-number-toggle.css";

export default function LineNumberToggle({ label }: { label: string }) {
  const visible = useStore(showLineNumbers);
  const apply = (value: boolean) => {
    showLineNumbers.set(value);
    document.documentElement.classList.toggle("hide-line-numbers", !value);
  };
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("showLineNumbers"); } catch {}
    apply(saved !== "false");
  }, []);
  const toggle = () => {
    apply(!visible);
    try { localStorage.setItem("showLineNumbers", String(!visible)); } catch {}
  };
  return <div class="line-number-toggle">
    <button type="button" role="switch" aria-checked={visible}
      class={`toggle-btn ${visible ? "active" : ""}`} onClick={toggle}>
      <span class="toggle-label">{label}</span>
      <span class="toggle-switch" aria-hidden="true"><span class="toggle-slider" /></span>
    </button>
  </div>;
}
