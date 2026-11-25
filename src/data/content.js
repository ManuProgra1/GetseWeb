export const CHURCH = {
  name: 'Asambleas de Dios Getsemaní',
  shortName: 'Getsemaní',
  movement: 'Asambleas de Dios',
  country: 'Guatemala',
  claim: 'Una iglesia de relación, no religión.',
  verse: {
    text: 'Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.',
    reference: 'Mateo 18:20',
  },
}

export const HISTORY_SOURCE = {
  label: 'Publicación oficial en Facebook',
  url: 'https://www.facebook.com/photo?fbid=1492891082867131&set=pcb.1492892119533694&locale=es_LA',
}

export const HISTORY_NOTE =
  'La historia de Asambleas de Dios Getsemaní se está documentando con archivos, fotografías y testimonios oficiales de la congregación. No publicamos fechas ni nombres que no podamos verificar.'

// Los eventos del sitio son actividades especiales: los cultos y reuniones
// semanales viven en `settings.horarios` y no se mezclan con la agenda.
export const EVENT_CATEGORIES = [
  'Actividades especiales',
  'Conferencias',
  'Campañas evangelísticas',
  'Retiros y vigilias',
  'Ministerios',
]

export const DEFAULT_SETTINGS = {
  nombreIglesia: 'Asambleas de Dios Getsemaní',
  lema: 'Una iglesia de relación, no religión.',
  descripcion:
    'Somos una comunidad cristiana que proclama el amor incondicional de Dios, forma discípulos y sirve con esperanza en Guatemala y las naciones.',
  logo: '/images/logo.jpg',
  direccion: '',
  telefono: '',
  whatsapp: '',
  correo: '',
  mapaUrl: '',
  informacionGeneral:
    'Somos parte del movimiento de Asambleas de Dios en Guatemala. Creemos en la Biblia como Palabra de Dios, en la salvación por gracia mediante la fe en Jesucristo, y en el poder del Espíritu Santo para transformar vidas.',
  redesSociales: {
    facebook:
      'https://www.facebook.com/photo?fbid=1492891082867131&set=pcb.1492892119533694&locale=es_LA',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
  pastores: [
    { nombre: 'Francisco Veliz', cargo: 'Pastor' },
    { nombre: 'María de Veliz', cargo: 'Pastora' },
  ],
  horarios: [
    { dia: 'Lunes', hora: 'Sin reunión', detalle: 'No hay servicio' },
    {
      dia: 'Martes',
      hora: 'Hora por confirmar',
      detalle: 'Casa de oración en casa de un hermano',
    },
    { dia: 'Miércoles', hora: '7:00 – 8:00 PM', detalle: 'Fraternidad' },
    {
      dia: 'Jueves',
      hora: '7:00 – 8:00 PM',
      detalle: 'Misioneritas y Exploradores · Culto para padres',
    },
    { dia: 'Viernes', hora: '9:00 – 10:00 PM', detalle: 'Concilio' },
    { dia: 'Sábado', hora: '6:00 – 7:00 PM', detalle: 'Jóvenes' },
    { dia: 'Domingo', hora: '9:00 – 11:00 AM', detalle: 'Escuela dominical' },
    { dia: 'Domingo', hora: '5:00 – 6:00 PM', detalle: 'Culto vespertino' },
  ],
}

export const DEFAULT_MINISTRIES = [
  {
    id: 'musicos',
    slug: 'musicos',
    nombre: 'Músicos',
    lema: 'Adoración que prepara el corazón',
    descripcion:
      'Equipo de músicos, voces y apoyo técnico que guía a la congregación a la presencia de Dios en cada culto. Cuidamos la excelencia musical y, sobre todo, un corazón rendido a Cristo.',
    objetivo:
      'Guiar a la iglesia a la adoración con excelencia, humildad y sensibilidad espiritual, sirviendo a cada reunión con un mensaje que apunte a Jesús.',
    actividades: [
      'Ensayos y preparación semanal',
      'Servicio en los cultos dominicales',
      'Apoyo musical en eventos y campañas',
    ],
    responsable: '',
    imagenPrincipal: '/images/musicos.jpg',
    logo: '',
    galeria: [],
    estado: 'publicado',
    orden: 1,
    acento: '#e6c9a1',
    pendiente: false,
  },
  {
    id: 'exploradores',
    slug: 'exploradores',
    nombre: 'Exploradores',
    lema: 'Formando a los niños en el camino',
    descripcion:
      'Ministerio dedicado a la formación y el crecimiento de los niños. A través de la enseñanza bíblica, actividades creativas y acompañamiento cercano, sembramos la Palabra de Dios en la niñez y fortalecemos a las familias.',
    objetivo:
      'Que cada niño conozca a Jesús, crezca en un ambiente seguro y descubra desde temprano el valor de amar, servir y vivir con propósito.',
    actividades: [
      'Escuela dominical por edades',
      'Reuniones del ministerio de Exploradores',
      'Actividades especiales y campamentos',
    ],
    responsable: '',
    imagenPrincipal: '/images/exploradores.jpg',
    logo: '/images/exploradores.jpg',
    galeria: [],
    estado: 'publicado',
    orden: 2,
    acento: '#76792e',
    pendiente: false,
  },
  {
    id: 'misioneritas',
    slug: 'misioneritas',
    nombre: 'Misioneritas',
    lema: 'Semillas que crecen en misión',
    descripcion:
      'Espacio enfocado en la formación espiritual y el desarrollo integral de las niñas, con enseñanzas, valores y proyectos que las invitan a amar a Dios y a servir a otros desde pequeñas.',
    objetivo:
      'Formar niñas con identidad, carácter y corazón misionero, acompañándolas en su crecimiento espiritual y en su vida cotidiana.',
    actividades: [
      'Reuniones y enseñanzas del ministerio',
      'Proyectos de servicio y misión',
      'Encuentros, retiros y actividades creativas',
    ],
    responsable: '',
    imagenPrincipal: '/images/misioneritas.jpg',
    logo: '/images/misioneritas.jpg',
    galeria: [],
    estado: 'publicado',
    orden: 3,
    acento: '#a7ba9f',
    pendiente: false,
  },
  {
    id: 'jovenes',
    slug: 'jovenes',
    nombre: 'Jóvenes',
    lema: 'Una generación con propósito',
    descripcion:
      'Un espacio para la formación, la comunión y el crecimiento espiritual de los jóvenes. Creemos en una generación que vive su fe con autenticidad, que pregunta, que sirve y que transforma su entorno.',
    objetivo:
      'Acompañar a los jóvenes a encontrar su identidad en Cristo, desarrollar sus dones y construir relaciones sanas dentro de la iglesia.',
    actividades: [
      'Reunión juvenil semanal',
      'Grupos pequeños y discipulado',
      'Retiros, encuentros y campañas',
    ],
    responsable: '',
    imagenPrincipal: '/images/jovenes.jpg',
    logo: '/images/jovenes.jpg',
    galeria: [],
    estado: 'publicado',
    orden: 4,
    acento: '#33504a',
    pendiente: false,
  },
  {
    id: 'diaconisas',
    slug: 'diaconisas',
    nombre: 'Diaconisas',
    lema: 'Servicio que sostiene',
    descripcion:
      'Ministerio de servicio, apoyo y colaboración en la iglesia. Con dedicación y discreción, las diaconisas acompañan la vida de la congregación y trabajan para que cada reunión y cada acción de la iglesia sea un espacio de cuidado.',
    objetivo:
      'Servir con integridad, hospitalidad y oración, apoyando a los ministerios de la iglesia y a las familias que lo necesitan.',
    actividades: [
      'Apoyo en cultos y actividades de la iglesia',
      'Visitas y acompañamiento a familias',
      'Servicio en eventos y campañas',
    ],
    responsable: '',
    imagenPrincipal: '/images/iglesia.jpg',
    logo: '',
    galeria: [],
    estado: 'publicado',
    orden: 5,
    acento: '#24352e',
    pendiente: false,
  },
  {
    id: 'meidad',
    slug: 'meidad',
    nombre: 'MEIDAD',
    lema: 'Su identidad oficial, con su nombre',
    descripcion:
      'MEIDAD es uno de los ministerios de Asambleas de Dios Getsemaní. Respetamos su nombre oficial y reservamos este espacio para su descripción institucional, su objetivo y sus actividades.',
    objetivo: '',
    actividades: [],
    responsable: '',
    imagenPrincipal: '/images/meidad.jpg',
    logo: '/images/meidad.jpg',
    galeria: [],
    estado: 'publicado',
    orden: 6,
    acento: '#76792e',
    pendiente: true,
  },
]

/**
 * No hay agenda de ejemplo: los eventos son actividades especiales que se
 * publican desde el panel. Los cultos semanales se muestran en Horarios.
 */
export const DEFAULT_EVENTS = []

export const DEFAULT_HISTORY = [
  {
    id: 'origenes',
    titulo: 'Los inicios',
    fecha: 'Por documentar',
    categoria: 'Origen',
    descripcion:
      'El relato de los primeros años de la congregación está en proceso de verificación. Este espacio está reservado para las fechas, los nombres y los acontecimientos confirmados por la iglesia y sus archivos oficiales.',
    imagen: '',
    orden: 1,
    estado: 'publicado',
    pendiente: true,
  },
  {
    id: 'crecimiento',
    titulo: 'Crecimiento y comunidad',
    fecha: 'Por documentar',
    categoria: 'Desarrollo',
    descripcion:
      'Años de servicio, formación y crecimiento comunitario se incorporarán aquí a partir de material verificable: fotografías, actas, publicaciones y testimonios de miembros de la iglesia.',
    imagen: '/images/congregacion.jpg',
    orden: 2,
    estado: 'publicado',
    pendiente: true,
  },
  {
    id: 'hoy',
    titulo: 'Getsemaní hoy',
    fecha: 'Presente',
    categoria: 'Actualidad',
    descripcion:
      'Hoy seguimos reuniéndonos con la misma convicción: proclamar el evangelio de Jesucristo, formar discípulos y servir a nuestra comunidad con amor.',
    imagen: '',
    orden: 3,
    estado: 'publicado',
    pendiente: false,
  },
]

export const DEFAULT_GALLERY = []
