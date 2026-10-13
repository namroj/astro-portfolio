import { useEffect, useId, useRef, useState } from "preact/hooks";
import { messages, type Locale } from "../i18n";
import { searchItems, type SearchItem } from "../utils/search";
export default function Search({ locale = "es" }: { locale?: Locale }) {
  const m = messages[locale];
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [active, setActive] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [open, setOpen] = useState(false);
  const results = searchItems(items, query);
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    fetch(`/${locale}/search.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Search request failed");
        return r.json();
      })
      .then((data) => {
        setItems(data);
        setState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [locale, attempt]);
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (e.key === "/" &&
          !target.closest('input, textarea, [contenteditable="true"]'))
      ) {
        e.preventDefault();
        setOpen(true);
        input.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <div
      class="global-search"
      onFocusOut={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <input
        ref={input}
        type="search"
        placeholder={`${m.search} (⌘K)`}
        aria-label={m.search}
        role="combobox"
        aria-expanded={open}
        aria-controls={id}
        aria-autocomplete="list"
        aria-activedescendant={
          open && results.length ? `${id}-${active}` : undefined
        }
        value={query}
        onFocus={() => setOpen(true)}
        onInput={(e) => {
          setQuery(e.currentTarget.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.max(0, Math.min(a + 1, results.length - 1)));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          }
          if (e.key === "Enter" && open && results[active])
            window.location.assign(results[active].url);
        }}
      />
      {open && (
        <div class="search-panel">
          {state === "loading" && <p role="status">{m.loading}</p>}
          {state === "error" && (
            <p role="status">
              {m.searchError}{" "}
              <button type="button" onClick={() => setAttempt((a) => a + 1)}>
                {locale === "en" ? "Retry" : "Reintentar"}
              </button>
            </p>
          )}
          {state === "ready" && query && !results.length && (
            <p role="status">{m.noResults}</p>
          )}
          <ul id={id} role="listbox">
            {results.map((r, i) => (
              <li
                key={r.id}
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === active}
                class={i === active ? "active" : ""}
              >
                <a href={r.url}>
                  <strong>{r.title}</strong>
                  <small>
                    {r.type === "project" ? m.projects : m.blog} ·{" "}
                    {r.description}
                  </small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
