export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export function localeFromPath(path: string): Locale {
  return path.split("/")[1] === "en" ? "en" : "es";
}
export function route(locale: Locale, path = "") {
  return `/${locale}/${path.replace(/^\/+|\/+$/g, "")}${path.replace(/^\/+|\/+$/g, "") ? "/" : ""}`;
}
export function unlocalizedPath(path: string) {
  return path.replace(/^\/(es|en)(\/|$)/, "/").replace(/^\/+|\/+$/g, "");
}
export type Localized<T> = T extends { es: infer S; en: unknown }
  ? S
  : T extends (infer I)[]
    ? Localized<I>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;
export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (Array.isArray(value))
    return value.map((v) => localize(v, locale)) as Localized<T>;
  if (value && typeof value === "object") {
    if ("es" in value && "en" in value) return value[locale] as Localized<T>;
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, localize(v, locale)]),
    ) as Localized<T>;
  }
  return value as Localized<T>;
}
export const messages = {
  es: {
    home: "Inicio",
    homeIntro:
      "Soy Jorman Espinoza. Desarrollo aplicaciones web, móviles y tiendas online para empresas y clientes freelance. Trabajo en frontend, backend e integración de APIs desde 2014, con base en Buenos Aires.",
    viewWork: "Ver mis proyectos",
    getInTouch: "Escríbeme",
    readingTime: "min de lectura estimada",
    sourceCode: "Ver código",
    liveDemo: "Abrir demo",
    websiteUnavailable: "Sitio original no disponible",

    about: "Sobre mí",
    education: "Educación",
    experience: "Experiencia",
    projects: "Proyectos",
    blog: "Blog",
    contact: "Contacto",
    role: "Ingeniero de Software",
    intro:
      "Sigue mi recorrido desde Venezuela hasta Buenos Aires, Argentina. Los marcadores señalan los lugares de la ruta, desde el punto de partida hasta la ciudad que hoy llamo hogar.",
    aboutText:
      "Soy Jorman Espinoza, desarrollador de software venezolano. Vivo y trabajo en Argentina desde 2017. He trabajado en frontend, backend e integración de APIs, y actualmente desarrollo y lidero proyectos en Accenture. También colaboro con clientes freelance en sitios web y tiendas online.",
    interests:
      "Disfruto del código limpio, los patrones de diseño, el fútbol y los videojuegos, que despertaron mi interés por la programación.",
    journey: "De Venezuela a Argentina",
    skills: "Tecnologías",
    tools: "Herramientas",
    webCommerce: "Web y ecommerce",
    backendData: "Backend y datos",
    mobile: "Desarrollo móvil",
    platformsWorkflow: "Plataformas y flujo de trabajo",
    moreSkills: "Ver más tecnologías y herramientas",
    visitProject: "Visitar sitio",
    impact: "Aporte destacado",
    responsibilities: "Responsabilidades",
    search: "Buscar artículos y proyectos",
    noResults: "No se encontraron resultados.",
    loading: "Cargando…",
    searchError: "No se pudo cargar la búsqueda. Intenta de nuevo.",
    filter: "Buscar por palabra clave",
    all: "Todas",
    clear: "Limpiar filtros",
    tags: "Etiquetas",
    previous: "Anterior",
    next: "Siguiente",
    emptyBlog: "Próximamente publicaré artículos en este idioma.",
    preferences: "Preferencias",
    theme: "Tema",
    font: "Fuente",
    developerFont: "Fuente de títulos y código",
    lineNumbers: "Mostrar números de línea",
    code: "Código",
    diagrams: "Diagramas",
    diagramStyle: "Estilo del diagrama",
    sketch: "Boceto",
    classic: "Clásico",
    diagramTheme: "Color del diagrama",
    matchSite: "Del sitio",
    darkTheme: "Oscuro",
    forestTheme: "Bosque",
    toc: "Tabla de contenidos",
    by: "Escrito por",
    certificate: "Certificado",
    contactText:
      "¿Tienes un proyecto en mente? Escríbeme por correo o conecta conmigo en LinkedIn.",
    description:
      "Portafolio y blog de Jorman Espinoza. Desarrollo web, móvil y ecommerce.",
  },
  en: {
    home: "Home",
    homeIntro:
      "I’m Jorman Espinoza. I build web applications, mobile apps, and online stores for businesses and freelance clients. I’ve worked across frontend, backend, and API integration since 2014, based in Buenos Aires.",
    viewWork: "View my work",
    getInTouch: "Get in touch",
    readingTime: "min estimated read",
    sourceCode: "View source",
    liveDemo: "Open demo",
    websiteUnavailable: "Original website unavailable",

    about: "About me",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
    role: "Software Engineer",
    intro:
      "Follow my journey from Venezuela to Buenos Aires, Argentina. The markers highlight places along the route, from where it began to the city I now call home.",
    aboutText:
      "I’m Jorman Espinoza, a Venezuelan software developer. I have lived and worked in Argentina since 2017. My experience spans frontend, backend, and API integrations, and I currently develop and lead projects at Accenture. I also work with freelance clients on websites and online stores.",
    interests:
      "I enjoy clean code, design patterns, football, and video games, which sparked my interest in programming.",
    journey: "From Venezuela to Argentina",
    skills: "Technologies",
    tools: "Tools",
    webCommerce: "Web and commerce",
    backendData: "Backend and data",
    mobile: "Mobile development",
    platformsWorkflow: "Platforms and workflow",
    moreSkills: "More technologies and tools",
    visitProject: "Visit site",
    impact: "Selected contribution",
    responsibilities: "Responsibilities",
    search: "Search articles and projects",
    noResults: "No results found.",
    loading: "Loading…",
    searchError: "Search could not load. Please try again.",
    filter: "Filter by keyword",
    all: "All",
    clear: "Clear filters",
    tags: "Tags",
    previous: "Previous",
    next: "Next",
    emptyBlog: "Articles in this language are coming soon.",
    preferences: "Preferences",
    theme: "Theme",
    font: "Font",
    developerFont: "Heading and code font",
    lineNumbers: "Show line numbers",
    code: "Code",
    diagrams: "Diagrams",
    diagramStyle: "Diagram style",
    sketch: "Sketch",
    classic: "Classic",
    diagramTheme: "Diagram colors",
    matchSite: "Site",
    darkTheme: "Dark",
    forestTheme: "Forest",
    toc: "Table of contents",
    by: "Written by",
    certificate: "Certificate",
    contactText:
      "Have a project in mind? Send me an email or connect on LinkedIn.",
    description:
      "Jorman Espinoza’s portfolio and blog. Web, mobile, and ecommerce development.",
  },
};
export function navigation(locale: Locale) {
  const m = messages[locale];
  return (
    ["about", "education", "experience", "projects", "blog", "contact"] as const
  ).map((path) => ({ path, label: m[path], url: route(locale, path) }));
}
