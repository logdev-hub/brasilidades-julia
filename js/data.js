/* =========================================================
   Brasilidades — Catálogo (dados da loja)
   Edite este arquivo para cadastrar categorias, linhas,
   produtos, cupons e lojas físicas.
   Para usar fotos reais, adicione `image` e `image2`
   (URL ou caminho em /img) em qualquer produto.
   ========================================================= */
window.BR_DATA = (function () {

  const categories = [
    { id: 'corpo-banho', name: 'Corpo & Banho', short: 'Corpo', color: '#FFB175',
      subs: ['Hidratantes', 'Óleos Corporais', 'Sabonetes', 'Esfoliantes', 'Desodorantes'] },
    { id: 'fragrancias', name: 'Fragrâncias', short: 'Fragrâncias', color: '#F25071',
      subs: ['Eau de Parfum', 'Eau de Toilette', 'Body Splash', 'Colônias'] },
    { id: 'rosto', name: 'Cuidado Facial', short: 'Rosto', color: '#09C1DA',
      subs: ['Limpeza', 'Séruns', 'Hidratantes Faciais', 'Olhos', 'Máscaras'] },
    { id: 'cabelos', name: 'Cuidado Capilar', short: 'Cabelos', color: '#CC274E',
      subs: ['Shampoos', 'Condicionadores', 'Máscaras Capilares', 'Séruns e Óleos'] },
    { id: 'maos', name: 'Mãos & Lábios', short: 'Mãos', color: '#96582a',
      subs: ['Cremes para Mãos', 'Lábios', 'Unhas'] },
    { id: 'casa', name: 'Casa', short: 'Casa', color: '#92BE25',
      subs: ['Velas', 'Difusores', 'Home Spray'] },
    { id: 'homem', name: 'Homem', short: 'Homem', color: '#3F2B2E',
      subs: ['Barba', 'Corpo', 'Perfumes'] },
    { id: 'presentes', name: 'Presentes', short: 'Presentes', color: '#91241E',
      subs: ['Kits', 'Até R$ 150', 'Presentes Especiais'] },
    { id: 'refil', name: 'Refil', short: 'Refil', color: '#64CE65',
      subs: ['Eco-Refil', 'Refil Grande'] }
  ];

  const lines = [
    { id: 'acai', name: 'Açaí & Guaraná', ingredient: 'Açaí', origin: 'Pará', color: '#BD4AC6', color2: '#3F2B2E',
      story: 'Colhido por comunidades ribeirinhas do Pará, o açaí é rico em antocianinas, poderosos antioxidantes que protegem a pele dos danos do dia a dia. O guaraná traz energia e vitalidade.' },
    { id: 'maracuja', name: 'Maracujá', ingredient: 'Maracujá', origin: 'Bahia', color: '#F8AD3F', color2: '#EA6404',
      story: 'O óleo de semente de maracujá, prensado a frio na Bahia, acalma e equilibra a pele com uma textura leve e uma fragrância tropical relaxante.' },
    { id: 'pitanga', name: 'Pitanga', ingredient: 'Pitanga', origin: 'Pernambuco', color: '#F25071', color2: '#CC274E',
      story: 'A pitanga, fruta nativa da Mata Atlântica, empresta seu frescor frutado e vibrante a uma linha que desperta os sentidos e perfuma a pele por horas.' },
    { id: 'cupuacu', name: 'Cupuaçu', ingredient: 'Manteiga de Cupuaçu', origin: 'Amazonas', color: '#FFB175', color2: '#96582a',
      story: 'A manteiga de cupuaçu absorve até 4 vezes mais água que a lanolina. Nutrição intensa e duradoura para peles secas, com ingrediente de extrativismo sustentável.' },
    { id: 'buriti', name: 'Buriti', ingredient: 'Óleo de Buriti', origin: 'Tocantins', color: '#EA6404', color2: '#91241E',
      story: 'O buriti, palmeira das veredas do Cerrado, produz um óleo dourado riquíssimo em betacaroteno que ilumina, protege e deixa a pele com um glow natural.' },
    { id: 'castanha', name: 'Castanha-do-Pará', ingredient: 'Óleo de Castanha', origin: 'Acre', color: '#96582a', color2: '#3F2B2E',
      story: 'Coletada na floresta em pé, a castanha-do-pará fornece um óleo rico em selênio e ômegas que firma, nutre e revitaliza a pele madura.' },
    { id: 'vitoria-regia', name: 'Vitória-Régia', ingredient: 'Extrato de Vitória-Régia', origin: 'Amazonas', color: '#09C1DA', color2: '#001022',
      story: 'Inspirada na flor que repousa sobre os rios amazônicos, a linha oferece hidratação leve e purificante, ideal para peles mistas e oleosas.' },
    { id: 'jabuticaba', name: 'Jabuticaba', ingredient: 'Extrato de Jabuticaba', origin: 'Minas Gerais', color: '#CC274E', color2: '#3F2B2E',
      story: 'A casca da jabuticaba mineira concentra polifenóis que fortalecem a fibra capilar, devolvendo brilho, maciez e resistência aos fios.' },
    { id: 'erva-mate', name: 'Erva-Mate & Cedro', ingredient: 'Erva-Mate', origin: 'Rio Grande do Sul', color: '#64CE65', color2: '#334a54',
      story: 'A erva-mate dos pampas, energizante e refrescante, encontra o calor amadeirado do cedro em uma linha pensada para o cuidado masculino.' },
    { id: 'capim-limao', name: 'Capim-Limão', ingredient: 'Óleo Essencial de Capim-Limão', origin: 'Goiás', color: '#92BE25', color2: '#64CE65',
      story: 'Cítrico, herbal e revigorante, o capim-limão purifica o ambiente e traz a sensação de uma manhã no campo para dentro de casa.' },
    { id: 'flor-de-ipe', name: 'Flor de Ipê', ingredient: 'Acorde Flor de Ipê', origin: 'Cerrado', color: '#FB839B', color2: '#D64C63',
      story: 'Quando o ipê floresce, o Cerrado se pinta de rosa. Uma linha floral, delicada e luminosa que celebra a beleza efêmera dessa árvore brasileira.' },
    { id: 'cacau', name: 'Cacau da Bahia', ingredient: 'Manteiga de Cacau', origin: 'Bahia', color: '#993B31', color2: '#3F2B2E',
      story: 'Cultivado em sistema cabruca, à sombra da Mata Atlântica, o cacau baiano oferece uma manteiga nutritiva que protege e repara mãos e lábios.' }
  ];

  /* type: frasco | tubo | pote | perfume | sabonete | vela | kit | oleo | refil | spray | difusor | bisnaga */
  const products = [
    // ---------- CORPO & BANHO
    { id: 'BR001', name: 'Óleo Corporal Iluminador Buriti', line: 'buriti', cat: 'corpo-banho', sub: 'Óleos Corporais', type: 'oleo',
      sizes: [{ label: '100mL', price: 189, old: 0 }, { label: '30mL', price: 79, old: 0 }], tags: ['BEST-SELLER'], rating: 4.9, reviews: 812, sold: 980, date: '2026-03-02',
      desc: 'Óleo seco multifuncional que se funde à pele, deixando um brilho dourado natural e até 24h de hidratação.', use: 'Aplique sobre a pele limpa e levemente úmida, massageando suavemente. Pode ser usado também nas pontas dos cabelos.' },
    { id: 'BR002', name: 'Creme Corporal Ultra Nutritivo Cupuaçu', line: 'cupuacu', cat: 'corpo-banho', sub: 'Hidratantes', type: 'pote',
      sizes: [{ label: '200mL', price: 159, old: 0 }, { label: '50mL', price: 69, old: 0 }], tags: ['BEST-SELLER', 'NOVA EMBALAGEM'], rating: 4.8, reviews: 1290, sold: 1500, date: '2025-11-10',
      desc: 'Textura rica e envolvente com 15% de manteiga de cupuaçu para nutrir profundamente peles secas e extrassecas.', use: 'Aplique diariamente no corpo, insistindo nas áreas mais ressecadas como cotovelos e joelhos.' },
    { id: 'BR003', name: 'Sabonete Líquido Refrescante Pitanga', line: 'pitanga', cat: 'corpo-banho', sub: 'Sabonetes', type: 'frasco',
      sizes: [{ label: '250mL', price: 49.5, old: 99 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 640, sold: 1320, date: '2025-08-01',
      desc: 'Espuma cremosa que limpa suavemente e perfuma a pele com o frescor frutado da pitanga.', use: 'Aplique sobre a pele molhada, massageie até formar espuma e enxágue.' },
    { id: 'BR004', name: 'Leite Hidratante Firmador Castanha-do-Pará', line: 'castanha', cat: 'corpo-banho', sub: 'Hidratantes', type: 'frasco',
      sizes: [{ label: '250mL', price: 179, old: 0 }], tags: ['NOVIDADE'], rating: 4.6, reviews: 98, sold: 310, date: '2026-09-01',
      desc: 'Hidratante de rápida absorção que melhora a firmeza e a elasticidade da pele em 4 semanas.', use: 'Aplique em movimentos ascendentes, do tornozelo às coxas, e no abdômen.' },
    { id: 'BR005', name: 'Esfoliante Corporal Açaí & Guaraná', line: 'acai', cat: 'corpo-banho', sub: 'Esfoliantes', type: 'pote',
      sizes: [{ label: '200g', price: 89.4, old: 149 }], tags: ['NOVIDADE'], rating: 4.7, reviews: 156, sold: 420, date: '2026-08-15',
      desc: 'Esfoliante com sementes de açaí e açúcar de cana que renova a pele e estimula a circulação.', use: 'Na pele úmida, massageie em movimentos circulares. Enxágue. Use 2 vezes por semana.' },
    { id: 'BR006', name: 'Óleo de Banho Relaxante Maracujá', line: 'maracuja', cat: 'corpo-banho', sub: 'Sabonetes', type: 'frasco',
      sizes: [{ label: '250mL', price: 129, old: 0 }], tags: ['BEST-SELLER'], rating: 4.8, reviews: 532, sold: 870, date: '2025-05-20',
      desc: 'Óleo que se transforma em espuma leitosa em contato com a água, limpando sem ressecar.', use: 'Aplique na pele molhada e massageie. Enxágue.' },
    { id: 'BR007', name: 'Desodorante Colônia Pitanga', line: 'pitanga', cat: 'corpo-banho', sub: 'Desodorantes', type: 'spray',
      sizes: [{ label: '100mL', price: 64.5, old: 129 }], tags: [], rating: 4.5, reviews: 210, sold: 600, date: '2025-02-10',
      desc: 'Desodorante colônia com notas frutadas de pitanga e acerola, proteção e perfume por até 24h.', use: 'Borrife a 15 cm do corpo após o banho.' },
    { id: 'BR008', name: 'Mist Perfumado Corpo e Cabelo Flor de Ipê', line: 'flor-de-ipe', cat: 'corpo-banho', sub: 'Hidratantes', type: 'spray',
      sizes: [{ label: '100mL', price: 119, old: 0 }], tags: ['NOVIDADE', 'EDIÇÃO LIMITADA'], rating: 4.9, reviews: 64, sold: 280, date: '2026-09-20',
      desc: 'Bruma leve e hidratante que perfuma corpo e cabelos com um floral luminoso e delicado.', use: 'Borrife sobre o corpo e os cabelos sempre que desejar.' },

    // ---------- FRAGRÂNCIAS
    { id: 'BR010', name: 'Eau de Parfum Flor de Ipê', line: 'flor-de-ipe', cat: 'fragrancias', sub: 'Eau de Parfum', type: 'perfume', family: 'Floral',
      sizes: [{ label: '75mL', price: 389, old: 0 }, { label: '30mL', price: 219, old: 0 }], tags: ['BEST-SELLER', 'PRESENTE FAVORITO'], rating: 4.9, reviews: 455, sold: 760, date: '2025-10-01',
      desc: 'Um floral radiante com notas de pera, flor de ipê e almíscar branco. Feminino, elegante e marcante.', use: 'Borrife nos pontos de pulsação: pulsos, pescoço e atrás das orelhas.' },
    { id: 'BR011', name: 'Eau de Toilette Pitanga', line: 'pitanga', cat: 'fragrancias', sub: 'Eau de Toilette', type: 'perfume', family: 'Frutal',
      sizes: [{ label: '100mL', price: 299, old: 0 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 389, sold: 690, date: '2025-04-12',
      desc: 'Frutal e vibrante, abre com pitanga e grapefruit, com coração de flor de laranjeira e fundo ambarado.', use: 'Borrife nos pontos de pulsação.' },
    { id: 'BR012', name: 'Eau de Parfum Cedro & Erva-Mate', line: 'erva-mate', cat: 'fragrancias', sub: 'Eau de Parfum', type: 'perfume', family: 'Amadeirado',
      sizes: [{ label: '75mL', price: 369, old: 0 }], tags: ['NOVIDADE'], rating: 4.8, reviews: 72, sold: 240, date: '2026-09-10',
      desc: 'Amadeirado aromático com erva-mate, cardamomo, cedro e vetiver. Sofisticado e envolvente.', use: 'Borrife nos pontos de pulsação.' },
    { id: 'BR013', name: 'Eau de Toilette Maracujá Dourado', line: 'maracuja', cat: 'fragrancias', sub: 'Eau de Toilette', type: 'perfume', family: 'Frutal',
      sizes: [{ label: '100mL', price: 179.4, old: 299 }], tags: [], rating: 4.6, reviews: 204, sold: 410, date: '2024-12-01',
      desc: 'Fragrância solar com maracujá, tangerina e baunilha. Alegre, quente e luminosa.', use: 'Borrife nos pontos de pulsação.' },
    { id: 'BR014', name: 'Body Splash Açaí & Guaraná', line: 'acai', cat: 'fragrancias', sub: 'Body Splash', type: 'spray', family: 'Gourmand',
      sizes: [{ label: '200mL', price: 99, old: 0 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 610, sold: 1100, date: '2025-01-05',
      desc: 'Perfume leve para o corpo com açaí, frutas vermelhas e um toque de guaraná energizante.', use: 'Borrife generosamente sobre o corpo.' },
    { id: 'BR015', name: 'Colônia Capim-Limão', line: 'capim-limao', cat: 'fragrancias', sub: 'Colônias', type: 'perfume', family: 'Cítrico',
      sizes: [{ label: '150mL', price: 159, old: 0 }], tags: [], rating: 4.5, reviews: 132, sold: 300, date: '2025-06-18',
      desc: 'Cítrico refrescante e unissex, com capim-limão, limão-siciliano e gengibre.', use: 'Borrife sobre a pele após o banho.' },
    { id: 'BR016', name: 'Eau de Parfum Cacau & Baunilha', line: 'cacau', cat: 'fragrancias', sub: 'Eau de Parfum', type: 'perfume', family: 'Gourmand',
      sizes: [{ label: '75mL', price: 349, old: 0 }], tags: ['EDIÇÃO LIMITADA'], rating: 4.8, reviews: 88, sold: 190, date: '2026-07-01',
      desc: 'Um gourmand intenso de cacau baiano, fava tonka e baunilha bourbon. Quente e viciante.', use: 'Borrife nos pontos de pulsação.' },

    // ---------- ROSTO
    { id: 'BR020', name: 'Sérum Facial Firmador Castanha-do-Pará', line: 'castanha', cat: 'rosto', sub: 'Séruns', type: 'oleo',
      sizes: [{ label: '30mL', price: 329, old: 0 }], tags: ['BEST-SELLER'], rating: 4.9, reviews: 720, sold: 890, date: '2025-09-01',
      desc: 'Sérum concentrado que reduz linhas finas e devolve firmeza à pele em 28 dias. Para todos os tipos de pele.', use: 'Aplique 2 a 3 gotas no rosto limpo, manhã e noite, antes do hidratante.' },
    { id: 'BR021', name: 'Creme Antissinais Castanha-do-Pará', line: 'castanha', cat: 'rosto', sub: 'Hidratantes Faciais', type: 'pote',
      sizes: [{ label: '50mL', price: 299, old: 0 }], tags: ['NOVA EMBALAGEM'], rating: 4.8, reviews: 430, sold: 650, date: '2025-03-15',
      desc: 'Creme rico que nutre, firma e suaviza rugas. Pele visivelmente mais jovem e luminosa.', use: 'Aplique manhã e noite no rosto e pescoço.' },
    { id: 'BR022', name: 'Gel de Limpeza Purificante Vitória-Régia', line: 'vitoria-regia', cat: 'rosto', sub: 'Limpeza', type: 'tubo',
      sizes: [{ label: '125mL', price: 119, old: 0 }], tags: [], rating: 4.6, reviews: 290, sold: 520, date: '2025-02-20',
      desc: 'Gel de limpeza suave que remove impurezas e controla a oleosidade sem ressecar.', use: 'Massageie sobre o rosto úmido e enxágue. Manhã e noite.' },
    { id: 'BR023', name: 'Hidratante Facial Leve Vitória-Régia', line: 'vitoria-regia', cat: 'rosto', sub: 'Hidratantes Faciais', type: 'tubo',
      sizes: [{ label: '50mL', price: 109.5, old: 219 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 515, sold: 980, date: '2024-11-11',
      desc: 'Gel-creme oil-free com efeito matte e hidratação de 48h para peles mistas e oleosas.', use: 'Aplique sobre o rosto limpo, manhã e noite.' },
    { id: 'BR024', name: 'Bálsamo para Olhos Açaí', line: 'acai', cat: 'rosto', sub: 'Olhos', type: 'tubo',
      sizes: [{ label: '15mL', price: 189, old: 0 }], tags: ['NOVIDADE'], rating: 4.6, reviews: 47, sold: 150, date: '2026-08-25',
      desc: 'Bálsamo antioxidante que reduz olheiras e bolsas com ponteira metálica refrescante.', use: 'Deslize a ponteira de dentro para fora no contorno dos olhos.' },
    { id: 'BR025', name: 'Máscara Facial Iluminadora Buriti', line: 'buriti', cat: 'rosto', sub: 'Máscaras', type: 'pote',
      sizes: [{ label: '75mL', price: 159, old: 0 }], tags: [], rating: 4.7, reviews: 133, sold: 260, date: '2025-07-07',
      desc: 'Máscara cremosa com argila e buriti que revela uma pele mais radiante em 10 minutos.', use: 'Aplique uma camada uniforme, deixe agir 10 minutos e enxágue.' },

    // ---------- CABELOS
    { id: 'BR030', name: 'Shampoo Reparação Intensiva Jabuticaba', line: 'jabuticaba', cat: 'cabelos', sub: 'Shampoos', type: 'frasco',
      sizes: [{ label: '300mL', price: 119, old: 0 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 690, sold: 990, date: '2025-01-30',
      desc: 'Shampoo sem sulfatos agressivos que limpa suavemente e repara fios danificados.', use: 'Aplique nos cabelos molhados, massageie e enxágue.' },
    { id: 'BR031', name: 'Condicionador Reparação Intensiva Jabuticaba', line: 'jabuticaba', cat: 'cabelos', sub: 'Condicionadores', type: 'frasco',
      sizes: [{ label: '250mL', price: 129, old: 0 }], tags: [], rating: 4.7, reviews: 410, sold: 720, date: '2025-01-30',
      desc: 'Condicionador que desembaraça, nutre e devolve brilho desde a primeira aplicação.', use: 'Após o shampoo, aplique no comprimento e pontas. Enxágue.' },
    { id: 'BR032', name: 'Máscara Capilar Nutrição Cupuaçu', line: 'cupuacu', cat: 'cabelos', sub: 'Máscaras Capilares', type: 'pote',
      sizes: [{ label: '200mL', price: 89.4, old: 149 }], tags: [], rating: 4.8, reviews: 377, sold: 640, date: '2025-04-04',
      desc: 'Máscara de nutrição profunda para cabelos secos, cacheados e crespos.', use: 'Aplique nos fios úmidos, deixe agir 5 minutos e enxágue.' },
    { id: 'BR033', name: 'Sérum Anti-frizz Buriti', line: 'buriti', cat: 'cabelos', sub: 'Séruns e Óleos', type: 'oleo',
      sizes: [{ label: '50mL', price: 139, old: 0 }], tags: ['NOVIDADE'], rating: 4.6, reviews: 58, sold: 170, date: '2026-09-05',
      desc: 'Sérum leve que controla o frizz por até 72h e protege do calor até 230ºC.', use: 'Aplique de 2 a 4 gotas nos fios úmidos ou secos.' },

    // ---------- MÃOS
    { id: 'BR040', name: 'Creme para Mãos Cacau da Bahia', line: 'cacau', cat: 'maos', sub: 'Cremes para Mãos', type: 'bisnaga',
      sizes: [{ label: '75mL', price: 89, old: 0 }, { label: '30mL', price: 45, old: 0 }], tags: ['BEST-SELLER', 'TRAVEL SIZE'], rating: 4.9, reviews: 2140, sold: 2600, date: '2024-06-01',
      desc: 'O queridinho da marca: 20% de manteiga de cacau para mãos macias, protegidas e perfumadas.', use: 'Aplique sempre que sentir necessidade.' },
    { id: 'BR041', name: 'Creme para Mãos Flor de Ipê', line: 'flor-de-ipe', cat: 'maos', sub: 'Cremes para Mãos', type: 'bisnaga',
      sizes: [{ label: '30mL', price: 45, old: 0 }], tags: ['TRAVEL SIZE'], rating: 4.8, reviews: 520, sold: 900, date: '2025-10-01',
      desc: 'Creme leve de rápida absorção com perfume floral delicado.', use: 'Aplique sempre que desejar.' },
    { id: 'BR042', name: 'Bálsamo Labial Cacau', line: 'cacau', cat: 'maos', sub: 'Lábios', type: 'bisnaga',
      sizes: [{ label: '12mL', price: 39, old: 0 }], tags: [], rating: 4.7, reviews: 310, sold: 700, date: '2025-05-01',
      desc: 'Bálsamo que repara e protege lábios ressecados com manteiga de cacau e óleo de castanha.', use: 'Aplique nos lábios ao longo do dia.' },
    { id: 'BR043', name: 'Óleo Nutritivo para Unhas e Cutículas Castanha', line: 'castanha', cat: 'maos', sub: 'Unhas', type: 'oleo',
      sizes: [{ label: '7,5mL', price: 59, old: 0 }], tags: [], rating: 4.6, reviews: 124, sold: 330, date: '2025-07-10',
      desc: 'Fortalece as unhas e amacia as cutículas em uma fórmula 98% de origem natural.', use: 'Aplique uma gota em cada unha e massageie.' },

    // ---------- CASA
    { id: 'BR050', name: 'Vela Perfumada Capim-Limão', line: 'capim-limao', cat: 'casa', sub: 'Velas', type: 'vela',
      sizes: [{ label: '140g', price: 159, old: 0 }], tags: ['BEST-SELLER'], rating: 4.8, reviews: 288, sold: 470, date: '2025-03-03',
      desc: 'Vela de cera vegetal com até 35h de queima e aroma cítrico purificante.', use: 'Na primeira queima, deixe acesa até que toda a superfície derreta.' },
    { id: 'BR051', name: 'Difusor de Ambiente Maracujá + 8 Varetas', line: 'maracuja', cat: 'casa', sub: 'Difusores', type: 'difusor',
      sizes: [{ label: '100mL', price: 119.4, old: 199 }], tags: [], rating: 4.7, reviews: 176, sold: 380, date: '2025-02-02',
      desc: 'Perfuma o ambiente por até 3 meses com notas tropicais e relaxantes.', use: 'Insira as varetas e vire-as semanalmente para intensificar.' },
    { id: 'BR052', name: 'Home Spray Flor de Ipê', line: 'flor-de-ipe', cat: 'casa', sub: 'Home Spray', type: 'spray',
      sizes: [{ label: '100mL', price: 99, old: 0 }], tags: ['NOVIDADE'], rating: 4.6, reviews: 39, sold: 120, date: '2026-09-15',
      desc: 'Spray para ambientes e tecidos com floral delicado e luminoso.', use: 'Borrife no ar, em almofadas e cortinas.' },

    // ---------- HOMEM
    { id: 'BR060', name: 'Gel Pós-Barba Erva-Mate', line: 'erva-mate', cat: 'homem', sub: 'Barba', type: 'tubo',
      sizes: [{ label: '75mL', price: 99, old: 0 }], tags: [], rating: 4.6, reviews: 142, sold: 300, date: '2025-05-05',
      desc: 'Acalma, refresca e hidrata a pele após o barbear sem deixar sensação oleosa.', use: 'Aplique no rosto após o barbear.' },
    { id: 'BR061', name: 'Shampoo e Sabonete 2 em 1 Erva-Mate', line: 'erva-mate', cat: 'homem', sub: 'Corpo', type: 'frasco',
      sizes: [{ label: '250mL', price: 89, old: 0 }], tags: ['BEST-SELLER'], rating: 4.7, reviews: 266, sold: 530, date: '2025-05-05',
      desc: 'Limpa cabelo e corpo com uma espuma energizante e perfume amadeirado-aromático.', use: 'Aplique no corpo e cabelos molhados, massageie e enxágue.' },
    { id: 'BR062', name: 'Desodorante Stick Cedro', line: 'erva-mate', cat: 'homem', sub: 'Corpo', type: 'tubo',
      sizes: [{ label: '75g', price: 79, old: 0 }], tags: ['NOVA EMBALAGEM'], rating: 4.5, reviews: 98, sold: 260, date: '2025-08-08',
      desc: 'Proteção de 48h sem álcool e sem sais de alumínio, com perfume amadeirado.', use: 'Aplique nas axilas limpas e secas.' },

    // ---------- PRESENTES
    { id: 'BR070', name: 'Kit Presente Ritual Buriti', line: 'buriti', cat: 'presentes', sub: 'Presentes Especiais', type: 'kit',
      sizes: [{ label: '3 itens', price: 279, old: 349 }], tags: ['PRESENTE FAVORITO'], rating: 4.9, reviews: 211, sold: 450, date: '2025-11-01',
      desc: 'Óleo iluminador 100mL, óleo de banho 75mL e creme para mãos 30mL em caixa presenteável.', use: 'Presente pronto para entregar, com cartão personalizado.' },
    { id: 'BR071', name: 'Kit Essenciais Pitanga', line: 'pitanga', cat: 'presentes', sub: 'Até R$ 150', type: 'kit',
      sizes: [{ label: '2 itens', price: 139, old: 0 }], tags: ['BEST-SELLER'], rating: 4.8, reviews: 180, sold: 520, date: '2025-09-15',
      desc: 'Sabonete líquido 250mL e loção corporal 250mL com o frescor da pitanga.', use: 'Embalado para presente.' },
    { id: 'BR072', name: 'Caixa Calendário Brasilidades 24 Dias', line: 'flor-de-ipe', cat: 'presentes', sub: 'Presentes Especiais', type: 'kit',
      sizes: [{ label: '24 itens', price: 599, old: 0 }], tags: ['NOVIDADE', 'EDIÇÃO LIMITADA'], rating: 5, reviews: 36, sold: 140, date: '2026-09-28',
      desc: '24 surpresas para um ritual de cuidados completo: fragrâncias, cuidados com corpo, rosto e mãos.', use: 'Abra uma janela por dia até a ceia!' },
    { id: 'BR073', name: 'Kit Mãos Brasileiras Trio', line: 'cacau', cat: 'presentes', sub: 'Até R$ 150', type: 'kit',
      sizes: [{ label: '3 itens', price: 119, old: 135 }], tags: ['PRESENTE FAVORITO', 'TRAVEL SIZE'], rating: 4.9, reviews: 410, sold: 880, date: '2025-10-20',
      desc: 'Trio de cremes para mãos 30mL: Cacau, Flor de Ipê e Maracujá.', use: 'Embalado para presente.' },

    // ---------- REFIL
    { id: 'BR080', name: 'Eco-Refil Sabonete Líquido Pitanga', line: 'pitanga', cat: 'refil', sub: 'Eco-Refil', type: 'refil',
      sizes: [{ label: '500mL', price: 109, old: 129 }], tags: ['REFIL BEST-SELLER'], rating: 4.8, reviews: 320, sold: 760, date: '2025-02-14',
      desc: 'Refil com 85% menos plástico. Reabasteça seu frasco e dê uma segunda vida à embalagem.', use: 'Despeje no frasco de 250mL ou use com a válvula pump.' },
    { id: 'BR081', name: 'Refil Creme Ultra Nutritivo Cupuaçu', line: 'cupuacu', cat: 'refil', sub: 'Refil Grande', type: 'refil',
      sizes: [{ label: '200mL', price: 135, old: 159 }], tags: [], rating: 4.7, reviews: 144, sold: 330, date: '2025-11-10',
      desc: 'Cápsula refil que se encaixa no pote original. Mesmo cuidado, menos impacto.', use: 'Encaixe a cápsula no pote original.' },
    { id: 'BR082', name: 'Eco-Refil Shampoo Jabuticaba', line: 'jabuticaba', cat: 'refil', sub: 'Eco-Refil', type: 'refil',
      sizes: [{ label: '500mL', price: 149, old: 175 }], tags: [], rating: 4.6, reviews: 88, sold: 210, date: '2025-06-06',
      desc: 'Refil econômico com 15% OFF em relação ao frasco, menos plástico e a mesma fórmula.', use: 'Despeje no frasco original.' }
  ];

  const coupons = {
    PRIMEIRACOMPRA: { type: 'pct', value: 10, label: '10% OFF na primeira compra' },
    BRASIL15: { type: 'pct', value: 15, min: 250, label: '15% OFF acima de R$ 250' },
    FRETEGRATIS: { type: 'ship', value: 0, label: 'Frete grátis' },
    REFIL15: { type: 'pct', value: 15, onlyCat: 'refil', label: '15% OFF em Refis' }
  };

  const samples = [
    { id: 'AM1', name: 'Amostra Óleo Iluminador Buriti 5mL', line: 'buriti' },
    { id: 'AM2', name: 'Amostra Creme Cupuaçu 8mL', line: 'cupuacu' },
    { id: 'AM3', name: 'Amostra Eau de Parfum Flor de Ipê 1,5mL', line: 'flor-de-ipe' },
    { id: 'AM4', name: 'Amostra Sérum Castanha-do-Pará 4mL', line: 'castanha' },
    { id: 'AM5', name: 'Amostra Creme para Mãos Cacau 10mL', line: 'cacau' },
    { id: 'AM6', name: 'Amostra Hidratante Vitória-Régia 5mL', line: 'vitoria-regia' }
  ];

  const stores = [
    { id: 1, name: 'Brasilidades Shopping Paulista', uf: 'SP', city: 'São Paulo', address: 'Rua 13 de Maio, 1947 — Bela Vista', phone: '(11) 3000-1001', hours: 'Seg. a Sáb. 10h–22h · Dom. 14h–20h', spa: true },
    { id: 2, name: 'Brasilidades Oscar Freire', uf: 'SP', city: 'São Paulo', address: 'Rua Oscar Freire, 900 — Jardins', phone: '(11) 3000-1002', hours: 'Seg. a Sáb. 10h–20h', spa: true },
    { id: 3, name: 'Brasilidades Campinas', uf: 'SP', city: 'Campinas', address: 'Av. Guilherme Campos, 500 — Santa Genebra', phone: '(19) 3000-1003', hours: 'Seg. a Sáb. 10h–22h · Dom. 14h–20h', spa: false },
    { id: 4, name: 'Brasilidades Ipanema', uf: 'RJ', city: 'Rio de Janeiro', address: 'Rua Visconde de Pirajá, 300 — Ipanema', phone: '(21) 3000-2001', hours: 'Seg. a Sáb. 9h–20h', spa: true },
    { id: 5, name: 'Brasilidades Barra', uf: 'RJ', city: 'Rio de Janeiro', address: 'Av. das Américas, 4666 — Barra da Tijuca', phone: '(21) 3000-2002', hours: 'Seg. a Sáb. 10h–22h · Dom. 13h–21h', spa: false },
    { id: 6, name: 'Brasilidades Savassi', uf: 'MG', city: 'Belo Horizonte', address: 'Rua Pernambuco, 1000 — Savassi', phone: '(31) 3000-3001', hours: 'Seg. a Sáb. 10h–20h', spa: false },
    { id: 7, name: 'Brasilidades Curitiba', uf: 'PR', city: 'Curitiba', address: 'Av. do Batel, 1868 — Batel', phone: '(41) 3000-4001', hours: 'Seg. a Sáb. 10h–22h · Dom. 14h–20h', spa: true },
    { id: 8, name: 'Brasilidades Porto Alegre', uf: 'RS', city: 'Porto Alegre', address: 'Av. Diário de Notícias, 300 — Cristal', phone: '(51) 3000-5001', hours: 'Seg. a Sáb. 10h–22h', spa: false },
    { id: 9, name: 'Brasilidades Recife', uf: 'PE', city: 'Recife', address: 'Av. República do Líbano, 251 — Pina', phone: '(81) 3000-6001', hours: 'Seg. a Sáb. 9h–22h · Dom. 12h–21h', spa: true },
    { id: 10, name: 'Brasilidades Salvador', uf: 'BA', city: 'Salvador', address: 'Av. Tancredo Neves, 3133 — Caminho das Árvores', phone: '(71) 3000-7001', hours: 'Seg. a Sáb. 9h–22h', spa: false },
    { id: 11, name: 'Brasilidades Brasília', uf: 'DF', city: 'Brasília', address: 'SCN Q. 6 — Asa Norte', phone: '(61) 3000-8001', hours: 'Seg. a Sáb. 10h–22h · Dom. 14h–20h', spa: false },
    { id: 12, name: 'Brasilidades Belém', uf: 'PA', city: 'Belém', address: 'Av. Visconde de Souza Franco, 776 — Reduto', phone: '(91) 3000-9001', hours: 'Seg. a Sáb. 10h–22h', spa: false }
  ];

  const popularSearches = ['óleo iluminador', 'creme para mãos', 'perfume', 'refil', 'kit presente', 'sérum', 'cupuaçu', 'vela'];

  return { categories, lines, products, coupons, samples, stores, popularSearches };
})();
