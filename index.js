window.onload = function () {
  obtenirVistaVeterinaris();
  addEventsListeners();

  let btnAnterior = document.getElementById("btnAnterior");
  let btnPosterior = document.getElementById("btnPosterior");
  btnAnterior.addEventListener("click", paginaPrevia, false);
  btnPosterior.addEventListener("click", paginaSeguent, false);

  let cercaperNomAnimal = document.getElementById("cercaperNomAnimal");
  let cercaperTipusAnimal = document.getElementById("cercaperTipusAnimal");
  let cercaperEdat = document.getElementById("cercaperEdat");
  let cercaperCaracteristiques = document.getElementById("cercaperCaracteristiques");
  let cercaperProtectora = document.getElementById("cercaperProtectora");
  let cercaperEnfermetat = document.getElementById("cercaperEnfermetat");
  let cercaperMedicacio = document.getElementById("cercaperMedicacio");
  let cercaperPublicacio = document.getElementById("cercaperPublicacio");


  cercaperNomAnimal.addEventListener("keyup", function () {
    cerca();
  });

  cercaperTipusAnimal.addEventListener("keyup", function () {
    cerca();
  });

  cercaperEdat.addEventListener("keyup", function () {
    cerca();
  })
  cercaperCaracteristiques.addEventListener("keyup", function () {
    cerca();
  })

  cercaperProtectora.addEventListener("keyup", function () {
    cerca();
  });
  cercaperEnfermetat.addEventListener("keyup", function () {
    cerca();
  });

  cercaperMedicacio.addEventListener("keyup", function () {
    cerca();
  });
  cercaperPublicacio.addEventListener("keyup", function () {
    cerca();
  });

  const tamanyPagina = 5;
  var paginaActual = 1;
  let stringify = paginaActual.toString();
  document.getElementById("numPagina").innerHTML = stringify;

  /* async () => {
     try {*/
  /* var x = comptarResultats();
   x.then(function(result){
     console.log(result);
    let maxPagina = calcularMaxPagina(result);
    console.log("Maxim pagina arredonir" +maxPagina);
   })*/


}
//console.log(x);
var maxPagina;
var token = "865|TJhKiLPfLpjCPpKsEc0bhbpRKmpfF1HMxanPa1018fe39ef0";
let sortAsc = false;
let data, table, sortCol;
var x = comptarResultats();
x.then(function (result) {
  // console.log(result);
 maxPagina = calcularMaxPagina(result);
  console.log("Maxim pagina arredonir" + maxPagina);
})

//var sortAnimal = 'default';

//Paginacio
const tamanyPagina = 5;
var paginaActual = 1;
var paginaTotal;
var dadesTaula = new Array();



function obtenirVistaVeterinaris() {
  fetch("http://localhost:8000/api/obtenirVistaProtectora", {
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(response => {
    if (response.ok) {
      return response.json()
    } else {
      return "Error";
    }
  }).then(vistaVeterinaris => {
    data = vistaVeterinaris;
    dadesTaula.push(vistaVeterinaris);
    renderitzarTaula();
  });

}




async function comptarResultats() {
  try {
    let comptador = 0;
    const response = await fetch("http://localhost:8000/api/obtenirVistaProtectora", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const data = await response.json();

    data.forEach(comptador2 => {
      comptador++;
      console.log(comptador);
    });

    return comptador;
  } catch (error) {
    console.log("Error fetching data: " + error);
    throw error;
  }
}

//}

function renderitzarTaula() {
  let tbody = document.getElementById("tbody");
  let resultat = '';
  data.filter((row, index) => {
    let comencament = (paginaActual - 1) * tamanyPagina;
    let final = paginaActual * tamanyPagina;
    if (index >= comencament && index < final) return true;

  }).forEach(vista => {
    let enfermetats;
    let medicacions;
    let titols_publicacions;
    let fotografia;
    if (vista.enfermetats == null) {
      enfermetats = 'Cap';
    } else {
      enfermetats = vista.enfermetats;
    }

    if (vista.medicacions == null) {
      medicacions = 'Cap';
    } else {
      medicacions = vista.medicacions;
    }

    if (vista.titols_publicacions == null) {
      titols_publicacions = 'Cap';
    } else {
      titols_publicacions = vista.titols_publicacions;
    }

    if (vista.fotografia == null) {
      fotografia = "100.webp";
    } else {
      fotografia = vista.fotografia;
    }

    resultat += `<tr class="informacio">
        <td class="fotografia"><img src=${fotografia} height="100px" width="100px"/></td>
        <td class="nom" value="${vista.nom}">${vista.nom}</td>
        <td class="tipusAnimal" value="${vista.tipus_animal_nom}">${vista.tipus_animal_nom}</td>
        <td class="edat" value="${vista.edat}">${vista.edat}</td>
        <td class="caracteristiques" value="${vista.caracteristiques}">${vista.caracteristiques}</td>
        <td class="protectora" value="${vista.protectora_nom}">${vista.protectora_nom}</td>
        <td class="enfermetats" value="${enfermetats}">${enfermetats}</td>
        <td class="medicacions" value="${medicacions}">${medicacions}</td>
        <td class="publicacions" value="${titols_publicacions}">${titols_publicacions}</td>
       </tr>`
  });
  tbody.innerHTML += resultat;
}


function addEventsListeners() {
  document.querySelectorAll("#taula #capcalera #columna th").forEach(sort => {
    sort.addEventListener('click', ordenar, false);
    sort.setAttribute("clase", "ok");
  })
}

function esborrarTaula() {
  let tr = document.getElementsByClassName("informacio");
  console.log(tr.length);
  while (tr[0]) {
    let trRow = tr[0];
    trRow.parentNode.removeChild(trRow);
  }

}

function ordenar(e) {
  esborrarTaula();
  let thisSort = e.target.dataset.sort;
  if (sortCol === thisSort) sortAsc = !sortAsc;
  sortCol = thisSort;
  data.sort((a, b) => {
    if (a[sortCol] < b[sortCol]) return sortAsc ? 1 : -1;
    if (a[sortCol] > b[sortCol]) return sortAsc ? -1 : 1;
    return 0;
  });
  renderitzarTaula();
}

function netejarOrdre() {
  sortAsc = false;
  data, table, sortCol;
  sortAnimal = 'default';
}

function paginaPrevia() {
  if (paginaActual > 1) {
    paginaActual--;
    document.getElementById("numPagina").innerHTML = paginaActual;
    esborrarTaula();
    renderitzarTaula();
  }
}

function paginaSeguent() {
  if ((paginaActual * tamanyPagina) < data.length)
    paginaActual++;
  document.getElementById("numPagina").innerHTML = paginaActual;
  esborrarTaula();
  renderitzarTaula();

}
function scrapejarPaginaSeguent() {
  if ((paginaActual * tamanyPagina) < data.length) {
    paginaActual++;
    return data;
  }
}

function calcularMaxPagina(result) {
  let maxPagina = result / tamanyPagina;
  let arredonir = Math.ceil(maxPagina)
  return arredonir;
}

//Recorrer array


function cerca() {
  console.log("Cerca....");
  let cercaperNomAnimal = document.getElementById("cercaperNomAnimal");
  let cercaperTipusAnimal = document.getElementById("cercaperTipusAnimal");
  let cercaperEdat = document.getElementById("cercaperEdat");
  let cercaperCaracteristiques = document.getElementById("cercaperCaracteristiques");
  let cercaperProtectora = document.getElementById("cercaperProtectora");
  let cercaperEnfermetat = document.getElementById("cercaperEnfermetat");
  let cercaperMedicacio = document.getElementById("cercaperMedicacio");
  let cercaperPublicacio = document.getElementById("cercaperPublicacio");






  //VERSION MAS O MENOS FUNCIONAL, BUSCA EN LA PRIMERA PAGINA

  //TD clases
  let tdFotografia = document.getElementsByClassName("fotografia");
  let tdNomAnimal = document.getElementsByClassName("nom");
  let tdTipusAnimal = document.getElementsByClassName("tipusAnimal");
  let tdEdat = document.getElementsByClassName("edat");
  let tdCaracteristiques = document.getElementsByClassName("caracteristiques");
  let tdProtectora = document.getElementsByClassName("protectora");
  let tdEnfermetat = document.getElementsByClassName("enfermetats");
  let tdMedicacio = document.getElementsByClassName("medicacions");
  let tdPublicacio = document.getElementsByClassName("publicacions");

  let tr = document.getElementsByClassName("informacio");
  console.log("Array of all data: ");
  //for (let j = 1; j < maxPagina; j++) {
    for (let i = 0; i <= dadesTaula.length; i++) {
      console.log(dadesTaula[i]);
      console.log(dadesTaula);
    }
  //}

  let trinf = document.querySelectorAll("tr.informacio");
  console.log(trinf);
  console.log("Table rows: ");
  //let maxPagines = calcularMaxPagina();

  // for(let i=0; i<=maxPagines;i++){

  //}
  for(let k=0; k < dadesTaula.length ;k++){
   // for (let j = 0; j < tr.length; j++) {
      console.log(tr[k]);
      let filtreNomAnimal = cercaperNomAnimal.value.toLowerCase();
      let filtreTipusAnimal = cercaperTipusAnimal.value.toLowerCase();
      let filtreEdat = cercaperEdat.value.toLowerCase();
      let filtreCaracteristiques = cercaperCaracteristiques.value.toLowerCase();
      let filtreProtectora = cercaperProtectora.value.toLowerCase();
      let filtreEnfermetat = cercaperEnfermetat.value.toLowerCase();
      let filtreMedicacio = cercaperMedicacio.value.toLowerCase();
      let filtrePublicacio = cercaperPublicacio.value.toLowerCase();
  
  
      let nom = tdNomAnimal[k].innerHTML;
      let tipusAnimal = tdTipusAnimal[k].innerHTML;
      let edat = tdEdat[k].innerHTML;
      let caracteristiques = tdCaracteristiques[k].innerHTML;
      let protectora = tdProtectora[k].innerHTML;
      let enfermetat = tdEnfermetat[k].innerHTML;
      let medicacio = tdMedicacio[k].innerHTML;
      let publicacio = tdPublicacio[k].innerHTML;
      console.log(tipusAnimal);
      if (nom && tipusAnimal && edat && caracteristiques && protectora && enfermetat && medicacio && publicacio) {
        let campNom = nom.toLowerCase();
        let campTipusAnimal = tipusAnimal.toLowerCase();
        let campEdat = edat.toLowerCase();
        let campCaracteristiques = caracteristiques.toLowerCase();
        let campProtectora = protectora.toLowerCase();
        let campEnfermetat = enfermetat.toLowerCase();
        let campMedicacio = medicacio.toLowerCase();
        let campPublicacio = publicacio.toLowerCase();
  
        //console.log("Resultat: "+campNom.includes(filtreNomAnimal));
        if (campNom.includes(filtreNomAnimal) == true &&
          campTipusAnimal.includes(filtreTipusAnimal) == true &&
          campEdat.includes(filtreEdat) == true &&
          campCaracteristiques.includes(filtreCaracteristiques) == true &&
          campProtectora.includes(filtreProtectora) == true &&
          campEnfermetat.includes(filtreEnfermetat) == true &&
          campMedicacio.includes(filtreMedicacio) == true &&
          campPublicacio.includes(filtrePublicacio)) {
          tr[k].style.display = "";
        } else {
          tr[k].style.display = "none";
        }
      }
  
    }
  }



  ///PRUEBAS

  //let tr = document.getElementsByClassName("informacio");

  //Datos de todas las paginas
  /* let tdProtectora = document.getElementsByClassName("protectora");
 
   for (let i = 0; i < dadesTaula.length; i++) {
     console.log(dadesTaula[i]);
     let filtreNomAnimal = cercaperNomAnimal.value.toLowerCase();
     let filtreTipusAnimal = cercaperTipusAnimal.value.toLowerCase();
     let filtreEdat = cercaperEdat.value.toLowerCase();
     let filtreCaracteristiques = cercaperCaracteristiques.value.toLowerCase();
     let filtreProtectora = cercaperProtectora.value.toLowerCase();
     let filtreEnfermetat = cercaperEnfermetat.value.toLowerCase();
     let filtreMedicacio = cercaperMedicacio.value.toLowerCase();
     let filtrePublicacio = cercaperPublicacio.value.toLowerCase();
 
 
     let protectora = dadesTaula[i].protectora;
    console.log(protectora);
     let campProtectora = protectora.toLowerCase();
 
     if(campProtectora.includes(filtreProtectora)==true){
       dadesTaula[i].style.display="";
     }else{
       dadesTaula[i].style.display="none";
     }
 
   }*/

  //
