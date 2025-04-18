/**
 * Enhances code blocks with language indicators and copy buttons
 */

// Function to format language name for display
function formatLanguage(lang) {
  if (!lang) {
    return "Text";
  }

  // Map of language identifiers to display names
  const languageMap = {
    js: 'JavaScript',
    ts: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    html: 'HTML',
    css: 'CSS',
    java: 'Java',
    python: 'Python',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    c: 'C',
    cpp: 'C++',
    csharp: 'C#',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    // Add more languages as needed
  };

  return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
}

// Function to create copy button
function createCopyButton() {
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.setAttribute('aria-label', 'Copy code to clipboard');

  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span class="copy-text">Copiar</span>
  `;

  return button;
}

// Function to handle copy button click
function handleCopyClick(event) {
  const button = event.currentTarget;
  const pre = button.closest('pre');
  const code = pre.querySelector('code').textContent;

  navigator.clipboard.writeText(code).then(() => {
    const copyText = button.querySelector('.copy-text');
    const originalText = copyText.textContent;

    copyText.textContent = 'Copiado!';

    setTimeout(() => {
      copyText.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy code: ', err);
  });
}

// Function to enhance code blaocks
function enhanceCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach(pre => {
    // Skip if already enhanced
    if (pre.hasAttribute('data-enhanced')) return;

    const code = pre.querySelector('code');
    if (!code) return;

    // Get language from class or data attribute
    // Common class prefixes for language identification
    const languagePrefixes = ['language-', 'lang-', 'brush-'];

    // Try to find a language class on a code element
    let languageClass = null;
    let prefix = '';
    let language = '';

    // Check code element first - classes
    for (const langPrefix of languagePrefixes) {
      languageClass = Array.from(code.classList).find(cls => cls.startsWith(langPrefix));
      if (languageClass) {
        prefix = langPrefix;
        language = languageClass.replace(prefix, '');
        break;
      }
    }

    // If not found on code element, try pre element - classes
    if (!language) {
      for (const langPrefix of languagePrefixes) {
        languageClass = Array.from(pre.classList).find(cls => cls.startsWith(langPrefix));
        if (languageClass) {
          prefix = langPrefix;
          language = languageClass.replace(prefix, '');
          break;
        }
      }
    }

    // If still not found, check for data attributes
    if (!language) {
      // Check data attributes on code element
      if (code.dataset.language) {
        language = code.dataset.language;
      } else if (code.dataset.lang) {
        language = code.dataset.lang;
      }
      // Check data attributes on pre element
      else if (pre.dataset.language) {
        language = pre.dataset.language;
      } else if (pre.dataset.lang) {
        language = pre.dataset.lang;
      }
    }

    // Check if language is in the class name itself (e.g., "java", "python", etc.)
    if (!language) {
      // Common language names that might appear as class names
      const commonLanguages = ['java', 'python', 'javascript', 'js', 'typescript', 'ts', 'html', 'css', 'ruby', 'go', 'rust', 'c', 'cpp', 'csharp', 'php', 'swift', 'kotlin'];

      // Check code element classes
      const codeLanguageClass = Array.from(code.classList).find(cls => commonLanguages.includes(cls.toLowerCase()));
      if (codeLanguageClass) {
        language = codeLanguageClass;
      }
      // Check pre element classes
      else {
        const preLanguageClass = Array.from(pre.classList).find(cls => commonLanguages.includes(cls.toLowerCase()));
        if (preLanguageClass) {
          language = preLanguageClass;
        }
      }
    }

    // Set language attribute for the ::before pseudo-element
    pre.setAttribute('data-language', formatLanguage(language));

    // Add copy button
    const copyButton = createCopyButton();
    copyButton.addEventListener('click', handleCopyClick);
    pre.appendChild(copyButton);

    // Add line wrapper for line numbers
    const codeLines = code.innerHTML.split('\n');
    // Add line numbers to each line
    code.innerHTML = codeLines
      .map((line, index) => `<span class="line" data-line-number="${index + 1}"><span class="line-number">${index + 1}</span>${line}</span>`)
      .join('\n');

    // Mark as enhanced
    pre.setAttribute('data-enhanced', 'true');
  });
}

// Run on page load and after navigation
document.addEventListener('astro:page-load', enhanceCodeBlocks);
document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
