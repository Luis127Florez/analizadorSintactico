const gorArray = ["IMPLEMENT", "EXECUTE"];

const identificadores = [
  "IMPLEMENT",
  "EXECUTE",
  "ALL",
  "INSERT",
  "SELECT",
  "DELETE",
  "UPDATE",
  "DELETE",
  "AUTHORIZATION",
  "FROM",
  "TOWARDS",
];
const privilegios = ["ALL", "INSERT", "SELECT", "DELETE", "UPDATE", "DELETE"];

// Tokenizar
const tokenizer = (input) => {
  let tokens = [];
  let current = 0;

  if (input[input.length - 1] === ";") {
    input += " ";
  } else {
    input = input + "; ";
  }

  while (current < input.length - 1) {
    const currentChar = input[current];

    const WHITESPACE = /\s+/;
    if (WHITESPACE.test(currentChar)) {
      current++;
      continue;
    }

    if (currentChar === ";") {
      let token = {
        code: "001",
        type: "MARCADOR",
        value: ";",
        position: current,
      };
      tokens.push(token);
      generarLexico("001", ";", "MARCADOR");
      current++;
      continue;
    }

    const LETTER = /[a-zA-Z]/;
    if (LETTER.test(currentChar)) {
      let letters = currentChar;

      while (LETTER.test(input[++current])) {
        letters += input[current];
      }

      if (identificadores.includes(letters)) {
        tokens.push({
          code: "002",
          type: "IDENTIFICADOR",
          value: letters,
          position: current,
        });
        generarLexico("002", letters, "IDENTIFICADOR");
        continue;
      }

      tokens.push({
        code: "003",
        type: "TEXTO",
        value: letters,
        position: current,
      });
      generarLexico("003", letters, "TEXTO");
      continue;
    }

    if (
      currentChar === "," ||
      currentChar === "'" ||
      currentChar === "*" ||
      currentChar === "." ||
      currentChar === "@" ||
      currentChar === "_"
    ) {
      let token = {
        code: "004",
        type: "SYMBOLS",
        value: currentChar,
        position: current,
      };
      tokens.push(token);
      generarLexico("004", currentChar, "SYMBOLS");
      current++;
      continue;
    }

    generarLexico("ERROR", currentChar, "NO SE RECONOCE");
    break;
  }

  return tokens;
};

function limpiarTexto() {
  $("#codigo").val("");
  $("#contenedorSalida").hide("fast");
  $("#codigo").focus();
}

function cargarLineas(text, textSplit) {
  var lineas = new Array();
  tamanio = 0;
  for (let index = 0; index < textSplit.length; index++) {
    for (let jndex = 0; jndex < textSplit[index].length + 1; jndex++) {
      if (text[tamanio] != undefined) {
        lineas.push({
          linea: index,
          posicion: tamanio,
          texto: text[tamanio],
        });
        tamanio += 1;
      }
    }
  }
  return lineas;
}

function mostrarError(lineas, posicion, tipoError, msgError, linea) {
  linea +=
    "<span class='text-danger fw-bold text-decoration-underline'>" +
    tipoError +
    " </span>";
  $("#salida").html(
    "<div>Se esperaba '" +
      msgError +
      "' , no un -> " +
      tipoError +
      "</div><div> ERROR en la linea " +
      (lineas[posicion - 1].linea + 1) +
      ", en la posicion -> " +
      (posicion - 1) +
      "</div><div class='bg-warning'>" +
      linea +
      "</div>"
  );
}

function generarLexico(code, value, token) {
  tabla = "<tr>";
  tabla += '<th scope="row">' + code + "</th>";
  tabla += "<td>" + value + "</td>";
  tabla += "<td>" + token + "</td>";
  tabla += "</tr>";
  $("#salidaLexico").append(tabla);
}

function generarSintactico(tipo, type, value, msg) {
  $("#salidaSintactico").append(
    "<div>" +
      type +
      " <strong class='text-" +
      tipo +
      "'>" +
      msg +
      " -> </strong>" +
      value +
      "</div>"
  );
}

function analizarCodigo() {
  $("#salidaLexico").html("");
  $("#salidaSintactico").html("");
  arrayLinea = tokenizer($("#codigo").val());
  text = $("#codigo").val();
  if (text == "" || text == null) {
    $("#salida").html(
      "<strong class='bg-warning'>SIN LÍNEAS DE CÓDIGO, ESCRIBE O PEGA EL CÓDIGO A ANALIZAR</strong>"
    );
  } else {
    const textSplit = text.split("\n");

    lineas = cargarLineas(text, textSplit);
    lineaHtml = "";
    //PARSER PARA IMPLEMENT O EXECUTE
    for (let index = 0; index < arrayLinea.length; index++) {
      //IMPLEMENT O EXECUTE
      if (gorArray.includes(arrayLinea[index].value)) {
        generarSintactico(
          "success",
          arrayLinea[index].type,
          arrayLinea[index].value,
          "Correcto"
        );
        lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
        index += 1;
        //AUTHORIZATION
        if (privilegios.includes(arrayLinea[index].value)) {
          generarSintactico(
            "success",
            arrayLinea[index].type,
            arrayLinea[index].value,
            "Correcto"
          );
          lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
          index += 1;
          //PRIVILEGE
          if (arrayLinea[index].value == "AUTHORIZATION") {
            generarSintactico(
              "success",
              arrayLinea[index].type,
              arrayLinea[index].value,
              "Correcto"
            );
            lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
            index += 1;
            //FROM
            if (arrayLinea[index].value == "FROM") {
              generarSintactico(
                "success",
                arrayLinea[index].type,
                arrayLinea[index].value,
                "Correcto"
              );
              lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
              index += 1;
              //TABLE
              if (arrayLinea[index].type == "TEXTO") {
                generarSintactico(
                  "success",
                  arrayLinea[index].type,
                  arrayLinea[index].value,
                  "Correcto"
                );
                lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
                index += 1;
                //TOWARDS
                if (arrayLinea[index].value == "TOWARDS") {
                  generarSintactico(
                    "success",
                    arrayLinea[index].type,
                    arrayLinea[index].value,
                    "Correcto"
                  );
                  lineaHtml += "<span>" + arrayLinea[index].value + " </span>";
                  index += 1;
                  //'
                  if (arrayLinea[index].value == "'") {
                    generarSintactico(
                      "success",
                      arrayLinea[index].type,
                      arrayLinea[index].value,
                      "Correcto"
                    );
                    lineaHtml +=
                      "<span>" + arrayLinea[index].value + " </span>";
                    index += 1;
                    //TEXTO
                    if (arrayLinea[index].type == "TEXTO") {
                      generarSintactico(
                        "success",
                        arrayLinea[index].type,
                        arrayLinea[index].value,
                        "Correcto"
                      );
                      lineaHtml +=
                        "<span>" + arrayLinea[index].value + " </span>";
                      index += 1;
                      //'
                      if (arrayLinea[index].value == "'") {
                        generarSintactico(
                          "success",
                          arrayLinea[index].type,
                          arrayLinea[index].value,
                          "Correcto"
                        );
                        lineaHtml +=
                          "<span>" + arrayLinea[index].value + " </span>";
                        index += 1;
                        //@
                        if (arrayLinea[index].value == "@") {
                          generarSintactico(
                            "success",
                            arrayLinea[index].type,
                            arrayLinea[index].value,
                            "Correcto"
                          );
                          lineaHtml +=
                            "<span>" + arrayLinea[index].value + " </span>";
                          index += 1;
                          //'
                          if (arrayLinea[index].value == "'") {
                            generarSintactico(
                              "success",
                              arrayLinea[index].type,
                              arrayLinea[index].value,
                              "Correcto"
                            );
                            lineaHtml +=
                              "<span>" + arrayLinea[index].value + " </span>";
                            index += 1;
                            //TEXTO
                            if (arrayLinea[index].type == "TEXTO") {
                              generarSintactico(
                                "success",
                                arrayLinea[index].type,
                                arrayLinea[index].value,
                                "Correcto"
                              );
                              lineaHtml +=
                                "<span>" + arrayLinea[index].value + " </span>";
                              index += 1;
                              //'
                              if (arrayLinea[index].value == "'") {
                                generarSintactico(
                                  "success",
                                  arrayLinea[index].type,
                                  arrayLinea[index].value,
                                  "Correcto"
                                );
                                lineaHtml +=
                                  "<span>" +
                                  arrayLinea[index].value +
                                  " </span>";
                                index += 1;
                                //;
                                if (arrayLinea[index].type == "MARCADOR") {
                                  $("#salida").html(
                                    "<div class='bg-success text-light'>GRAMÁTICA CORRECTA</div>"
                                  );
                                  generarSintactico(
                                    "success",
                                    arrayLinea[index].type,
                                    arrayLinea[index].value,
                                    "Correcto"
                                  );
                                  break;
                                } else {
                                  mostrarError(
                                    lineas,
                                    arrayLinea[index].position,
                                    arrayLinea[index].value,
                                    ";",
                                    lineaHtml
                                  );
                                  generarSintactico(
                                    "danger",
                                    arrayLinea[index].type,
                                    arrayLinea[index].value,
                                    "Incorrecto"
                                  );
                                  break;
                                }
                              } else {
                                mostrarError(
                                  lineas,
                                  arrayLinea[index].position,
                                  arrayLinea[index].value,
                                  "COMILLA SIMPLE",
                                  lineaHtml
                                );
                                generarSintactico(
                                  "danger",
                                  arrayLinea[index].type,
                                  arrayLinea[index].value,
                                  "Incorrecto"
                                );
                                break;
                              }
                            } else {
                              mostrarError(
                                lineas,
                                arrayLinea[index].position,
                                arrayLinea[index].type,
                                "TEXTO",
                                lineaHtml
                              );
                              generarSintactico(
                                "danger",
                                arrayLinea[index].type,
                                arrayLinea[index].value,
                                "Incorrecto"
                              );
                              break;
                            }
                          } else {
                            mostrarError(
                              lineas,
                              arrayLinea[index].position,
                              arrayLinea[index].value,
                              "COMILLA SIMPLE",
                              lineaHtml
                            );
                            generarSintactico(
                              "danger",
                              arrayLinea[index].type,
                              arrayLinea[index].value,
                              "Incorrecto"
                            );
                            break;
                          }
                        } else {
                          mostrarError(
                            lineas,
                            arrayLinea[index].position,
                            arrayLinea[index].value,
                            "@",
                            lineaHtml
                          );
                          generarSintactico(
                            "danger",
                            arrayLinea[index].type,
                            arrayLinea[index].value,
                            "Incorrecto"
                          );
                          break;
                        }
                      } else {
                        mostrarError(
                          lineas,
                          arrayLinea[index].position,
                          arrayLinea[index].value,
                          "COMILLA SIMPLE",
                          lineaHtml
                        );
                        generarSintactico(
                          "danger",
                          arrayLinea[index].type,
                          arrayLinea[index].value,
                          "Incorrecto"
                        );
                        break;
                      }
                    } else {
                      mostrarError(
                        lineas,
                        arrayLinea[index].position,
                        arrayLinea[index].type,
                        "TEXTO",
                        lineaHtml
                      );
                      generarSintactico(
                        "danger",
                        arrayLinea[index].type,
                        arrayLinea[index].value,
                        "Incorrecto"
                      );
                      break;
                    }
                  } else {
                    mostrarError(
                      lineas,
                      arrayLinea[index].position,
                      arrayLinea[index].value,
                      "COMILLA SIMPLE",
                      lineaHtml
                    );
                    generarSintactico(
                      "danger",
                      arrayLinea[index].type,
                      arrayLinea[index].value,
                      "Incorrecto"
                    );
                    break;
                  }
                } else {
                  mostrarError(
                    lineas,
                    arrayLinea[index].position,
                    arrayLinea[index].value,
                    "TOWARDS",
                    lineaHtml
                  );
                  generarSintactico(
                    "danger",
                    arrayLinea[index].type,
                    arrayLinea[index].value,
                    "Incorrecto"
                  );
                  break;
                }
              } else {
                mostrarError(
                  lineas,
                  arrayLinea[index].position,
                  arrayLinea[index].type,
                  "TEXTO",
                  lineaHtml
                );
                generarSintactico(
                  "danger",
                  arrayLinea[index].type,
                  arrayLinea[index].value,
                  "Incorrecto"
                );
                break;
              }
            } else {
              mostrarError(
                lineas,
                arrayLinea[index].position,
                arrayLinea[index].value,
                "FROM",
                lineaHtml
              );
              generarSintactico(
                "danger",
                arrayLinea[index].type,
                arrayLinea[index].value,
                "Incorrecto"
              );
              break;
            }
          } else {
            mostrarError(
              lineas,
              arrayLinea[index].position,
              arrayLinea[index].value,
              "AUTHORIZATION",
              lineaHtml
            );
            generarSintactico(
              "danger",
              arrayLinea[index].type,
              arrayLinea[index].value,
              "Incorrecto"
            );
            break;
          }
        } else {
          mostrarError(
            lineas,
            arrayLinea[index].position,
            arrayLinea[index].value,
            "ALL, SELECT, INSERT, UPDATE, o DELETE",
            lineaHtml
          );
          generarSintactico(
            "danger",
            arrayLinea[index].type,
            arrayLinea[index].value,
            "Incorrecto"
          );
          break;
        }
      } else {
        mostrarError(
          lineas,
          arrayLinea[index].position,
          arrayLinea[index].value,
          "IMPLEMENT o EXECUTE",
          lineaHtml
        );
        generarSintactico(
          "danger",
          arrayLinea[index].type,
          arrayLinea[index].value,
          "Incorrecto"
        );
        break;
      }
    }
  }
}

//Textarea
function update() {
  let line = 1;
  let text = document.querySelector("#codigo").value;
  document.querySelector(".line").innerHTML = " ";
  text.split("\n").map(() => {
    //aquí rompo el texto y recorro para ir añadiendo el numero
    document.querySelector(".line").innerHTML += "<p>" + line + "</p>";
    line++;
  });
}
window.onload = () => {
  let editor = document.querySelector(".editor");
  let text = document.querySelector("#codigo");
  let line = document.querySelector(".line");
  //agrego un evento de scroll para mover ambos scroll al tiempo (el del editor y el del textarea)
  document.querySelector("#codigo").addEventListener("scroll", () => {
    let k = editor.scrollHeight / text.scrollHeight; //usando proporción para mover simultáneamente ambos scrolls
    editor.scrollTop = text.scrollTop * k;
  });
};
