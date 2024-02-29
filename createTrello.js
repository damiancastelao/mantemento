/**
 * El trigger se hace desde el menu
 * lanza esta funcion cuando se envia
 */
function onEnviado(e) {
    // crear card mediante la API
    // e.values: Array de los valores enviados
    // e.namedValues: Object de los valores con los nombres de los campos
    createTrelloCard(e.values)
}

/**
 * Sends an email que crea una card
 */
function sendEmails(valores) {
    var emailTrello = "damiannogueiras+3hozxotp3jf8cnacct0l@boards.trello.com"
    // test
    var emailTest = "damian@danielcastelao.org"
    // titulo de la card y etiqueta
    var emailSubject = "respuesta" //valores //.Resumen + " #recibida"
    var emailBody = valores
    MailApp.sendEmail(emailTest, emailSubject, emailBody);
}

/**
 * Utiliza la API para crear card en recibidas
 * Orden de las columnas
 *  0 - marca temporal
 *  1 - Dirección de correo electrónico
 *  2 - Resumen
 *  3 - Lugar
 *  4 - Equipo
 *  5 - Momento
 *  6 - Descripcion
 */

function createTrelloCard(valores) {

    // var board_id  = "65297feb0e28569a5a4f740b";
    var url = "https://api.trello.com/1/";
    // no mandamos el correo, registramos nombre de personas
    var autor = nombreByEmail(valores[1])
    var resumen = valores[2]
    var contenido =
        '\n---\n\n' +
        'Descripcion: ' + valores[6] + '\n' +
        '\n---\n\n' +
        'Lugar: ' + valores[3] + '\n' +
        'Equipo: ' + valores[4] + '\n' +
        'Momento: ' + valores[5] + '\n' +
        '\n---\n\n' +
        'Autor: ' + autor

    //POST [/1/cards], Required permissions: write
    var payload = {
        "name": resumen, //(required) Valid Values: a string with a length from 1 to 16384
        "desc": contenido, //(optional)Valid Values: a string with a length from 0 to 16384
        "pos": "top", //(optional) Default: bottom Valid Values: A position. top, bottom, or a positive number.
        "due": "", //(required) Valid Values: A date, or null
        "idList": "65297feb0e28569a5a4f740b", // Recibidas (required)Valid Values: id of the list that the card should be added to
        // "labels": "6528d025e17b46d74da2b49d"//, id label separadas por coma(optional)
        //"idMembers": ,//(optional)Valid Values: A comma-separated list of objectIds, 24-character hex strings
        "idCardSource": "653bf3eeb95fd71077a93c10",//template
        //"keepFromSource": ,//(optional)Default: all Valid Values: Properties of the card to copy over from the source.
    };

    // Because payload is a JavaScript object, it will be interpreted as
    // an HTML form. (We do not need to specify contentType; it will
    // automatically default to either 'application/x-www-form-urlencoded'
    // or 'multipart/form-data')
    var url = 'https://api.trello.com/1/cards?key=' + api_key + '&token=' + api_token //optional... -&cards=open&lists=open'-
    var options = {
        "method": "post",
        "payload": payload
    };

    var response = UrlFetchApp.fetch(url, options)
    // la respuesta es del tipo (ver fichero) card.json
    var responseJSON = JSON.parse(response.getContentText())
    // la podemos mandar por correo para verificar
    // sendEmails(responseJSON.shortUrl)
}

/**
 * devuelve nombre por email
 * @return nombre del autor
 * @param email del autor
 */
function nombreByEmail(email) {
    // test
    // email = "damian@danielcastelao.org"
    // abrimos la hoja datos
    var hojaDatos = SpreadsheetApp.openById("1-_-z_xqOFyFuZNlwWfNdUnowMeUTZ0qKxG9OWK7hKQs")
    // buscamos el range segun texto email
    var tf = hojaDatos.createTextFinder(email)
    // buscamos la celda nombre, la segunda
    var nombre = hojaDatos.getSheetValues(tf.findAll()[0].getRow(), 2, 1, 1)
    // Logger.log(nombre[0])
    return nombre
}
