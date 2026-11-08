// Paso course: Spanish for Lithuanian speakers (level: knows some basics).
// To add content: add [spanish, lithuanian, [optional other accepted Spanish answers]].
// Exercises are generated automatically from these pairs.
window.COURSE = {
  title: 'Ispanų kalba',
  units: [
    {
      id: 'u1', title: 'Susipažinkime', desc: 'Pasisveikinimai ir prisistatymas', color: '#ff7a45',
      tip: `
<h3>Ser ir estar – du „būti“</h3>
<p><b>Ser</b> – kas tu esi: vardas, kilmė, profesija, savybės.<br><i>Soy de Lituania. Ella es estudiante.</i></p>
<p><b>Estar</b> – kaip jautiesi arba kur esi.<br><i>Estoy cansada. Estoy en casa.</i></p>
<table><tr><th></th><th>ser</th><th>estar</th></tr>
<tr><td>yo (aš)</td><td>soy</td><td>estoy</td></tr>
<tr><td>tú (tu)</td><td>eres</td><td>estás</td></tr>
<tr><td>él / ella (jis / ji)</td><td>es</td><td>está</td></tr>
<tr><td>nosotros (mes)</td><td>somos</td><td>estamos</td></tr>
<tr><td>vosotros (jūs)</td><td>sois</td><td>estáis</td></tr>
<tr><td>ellos / ellas (jie / jos)</td><td>son</td><td>están</td></tr></table>
<p>Ispanai dažnai praleidžia įvardį: <i>Soy</i> = <i>Yo soy</i>.</p>
<p>Klausimai ir šūksniai prasideda apverstu ženklu: <i>¿Qué tal? ¡Hola!</i></p>`,
      lessons: [
        {
          id: 'u1l1', title: 'Pasisveikinimai', icon: '👋',
          words: [
            ['hola', 'labas'], ['adiós', 'viso gero'], ['buenos días', 'labas rytas'],
            ['buenas noches', 'labanakt'], ['gracias', 'ačiū'], ['por favor', 'prašau'],
            ['perdón', 'atsiprašau'], ['sí', 'taip'],
          ],
          sentences: [
            ['Hola, ¿qué tal?', 'Labas, kaip sekasi?'],
            ['Muy bien, gracias.', 'Labai gerai, ačiū.'],
            ['Me llamo Ana.', 'Mano vardas Ana.', ['Yo me llamo Ana.']],
            ['¿Cómo te llamas?', 'Koks tavo vardas?', ['¿Tú cómo te llamas?']],
            ['Mucho gusto.', 'Malonu susipažinti.'],
            ['Hasta mañana.', 'Iki rytojaus.'],
          ],
        },
        {
          id: 'u1l2', title: 'Iš kur tu?', icon: '🌍',
          words: [
            ['yo', 'aš'], ['tú', 'tu'], ['él', 'jis'], ['ella', 'ji'],
            ['nosotros', 'mes'], ['el país', 'šalis'], ['la ciudad', 'miestas'], ['el amigo', 'draugas'],
          ],
          sentences: [
            ['Soy de Lituania.', 'Aš esu iš Lietuvos.', ['Yo soy de Lituania.']],
            ['¿De dónde eres?', 'Iš kur tu esi?', ['¿Tú de dónde eres?']],
            ['Ella es estudiante.', 'Ji yra studentė.'],
            ['Somos amigos.', 'Mes esame draugai.', ['Nosotros somos amigos.']],
            ['Estoy cansada.', 'Aš esu pavargusi.', ['Yo estoy cansada.']],
            ['Vivo en Vilna.', 'Aš gyvenu Vilniuje.', ['Yo vivo en Vilna.', 'Vivo en Vilnius.', 'Yo vivo en Vilnius.']],
          ],
        },
      ],
    },
    {
      id: 'u2', title: 'Maistas ir gėrimai', desc: 'Kavinėje ir restorane', color: '#ffb020',
      tip: `
<h3>Giminė: el ir la</h3>
<p>Kiekvienas daiktavardis turi giminę. Dažniausiai <b>-o</b> – vyriškoji (<i>el vino</i>), <b>-a</b> – moteriškoji (<i>la cerveza</i>). Daiktavardžių su <b>-e</b> giminę reikia įsiminti: <i>el café, la leche, la carne</i>. <i>El agua</i> – moteriškoji, bet prieš kirčiuotą <i>a</i> sakoma <i>el</i>.</p>
<table><tr><th></th><th>vienaskaita</th><th>daugiskaita</th></tr>
<tr><td>vyr. g.</td><td>el / un</td><td>los / unos</td></tr>
<tr><td>mot. g.</td><td>la / una</td><td>las / unas</td></tr></table>
<p>Daugiskaita: po balsės pridedame <b>-s</b> (<i>manzanas</i>), po priebalsės <b>-es</b> (<i>panes</i>).</p>
<h3>Me gusta / me gustan</h3>
<p>Pažodžiui „man patinka“. Jei patinka vienas dalykas – <i>me gusta el café</i>, jei daug – <i>me gustan las manzanas</i>.</p>`,
      lessons: [
        {
          id: 'u2l1', title: 'Kavinėje', icon: '☕',
          words: [
            ['el agua', 'vanduo'], ['el café', 'kava'], ['el pan', 'duona'], ['la leche', 'pienas'],
            ['la manzana', 'obuolys'], ['el queso', 'sūris'], ['la cerveza', 'alus'], ['el vino', 'vynas'],
          ],
          sentences: [
            ['Quiero un café, por favor.', 'Noriu kavos, prašau.', ['Yo quiero un café, por favor.', 'Quiero café, por favor.']],
            ['Bebo agua.', 'Aš geriu vandenį.', ['Yo bebo agua.']],
            ['El pan está muy bueno.', 'Duona labai skani.'],
            ['No como carne.', 'Aš nevalgau mėsos.', ['Yo no como carne.']],
            ['¿Quieres comer?', 'Ar nori valgyti?', ['¿Tú quieres comer?']],
            ['La cuenta, por favor.', 'Sąskaitą, prašau.'],
          ],
        },
        {
          id: 'u2l2', title: 'Restorane', icon: '🍽️',
          words: [
            ['la carne', 'mėsa'], ['el pescado', 'žuvis'], ['el pollo', 'vištiena'], ['la sopa', 'sriuba'],
            ['el arroz', 'ryžiai'], ['la ensalada', 'salotos'], ['el desayuno', 'pusryčiai'], ['la cena', 'vakarienė'],
          ],
          sentences: [
            ['Me gusta el pescado.', 'Man patinka žuvis.'],
            ['No me gusta la sopa.', 'Man nepatinka sriuba.'],
            ['Me gustan las manzanas.', 'Man patinka obuoliai.'],
            ['Para mí, pollo con arroz.', 'Man vištienos su ryžiais.'],
            ['¿Qué quieres para cenar?', 'Ką nori vakarienei?', ['¿Qué quieres cenar?']],
            ['La comida está deliciosa.', 'Maistas labai skanus.'],
          ],
        },
      ],
    },
    {
      id: 'u3', title: 'Šeima', desc: 'Artimieji ir jų apibūdinimas', color: '#2bb5a0',
      tip: `
<h3>Savybiniai įvardžiai</h3>
<table><tr><th></th><th>vns.</th><th>dgs.</th></tr>
<tr><td>mano</td><td>mi</td><td>mis</td></tr>
<tr><td>tavo</td><td>tu</td><td>tus</td></tr>
<tr><td>jo / jos / jų</td><td>su</td><td>sus</td></tr>
<tr><td>mūsų</td><td>nuestro/a</td><td>nuestros/as</td></tr></table>
<p><i>mi hermano</i> – mano brolis, <i>mis hermanos</i> – mano broliai.</p>
<h3>Amžius su „tener“</h3>
<p>Ispaniškai amžių „turi“: <i>Tengo veinticinco años</i> – man 25 metai. Niekada nesakyk <i>soy 25</i>.</p>
<p>tener: tengo, tienes, tiene, tenemos, tenéis, tienen.</p>
<h3>Būdvardžiai</h3>
<p>Būdvardis dažniausiai eina <b>po</b> daiktavardžio ir derinasi: <i>un chico alto, una chica alta</i>.</p>`,
      lessons: [
        {
          id: 'u3l1', title: 'Mano šeima', icon: '👨‍👩‍👧',
          words: [
            ['la madre', 'motina'], ['el padre', 'tėvas'], ['el hermano', 'brolis'], ['la hermana', 'sesuo'],
            ['el hijo', 'sūnus'], ['la hija', 'dukra'], ['los abuelos', 'seneliai'], ['la familia', 'šeima'],
          ],
          sentences: [
            ['Tengo dos hermanos.', 'Aš turiu du brolius.', ['Yo tengo dos hermanos.']],
            ['Mi madre se llama Laura.', 'Mano mamos vardas Laura.'],
            ['Mi hermana es muy alta.', 'Mano sesuo labai aukšta.'],
            ['¿Tienes hijos?', 'Ar turi vaikų?', ['¿Tú tienes hijos?']],
            ['Mis abuelos viven en Kaunas.', 'Mano seneliai gyvena Kaune.'],
            ['Mi padre trabaja mucho.', 'Mano tėtis daug dirba.'],
          ],
        },
        {
          id: 'u3l2', title: 'Kokie jie?', icon: '🧑',
          words: [
            ['alto', 'aukštas'], ['bajo', 'žemas'], ['joven', 'jaunas'], ['mayor', 'vyresnis'],
            ['simpático', 'malonus'], ['divertido', 'linksmas'], ['inteligente', 'protingas'], ['guapo', 'gražus'],
          ],
          sentences: [
            ['Mi hermano es joven y divertido.', 'Mano brolis jaunas ir linksmas.'],
            ['Ella es muy simpática.', 'Ji labai maloni.'],
            ['Mi abuela tiene ochenta años.', 'Mano močiutei aštuoniasdešimt metų.'],
            ['¿Cuántos años tienes?', 'Kiek tau metų?'],
            ['Tengo veinticinco años.', 'Man dvidešimt penkeri metai.', ['Yo tengo veinticinco años.']],
            ['Nuestra familia es grande.', 'Mūsų šeima didelė.'],
          ],
        },
      ],
    },
    {
      id: 'u4', title: 'Kasdienybė', desc: 'Diena, darbas ir laisvalaikis', color: '#4a8cff',
      tip: `
<h3>Esamasis laikas</h3>
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>hablo</td><td>como</td><td>vivo</td></tr>
<tr><td>tú</td><td>hablas</td><td>comes</td><td>vives</td></tr>
<tr><td>él / ella</td><td>habla</td><td>come</td><td>vive</td></tr>
<tr><td>nosotros</td><td>hablamos</td><td>comemos</td><td>vivimos</td></tr>
<tr><td>ellos</td><td>hablan</td><td>comen</td><td>viven</td></tr></table>
<h3>Sangrąžiniai veiksmažodžiai</h3>
<p>Kaip lietuviškas <b>-si</b>: <i>levantarse</i> – keltis.</p>
<p><i>me levanto</i> (keliuosi), <i>te levantas</i> (keliesi), <i>se levanta</i> (keliasi), <i>nos levantamos</i> (keliamės).</p>
<p>Laikas: <i>a las siete</i> – septintą valandą, <i>a la una</i> – pirmą.</p>`,
      lessons: [
        {
          id: 'u4l1', title: 'Mano diena', icon: '⏰',
          words: [
            ['despertarse', 'pabusti'], ['levantarse', 'keltis'], ['ducharse', 'praustis po dušu'], ['desayunar', 'pusryčiauti'],
            ['trabajar', 'dirbti'], ['estudiar', 'mokytis'], ['dormir', 'miegoti'], ['temprano', 'anksti'],
          ],
          sentences: [
            ['Me levanto a las siete.', 'Aš keliuosi septintą valandą.', ['Yo me levanto a las siete.']],
            ['Desayuno en casa.', 'Pusryčiauju namuose.', ['Yo desayuno en casa.']],
            ['Trabajo de lunes a viernes.', 'Dirbu nuo pirmadienio iki penktadienio.', ['Yo trabajo de lunes a viernes.']],
            ['Ella se ducha por la mañana.', 'Ji prausiasi po dušu ryte.'],
            ['Estudio español todos los días.', 'Kasdien mokausi ispanų kalbos.', ['Estudio español cada día.', 'Yo estudio español todos los días.']],
            ['Me acuesto tarde.', 'Aš vėlai einu miegoti.', ['Yo me acuesto tarde.']],
          ],
        },
        {
          id: 'u4l2', title: 'Laisvalaikis', icon: '🎧',
          words: [
            ['leer', 'skaityti'], ['escuchar', 'klausytis'], ['la música', 'muzika'], ['el fin de semana', 'savaitgalis'],
            ['correr', 'bėgioti'], ['cocinar', 'gaminti valgį'], ['ver', 'žiūrėti'], ['el libro', 'knyga'],
          ],
          sentences: [
            ['Los fines de semana veo películas.', 'Savaitgaliais žiūriu filmus.'],
            ['Me gusta leer libros.', 'Man patinka skaityti knygas.'],
            ['Escucho música en el autobús.', 'Klausausi muzikos autobuse.', ['Yo escucho música en el autobús.']],
            ['¿Qué haces hoy?', 'Ką šiandien veiki?', ['¿Qué haces tú hoy?']],
            ['Vamos a la playa.', 'Einam į paplūdimį.'],
            ['Cocino para mis amigos.', 'Gaminu valgį draugams.', ['Yo cocino para mis amigos.']],
          ],
        },
      ],
    },
    {
      id: 'u5', title: 'Mieste ir kelionėje', desc: 'Kryptys, transportas, atostogos', color: '#a66cff',
      tip: `
<h3>Kur yra? – estar</h3>
<p>Kai sakai, kur yra daiktas ar žmogus, naudok <b>estar</b>: <i>¿Dónde está el museo?</i> – Kur yra muziejus?</p>
<h3>Hay – „yra“ (egzistuoja)</h3>
<p><i>Hay un café en esta calle.</i> – Šioje gatvėje yra kavinė. <b>Hay</b> nekinta: <i>hay dos hoteles</i>.</p>
<h3>Ir a + bendratis = ketinti</h3>
<p>Paprasčiausias būdas kalbėti apie ateitį: <i>Voy a viajar</i> – keliausiu.</p>
<p>ir: voy, vas, va, vamos, vais, van.</p>`,
      lessons: [
        {
          id: 'u5l1', title: 'Kryptys', icon: '🧭',
          words: [
            ['la calle', 'gatvė'], ['la estación', 'stotis'], ['el museo', 'muziejus'], ['el hotel', 'viešbutis'],
            ['izquierda', 'kairė'], ['derecha', 'dešinė'], ['cerca', 'arti'], ['lejos', 'toli'],
          ],
          sentences: [
            ['¿Dónde está el museo?', 'Kur yra muziejus?'],
            ['El hotel está cerca.', 'Viešbutis yra arti.'],
            ['Gira a la derecha.', 'Pasuk į dešinę.'],
            ['La estación está lejos.', 'Stotis yra toli.'],
            ['Hay un café en esta calle.', 'Šioje gatvėje yra kavinė.'],
            ['Sigue todo recto.', 'Eik tiesiai.'],
          ],
        },
        {
          id: 'u5l2', title: 'Kelionė', icon: '✈️',
          words: [
            ['el avión', 'lėktuvas'], ['el tren', 'traukinys'], ['el billete', 'bilietas'], ['la maleta', 'lagaminas'],
            ['el pasaporte', 'pasas'], ['viajar', 'keliauti'], ['la playa', 'paplūdimys'], ['las vacaciones', 'atostogos'],
          ],
          sentences: [
            ['Voy a viajar a España.', 'Aš keliausiu į Ispaniją.', ['Yo voy a viajar a España.', 'Viajaré a España.']],
            ['Necesito un billete de tren.', 'Man reikia traukinio bilieto.', ['Yo necesito un billete de tren.']],
            ['¿A qué hora sale el avión?', 'Kelintą valandą išskrenda lėktuvas?'],
            ['Mi maleta es azul.', 'Mano lagaminas mėlynas.'],
            ['Me encanta viajar.', 'Aš labai mėgstu keliauti.'],
            ['Estamos de vacaciones.', 'Mes atostogaujame.', ['Nosotros estamos de vacaciones.']],
          ],
        },
      ],
    },
    {
      id: 'u6', title: 'Apsipirkimas', desc: 'Kainos, skaičiai, drabužiai', color: '#ff5c8a',
      tip: `
<h3>Skaičiai</h3>
<p>1 uno, 2 dos, 3 tres, 4 cuatro, 5 cinco, 6 seis, 7 siete, 8 ocho, 9 nueve, 10 diez</p>
<p>20 veinte, 30 treinta, 40 cuarenta, 50 cincuenta, 100 cien</p>
<p><i>¿Cuánto cuesta?</i> – Kiek kainuoja? <i>¿Cuánto cuestan?</i> – Kiek kainuoja (keli daiktai)?</p>
<h3>Spalvos derinasi</h3>
<p><i>un vestido rojo, una camisa roja, zapatos rojos</i>.</p>
<p>Spalvos, kurios baigiasi ne -o, nekeičia giminės: <i>verde, azul</i> (dgs. <i>verdes, azules</i>).</p>
<p><b>este / esta</b> – šis / ši: <i>este vestido, esta camisa</i>.</p>`,
      lessons: [
        {
          id: 'u6l1', title: 'Parduotuvėje', icon: '🛍️',
          words: [
            ['diez', 'dešimt'], ['veinte', 'dvidešimt'], ['cien', 'šimtas'], ['el euro', 'euras'],
            ['barato', 'pigus'], ['caro', 'brangus'], ['la tienda', 'parduotuvė'], ['comprar', 'pirkti'],
          ],
          sentences: [
            ['¿Cuánto cuesta?', 'Kiek kainuoja?'],
            ['Cuesta veinte euros.', 'Kainuoja dvidešimt eurų.'],
            ['Es demasiado caro.', 'Per brangu.'],
            ['Quiero comprar una camisa.', 'Noriu nusipirkti marškinius.', ['Yo quiero comprar una camisa.']],
            ['¿Puedo pagar con tarjeta?', 'Ar galiu mokėti kortele?', ['¿Se puede pagar con tarjeta?']],
            ['La tienda abre a las nueve.', 'Parduotuvė atsidaro devintą valandą.'],
          ],
        },
        {
          id: 'u6l2', title: 'Drabužiai', icon: '👗',
          words: [
            ['rojo', 'raudonas'], ['azul', 'mėlynas'], ['verde', 'žalias'], ['negro', 'juodas'],
            ['blanco', 'baltas'], ['los zapatos', 'batai'], ['el vestido', 'suknelė'], ['la talla', 'dydis'],
          ],
          sentences: [
            ['Me gusta este vestido rojo.', 'Man patinka ši raudona suknelė.'],
            ['¿Tiene otra talla?', 'Ar turite kitą dydį?'],
            ['Busco zapatos negros.', 'Ieškau juodų batų.', ['Yo busco zapatos negros.']],
            ['Las camisas blancas son baratas.', 'Balti marškiniai yra pigūs.'],
            ['Me llevo este vestido.', 'Paimsiu šią suknelę.'],
            ['¿Dónde está el probador?', 'Kur yra matavimosi kabina?'],
          ],
        },
      ],
    },
    {
      id: 'u7', title: 'Vakar', desc: 'Būtasis laikas (pretérito)', color: '#3cbf5a',
      tip: `
<h3>Pretérito indefinido</h3>
<p>Baigtas veiksmas praeityje: <i>Ayer comí paella</i> – vakar valgiau paelją.</p>
<table><tr><th></th><th>-ar (hablar)</th><th>-er / -ir (comer)</th></tr>
<tr><td>yo</td><td>hablé</td><td>comí</td></tr>
<tr><td>tú</td><td>hablaste</td><td>comiste</td></tr>
<tr><td>él / ella</td><td>habló</td><td>comió</td></tr>
<tr><td>nosotros</td><td>hablamos</td><td>comimos</td></tr>
<tr><td>ellos</td><td>hablaron</td><td>comieron</td></tr></table>
<p><b>ir</b> ir <b>ser</b> sutampa: fui, fuiste, fue, fuimos, fuisteis, fueron.</p>
<p><b>hacer</b>: hice, hiciste, hizo, hicimos, hicieron. <b>ver</b>: vi, viste, vio.</p>`,
      lessons: [
        {
          id: 'u7l1', title: 'Ką veikei?', icon: '📅',
          words: [
            ['ayer', 'vakar'], ['anoche', 'vakar vakare'], ['comí', 'valgiau'], ['hablé', 'kalbėjau'],
            ['vi', 'mačiau'], ['fui', 'nuėjau'], ['fue', 'buvo'], ['la semana pasada', 'praėjusią savaitę'],
          ],
          sentences: [
            ['Ayer comí paella.', 'Vakar valgiau paelją.', ['Ayer yo comí paella.']],
            ['Anoche vi una película.', 'Vakar vakare mačiau filmą.'],
            ['Hablé con mi madre.', 'Kalbėjau su mama.', ['Yo hablé con mi madre.']],
            ['Fuimos al cine.', 'Mes ėjome į kiną.', ['Nosotros fuimos al cine.']],
            ['¿Qué hiciste el fin de semana?', 'Ką veikei savaitgalį?'],
            ['El viaje fue increíble.', 'Kelionė buvo nuostabi.'],
          ],
        },
        {
          id: 'u7l2', title: 'Savaitgalis', icon: '🏖️',
          words: [
            ['compré', 'nusipirkau'], ['viajé', 'keliavau'], ['estuve', 'buvau'], ['tuve', 'turėjau'],
            ['hice', 'padariau'], ['el año pasado', 'praėjusiais metais'], ['después', 'po to'], ['antes', 'anksčiau'],
          ],
          sentences: [
            ['El sábado fui a la playa.', 'Šeštadienį nuėjau į paplūdimį.', ['El sábado yo fui a la playa.']],
            ['Compré un regalo para mi hermana.', 'Nupirkau dovaną sesei.', ['Yo compré un regalo para mi hermana.']],
            ['El año pasado viajé a México.', 'Praėjusiais metais keliavau į Meksiką.'],
            ['Estuve en casa todo el día.', 'Visą dieną buvau namuose.', ['Yo estuve en casa todo el día.']],
            ['Después cenamos en un restaurante.', 'Po to vakarieniavome restorane.'],
            ['¿Te gustó la película?', 'Ar tau patiko filmas?'],
          ],
        },
      ],
    },
    {
      id: 'u8', title: 'Namai', desc: 'Butas, kambariai ir namų ruoša', color: '#d9822b',
      tip: `
<h3>Kur kas yra?</h3>
<p><b>Hay</b> – kai sakai, kad kažkas yra (egzistuoja): <i>Hay dos dormitorios.</i></p>
<p><b>Estar</b> – kai sakai, kur konkretus daiktas yra: <i>Las llaves están encima de la mesa.</i></p>
<table><tr><th>ispaniškai</th><th>lietuviškai</th></tr>
<tr><td>en</td><td>-e (viduje) / ant</td></tr>
<tr><td>encima de</td><td>ant, virš</td></tr>
<tr><td>debajo de</td><td>po</td></tr>
<tr><td>al lado de</td><td>šalia</td></tr>
<tr><td>delante de / detrás de</td><td>priešais / už</td></tr></table>
<p><b>de + el = del</b>: <i>al lado del salón</i>. <b>a + el = al</b>: <i>voy al baño</i>.</p>
<h3>Tener que + bendratis</h3>
<p>„Turėti ką nors padaryti“: <i>Tengo que limpiar</i> – turiu išvalyti.</p>`,
      lessons: [
        {
          id: 'u8l1', title: 'Mano namai', icon: '🏠',
          words: [
            ['la casa', 'namas'], ['el piso', 'butas'], ['la cocina', 'virtuvė'], ['el baño', 'vonios kambarys'],
            ['el dormitorio', 'miegamasis'], ['la mesa', 'stalas'], ['la silla', 'kėdė'], ['la cama', 'lova'],
          ],
          sentences: [
            ['Mi piso es pequeño pero bonito.', 'Mano butas mažas, bet gražus.'],
            ['La cocina está al lado del salón.', 'Virtuvė yra šalia svetainės.'],
            ['Hay dos dormitorios.', 'Yra du miegamieji.'],
            ['Las llaves están encima de la mesa.', 'Raktai yra ant stalo.', ['Las llaves están en la mesa.']],
            ['El gato duerme debajo de la cama.', 'Katinas miega po lova.'],
            ['Vivo en el tercer piso.', 'Gyvenu trečiame aukšte.', ['Yo vivo en el tercer piso.', 'Vivo en la tercera planta.']],
          ],
        },
        {
          id: 'u8l2', title: 'Namų ruoša', icon: '🧹',
          words: [
            ['limpiar', 'valyti'], ['lavar', 'plauti'], ['la ropa', 'drabužiai'], ['los platos', 'indai'],
            ['la basura', 'šiukšlės'], ['la ventana', 'langas'], ['la puerta', 'durys'], ['ayudar', 'padėti'],
          ],
          sentences: [
            ['Tengo que limpiar la cocina.', 'Turiu išvalyti virtuvę.', ['Yo tengo que limpiar la cocina.']],
            ['¿Puedes lavar los platos?', 'Ar gali išplauti indus?', ['¿Tú puedes lavar los platos?', '¿Puedes fregar los platos?']],
            ['Abre la ventana, por favor.', 'Atidaryk langą, prašau.'],
            ['Mi hermano saca la basura.', 'Mano brolis išneša šiukšles.'],
            ['Hoy lavo la ropa.', 'Šiandien skalbiu drabužius.', ['Hoy yo lavo la ropa.']],
            ['¿Me ayudas?', 'Ar man padėsi?', ['¿Tú me ayudas?']],
          ],
        },
      ],
    },
    {
      id: 'u9', title: 'Oras ir metų laikai', desc: 'Orai, mėnesiai, datos', color: '#14a3c7',
      tip: `
<h3>Kalbame apie orą</h3>
<p>Dažniausiai su <b>hacer</b>: <i>hace calor</i> (karšta), <i>hace frío</i> (šalta), <i>hace sol</i> (šviečia saulė), <i>hace viento</i> (vėjuota).</p>
<p>Lyja, sninga: <i>llueve, nieva</i>, arba „dabar“: <i>está lloviendo</i>.</p>
<p>Ateitis: <i>va a llover</i> – lis, <i>va a nevar</i> – snigs.</p>
<h3>Mėnesiai</h3>
<p>enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre</p>
<p>Mėnesiai ir savaitės dienos rašomi <b>mažąja</b> raide.</p>
<p>Data: <i>el uno de enero</i> – sausio 1-oji, <i>el quince de mayo</i> – gegužės 15-oji. Kurį mėnesį: <i>en julio</i> – liepą.</p>`,
      lessons: [
        {
          id: 'u9l1', title: 'Koks oras?', icon: '☀️',
          words: [
            ['el sol', 'saulė'], ['la lluvia', 'lietus'], ['la nieve', 'sniegas'], ['el viento', 'vėjas'],
            ['el calor', 'karštis'], ['el frío', 'šaltis'], ['la nube', 'debesis'], ['el tiempo', 'oras'],
          ],
          sentences: [
            ['¿Qué tiempo hace hoy?', 'Koks šiandien oras?'],
            ['Hace mucho calor.', 'Labai karšta.'],
            ['Hace frío en invierno.', 'Žiemą šalta.', ['En invierno hace frío.']],
            ['Hoy está lloviendo.', 'Šiandien lyja.', ['Hoy llueve.']],
            ['Mañana va a nevar.', 'Rytoj snigs.'],
            ['Hace sol y no hay nubes.', 'Šviečia saulė ir nėra debesų.'],
          ],
        },
        {
          id: 'u9l2', title: 'Metų laikai', icon: '🍂',
          words: [
            ['la primavera', 'pavasaris'], ['el verano', 'vasara'], ['el otoño', 'ruduo'], ['el invierno', 'žiema'],
            ['enero', 'sausis'], ['julio', 'liepa'], ['diciembre', 'gruodis'], ['el cumpleaños', 'gimtadienis'],
          ],
          sentences: [
            ['Mi estación favorita es el verano.', 'Mano mėgstamiausias metų laikas yra vasara.'],
            ['Mi cumpleaños es en mayo.', 'Mano gimtadienis yra gegužę.'],
            ['En otoño llueve mucho.', 'Rudenį daug lyja.'],
            ['En diciembre hace mucho frío.', 'Gruodį labai šalta.'],
            ['Vamos de vacaciones en julio.', 'Liepą važiuojame atostogų.'],
            ['Hoy es el uno de enero.', 'Šiandien sausio pirmoji.', ['Hoy es uno de enero.']],
          ],
        },
      ],
    },
    {
      id: 'u10', title: 'Sveikata', desc: 'Kūnas, savijauta, vaistinė', color: '#e5484d',
      tip: `
<h3>Me duele – man skauda</h3>
<p>Veikia kaip <i>me gusta</i>: jei skauda vieną dalyką – <b>duele</b>, jei kelis – <b>duelen</b>.</p>
<p><i>Me duele la cabeza.</i> – Man skauda galvą. <i>Me duelen los pies.</i> – Man skauda pėdas.</p>
<p>Kitam žmogui: <i>te duele</i> (tau), <i>le duele</i> (jam / jai).</p>
<h3>Kaip jautiesi?</h3>
<p><i>Estoy enfermo / enferma</i> – sergu. <i>Tengo fiebre</i> – karščiuoju. <i>Tengo tos</i> – kosiu.</p>
<h3>Patarimai</h3>
<p><b>deber</b> + bendratis – „turi“ (patarimas): <i>Debes descansar.</i> – Turi pailsėti.</p>
<p>Įsakymas draugui: <i>toma</i> (imk, gerk vaistą), <i>bebe</i> (gerk), <i>descansa</i> (ilsėkis).</p>`,
      lessons: [
        {
          id: 'u10l1', title: 'Kūnas', icon: '🩺',
          words: [
            ['la cabeza', 'galva'], ['el estómago', 'skrandis'], ['la espalda', 'nugara'], ['la mano', 'ranka'],
            ['el pie', 'pėda'], ['los ojos', 'akys'], ['la garganta', 'gerklė'], ['el médico', 'gydytojas'],
          ],
          sentences: [
            ['Me duele la cabeza.', 'Man skauda galvą.'],
            ['Me duelen los pies.', 'Man skauda pėdas.'],
            ['Tengo fiebre.', 'Aš karščiuoju.', ['Yo tengo fiebre.']],
            ['Estoy enferma.', 'Aš sergu.', ['Yo estoy enferma.']],
            ['Necesito ir al médico.', 'Man reikia nueiti pas gydytoją.', ['Yo necesito ir al médico.', 'Tengo que ir al médico.']],
            ['¿Qué te pasa?', 'Kas tau yra?'],
          ],
        },
        {
          id: 'u10l2', title: 'Vaistinėje', icon: '💊',
          words: [
            ['la farmacia', 'vaistinė'], ['la pastilla', 'tabletė'], ['el resfriado', 'peršalimas'], ['la tos', 'kosulys'],
            ['la cita', 'vizitas'], ['descansar', 'ilsėtis'], ['beber', 'gerti'], ['mejor', 'geriau'],
          ],
          sentences: [
            ['¿Tiene algo para la tos?', 'Ar turite ko nors nuo kosulio?'],
            ['Toma una pastilla cada ocho horas.', 'Gerk po vieną tabletę kas aštuonias valandas.'],
            ['Tengo un resfriado.', 'Aš peršalau.', ['Yo tengo un resfriado.', 'Estoy resfriada.']],
            ['Quiero pedir una cita.', 'Noriu užsiregistruoti vizitui.', ['Yo quiero pedir una cita.']],
            ['Debes descansar y beber agua.', 'Turi ilsėtis ir gerti vandenį.', ['Tú debes descansar y beber agua.']],
            ['Ya me siento mejor.', 'Jau jaučiuosi geriau.', ['Ya me encuentro mejor.']],
          ],
        },
      ],
    },
    {
      id: 'u11', title: 'Darbas ir planai', desc: 'Darbe ir apie ateitį', color: '#6d7cff',
      tip: `
<h3>Būsimasis laikas</h3>
<p>Prie <b>visos bendraties</b> pridedame galūnę – vienodą visiems veiksmažodžiams. Keli netaisyklingi keičia kamieną: <i>tener → tendré, hacer → haré</i>.</p>
<table><tr><th></th><th>hablar</th><th>vivir</th></tr>
<tr><td>yo</td><td>hablaré</td><td>viviré</td></tr>
<tr><td>tú</td><td>hablarás</td><td>vivirás</td></tr>
<tr><td>él / ella</td><td>hablará</td><td>vivirá</td></tr>
<tr><td>nosotros</td><td>hablaremos</td><td>viviremos</td></tr>
<tr><td>ellos</td><td>hablarán</td><td>vivirán</td></tr></table>
<p>Šnekamojoje kalboje dažniau: <i>voy a + bendratis</i> (<i>voy a vivir</i>).</p>
<h3>Norai</h3>
<p><i>Quiero</i> – noriu. Mandagiau: <i>me gustaría</i> – norėčiau.</p>
<p>Profesija be artikelio: <i>Soy profesora</i> – esu mokytoja.</p>`,
      lessons: [
        {
          id: 'u11l1', title: 'Darbe', icon: '💼',
          words: [
            ['el trabajo', 'darbas'], ['la oficina', 'biuras'], ['el jefe', 'viršininkas'], ['la reunión', 'susitikimas'],
            ['el compañero', 'kolega'], ['la empresa', 'įmonė'], ['ganar', 'uždirbti'], ['el sueldo', 'atlyginimas'],
          ],
          sentences: [
            ['¿En qué trabajas?', 'Kuo dirbi?', ['¿Tú en qué trabajas?', '¿A qué te dedicas?']],
            ['Trabajo en una empresa pequeña.', 'Dirbu mažoje įmonėje.', ['Yo trabajo en una empresa pequeña.']],
            ['Tengo una reunión a las diez.', 'Dešimtą valandą turiu susitikimą.', ['Yo tengo una reunión a las diez.']],
            ['Mi jefe es muy simpático.', 'Mano viršininkas labai malonus.'],
            ['Hoy trabajo desde casa.', 'Šiandien dirbu iš namų.', ['Hoy yo trabajo desde casa.']],
            ['Mis compañeros son divertidos.', 'Mano kolegos linksmi.'],
          ],
        },
        {
          id: 'u11l2', title: 'Ateities planai', icon: '🚀',
          words: [
            ['el futuro', 'ateitis'], ['el plan', 'planas'], ['el sueño', 'svajonė'], ['aprender', 'išmokti'],
            ['mudarse', 'persikraustyti'], ['algún día', 'kada nors'], ['pronto', 'greitai'], ['el próximo año', 'kitais metais'],
          ],
          sentences: [
            ['El próximo año viviré en España.', 'Kitais metais gyvensiu Ispanijoje.', ['El año que viene viviré en España.']],
            ['Quiero aprender a bailar.', 'Noriu išmokti šokti.', ['Yo quiero aprender a bailar.']],
            ['Me gustaría viajar por el mundo.', 'Norėčiau keliauti po pasaulį.'],
            ['Algún día hablaré español muy bien.', 'Kada nors labai gerai kalbėsiu ispaniškai.'],
            ['Pronto vamos a mudarnos.', 'Greitai kraustysimės.', ['Vamos a mudarnos pronto.', 'Pronto nos vamos a mudar.']],
            ['Mi sueño es tener una casa en la playa.', 'Mano svajonė yra turėti namą prie jūros.'],
          ],
        },
      ],
    },
  ],
};
