/** Enhance only explicitly marked blog posts; never persist reading mode. */
export function initializeReadingView() {
  const toggle = document.querySelector<HTMLButtonElement>('#reading-view-toggle');
  const main = document.querySelector<HTMLElement>('main');
  if (!toggle || !main || toggle.dataset.initialized) return;
  toggle.dataset.initialized = 'true';
  const root = document.documentElement;
  root.removeAttribute('data-reading-view');

  const updateLabel = () => {
    const expanded = root.dataset.readingView === 'expanded';
    const label = (expanded ? toggle.dataset.restoreLabel : toggle.dataset.expandLabel) || '';
    toggle.title = label;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('aria-pressed', String(expanded));
  };
  const changeMode = () => {
    // Use the existing scroll owner on either side of the desktop breakpoint.
    const nested = /auto|scroll/.test(getComputedStyle(main).overflowY)
      && main.scrollHeight > main.clientHeight;
    const scroller = nested ? main : window;
    const toolbarBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
    const blocks = Array.from(main.querySelectorAll<HTMLElement>('h1, .post > *, .post li, .post p'));
    const anchor = blocks.find(block => {
      const rect = block.getBoundingClientRect();
      return rect.bottom > toolbarBottom && rect.top < window.innerHeight;
    });
    const offset = anchor?.getBoundingClientRect().top;
    const previousAnchoring = main.style.overflowAnchor;
    main.style.overflowAnchor = 'none';
    main.style.removeProperty('--reading-top-padding');
    main.style.removeProperty('padding-bottom');
    if (root.dataset.readingView) root.removeAttribute('data-reading-view');
    else root.dataset.readingView = 'expanded';
    updateLabel();
    if (anchor && offset !== undefined) {
      const delta = anchor.getBoundingClientRect().top - offset;
      const scrollTop = nested ? main.scrollTop : window.scrollY;
      // At the beginning there is no negative scroll range. Retain enough
      // breathing room above the title instead of letting it jump upward.
      if (root.dataset.readingView && scrollTop + delta < 0) {
        const padding = parseFloat(getComputedStyle(main).paddingTop) || 0;
        main.style.setProperty('--reading-top-padding', `${padding - scrollTop - delta}px`);
      }
      const targetScroll = scrollTop + anchor.getBoundingClientRect().top - offset;
      const maxScroll = nested
        ? main.scrollHeight - main.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      // Widening a long table or restoring the footer can shorten the scroll
      // range. Add only the space needed to keep the current block in place.
      if (targetScroll > maxScroll) {
        const padding = parseFloat(getComputedStyle(main).paddingBottom) || 0;
        main.style.paddingBottom = `${padding + targetScroll - maxScroll}px`;
      }
      scroller.scrollBy({ top: anchor.getBoundingClientRect().top - offset, behavior: 'instant' });
    }
    main.style.overflowAnchor = previousAnchoring;
    toggle.focus({ preventScroll: true });
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || root.dataset.readingView !== 'expanded') return;
    // Capture before existing panel listeners so one Escape has only one effect.
    if (document.querySelector('dialog[open], [aria-modal="true"], .search-panel')) return;
    for (const id of ['preferences', 'toc']) {
      if (!document.getElementById(id)?.classList.contains('active')) continue;
      const trigger = document.getElementById(`${id}-toggle-btn`);
      trigger?.click();
      trigger?.focus({ preventScroll: true });
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.defaultPrevented) return;
    event.preventDefault();
    changeMode();
  };
  updateLabel();
  toggle.hidden = false;
  toggle.addEventListener('click', changeMode);
  document.addEventListener('keydown', onKey, true);
  return () => {
    toggle.removeEventListener('click', changeMode);
    document.removeEventListener('keydown', onKey, true);
    delete toggle.dataset.initialized;
  };
}
