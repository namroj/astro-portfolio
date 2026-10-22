// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { initializeReadingView } from '../scripts/reading-view';

describe('expanded reading view', () => {
  let cleanup: (() => void) | undefined;
  beforeEach(() => {
    document.documentElement.removeAttribute('data-reading-view');
    document.body.innerHTML = `<header class="site-header"></header>
      <button id="reading-view-toggle" hidden data-expand-label="Expand reading view" data-restore-label="Restore reading view"></button>
      <main><h1>Title</h1><div class="post"><p>Article</p></div></main>
      <aside id="preferences" inert></aside><button id="preferences-toggle-btn"></button>
      <aside id="toc"></aside><button id="toc-toggle-btn"></button>`;
    vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
  });
  afterEach(() => { cleanup?.(); vi.restoreAllMocks(); });
  const button = () => document.querySelector<HTMLButtonElement>('#reading-view-toggle')!;
  const escape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

  it('initializes normal mode, toggles labels and pressed state, and retains focus', () => {
    cleanup = initializeReadingView();
    expect(button().hidden).toBe(false);
    expect(button().getAttribute('aria-pressed')).toBe('false');
    button().click();
    expect(document.documentElement.dataset.readingView).toBe('expanded');
    expect(button().title).toBe('Restore reading view');
    expect(button().getAttribute('aria-label')).toBe(button().title);
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(button());
    escape();
    expect(document.documentElement.hasAttribute('data-reading-view')).toBe(false);
    expect(button().title).toBe('Expand reading view');
  });

  it('leaves pages without the post control untouched', () => {
    button().remove();
    cleanup = initializeReadingView();
    escape();
    expect(document.documentElement.hasAttribute('data-reading-view')).toBe(false);
  });

  it('uses localized labels supplied by the page', () => {
    button().dataset.expandLabel = 'Ampliar vista de lectura';
    button().dataset.restoreLabel = 'Restaurar vista de lectura';
    cleanup = initializeReadingView();
    expect(button().title).toBe('Ampliar vista de lectura');
    button().click();
    expect(button().title).toBe('Restaurar vista de lectura');
  });

  it.each(['preferences', 'toc'])('closes %s before leaving expanded mode', id => {
    cleanup = initializeReadingView();
    button().click();
    const panel = document.getElementById(id)!;
    const trigger = document.getElementById(`${id}-toggle-btn`)!;
    panel.classList.add('active');
    trigger.addEventListener('click', () => panel.classList.remove('active'));
    escape();
    expect(panel.classList.contains('active')).toBe(false);
    expect(document.documentElement.dataset.readingView).toBe('expanded');
    expect(document.activeElement).toBe(trigger);
    escape();
    expect(document.documentElement.hasAttribute('data-reading-view')).toBe(false);
  });

  it('defers to other open dialogs', () => {
    cleanup = initializeReadingView();
    button().click();
    document.body.insertAdjacentHTML('beforeend', '<dialog open></dialog>');
    escape();
    expect(document.documentElement.dataset.readingView).toBe('expanded');
  });

  it('adds top spacing when preserving the title would require negative scrolling', () => {
    const main = document.querySelector('main')!;
    main.style.paddingTop = '84px';
    const title = document.querySelector('h1')!;
    vi.spyOn(title, 'getBoundingClientRect').mockImplementation(() => ({
      top: document.documentElement.dataset.readingView
        ? parseFloat(main.style.getPropertyValue('--reading-top-padding') || '84') : 170,
      bottom: 250,
    } as DOMRect));
    cleanup = initializeReadingView();
    button().click();
    expect(main.style.getPropertyValue('--reading-top-padding')).toBe('170px');
    expect(window.scrollBy).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' });
  });

  it('extends the scroll range only as needed at the bottom', () => {
    const main = document.querySelector('main')!;
    main.style.overflowY = 'auto';
    main.style.paddingBottom = '0px';
    Object.defineProperty(main, 'scrollHeight', { value: 1000 });
    Object.defineProperty(main, 'clientHeight', { value: 800 });
    main.scrollTop = 200;
    main.scrollBy = vi.fn();
    const title = document.querySelector('h1')!;
    vi.spyOn(title, 'getBoundingClientRect').mockImplementation(() => ({
      top: document.documentElement.dataset.readingView ? 180 : 100, bottom: 300,
    } as DOMRect));
    cleanup = initializeReadingView();
    button().click();
    expect(main.style.paddingBottom).toBe('80px');
    expect(main.scrollBy).toHaveBeenCalledWith({ top: 80, behavior: 'instant' });
  });

  it.each([false, true])('preserves the visible block offset (nested scroller: %s)', nested => {
    const main = document.querySelector('main')!;
    if (nested) main.style.overflowY = 'auto';
    Object.defineProperty(main, 'scrollHeight', { value: 2000 });
    Object.defineProperty(main, 'clientHeight', { value: 800 });
    main.scrollBy = vi.fn();
    const title = document.querySelector('h1')!;
    vi.spyOn(title, 'getBoundingClientRect').mockReturnValue({ top: -200, bottom: -100 } as DOMRect);
    const block = document.querySelector('.post p')!;
    vi.spyOn(block, 'getBoundingClientRect').mockImplementation(() => ({
      top: document.documentElement.dataset.readingView ? 180 : 100,
      bottom: 300,
    } as DOMRect));
    cleanup = initializeReadingView();
    button().click();
    expect(nested ? main.scrollBy : window.scrollBy).toHaveBeenCalledWith({ top: 80, behavior: 'instant' });
  });
});
