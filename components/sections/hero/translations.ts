export type EditorLanguage = 'en' | 'es' | 'fr';

export interface EditorDictionary {
  tabs: {
    pages: string;
    layers: string;
    assets: string;
  };
  layers: {
    home: string;
    hero: string;
    techStack: string;
    introduction: string;
    featuredWorks: string;
    services: string;
    approach: string;
    faqs: string;
    cta: string;
    footer: string;
  };
  inspector: {
    position: string;
    type: string;
    relative: string;
    size: string;
    width: string;
    height: string;
    maxWidth: string;
    fill: string;
    fit: string;
    fixed: string;
    layout: string;
    direction: string;
    distribute: string;
    align: string;
    wrap: string;
    yes: string;
    no: string;
  };
  tooltips: {
    play: string;
    pause: string;
    canvasFitExpand: string;
    canvasFitShrink: string;
    canvasTheme: string;
    speed: string;
    reverse: string;
    language: string;
    pressAndHold: string;
    viewProject: string;
  };
}

export const TRANSLATIONS: Record<EditorLanguage, EditorDictionary> = {
  en: {
    tabs: {
      pages: 'Pages',
      layers: 'Layers',
      assets: 'Assets',
    },
    layers: {
      home: 'Home',
      hero: 'Hero',
      techStack: 'Tech Stack',
      introduction: 'Introduction',
      featuredWorks: 'Featured Works',
      services: 'Services',
      approach: 'Approach',
      faqs: 'FAQs',
      cta: 'CTA',
      footer: 'Footer',
    },
    inspector: {
      position: 'Position',
      type: 'Type',
      relative: 'Relative',
      size: 'Size',
      width: 'Width',
      height: 'Height',
      maxWidth: 'Max Width',
      fill: '1fr Fill',
      fit: 'Auto Fit',
      fixed: '1200 Fixed',
      layout: 'Layout',
      direction: 'Direction',
      distribute: 'Distribute End',
      align: 'Align Center',
      wrap: 'Wrap',
      yes: 'Yes',
      no: 'No',
    },
    tooltips: {
      play: 'Play marquee',
      pause: 'Pause marquee',
      canvasFitExpand: 'Canvas fit: Expand',
      canvasFitShrink: 'Canvas fit: Shrink',
      canvasTheme: 'Canvas theme',
      speed: 'Marquee speed',
      reverse: 'Reverse direction',
      language: 'Interface language',
      pressAndHold: 'Press & Hold',
      viewProject: 'View Project',
    },
  },
  es: {
    tabs: {
      pages: 'Páginas',
      layers: 'Capas',
      assets: 'Recursos',
    },
    layers: {
      home: 'Inicio',
      hero: 'Portada',
      techStack: 'Tecnologías',
      introduction: 'Introducción',
      featuredWorks: 'Destacados',
      services: 'Servicios',
      approach: 'Enfoque',
      faqs: 'Preguntas',
      cta: 'Llamada',
      footer: 'Pie de página',
    },
    inspector: {
      position: 'Posición',
      type: 'Tipo',
      relative: 'Relativo',
      size: 'Tamaño',
      width: 'Ancho',
      height: 'Alto',
      maxWidth: 'Ancho Máx',
      fill: '1fr Rellenar',
      fit: 'Ajustar',
      fixed: '1200 Fijo',
      layout: 'Diseño',
      direction: 'Dirección',
      distribute: 'Distribuir Fin',
      align: 'Centrar',
      wrap: 'Envolver',
      yes: 'Sí',
      no: 'No',
    },
    tooltips: {
      play: 'Reproducir carrusel',
      pause: 'Pausar carrusel',
      canvasFitExpand: 'Ajuste: Expandir',
      canvasFitShrink: 'Ajuste: Reducir',
      canvasTheme: 'Tema del lienzo',
      speed: 'Velocidad del carrusel',
      reverse: 'Invertir dirección',
      language: 'Idioma de interfaz',
      pressAndHold: 'Mantener pulsado',
      viewProject: 'Ver Proyecto',
    },
  },
  fr: {
    tabs: {
      pages: 'Pages',
      layers: 'Calques',
      assets: 'Ressources',
    },
    layers: {
      home: 'Accueil',
      hero: 'Bannière',
      techStack: 'Technologies',
      introduction: 'Introduction',
      featuredWorks: 'Sélection',
      services: 'Services',
      approach: 'Approche',
      faqs: 'Questions',
      cta: 'Appel à action',
      footer: 'Pied de page',
    },
    inspector: {
      position: 'Position',
      type: 'Type',
      relative: 'Relatif',
      size: 'Taille',
      width: 'Largeur',
      height: 'Hauteur',
      maxWidth: 'Largeur Max',
      fill: '1fr Remplir',
      fit: 'Ajuster',
      fixed: '1200 Fixe',
      layout: 'Disposition',
      direction: 'Direction',
      distribute: 'Distribuer Fin',
      align: 'Centrer',
      wrap: 'Retour ligne',
      yes: 'Oui',
      no: 'Non',
    },
    tooltips: {
      play: 'Lancer le défilement',
      pause: 'Mettre en pause',
      canvasFitExpand: 'Ajuster: Agrandir',
      canvasFitShrink: 'Ajuster: Réduire',
      canvasTheme: 'Thème du canevas',
      speed: 'Vitesse de défilement',
      reverse: 'Inverser le sens',
      language: 'Langue de l’interface',
      pressAndHold: 'Maintenir appuyé',
      viewProject: 'Voir le projet',
    },
  },
};
