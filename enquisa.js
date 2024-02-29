/**
 * Manda formularios a los trabajadores
 */
function mandaForm(){
    // repite cinco veces
    for (let i = 0; i < 5; i++) {
        // genera numero aleatorio
        let n = generaAleatorio(1, 33)
        // busca email segun fila
        let email = emailByFila(n)
        // manda formulario
        enviarFormulario("damian@danielcastelao.org",email)
    }
}

function generaAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
* Guarda los numeros aleatorios para que no se repitan
*/
function guardarAleatorios(aleatorios) {
    //
}

/**
 * Busca email segun fila
 */
function emailByFila(fila) {
    // Busca en la hoja de calculo Datos
    let spreadsheet = SpreadsheetApp.openById("1-_-z_xqOFyFuZNlwWfNdUnowMeUTZ0qKxG9OWK7hKQs");
    let sheet = spreadsheet.getSheetByName("trabajadores");
    // obtener datos columnas A y B
    // buscar por valor de la columna A (email)

    let data = sheet.getRange('A' + fila + ':B' + fila).getValues();
    Logger.log(data)
    return(data[0][0])
}

/**
 * Manda formulario
 */
function enviarFormulario(email, cuerpo) {
    // No he podido incrustar el form en el email, asi que lo mando como html
    // copido de un correo
    // load html file
    let formHTLM = HtmlService.createHtmlOutputFromFile("satisfaccion.html").getContent();
    GmailApp.sendEmail(email, "Enquisa Mantemento", "", {
        htmlBody: formHTLM,
        from: "mantemento@danielcastelao.org"
    });

}