/**
 * data.js — Catálogo de productos StrikeStore
 * Expone el objeto Products en window.Products
 * Depende de: utils.js (Utils)
 */

const Products = {
  _key: 'ss_products',

  // ─── Datos semilla ────────────────────────────────────────────────────────

  _seed: [
    // ── BATES ──────────────────────────────────────────────────────────────
    {
      id: 'prod_bat001',
      name: 'Louisville Slugger Select PWR ASA',
      brand: 'Louisville Slugger',
      category: 'bates',
      price: 189.99,
      originalPrice: 189.99,
      description: 'Bate de softball ASA con tecnología PWR y mango de carbono reforzado.',
      fullDescription: 'El Louisville Slugger Select PWR ASA es el bate preferido por jugadores competitivos que buscan máxima potencia en cada turno al bate. Su barril de una pieza en aleación de aluminio premium ofrece una zona de contacto ampliada y una respuesta explosiva, mientras que el mango Ultra-Thin de carbono absorbe las vibraciones no deseadas para mayor comodidad.',
      features: [
        'Barril de aleación de aluminio premium ST+7U1',
        'Mango Ultra-Thin de carbono para menor vibración',
        'Zona de contacto ampliada (-3 drop)',
        'Certificado ASA/USA Softball',
        'Disponible en tallas 32"-34"'
      ],
      stock: 15,
      sku: 'LS-SPWR-ASA-001',
      rating: 4.8,
      reviewCount: 124,
      badge: 'featured',
      icon: 'fa-solid fa-baseball-bat-ball',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #3f4a4b 100%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    },
    {
      id: 'prod_bat002',
      name: 'Easton Ghost ASA 12"',
      brand: 'Easton',
      category: 'bates',
      price: 229.99,
      originalPrice: 229.99,
      description: 'Bate de dos piezas con tecnología Double Barrel 3 para máxima flexibilidad.',
      fullDescription: 'El Easton Ghost ASA 12" presenta la innovadora tecnología Double Barrel 3, que consiste en un barril doble de compuesto que maximiza la flexibilidad y el retorno de energía en cada impacto. Su diseño de dos piezas con tecnología ConneXion+ reduce la vibración y entrega más potencia al bateador, siendo ideal para jugadores avanzados de softball femenino.',
      features: [
        'Tecnología Double Barrel 3 de compuesto',
        'Construcción de dos piezas con ConneXion+',
        'Optimizado para softbol ASA/USA 12"',
        'Grip de alto rendimiento Hyperskin',
        'Balance 2 1/4" con peso distribuido'
      ],
      stock: 8,
      sku: 'EA-GHOST-ASA-002',
      rating: 4.9,
      reviewCount: 87,
      badge: 'new',
      icon: 'fa-solid fa-baseball-bat-ball',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #3f4a4b 100%)',
      createdAt: '2025-02-15T10:00:00.000Z'
    },
    {
      id: 'prod_bat003',
      name: 'DeMarini Prism+ ASA',
      brand: 'DeMarini',
      category: 'bates',
      price: 259.99,
      originalPrice: 299.99,
      description: 'Bate de compuesto de alto rendimiento con tecnología Paraflex+ para jugadoras de élite.',
      fullDescription: 'El DeMarini Prism+ ASA está fabricado con la tecnología de barril Paraflex+ que ofrece un perfil de barril más largo para mayor área de impacto. Su estructura de dos piezas con ensamblaje 3Fusion absorbe las vibraciones y redirige esa energía de vuelta al barril, maximizando la velocidad de la pelota. Diseñado específicamente para jugadoras de softbol de alto nivel.',
      features: [
        'Barril de compuesto Paraflex+ de alto rendimiento',
        'Construcción de dos piezas con 3Fusion Handle',
        'Perfil de barril extendido para mayor área de contacto',
        'Peso de fin de mango ajustable ReAction End Cap',
        'Certificado ASA/USA con lista WBSC'
      ],
      stock: 12,
      sku: 'DM-PRISM-ASA-003',
      rating: 4.7,
      reviewCount: 63,
      badge: 'sale',
      icon: 'fa-solid fa-baseball-bat-ball',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #3f4a4b 100%)',
      createdAt: '2025-01-20T10:00:00.000Z'
    },

    // ── PELOTAS ────────────────────────────────────────────────────────────
    {
      id: 'prod_pel001',
      name: 'Worth Thunder Heat 12" (Pack 12)',
      brand: 'Worth',
      category: 'pelotas',
      price: 34.99,
      originalPrice: 34.99,
      description: 'Pack de 12 pelotas de softball ASA con núcleo de poliuretano de alta compresión.',
      fullDescription: 'Las pelotas Worth Thunder Heat 12" ASA son las preferidas por ligas recreativas y competitivas. Su núcleo de poliuretano ofrece una compresión consistente de 40/325, mientras que la cubierta de cuero sintético de alto rendimiento resiste múltiples innings de juego intenso. Cada pack incluye 12 pelotas certificadas para juego oficial.',
      features: [
        'Núcleo de poliuretano alta compresión (40/325)',
        'Cubierta de cuero sintético resistente',
        'Certificadas ASA/USA Softball',
        'Costura de 88 puntos de polipropileno amarillo',
        'Pack de 12 unidades para entrenamiento o juego'
      ],
      stock: 50,
      sku: 'WO-THEAT-12-001',
      rating: 4.6,
      reviewCount: 210,
      badge: null,
      icon: 'fa-solid fa-baseball',
      gradient: 'linear-gradient(135deg, #e17605 0%, #df5911 100%)',
      createdAt: '2025-01-05T10:00:00.000Z'
    },
    {
      id: 'prod_pel002',
      name: 'Rawlings Official Softball ASA 12" (Pack 6)',
      brand: 'Rawlings',
      category: 'pelotas',
      price: 29.99,
      originalPrice: 29.99,
      description: 'Pack de 6 pelotas oficiales Rawlings ASA, aprobadas para competencia.',
      fullDescription: 'Las pelotas Rawlings Official Softball ASA 12" cumplen con todas las especificaciones de la Asociación de Softball de América. Su núcleo de corcho y caucho laminado garantiza una respuesta uniforme de bateo, y la cubierta de cuero genuino de alta calidad ofrece un agarre seguro para lanzadores y receptores en condiciones de juego real.',
      features: [
        'Núcleo de corcho y caucho laminado oficial',
        'Cubierta de cuero genuino de grano completo',
        'Aprobadas para competencia ASA oficial',
        'Costura de nailon de alto contraste para mayor visibilidad',
        'Pack de 6 unidades'
      ],
      stock: 45,
      sku: 'RA-OFFSA-12-002',
      rating: 4.5,
      reviewCount: 178,
      badge: null,
      icon: 'fa-solid fa-baseball',
      gradient: 'linear-gradient(135deg, #e17605 0%, #df5911 100%)',
      createdAt: '2025-01-05T10:00:00.000Z'
    },
    {
      id: 'prod_pel003',
      name: 'Dudley Thunder Heat USSSA 11" (Pack 12)',
      brand: 'Dudley',
      category: 'pelotas',
      price: 37.99,
      originalPrice: 37.99,
      description: 'Pack de 12 pelotas USSSA 11" con alta visibilidad, ideales para ligas femeninas.',
      fullDescription: 'Las Dudley Thunder Heat USSSA 11" son el estándar para ligas femeninas de alto rendimiento. Su tamaño compacto de 11 pulgadas ofrece mayor velocidad de lanzamiento, mientras que el núcleo de compresión 52/300 proporciona una respuesta de bateo explosiva. La cubierta amarilla de alta visibilidad facilita el seguimiento de la pelota en condiciones de baja luz.',
      features: [
        'Pelota de 11 pulgadas para softball femenino USSSA',
        'Núcleo de compresión 52/300 de alta energía',
        'Cubierta amarilla de alta visibilidad',
        'Costura roja contrastante para seguimiento visual',
        'Pack de 12 unidades certificadas'
      ],
      stock: 30,
      sku: 'DU-THEAT-11-003',
      rating: 4.4,
      reviewCount: 95,
      badge: 'new',
      icon: 'fa-solid fa-baseball',
      gradient: 'linear-gradient(135deg, #e17605 0%, #df5911 100%)',
      createdAt: '2025-03-01T10:00:00.000Z'
    },

    // ── GUANTES ────────────────────────────────────────────────────────────
    {
      id: 'prod_gua001',
      name: 'Rawlings Pro Preferred 12.5"',
      brand: 'Rawlings',
      category: 'guantes',
      price: 299.99,
      originalPrice: 299.99,
      description: 'Guante de cuero Kip de lujo con bolsillo profundo para outfielders de élite.',
      fullDescription: 'El Rawlings Pro Preferred 12.5" es el guante preferido por jugadores profesionales. Fabricado con cuero Kip premium de origen japonés, este guante ofrece una suavidad, ligereza y durabilidad excepcionales desde el primer día. El diseño de 12.5" con bolsillo profundo es perfecto para outfielders que necesitan el máximo alcance y seguridad en los atrapes.',
      features: [
        'Cuero Kip premium importado de Japón',
        'Bolsillo profundo para outfield 12.5"',
        'Cordón de cuero bronceado tostado de larga duración',
        'Relleno de palma Pittards Sheepskin ultra-suave',
        'Disponible en zurdo y diestro'
      ],
      stock: 5,
      sku: 'RA-PPREF-125-001',
      rating: 4.9,
      reviewCount: 56,
      badge: 'featured',
      icon: 'fa-solid fa-hand-back-fist',
      gradient: 'linear-gradient(135deg, #114664 0%, #3f4a4b 100%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    },
    {
      id: 'prod_gua002',
      name: 'Wilson A2000 Fastpitch 12"',
      brand: 'Wilson',
      category: 'guantes',
      price: 279.99,
      originalPrice: 279.99,
      description: 'El guante de referencia para softbol femenino con cuero Pro Stock.',
      fullDescription: 'El Wilson A2000 Fastpitch 12" es sinónimo de excelencia en el softbol femenino. Construido con el famoso cuero Pro Stock de Wilson, este guante ofrece una combinación inigualable de firmeza y maleabilidad que lo hace listo para usar con un mínimo de rodaje. Su diseño específico para manos femeninas garantiza un ajuste superior y mayor control del guante.',
      features: [
        'Cuero Pro Stock de Wilson de durabilidad comprobada',
        'Diseño Fastpitch optimizado para manos femeninas',
        'Bolsillo 12" con red de doble costura',
        'Cierre de muñeca ajustable Velcro para ajuste preciso',
        'Tecnología DriLex para interior transpirable'
      ],
      stock: 7,
      sku: 'WI-A2000-FP-002',
      rating: 4.8,
      reviewCount: 74,
      badge: null,
      icon: 'fa-solid fa-hand-back-fist',
      gradient: 'linear-gradient(135deg, #114664 0%, #3f4a4b 100%)',
      createdAt: '2025-01-15T10:00:00.000Z'
    },
    {
      id: 'prod_gua003',
      name: 'Mizuno MVP Prime SE 12"',
      brand: 'Mizuno',
      category: 'guantes',
      price: 139.99,
      originalPrice: 179.99,
      description: 'Guante de entrada al mercado premium con cuero Centro Pocket para infielders.',
      fullDescription: 'El Mizuno MVP Prime SE 12" es la puerta de entrada al rendimiento profesional a un precio accesible. Fabricado con cuero Centro Pocket patentado de Mizuno, este guante ofrece un bolsillo perfectamente formado desde el primer uso. Ideal para infielders que buscan rapidez de respuesta y precisión en el fildeo, con un acabado que rivaliza con guantes de mayor precio.',
      features: [
        'Cuero Centro Pocket para bolsillo preformado',
        'Palma de cuero PowerLock de mayor resistencia',
        'Talla 12" perfecta para infield de softball',
        'Cordón de cuero reforzado de larga vida útil',
        'Disponible en varios colores'
      ],
      stock: 18,
      sku: 'MI-MVPSE-12-003',
      rating: 4.5,
      reviewCount: 103,
      badge: 'sale',
      icon: 'fa-solid fa-hand-back-fist',
      gradient: 'linear-gradient(135deg, #114664 0%, #3f4a4b 100%)',
      createdAt: '2025-02-01T10:00:00.000Z'
    },

    // ── GUANTINES ──────────────────────────────────────────────────────────
    {
      id: 'prod_gtnes001',
      name: 'Franklin CFX Pro Series',
      brand: 'Franklin',
      category: 'guantines',
      price: 44.99,
      originalPrice: 44.99,
      description: 'Guantines de bateo profesionales con palma de cuero genuino y ajuste digital.',
      fullDescription: 'Los guantines Franklin CFX Pro Series son los favoritos de jugadores profesionales de softball y béisbol. Su palma de cuero genuino de corte digital ofrece el máximo tacto y control del bate, mientras que el dorso de licra/cuero ventilado mantiene las manos frescas durante juegos largos. El sistema de ajuste Tri-Curve garantiza que el guante se adapte perfectamente a la curvatura natural de la mano.',
      features: [
        'Palma de cuero genuino de corte digital',
        'Sistema Tri-Curve para ajuste anatómico',
        'Dorso de licra/cuero ventilado',
        'Cierre de muñeca ajustable digital flex',
        'Disponible en 8 tallas y múltiples colores'
      ],
      stock: 25,
      sku: 'FR-CFXPRO-001',
      rating: 4.7,
      reviewCount: 189,
      badge: null,
      icon: 'fa-solid fa-hand',
      gradient: 'linear-gradient(135deg, #df5911 0%, #e17605 100%)',
      createdAt: '2025-01-08T10:00:00.000Z'
    },
    {
      id: 'prod_gtnes002',
      name: 'Easton Quantum Elite Pair',
      brand: 'Easton',
      category: 'guantines',
      price: 39.99,
      originalPrice: 39.99,
      description: 'Par de guantines con palma de cuero perforada y protección de nudillos.',
      fullDescription: 'Los Easton Quantum Elite son guantines de bateo diseñados para jugadores que priorizan la protección sin sacrificar el tacto. La palma de cuero perforada proporciona un agarre seguro incluso en condiciones húmedas, mientras que la almohadilla de protección de nudillos absorbe el impacto de los pitches fallados. El dorso de malla elástica asegura ventilación óptima durante el juego.',
      features: [
        'Palma de cuero perforado para mayor agarre',
        'Almohadilla protectora de nudillos integrada',
        'Dorso de malla elástica ultra-transpirable',
        'Cierre Velcro de doble ancho ajustable',
        'Par completo (mano derecha e izquierda)'
      ],
      stock: 30,
      sku: 'EA-QELITE-002',
      rating: 4.4,
      reviewCount: 142,
      badge: null,
      icon: 'fa-solid fa-hand',
      gradient: 'linear-gradient(135deg, #df5911 0%, #e17605 100%)',
      createdAt: '2025-01-12T10:00:00.000Z'
    },

    // ── CASCOS ─────────────────────────────────────────────────────────────
    {
      id: 'prod_cas001',
      name: 'Rawlings Mach EXT Fastpitch',
      brand: 'Rawlings',
      category: 'cascos',
      price: 89.99,
      originalPrice: 89.99,
      description: 'Casco de bateo Fastpitch con jaula integrada y tecnología de absorción PORON XRD.',
      fullDescription: 'El Rawlings Mach EXT Fastpitch es el casco de mayor protección para jugadoras de softball competitivo. Equipado con la tecnología de absorción de impacto PORON XRD en los puntos críticos de la cabeza, este casco supera los estándares NOCSAE. La jaula EXT de aluminio proporciona una visibilidad superior mientras protege el rostro completo, y el interior acolchado VentTEK garantiza circulación de aire durante el juego.',
      features: [
        'Tecnología de absorción PORON XRD en puntos clave',
        'Jaula EXT de aluminio para visibilidad superior',
        'Interior VentTEK de alta ventilación',
        'Certificado NOCSAE y aprobado ASA',
        'Disponible en tallas 6.5" a 7.5"'
      ],
      stock: 14,
      sku: 'RA-MACHEXT-001',
      rating: 4.8,
      reviewCount: 67,
      badge: 'new',
      icon: 'fa-solid fa-helmet-safety',
      gradient: 'linear-gradient(135deg, #3f4a4b 0%, #de3a0d 100%)',
      createdAt: '2025-03-05T10:00:00.000Z'
    },
    {
      id: 'prod_cas002',
      name: 'Easton Alpha 360 Batting',
      brand: 'Easton',
      category: 'cascos',
      price: 79.99,
      originalPrice: 79.99,
      description: 'Casco ligero con almohadillas de gel 360° y acabado mate profesional.',
      fullDescription: 'El Easton Alpha 360 Batting ofrece una combinación ideal de protección, comodidad y estilo. Sus almohadillas de gel de espuma 360° se adaptan a la forma de la cabeza del bateador, distribuyendo uniformemente el impacto. El diseño exterior de ABS de alto impacto y acabado mate proporciona un look profesional, mientras que los orificios de ventilación estratégicos mantienen la cabeza fresca bajo el sol.',
      features: [
        'Almohadillas de gel de espuma 360° adaptativas',
        'Casco exterior de ABS de alto impacto',
        'Acabado mate profesional anti-brillo',
        'Orificios de ventilación de flujo optimizado',
        'Compatible con careta removible (vendida por separado)'
      ],
      stock: 20,
      sku: 'EA-ALPHA360-002',
      rating: 4.6,
      reviewCount: 88,
      badge: null,
      icon: 'fa-solid fa-helmet-safety',
      gradient: 'linear-gradient(135deg, #3f4a4b 0%, #de3a0d 100%)',
      createdAt: '2025-01-18T10:00:00.000Z'
    },

    // ── BASES ──────────────────────────────────────────────────────────────
    {
      id: 'prod_bas001',
      name: 'Hollywood Professional Bases Set 3-Pack',
      brand: 'Hollywood Bases',
      category: 'bases',
      price: 149.99,
      originalPrice: 149.99,
      description: 'Set de 3 bases profesionales de softball con sistema de anclaje Hollywood.',
      fullDescription: 'El set Hollywood Professional Bases es el estándar oficial de torneos y ligas profesionales de softball. Fabricadas con espuma de alto rendimiento de doble densidad cubiertas en nylon de alta resistencia, estas bases ofrecen la combinación ideal de seguridad para los jugadores y durabilidad en cancha. El innovador sistema de anclaje Hollywood Lock-Down garantiza que las bases permanezcan en posición durante el juego más intenso.',
      features: [
        'Espuma de doble densidad para mayor seguridad y rebote controlado',
        'Cubierta de nylon de alta resistencia UV',
        'Sistema de anclaje Hollywood Lock-Down anti-deslizamiento',
        'Set de 3 bases: primera, segunda y tercera',
        'Conformes con regulaciones ASA/USSSA oficial'
      ],
      stock: 10,
      sku: 'HW-PROBASES-001',
      rating: 4.5,
      reviewCount: 34,
      badge: 'featured',
      icon: 'fa-solid fa-diamond',
      gradient: 'linear-gradient(135deg, #114664 0%, #de3a0d 100%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    },

    // ── TACOS ──────────────────────────────────────────────────────────────
    {
      id: 'prod_tac001',
      name: 'Under Armour Glyde MT Softball',
      brand: 'Under Armour',
      category: 'tacos',
      price: 109.99,
      originalPrice: 109.99,
      description: 'Tacos de softball con placa de metal y upper de tela tejida ligera.',
      fullDescription: 'Los Under Armour Glyde MT combinan el rendimiento de los tacos de metal con la comodidad de las zapatillas deportivas modernas. Su upper de tela tejida de ingeniería proporciona soporte lateral sin sacrificar flexibilidad, mientras que la placa de metal de 7 tacos ofrece máxima tracción en tierra y arcilla. La entresuela de espuma UA HOVR absorbe el impacto en cada paso y zancada.',
      features: [
        'Upper de tela tejida de ingeniería ligera',
        'Placa de 7 tacos de metal intercambiables',
        'Entresuela UA HOVR de absorción de impacto',
        'Suela exterior de caucho para mayor durabilidad',
        'Cierre de cordones con guía de ajuste rápido'
      ],
      stock: 16,
      sku: 'UA-GLYDE-MT-001',
      rating: 4.6,
      reviewCount: 77,
      badge: null,
      icon: 'fa-solid fa-shoe-prints',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #df5911 80%)',
      createdAt: '2025-01-22T10:00:00.000Z'
    },
    {
      id: 'prod_tac002',
      name: 'Mizuno 9-Spike Advanced V1',
      brand: 'Mizuno',
      category: 'tacos',
      price: 119.99,
      originalPrice: 119.99,
      description: 'Tacos de 9 tacos de metal con tecnología Wave para absorción de impacto.',
      fullDescription: 'Los Mizuno 9-Spike Advanced V1 integran la famosa tecnología Wave de Mizuno en el diseño de calzado de softball, ofreciendo una distribución de presión uniforme que reduce la fatiga en juegos largos. Con 9 tacos de metal distribuidos estratégicamente para maximizar la tracción en movimientos multidireccionales, estos tacos son ideales para jugadores de campo que cubren grandes extensiones de terreno.',
      features: [
        'Tecnología Wave de Mizuno para distribución de presión',
        '9 tacos de metal de alta tracción multidireccional',
        'Upper de cuero sintético resistente a la humedad',
        'Entresuela AP+ para amortiguación superior',
        'Disponible en tallas 5.5 a 13 (hombre y mujer)'
      ],
      stock: 11,
      sku: 'MI-9SPIKE-V1-002',
      rating: 4.7,
      reviewCount: 59,
      badge: 'new',
      icon: 'fa-solid fa-shoe-prints',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #df5911 80%)',
      createdAt: '2025-03-10T10:00:00.000Z'
    },

    // ── MANGAS ─────────────────────────────────────────────────────────────
    {
      id: 'prod_man001',
      name: 'McDavid HEX Compression Arm Sleeve',
      brand: 'McDavid',
      category: 'mangas',
      price: 24.99,
      originalPrice: 24.99,
      description: 'Manga de compresión con tecnología HEX para protección del antebrazo.',
      fullDescription: 'La manga de compresión McDavid HEX utiliza la exclusiva tecnología de almohadillas hexagonales integradas que distribuyen el impacto uniformemente sobre el antebrazo. Fabricada con tela de compresión de 4 vías que mejora la circulación sanguínea y reduce la fatiga muscular durante lanzamientos repetitivos. Ideal para lanzadores y receptores que necesitan protección extra en el antebrazo.',
      features: [
        'Almohadillas hexagonales HEX integradas anti-impacto',
        'Compresión de 4 vías para mejor circulación',
        'Tela de nylon/spandex transpirable y de secado rápido',
        'Bordes de silicona anti-deslizamiento para fijación',
        'Talla única ajustable para adultos'
      ],
      stock: 35,
      sku: 'MC-HEXARM-001',
      rating: 4.5,
      reviewCount: 231,
      badge: null,
      icon: 'fa-solid fa-mitten',
      gradient: 'linear-gradient(135deg, #e17605 0%, #114664 100%)',
      createdAt: '2025-01-07T10:00:00.000Z'
    },
    {
      id: 'prod_man002',
      name: 'EvoShield Pro-SRZ Batter\'s Elbow Guard',
      brand: 'EvoShield',
      category: 'mangas',
      price: 34.99,
      originalPrice: 34.99,
      description: 'Protector de codo personalizable con tecnología Gel-to-Shell de EvoShield.',
      fullDescription: 'El EvoShield Pro-SRZ Batter\'s Elbow Guard utiliza la revolucionaria tecnología Gel-to-Shell que permite que el protector tome la forma exacta del codo del bateador al primer uso. El escudo parte como gel flexible y en contacto con el aire se endurece formando un molde personalizado que ofrece protección rígida sin restringir el movimiento. Certificado por la mayoría de ligas de softball profesional.',
      features: [
        'Tecnología Gel-to-Shell de moldeo personalizado',
        'Protector exterior ABS de alta resistencia una vez curado',
        'Sistema de correas dobles con Velcro ajustable',
        'Interior de neopreno acolchado para comodidad',
        'Aprobado por ASA, USSSA y NSA'
      ],
      stock: 22,
      sku: 'EV-PROSRZ-002',
      rating: 4.6,
      reviewCount: 115,
      badge: null,
      icon: 'fa-solid fa-mitten',
      gradient: 'linear-gradient(135deg, #e17605 0%, #114664 100%)',
      createdAt: '2025-01-25T10:00:00.000Z'
    },

    // ── LENTES ─────────────────────────────────────────────────────────────
    {
      id: 'prod_len001',
      name: 'Oakley Flak 2.0 XL Softball',
      brand: 'Oakley',
      category: 'lentes',
      price: 179.99,
      originalPrice: 179.99,
      description: 'Lentes de alto rendimiento con lentes Prizm Field para mayor contraste en cancha.',
      fullDescription: 'Los Oakley Flak 2.0 XL son los lentes de referencia para jugadores de softball de todos los niveles. La tecnología de lentes Prizm Field de Oakley maximiza el contraste y la visibilidad en terrenos de juego, permitiendo detectar la pelota con mayor rapidez y precisión. El marco de Unobtainium aumenta su adherencia con la transpiración, asegurando que los lentes permanezcan en posición durante todo el juego.',
      features: [
        'Lentes Prizm Field para contraste optimizado en cancha',
        'Marco de Unobtainium con adherencia creciente ante la transpiración',
        'Protección UV 100% UVA, UVB y UVC',
        'Cobertura XL para mayor campo de visión periférica',
        'Intercambiables con lentes Plutonite adicionales'
      ],
      stock: 9,
      sku: 'OA-FLAK20-001',
      rating: 4.8,
      reviewCount: 48,
      badge: 'featured',
      icon: 'fa-solid fa-glasses',
      gradient: 'linear-gradient(135deg, #3f4a4b 0%, #114664 80%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    },

    // ── GORRAS ─────────────────────────────────────────────────────────────
    {
      id: 'prod_gor001',
      name: 'New Era 59Fifty StrikeStore Edition',
      brand: 'New Era',
      category: 'gorras',
      price: 39.99,
      originalPrice: 39.99,
      description: 'Gorra fitted 59Fifty edición exclusiva StrikeStore en colaboración con New Era.',
      fullDescription: 'La gorra New Era 59Fifty en edición exclusiva StrikeStore combina el estilo icónico de New Era con los colores y branding de StrikeStore. Fabricada en 100% lana de alta calidad con visera plana pre-curvada, esta gorra structured fitted ofrece un ajuste perfecto para todos los tamaños de cabeza. El bordado de alta densidad del logo StrikeStore en el frente la convierte en una pieza de colección.',
      features: [
        'Construcción 100% lana de alta calidad structured fitted',
        'Visera plana pre-curvada con 6 costuras',
        'Bordado de alta densidad del logo StrikeStore',
        'Sudadera interior de tela absorbente',
        'Disponible en tallas 6 3/4 a 7 3/4'
      ],
      stock: 40,
      sku: 'NE-59FIFTY-SS-001',
      rating: 4.7,
      reviewCount: 203,
      badge: 'new',
      icon: 'fa-solid fa-hat-cowboy',
      gradient: 'linear-gradient(135deg, #114664 0%, #df5911 100%)',
      createdAt: '2025-02-20T10:00:00.000Z'
    },
    {
      id: 'prod_gor002',
      name: 'Richardson 252 Umpire Performance',
      brand: 'Richardson',
      category: 'gorras',
      price: 29.99,
      originalPrice: 29.99,
      description: 'Gorra de árbitro oficial con panel frontal estructurado y sweatband de lujo.',
      fullDescription: 'La Richardson 252 es la gorra estándar para árbitros de softbol en ligas americanas. Su panel frontal estructurado de poliéster/lana mantiene la forma en todo momento, mientras que el sweatband de terry de lujo absorbe eficientemente la transpiración durante partidos largos al sol. El cierre trasero de snapback permite ajuste rápido entre turnos sin herramientas.',
      features: [
        'Mezcla de poliéster/lana structured de alta durabilidad',
        'Sweatband de terry de lujo de alta absorción',
        'Cierre snapback de ajuste rápido de 5 posiciones',
        'Visera plana con 6 costuras y parche de tela frontal',
        'Disponible en negro sólido (estándar oficial)'
      ],
      stock: 55,
      sku: 'RI-252-UMP-002',
      rating: 4.4,
      reviewCount: 67,
      badge: null,
      icon: 'fa-solid fa-hat-cowboy',
      gradient: 'linear-gradient(135deg, #114664 0%, #df5911 100%)',
      createdAt: '2025-01-05T10:00:00.000Z'
    },

    // ── ROPA ───────────────────────────────────────────────────────────────
    {
      id: 'prod_rop001',
      name: 'Uniforme Completo StrikeStore Pro',
      brand: 'StrikeStore',
      category: 'ropa',
      price: 89.99,
      originalPrice: 89.99,
      description: 'Uniforme completo (jersey + pantalón) con tecnología de gestión de humedad.',
      fullDescription: 'El Uniforme Completo StrikeStore Pro es el kit oficial para equipos que quieren verse y rendirse al máximo. El jersey de poliéster doble tejido con tecnología HeatGear absorbe la humedad y la aleja de la piel, manteniendo al jugador fresco en los innings más calurosos. El pantalón de tejido de doble capa ofrece la flexibilidad necesaria para slides y zancadas amplias, con refuerzos en rodillas y trasero.',
      features: [
        'Jersey de poliéster doble tejido con tecnología HeatGear',
        'Pantalón de doble capa flexible con refuerzos',
        'Bordado del logo StrikeStore en jersey',
        'Disponible en colores de equipo personalizables',
        'Set completo: jersey + pantalón'
      ],
      stock: 20,
      sku: 'SS-UNIFPRO-001',
      rating: 4.6,
      reviewCount: 91,
      badge: 'featured',
      icon: 'fa-solid fa-shirt',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #114664 100%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    },
    {
      id: 'prod_rop002',
      name: 'Pantalón de Juego AllTime Pro',
      brand: 'AllTime',
      category: 'ropa',
      price: 44.99,
      originalPrice: 59.99,
      description: 'Pantalón de softball de doble capa con tejido de nylon elástico y cintura ajustable.',
      fullDescription: 'El Pantalón de Juego AllTime Pro está diseñado para resistir la demanda física del softball competitivo. Fabricado en tejido de nylon 4-way stretch con tratamiento DWR repelente al agua, este pantalón ofrece libertad de movimiento total mientras protege contra la humedad del campo. Los refuerzos de tejido extra grueso en rodillas y zona de slide extienden significativamente la vida útil del pantalón.',
      features: [
        'Tejido de nylon 4-way stretch para máxima movilidad',
        'Tratamiento DWR repelente al agua',
        'Refuerzos dobles en rodillas y zona de slide',
        'Cintura elástica con cordón ajustable interno',
        'Bolsillos laterales con cierre'
      ],
      stock: 28,
      sku: 'AT-PANTPRO-002',
      rating: 4.5,
      reviewCount: 126,
      badge: 'sale',
      icon: 'fa-solid fa-shirt',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #114664 100%)',
      createdAt: '2025-02-05T10:00:00.000Z'
    },
    {
      id: 'prod_rop003',
      name: 'Jersey StrikeStore Edición 2025',
      brand: 'StrikeStore',
      category: 'ropa',
      price: 54.99,
      originalPrice: 54.99,
      description: 'Jersey edición limitada 2025 con diseño exclusivo y tela de microfibra premium.',
      fullDescription: 'El Jersey StrikeStore Edición 2025 es nuestra pieza de colección para la temporada. Fabricado en microfibra de poliéster de alto rendimiento con tecnología de sublimación total, los colores y el diseño nunca se desvanecen ni descascaran, sin importar cuántas veces se lave. El diseño exclusivo 2025 combina los colores icónicos de StrikeStore con un patrón geométrico moderno que lo hace destacar en el diamante.',
      features: [
        'Microfibra de poliéster con impresión de sublimación total',
        'Diseño exclusivo StrikeStore 2025 de edición limitada',
        'Corte atlético ergonómico con costuras planas',
        'Cuello en V reforzado con cinta elástica',
        'Disponible en tallas XS-3XL'
      ],
      stock: 35,
      sku: 'SS-JERSEY25-003',
      rating: 4.7,
      reviewCount: 78,
      badge: 'new',
      icon: 'fa-solid fa-shirt',
      gradient: 'linear-gradient(135deg, #de3a0d 0%, #114664 100%)',
      createdAt: '2025-03-01T10:00:00.000Z'
    },

    // ── ACCESORIOS ─────────────────────────────────────────────────────────
    {
      id: 'prod_acc001',
      name: 'Bag de Equipo StrikeStore XL Wheeled',
      brand: 'StrikeStore',
      category: 'accesorios',
      price: 129.99,
      originalPrice: 129.99,
      description: 'Bolsa de equipo con ruedas y compartimentos para bates, guante y equipamiento completo.',
      fullDescription: 'El Bag de Equipo StrikeStore XL Wheeled es la solución definitiva para transportar todo el equipo de softball en un solo viaje. Con capacidad para hasta 4 bates en el tubo exterior reforzado, compartimento principal para guante y casco, y bolsillos laterales para pelotas, guantines y accesorios personales, esta bolsa lo tiene todo. El sistema de ruedas telescópico de aluminio hace que cargarla por el estacionamiento o el aeropuerto sea un placer.',
      features: [
        'Tubo exterior para hasta 4 bates de 34"',
        'Compartimento principal con separadores internos',
        'Sistema de ruedas telescópico de aluminio',
        'Tela exterior de poliéster 600D resistente al agua',
        'Correa de hombro ajustable y asas de mano reforzadas'
      ],
      stock: 13,
      sku: 'SS-BAGXLWH-001',
      rating: 4.5,
      reviewCount: 44,
      badge: 'featured',
      icon: 'fa-solid fa-bag-shopping',
      gradient: 'linear-gradient(135deg, #df5911 0%, #3f4a4b 100%)',
      createdAt: '2025-01-10T10:00:00.000Z'
    }
  ],

  // ─── Métodos de acceso a localStorage ────────────────────────────────────

  /**
   * Inicializa los productos en localStorage solo si no existen aún.
   */
  init() {
    if (!localStorage.getItem(this._key)) {
      localStorage.setItem(this._key, JSON.stringify(this._seed));
    }
  },

  /**
   * Retorna el array completo de productos.
   */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this._key)) || [];
    } catch {
      return [];
    }
  },

  /**
   * Retorna un producto por ID, o null si no existe.
   */
  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  },

  /**
   * Retorna los productos de una categoría específica.
   */
  getByCategory(cat) {
    return this.getAll().filter(p => p.category === cat);
  },

  /**
   * Búsqueda en nombre, marca, descripción y categoría (case insensitive).
   */
  search(query) {
    if (!query || !query.trim()) return this.getAll();
    const q = query.toLowerCase().trim();
    return this.getAll().filter(p =>
      [p.name, p.brand, p.description, p.category, p.fullDescription]
        .some(field => field && field.toLowerCase().includes(q))
    );
  },

  /**
   * Retorna productos con badge === 'featured'.
   */
  getFeatured() {
    return this.getAll().filter(p => p.badge === 'featured');
  },

  /**
   * Retorna productos con badge === 'new'.
   */
  getNewArrivals() {
    return this.getAll().filter(p => p.badge === 'new');
  },

  /**
   * Retorna productos con badge === 'sale'.
   */
  getSaleItems() {
    return this.getAll().filter(p => p.badge === 'sale');
  },

  /**
   * Retorna array de categorías únicas en uso.
   */
  getCategories() {
    return [...new Set(this.getAll().map(p => p.category))];
  },

  /**
   * Agrega un producto nuevo. Genera ID automáticamente.
   * @returns {{ success: boolean, message: string, product?: object }}
   */
  add(data) {
    if (!data || !data.name || !data.price || !data.category) {
      return { success: false, message: 'Nombre, precio y categoría son requeridos.' };
    }
    const products = this.getAll();
    const product = {
      ...data,
      id: Utils.generateId('prod'),
      icon: data.icon || Utils.getCategoryIcon(data.category),
      gradient: data.gradient || Utils.getCategoryGradient(data.category),
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      badge: data.badge || null,
      stock: data.stock || 0,
      originalPrice: data.originalPrice || data.price,
      features: data.features || [],
      createdAt: new Date().toISOString()
    };
    products.push(product);
    localStorage.setItem(this._key, JSON.stringify(products));
    return { success: true, message: 'Producto agregado correctamente.', product };
  },

  /**
   * Actualiza un producto existente por ID.
   * @returns {{ success: boolean, message: string }}
   */
  update(id, data) {
    const products = this.getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Producto no encontrado.' };

    products[idx] = { ...products[idx], ...data, id, updatedAt: new Date().toISOString() };
    localStorage.setItem(this._key, JSON.stringify(products));
    return { success: true, message: 'Producto actualizado correctamente.' };
  },

  /**
   * Elimina un producto por ID.
   * @returns {{ success: boolean, message: string }}
   */
  delete(id) {
    const products = this.getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Producto no encontrado.' };

    products.splice(idx, 1);
    localStorage.setItem(this._key, JSON.stringify(products));
    return { success: true, message: 'Producto eliminado correctamente.' };
  }
};
