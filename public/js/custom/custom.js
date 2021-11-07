$(document).ready(function(){
  /**
   * Registered
   */
  var estados = "<option value='' disabled selected>Elija el estado</option>";

  for (var key in municipios) {
      if (municipios.hasOwnProperty(key)) {
          estados = estados + "<option value='" + key + "'>" + key + "</option>";
      }
  }

  $('#estado').html(estados);

  $( "#estado" ).change(function() {
    var html = "<option value='' disabled selected>Elija la ciudad</option>";
    $( "#estado option:selected" ).each(function() {
        var estado = $(this).text();
        if(estado != "Elija el estado"){
            var municipio = municipios[estado];
            for (var i = 0; i < municipio.length; i++)
                html += "<option value='" + municipio[i] + "'>" + municipio[i] + "</option>";
        }
    });
    $('#municipio').html(html);
})
.trigger( "change" );
  /**
   * Register
   */
   var estados = "<option value='' disabled selected>Elija el estado</option>";

  for (var key in municipios) {
      if (municipios.hasOwnProperty(key)) {
          estados = estados + "<option value='" + key + "'>" + key + "</option>";
      }
  }

  $('#estado2').html(estados);

  // Al detectar
  $( "#estado2" ).change(function() {
      var html = "<option value='' disabled selected>Elija la ciudad</option>";
      $( "#estado2 option:selected" ).each(function() {
          var estado = $(this).text();
          if(estado != "Elija el estado"){
              var municipio = municipios[estado];
              for (var i = 0; i < municipio.length; i++)
                  html += "<option value='" + municipio[i] + "'>" + municipio[i] + "</option>";
          }
      });
      $('#municipio2').html(html);
  })
  .trigger( "change" );
});

var municipios = {
  "Amazonas":[
          "Maroa",
          "Puerto Ayacucho",
          "San Fernando de Atabapo"
      ],
  "Anzoátegui":[
          "Anaco",
          "Aragua de Barcelona",
          "Barcelona",
          "Boca de Uchire",
          "Cantaura",
          "Clarines",
          "El Chaparro",
          "El Pao Anzoátegui",
          "El Tigre",
          "El Tigrito",
          "Guanape",
          "Guanta",
          "Lecherí­a",
          "Onoto",
          "Pariaguán",
          "Puerto Pí­ritu",
          "Sabana de Uchire",
          "San Mateo Anzoátegui",
          "San Pablo Anzoátegui",
          "San Tomé",
          "Santa Ana de Anzoátegui",
          "Santa Fe Anzoátegui",
          "Santa Rosa",
          "Soledad",
          "Urica",
          "Valle de Guanape"
      ],
  "Apure":[
          "Achaguas",
          "Biruaca",
          "Bruzual",
          "El Amparo",
          "El Nula",
          "Elorza",
          "Guasdualito",
          "Mantecal",
          "Puerto Páez",
          "San Fernando de Apure",
          "San Juan de Payara"
      ],
  "Aragua":[
          "Barbacoas",
          "Cagua",
          "Camatagua",
          "Choroní­",
          "Colonia Tovar",
          "El Consejo",
          "La Victoria",
          "Las Tejerí­as",
          "Magdaleno",
          "Maracay",
          "Ocumare de la Costa",
          "Palo Negro",
          "San Casimiro",
          "San Mateo",
          "San Sebastián",
          "Santa Cruz de Aragua",
          "Tocorón",
          "Turmero",
          "Villa de Cura",
          "Zuata"
      ],
  "Barinas":[
          "Barinas",
          "Barinitas",
          "Barrancas",
          "Calderas",
          "Capitanejo",
          "Ciudad Bolivia",
          "El Cantón",
          "Las Veguitas",
          "Libertad de Barinas",
          "Sabaneta",
          "Santa Bárbara de Barinas",
          "Socopó"
      ],
  "Bolí­var":[
          "Caicara del Orinoco",
          "Canaima",
          "Ciudad Bolí­var",
          "Ciudad Piar",
          "El Callao",
          "El Dorado",
          "El Manteco",
          "El Palmar",
          "El Pao",
          "Guasipati",
          "Guri",
          "La Paragua",
          "Matanzas",
          "Puerto Ordaz",
          "San Félix",
          "Santa Elena de Uairén",
          "Tumeremo",
          "Unare",
          "Upata"
      ],
  "Carabobo":[
          "Bejuma",
          "Belén",
          "Campo de Carabobo",
          "Canoabo",
          "Central Tacarigua",
          "Chirgua",
          "Ciudad Alianza",
          "El Palito",
          "Guacara",
          "Guigue",
          "Las Trincheras",
          "Los Guayos",
          "Mariara",
          "Miranda",
          "Montalbán",
          "Morón",
          "Naguanagua",
          "Puerto Cabello",
          "San Joaquí­n",
          "Tocuyito",
          "Urama",
          "Valencia",
          "Vigirimita"
      ],
  "Cojedes":[
          "Aguirre",
          "Apartaderos Cojedes",
          "Arismendi",
          "Camuriquito",
          "El Baúl",
          "El Limón",
          "El Pao Cojedes",
          "El Socorro",
          "La Aguadita",
          "Las Vegas",
          "Libertad de Cojedes",
          "Mapuey",
          "Piñedo",
          "Samancito",
          "San Carlos",
          "Sucre",
          "Tinaco",
          "Tinaquillo",
          "Vallecito"
      ],
    "Delta Amacuro":[
          "Tucupita"
         
      ],
    
  "Distrito Capital":[
          "Caracas",
          "El Junquito"
      ],
  "Falcón":[
          "Adí­cora",
          "Boca de Aroa",
          "Cabudare",
          "Capadare",
          "Capatárida",
          "Chichiriviche",
          "Churuguara",
          "Coro",
          "Cumarebo",
          "Dabajuro",
          "Judibana",
          "La Cruz de Taratara",
          "La vela de Coro",
          "Los Taques",
          "Maparari",
          "Mene de Mauroa",
          "Mirimire",
          "Pedregal",
          "Pí­ritu Falcón",
          "Pueblo nuevo Falcón",
          "Puerto Cumarebo",
          "Punta Cardón",
          "Punto Fijo",
          "San Juan de los Cayos",
          "San Luis",
          "Santa Ana Falcón",
          "Santa Cruz de Bucaral",
          "Tocopero",
          "Tocuyo de la Costa",
          "Tucacas",
          "Yaracal"
      ],
  "Guárico":[
          "Altagracia de Orituco",
          "Cabruta",
          "Calabozo",
          "Camaguán",
          "Chaguaramas Guárico",
          "El Socorro",
          "El Sombrero",
          "Las mercedes de los llanos",
          "Lezama",
          "Onoto",
          "Ortí­z",
          "San José de Guaribe",
          "San Juan de los Morros",
          "San Rafael de Laya",
          "Santa Marí­a de Ipire",
          "Tucupido",
          "Valle de la Pascua",
          "Zaraza"
      ],
  "Lara":[
          "Aguada Grande",
          "Atarigua",
          "Barquisimeto",
          "Bobare",
          "Cabudare",
          "Carora",
          "Cubiro",
          "Cují­",
          "Duaca",
          "El Manzano",
          "El Tocuyo",
          "Guarí­co",
          "Humocaro Alto",
          "Humocaro Bajo",
          "La Miel",
          "Moroturo",
          "Quí­bor",
          "Rí­o Claro",
          "Sanare",
          "Santa Inés",
          "Sarare",
          "Siquisique",
          "Tintorero"

      ],
  "Mérida":[
          "Apartaderos Mérida",
          "Arapuey",
          "Bailadores",
          "Caja Seca",
          "Canaguá",
          "Chachopo",
          "Chiguara",
          "Ejido",
          "El Vigí­a",
          "La Azulita",
          "La Playa",
          "Lagunillas Mérida",
          "Mérida",
          "Mesa de Bolí­var",
          "Mucuchí­es",
          "Mucujepe",
          "Mucuruba",
          "Nueva Bolivia",
          "Palmarito",
          "Pueblo Llano",
          "Santa Cruz de Mora",
          "Santa Elena de Arenales",
          "Santo Domingo",
          "Tabáy",
          "Timotes",
          "Torondoy",
          "Tovar",
          "Tucani",
          "Zea"
      ],
  "Miranda":[
          "Araguita",
          "Carrizal",
          "Caucagua",
          "Chaguaramas Miranda",
          "Charallave",
          "Chirimena",
          "Chuspa",
          "Cúa",
          "Cupira",
          "Curiepe",
          "El Guapo",
          "El Jarillo",
          "Filas de Mariche",
          "Guarenas",
          "Guatire",
          "Higuerote",
          "Los Anaucos",
          "Los Teques",
          "Los Salias",
          "Ocumare del Tuy",
          "Panaquire",
          "Paracotos",
          "Rí­o Chico",
          "San Antonio de los Altos",
          "San Diego de los Altos",
          "San Francisco de Yare",
          "San José de los Altos",
          "San José de Rí­o Chico",
          "San Pedro de los Altos",
          "Santa Lucí­a",
          "Santa Teresa",
          "Tacarigua de la Laguna",
          "Tacarigua de Mamporal",
          "Tácata",
          "Turumo"
      ],
  "Monagas":[
          "Aguasay",
          "Aragua de Maturí­n",
          "Barrancas del Orinoco",
          "Caicara de Maturí­n",
          "Caripe",
          "Caripito",
          "Chaguaramal",
          "Chaguaramas Monagas",
          "El Furrial",
          "El Tejero",
          "Jusepí­n",
          "La Toscana",
          "Maturí­n",
          "Miraflores",
          "Punta de Mata",
          "Quiriquire",
          "San Antonio de Maturí­n",
          "San Vicente Monagas",
          "Santa Bárbara",
          "Temblador",
          "Teresen",
          "Uracoa"
      ],
  "Nueva Esparta":[
          "Altagracia",
          "Boca de Pozo",
          "Boca de Rí­o",
          "El Espinal",
          "El Valle del Espí­ritu santo",
          "El Yaque",
          "Juangriego",
          "La Asunción",
          "La Guardia",
          "Pampatar",
          "Porlamar",
          "Puerto Fermí­n",
          "Punta de Piedras",
          "San Francisco de Macanao",
          "San Juan Bautista",
          "San Pedro de Coche",
          "Santa Ana",
          "Villa Rosa"
      ],
  "Portuguesa":[
          "Acarigua",
          "Agua Blanca",
          "Araure",
          "Biscucuy",
          "Boconoito",
          "Campo Elí­as",
          "Chabasquén",
          "Guanare",
          "Guanarito",
          "La Aparición",
          "La Misión",
          "Mesa de Cavacas",
          "Ospino",
          "Papelón",
          "Payara",
          "Pimpinela",
          "Pí­ritu de Portuguesa",
          "San Rafael de Onoto",
          "Santa Rosalí­a",
          "Turén"
      ],
  "Sucre":[
          "Altos de Sucre",
          "Araya",
          "Cariaco",
          "Carúpano",
          "Casanay",
          "Cumaná",
          "Cumanacoa",
          "El Morro Puerto Santo",
          "El Pilar",
          "El Poblado",
          "Guaca",
          "Guiria",
          "Irapa",
          "Manicuare",
          "Mariguitar",
          "Rí­o Caribe",
          "San Antonio del Golfo",
          "San José de Aerocuar",
          "San Vicente de Sucre",
          "Santa Fe de Sucre",
          "Tunapuy",
          "Yaguaraparo",
          "Yoco"
      ],
  "Táchira":[
          "Abejales",
          "Borota",
          "Bramon",
          "Capacho",
          "Colón",
          "Coloncito",
          "Cordero",
          "El Cobre",
          "El Pinal",
          "Independencia",
          "La Frí­a",
          "La Grita",
          "La Pedrera",
          "La Tendida",
          "Las Delicias",
          "Las Hernández",
          "Lobatera",
          "Michelena",
          "Palmira",
          "Pregonero",
          "Queniquea",
          "Rubio",
          "San Antonio del Táchira",
          "San Cristóbal",
          "San José de Bolí­var",
          "San Josecito",
          "San Pedro del Rí­o",
          "Santa Ana Táchira",
          "Seboruco",
          "Táriba",
          "Umuquena",
          "Ureña"
      ],
  "Trujillo":[
          "Batatal",
          "Betijoque",
          "Boconó",
          "Carache",
          "Chejende",
          "Cuicas",
          "El Dividive",
          "El Jaguito",
          "Escuque",
          "Isnotú",
          "Jajó",
          "La Ceiba",
          "La Concepción de Trujillo",
          "La Mesa de Esnujaque",
          "La Puerta",
          "La Quebrada",
          "Mendoza Frí­a",
          "Meseta de Chimpire",
          "Monay",
          "Motatán",
          "Pampán",
          "Pampanito",
          "Sabana de Mendoza",
          "San Lázaro",
          "Santa Ana de Trujillo",
          "Tostós",
          "Trujillo",
          "Valera"
      ],
  "Vargas":[
          "Carayaca",
          "Catia La Mar",
          "La Guaira",
          "Litoral",
          "Macuto",
          "Naiguatá"  
      ],
  "Yaracuy":[
          "Aroa",
          "Boraure",
          "Campo Elí­as de Yaracuy",
          "Chivacoa",
          "Cocorote",
          "Farriar",
          "Guama",
          "Marí­n",
          "Nirgua",
          "Sabana de Parra",
          "Salom",
          "San Felipe",
          "San Pablo de Yaracuy",
          "Urachiche",
          "Yaritagua",
          "Yumare",
      ],
  "Zulia":[
          "Bachaquero",
          "Bobures",
          "Cabimas",
          "Campo Concepción",
          "Campo Mara",
          "Campo Rojo",
          "Carrasquero",
          "Casigua",
          "Chiquinquirá",
          "Ciudad Ojeda",
          "El Batey",
          "El Carmelo",
          "El Chivo",
          "El Guayabo",
          "El Mene",
          "El Venado",
          "Encontrados",
          "Gibraltar",
          "Isla de Toas",
          "La Concepción del Zulia",
          "La Paz",
          "La Sierrita",
          "Lagunillas del Zulia",
          "Las Piedras de Perijá",
          "Los Cortijos",
          "Machiques",
          "Maracaibo",
          "Mene Grande",
          "Palmarejo",
          "Paraguaipoa",
          "Potrerito",
          "Pueblo Nuevo del Zulia",
          "Puertos de Altagracia",
          "Punta Gorda",
          "Sabaneta de Palma",
          "San Francisco",
          "San José de Perijá",
          "San Rafael del Moján",
          "San Timoteo",
          "Santa Bárbara del Zulia",
          "Santa Rita",
          "Sinamaica",
          "Tamare",
          "Tí­a Juana",
          "Villa del Rosario"
      ],
}

// Custom
$(document).ready(function() {
    $('#registered').click(function() {
        $('#form_one').addClass('active');
        if ($('#form_two').hasClass('active')) {
            $('#form_two').removeClass('active');
        }
    })

    $('#register').click(function() {
        $('#form_two').addClass('active');
        if ($('#form_one').hasClass('active')) {
            $('#form_one').removeClass('active');
        }
    })
})

// Materialize Initialization
$(document).ready(function(){

$('#carousel-header.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true
});

function initCarousel() {
    $('#carousel-modal.carousel.carousel-slider').carousel({
        duration: 100,
        indicators: true
    });

    $('#carousel-modal-single.carousel.carousel-slider').carousel({
        fullWidth: true,
        duration: 100,
        indicators: true
    });
}

$('.modal').modal({
    onOpenEnd: initCarousel,
    preventScrolling: true
})

$('.dropdown-trigger').dropdown();
$('.tooltipped').tooltip();
$('.select').formSelect();
$('.materialboxed').materialbox();
$('.sidenav').sidenav();
$('.fixed-action-btn').floatingActionButton();
})

/**
 * Query selector
 * @param {string} element
 * @returns {Object}
 */
 const elmSelect = (element) => document.querySelector(element);

 /**
  * Query selector all
  * @param {String} element
  * @returns {Object}
  */
 const elmSelectAll = (element) => document.querySelectorAll(element);

/**
 * Notification initialization
 * @param {String} toggleElm
 * @param {String} notifyElm
 * @param {Number} timeValue
 * @returns {Object}
 */
 const notifications = (toggleElm, notifyElm, timeValue) => {
    const toggle = elmSelect(toggleElm);
    const notification = elmSelect(notifyElm);
    const time = parseInt(timeValue) || 3000;

    if(toggle && notification && time) {
        toggle.addEventListener('click', () => {
            notification.classList.remove('is-active');
            notification.classList.add('is-hidden');
        });
        setTimeout(function() {
            notification.classList.remove('is-active');
            notification.classList.add('is-hidden');
        }, time);
    }
}

notifications('.notification-toggle', '.notification');

/**
 * Navigation initialization
 * @param {String} toggleElm
 * @param {String} navElm
 * @returns {Object}
 */
 const showNavigation = (toggleElm, navElm) => {
    const toggle = elmSelect(toggleElm);
    const nav = elmSelect(navElm);
    const links = elmSelectAll('#nav-link');
    if (toggle && nav && links) {
        elmSelect('.nav-toggle').addEventListener('click', () => {
            elmSelect('.navigation').classList.toggle('active');
        });
        links.forEach(e => {
            e.onclick = () => {
                nav.classList.remove('active');
            }
        })
    }
}
showNavigation('.nav-toggle', '.navigation');

/**
 * Counter numbers
 * @param {String} elm 
 * @param {Number} speedValue 
 */

 const counters = (elm, speedValue) => {
    const number = elmSelectAll(elm);
    const speed = speedValue || 100000;

    if (number && speed) {
        number.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-value');
                const data = +counter.innerText;

                const time = value / speed;
                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 45);
                } else {
                    counter.innerText = value;
                }
            }
            animate();
        })
    }
}

counters('.counters');