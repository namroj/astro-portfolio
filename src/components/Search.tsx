import { h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

type Item = {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
};

export default function Search() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetch('/search.json')
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [] as Item[];
    const t = q.toLowerCase();
    return items
      .filter((i) =>
        i.title.toLowerCase().includes(t) ||
        i.description.toLowerCase().includes(t) ||
        i.tags.some((tag) => tag.toLowerCase().includes(t))
      )
      .slice(0, 8);
  }, [q, items]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === 'Enter' && results[active]) {
        window.location.href = results[active].url;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active]);

  return (
    <div class="search">
      <input
        ref={inputRef}
        type="search"
        placeholder="Buscar artículos..."
        aria-label="Buscar"
        value={q}
        onInput={(e) => {
          const v = (e.target as HTMLInputElement).value;
          setQ(v);
          setOpen(!!v);
        }}
        onFocus={() => setOpen(!!q)}
      />
      {open && results.length > 0 && (
        <ul class="panel" ref={listRef} role="listbox">
          {results.map((r, i) => (
            <li key={r.id} class={i === active ? 'active' : ''}>
              <a href={r.url} onClick={() => setOpen(false)}>
                <span class="title">{r.title}</span>
                <span class="desc">{r.description}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {open && q && results.length === 0 && (
        <div class="panel empty">Sin resultados</div>
      )}
      <style>
        {`
        .search { position: relative; }
        .search input {
          width: 220px;
          padding: 0.5em 0.75em;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: rgba(var(--background-color-rgb), 0.6);
          color: var(--foreground-color);
        }
        .panel {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          width: 460px;
          max-width: min(92dvw, 560px);
          background: rgba(var(--background-color-rgb), 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          box-shadow: 0 10px 24px rgba(0,0,0,.15);
          z-index: 20;
        }
        .panel.empty { padding: 0.75em; font-size: .9em; color: var(--accent-muted-color); }
        .panel ul { list-style: none; margin: 0; padding: 0; }
        .panel li { border-bottom: 1px solid var(--border-color); }
        .panel li:last-child { border-bottom: 0; }
        .panel a { display: block; padding: .75em; color: inherit; }
        .panel li.active, .panel a:hover { background: rgba(var(--accent-color-rgb, 255, 99, 71), .08); }
        .title { display: block; font-weight: 600; }
        .desc { display: block; font-size: .85em; color: var(--accent-muted-color); }
        `}
      </style>
    </div>
  );
}
