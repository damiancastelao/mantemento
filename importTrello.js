/**
 * Podemos ejecutarlo desde Trello regularmente o dispararlo con un evento
 * https://script.google.com/u/0/home/projects/102tGCHh7Ujw8YXRhlhcJF-5E-MFKW488Y_QqZxztqRvVDPfjwYDRYgq9/triggers
 */

// campos etiquetas
var etiquetas = {
    Prioridad: "",
    Tipo: ""
}
function importCardsIncidencias()
{
    // configuracion
    var board_id  = "6528d025c1a65fb35b8d57ea";
    var url       = "https://api.trello.com/1/";
    rows = ["Id","Tarea","Descripcion", "Lugar","Equipo","Momento","Quien","Link","Prioridad","Tipo","Estado","Fecha Inicio","Fecha Fin", "Finalizada", "Dias"]


    //limpiamos la hoja "Todas" y le ponemos cabecera
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Todas");
    spreadsheet.clear();
    spreadsheet.appendRow(rows);

    //obtenemos los datos de Trello
    var response = UrlFetchApp.fetch(url + "boards/" + board_id + "/lists?cards=all&key=" + api_key + "&token=" + api_token);
    var lists = JSON.parse((response.getContentText()));

    for (var i = 0 ; i < lists.length ; i++) {
      // si es la lista de anteriores la saltamos
      if (lists[i].id == "6540a91125ce0175b8f32327") {
        // comprobamos si es la ultima
        if (i == lists.length-1) {
          break
        } else {
          i++
        }
      }

        var list = lists[i];
        var response = UrlFetchApp.fetch(url + "list/" + list.id + "/cards?key=" + api_key + "&token=" + api_token);
        var cards = JSON.parse(response.getContentText());
        if(!cards) continue;

        for (var j = 0; j < cards.length; j++)
        {
          var card = cards[j];
          var response = UrlFetchApp.fetch(url + "cards/" + card.id + "/?actions=all&key=" + api_key + "&token=" + api_token);
 
          // Logger.log(response.getContentText())
          // Logger.log(card.desc)
          var datos = descToObect(card.desc)
          // etiqueta prioridad y tipo
          getEtiquetas(card.labels)
          var inicio = new Date(card.start)
          var final = new Date(card.due)
          // var final = Utilities.formatDate(new Date(card.due),'GMT+0','dd-MMM HH-mm')
          var day_as_milliseconds = 86400000
          var diff_in_millisenconds = final - inicio;
          var diff_in_days = (diff_in_millisenconds / day_as_milliseconds).toFixed(1);

        // añadimos a la hoja de calculo
        // rows = ["Id","Tarea","Lugar","Equipo","Momento","Quien","Link","Prioridad","Tipo","Estado","Fecha Inicio","Fecha Fin", "Finalizada", "Duracion"]
        spreadsheet.appendRow([card.shortLink, card.name,datos.Descripcion, datos.Lugar, datos.Equipo, datos.Momento, datos.Autor, card.shortUrl, etiquetas.Prioridad, etiquetas.Tipo, list.name, inicio, final, card.dueComplete, diff_in_days]);

        }
    }
}

/**
 * Obtiene etiqueta prioridad
 */
function getEtiquetas(labels){
  // Logger.log(labels)

  for (var i = 0; i < labels.length; i++) {
    /*switch (true) {
      case /alta/.test(labels[i].name) : 
        etiquetas.Prioridad = "alta"
        break
      case /media/.test(labels[i].name) : 
        etiquetas.Prioridad = "media"
        break
      case /baja/.test(labels[i].name) : 
        etiquetas.Prioridad = "baja"
        break
    }*/
      if (/\[prioridad\]/.test(labels[i].name)) {
          etiquetas.Prioridad = labels[i].name.replace(/\[prioridad\] /,"")
      }

     if (/\[tipo\]/.test(labels[i].name)) {
          etiquetas.Tipo = labels[i].name.replace(/\[tipo\] /,"")
  }

  }
}

/**
 * Con la cadena de descripción creamos un objeto con los datos
 */
function descToObect(desc){
  var cadena = desc
  // quitamos ineas markdown
  // convertimos en Array segun \n
  var cadena = cadena.replaceAll("---", "")
  //cadena = cadena.replaceAll("\n---","")
  var arr = cadena.split("\n")
  // Logger.log(arr)

  // cada elemento del Array en otro Array(2)
  // para despues poder pasarlo a objeto
  var arr2 = []
  var index = 0
  for (let i = 0; i < arr.length; i++) {
      // Logger.log(arr[i])
      // si esta vacio, no lo paso
      if (arr[i] != "") {
          arr2[index] = arr[i].split(": ",2)
          index++
      }
  }
  // Logger.log(arr2)
  // Array to Object
  return Object.fromEntries(arr2)
}
