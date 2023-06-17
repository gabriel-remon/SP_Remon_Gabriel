import { Aereo, Terrestre, Spinner } from './clases.js'
import { getTbody, getThead } from './listaDinamica.js'
import { validarMayorA0, validarMayorAmenos1, validarMayorAmenos1885, validarTexto } from './validaciones.js';

const spinner = new Spinner();
const datosAlmacenados = []
/**
    clase1: aereo,   
    clase2: terrestre,    
    atributo1Clase1 : altMax,   
    atributo2Clase1 : autonomia,   
    atributo1Clase2 : cantPue,  
    atributo2Clase2 : CantRue  ,       
    url_get: http://localhost:8080/vehiculoAereoTerrestre.php,      
    url_put: http://localhost:8080/vehiculoAereoTerrestre.php,  
    url_post: http://localhost:8080/vehiculoAereoTerrestre.php,         
    url_delete: http://localhost:8080/vehiculoAereoTerrestre.php,
 */
const env = {
    clase1: 'aereo',
    clase2: 'terrestre',
    atributo1Clase1: 'altMax',
    atributo2Clase1: 'autonomia',
    atributo1Clase2: 'cantPue',
    atributo2Clase2: 'cantRue',
    url_get: 'http://localhost:8080/vehiculoAereoTerrestre.php',
    url_put: 'http://localhost:8080/vehiculoAereoTerrestre.php',
    url_post: 'http://localhost:8080/vehiculoAereoTerrestre.php',
    url_delete: 'http://localhost:8080/vehiculoAereoTerrestre.php',
}

const formDatos = document.getElementById('form-container')
//calcular edad 

const inputEdad = document.getElementById('inputEdad')
//sellecionar tipo de objetos a mostrar
const categoria = document.getElementById('categoria')
//tabla donde se mostraran
const tabla = document.getElementById('tabla')
//div y checkbox de los filtroa a aplicar
const divFiltro = document.getElementById('filtros')
const checkbox = document.querySelectorAll("input[type='checkbox']")
//boton para abrir el abm
const btnAbm = document.getElementById('getAbm')

//form del abm
const formAbm = document.getElementById('abm')
const accionAbm = document.getElementById('accionAbm')
//categorias abm
const categoriaAbm = document.getElementById('categoriaAbm')
const clase1Abm = document.getElementById('clase1Abm')
const clase2Abm = document.getElementById('clase2Abm')
//inputs abm
const inputsAbm = document.querySelectorAll('form input')
//botones del abm
const btnAgregar = document.getElementById('aceptar')
getLista()

//--------------------------------------------funciones--------------------------------------------

function instanciarVehiculo(vehiculo) {

    const element = vehiculo
    let retorno;

    if ('altMax' in element) retorno = new Aereo(
        element.id,
        element.modelo,
        element.anoFab,
        element.velMax,
        element.altMax,
        element.autonomia)
    else retorno = new Terrestre(
        element.id,
        element.modelo,
        element.anoFab,
        element.velMax,
        element.cantPue,
        element.cantRue)
    return retorno
}

function getLista() {

    spinner.add()
    fetch(env.url_put, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => {
            spinner.remove();
            if (res.status == 200) {

                res.json()
                    .then(data => {
                        data.forEach(element => {
                            element = instanciarVehiculo(element)


                            datosAlmacenados.push(element)
                        });
                        //datosAlmacenados = responseData;
                        actualizarTabla(getFiltros());
                    })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: `status: ${xhr.status}`,
                    text: 'no se pudo actualizar la lista',
                })

            }

        })
        .catch(err => {
            spinner.remove();
            Swal.fire({
                icon: 'error',
                title: `Error en la solicitud`,
                text: err,
            })
        })
}

function altaVehiculo(vehiculo) {


    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onerror = function () {
        Swal.fire({
            icon: 'error',
            title: `Error en la solicitud, status: ${xhr.status}`,
            text: xhr.statusText,
        })
    };

    xhr.open('PUT', env.url_get, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            spinner.remove();
            if (xhr.status === 200) {
                vehiculo.id = xhr.response.id;
                datosAlmacenados.push(instanciarVehiculo(vehiculo));
                actualizarTabla(getFiltros())
                mostrarTabla()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: `status: ${xhr.status}`,
                    text: 'no se pudo realizar el alta la lista',
                })
            }

        }
    };

    spinner.add();
    xhr.send(JSON.stringify(vehiculo))

}

async function ModificarVehiculo(vehiculo) {
    try {
        spinner.add()
        const res = await fetch(env.url_post, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehiculo)
        })
        spinner.remove()
        if (res.status == 200) {
            const index = datosAlmacenados.findIndex(element => element.id == vehiculo.id)
            datosAlmacenados[index] = instanciarVehiculo(vehiculo)
            actualizarTabla(getFiltros())
            mostrarTabla()
            Swal.fire({
                icon: 'success',
                title: `Vehiculo modificada`,
                text: `se modifico con exito la vehiculo con id: ${vehiculo.id}`

            })

        } else {
            Swal.fire({
                icon: 'error',
                title: `Error en la solicitud`,
                text: res.status

            })
        }
    } catch (err) {
        spinner.remove()
        Swal.fire({
            icon: 'error',
            title: `Error en la solicitud`,
            text: err
        })
    }
}


function eliminarVehiculo(id) {

    
                mostrarTabla()
                spinner.add()

                fetch(env.url_delete, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                })

                    .then((res) => {
                        spinner.remove()

                        if (res.status == 200) {
                            Swal.fire(
                                'Deleted!',
                                'Vehiculo eliminado',
                                'success'
                            )

                            const index = datosAlmacenados.findIndex(element => element.id == id)
                            datosAlmacenados.splice(index, 1)
                            actualizarTabla(getFiltros())

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: `Error en la solicitud`,
                                text: res.status

                            })
                        }
                    })
                    .catch(e => {
                        spinner.remove()
                        Swal.fire({
                            icon: 'error',
                            title: `Error en la solicitud`,
                            text: e,
                        })
                    })
}

/**
* 
* @param {array} data lista de objetos 
* 
* calcula la edad de todos los objetos que tengan la propiedad edad como uno de sus paramatros
* 
* @returns {int} promedio de edades
* 
*/
function cargarVehiculoInputs(id) {

    datosAlmacenados.forEach(element => {
        if(element.id == id){
            inputsAbm[0].value = element.id
            inputsAbm[1].value = element.modelo
            inputsAbm[2].value = element.anoFab
            inputsAbm[3].value = element.velMax
            inputsAbm[1].style.borderColor = 'green'
            inputsAbm[2].style.borderColor = 'green'
            inputsAbm[3].style.borderColor = 'green'
            if (element instanceof Aereo){
                inputsAbm[4].value = element.altMax
                inputsAbm[5].value = element.autonomia
                inputsAbm[4].style.borderColor = 'green'
                inputsAbm[5].style.borderColor = 'green'
            }else{
                inputsAbm[6].value = element.cantPue
                inputsAbm[7].value = element.cantRue
                inputsAbm[6].style.borderColor = 'green'
                inputsAbm[7].style.borderColor = 'green'
            }
        }
    });
}

/**
* 
* @param {array} data lista de objetos 
* @param {array} filtros nombre de las key que no se mostraran del objeto
* 
* actualiza todos los valores de la tabla (Thead y Tbody) pasandole como parametro
* una lista de objetos y los filttos a plicar (las keys que no se mostraran)
* ----(esta funcion solo funciona con este proyecto)----
* 
*/
function actualizarTabla(filtros, tablaAux) {

    limpiarTabla()
    if (tablaAux && tablaAux.length > 0) {
        tabla.appendChild(getThead(tablaAux, filtros))
        tabla.appendChild(getTbody(tablaAux, filtros))
    } else {
        if (datosAlmacenados.length > 0) {
            tabla.appendChild(getThead(datosAlmacenados, filtros))
            tabla.appendChild(getTbody(datosAlmacenados, filtros))
        } else {
            const div = document.createElement("div")
            div.classList.add("recuadro")
            div.textContent = "No hay ningún dato guardado"
            tabla.appendChild(div)
        }
    }
}

/**
* 
* limpia todos los valores del objeto tabla
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function limpiarTabla() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
}

/**
* 
* consigue el valor de todos los checkbox de form datos siempre y cuanto esten con la propiedad
* checked y retorna un array de string con todos los calores
* -----(esta funcion solo funciona con este proyecto)-------
* 
* @returns {array} array de string de los valores de los checkbox de form datos
*/
function getFiltros() {
    const filtro = new Array()
    const checkboxArray = Array.from(checkbox)
    checkboxArray.forEach(element => {
        if (!element.checked) {
            filtro.push(element.value)
        }
    })
    return filtro
}


/**
* 
* agrega las clases 'hide' a los checbok de form datos que no correspondan a los 
* atributos vinculadodos con vendedor, a la vez quita la clase 'hide' de los checkbox
* que si correspondan a una propiedad del vendedor
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarClase1() {
    checkbox[4].parentNode.classList.remove('hide')//1° atributo unico clase 1
    checkbox[5].parentNode.classList.remove('hide')//2° atributo unico clase 1
    checkbox[6].parentNode.classList.add('hide')//1° atributo unico clase 2
    checkbox[7].parentNode.classList.add('hide')//2° atributo unico clase 2

}

/**
* 
* agrega las clases 'hide' a los checbok de form datos que no correspondan a los 
* atributos vinculadodos con cliente, a la vez quita la clase 'hide' de los checkbox
* que si correspondan a una propiedad del cliente
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarClase2() {
    checkbox[4].parentNode.classList.add('hide')//1° atributo unico clase 1
    checkbox[5].parentNode.classList.add('hide')//2° atributo unico clase 1
    checkbox[6].parentNode.classList.remove('hide')//1° atributo unico clase 2
    checkbox[7].parentNode.classList.remove('hide')//2° atributo unico clase 2

}
/**
* 
* elimina todas las clases hide de los checkbox de form datos
* mostrando todos los checkbox
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarTodo() {
    checkbox[4].parentNode.classList.remove('hide')//1° atributo unico clase 1
    checkbox[5].parentNode.classList.remove('hide')//2° atributo unico clase 1
    checkbox[6].parentNode.classList.remove('hide')//1° atributo unico clase 2
    checkbox[7].parentNode.classList.remove('hide')//2° atributo unico clase 2
}


/**
* 
* muestra el form de datos ocultando el form amb
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarTabla() {
    formDatos.classList.remove('hide')
    formAbm.classList.add('hide')
}

/**
* 
* muestra el form de amb ocultando el form datos
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarAbm() {
    formDatos.classList.add('hide')
    formAbm.classList.remove('hide')
}

/**
* 
* limpia todos los valores de los inputs del abm 
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function limpiarAbm() {
    limpiarValidaciones()
    for (let i = 0; i < inputsAbm.length; i++) {
        inputsAbm[i].value = ""
    }
}

/**
* 
* oculta los input que corresponden al form abm de cliente y muestra unicamente los de vendedor
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarClase1Abm() {
    clase2Abm.classList.add('hide')
    clase1Abm.classList.remove('hide')
}

/**
* 
* oculta los input que corresponden al form abm de vendedor y muestra unicamente los de clientes
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
function mostrarClase2Abm() {
    clase2Abm.classList.remove('hide')
    clase1Abm.classList.add('hide')
}


function validarVehiculo() {
    if (
        inputsAbm[1].style.borderColor && inputsAbm[1].style.borderColor == 'green' &&
        inputsAbm[2].style.borderColor && inputsAbm[2].style.borderColor == 'green' &&
        inputsAbm[3].style.borderColor && inputsAbm[3].style.borderColor == 'green'
    ) {
        return true
    }
    return false
}
function validarClase1() {
    if (validarVehiculo() &&
        inputsAbm[4].style.borderColor && inputsAbm[4].style.borderColor == 'green' &&
        inputsAbm[5].style.borderColor && inputsAbm[5].style.borderColor == 'green') {
        return true
    }
    return false
}
function validarClase2() {
    if (validarVehiculo() &&
        inputsAbm[6].style.borderColor && inputsAbm[6].style.borderColor == 'green' &&
        inputsAbm[7].style.borderColor && inputsAbm[7].style.borderColor == 'green') {
        return true
    }
    return false
}

function limpiarValidaciones() {

    for (var i = 0; i < inputsAbm.length; i++) {
        inputsAbm[i].style.borderColor = 'black'
    }
}
//--------------------------------------------callbacks--------------------------------------------



/**
* 
* pregunta el valor actual de la etiqueta select y dependiendo la respuesta renderiza la tabla
* y oculta los checkbox correspondientes para que solo se muestran los checkbox que correnponda a 
* los datos que se mostraran en la tabla. tambien renderiza la pagina con los filtros actuales si es que hay
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
const eventoCambioCategoria = e => {
    if (e.target.tagName !== 'SELECT') {
        return
    }

    const eleccion = e.target.value

    if (eleccion === 'todos') {
        actualizarTabla(getFiltros())
        mostrarTodo()
    }

    if (eleccion === env.clase2) {

        actualizarTabla(getFiltros(), datosAlmacenados.filter(element => {
            if (env.atributo1Clase2 in element)
                return element
        }))
        mostrarClase2()
    }
    if (eleccion === env.clase1) {
        actualizarTabla(getFiltros(), datosAlmacenados.filter(element => {
            if (env.atributo1Clase1 in element)
                return element
        }))
        mostrarClase1()
    }


}

/**
* 
* pregunta si el e.target es un input y si lo es llama al metodo 'actualizarTabla'
* y al metodo 'getFiltros' para renderizar la tabla con los nuevos parametros
* -----(esta funcion solo funciona con este proyecto)-------
* 
*/
const eventoGetCheckbox = e => {
    if (e.target.tagName === 'INPUT')
        actualizarTabla(getFiltros())
}

/**
* 
* al invocar este metodo se ocultara form datos y se mostrara form abm 
* con todos los datos de form amb con la intencion de agregar una nueva vehiculo 
* tambien se eliminaran cualquier clase 'hide' de los elementos que componen form.
* tambien se ocultaran los botones modificar, eliminar y se ocultara el input id
* 
*/
const eventoMostrarAbm = e => {
    accionAbm.textContent = "agregar"
    mostrarAbm()
    limpiarAbm()
    //    btnModificar.classList.add('hide')
    //    btnEliminar.classList.add('hide')
    btnAgregar.classList.remove('hide')
    categoriaAbm.classList.remove('hide')
    inputsAbm[0].parentNode.classList.add('hide')
}


/**
* 
* manejador del submit del form amb, compruba que boton se preciono y realiza la accion
* correspondiente, luego vuelve a la tabla de form datos con los datos actualizados 
* 
*/
const eventoManejadorAbm = e => {
    try {
        e.preventDefault()
        const accion = accionAbm.textContent
        const botonActivador = e.submitter.value
        if (botonActivador == 'aceptar') {
            if (accion == "eliminar") {
                eliminarVehiculo(inputsAbm[0].value)
            } 
            else {

                const vehiculo = {
                    modelo: inputsAbm[1].value,
                    anoFab: inputsAbm[2].value,
                    velMax: inputsAbm[3].value,
                }
                if (categoriaAbm.value == env.clase1) {
                    if (!validarClase1()) throw new Error(`los cambos de ${env.clase1} no son validos`);
                    vehiculo[env.atributo1Clase1] = inputsAbm[4].value
                    vehiculo[env.atributo2Clase1] = inputsAbm[5].value
                } else {
                    if (!validarClase2()) throw new Error(`los cambos de ${env.clase2} no son validos`);
                    vehiculo[env.atributo1Clase2] = inputsAbm[6].value
                    vehiculo[env.atributo2Clase2] = inputsAbm[7].value
                }

                switch (accion) {
                    case 'agregar':
                        altaVehiculo(vehiculo)
                        break
                    case 'modificar':
                        vehiculo.id = inputsAbm[0].value
                        ModificarVehiculo(vehiculo)
                        break
                }
            }
            mostrarTodo()

        } else {
        }
        categoria.value = 'todos'
        mostrarTabla()
        limpiarAbm()
        categoriaAbm.classList.remove('hide')

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: `error en el abm`,
            text: err.message,
        })
    }
}

const eventoSeleccionarCategoriaAbm = e => {
    const eleccion = e.target.value
    if (eleccion === env.clase1) {
        mostrarClase1Abm()
    }
    if (eleccion === env.clase2) {
        mostrarClase2Abm()
    }
}

const callbackTabla = e => {
    if(e.target.tagName === "BUTTON"){

        const id = e.target.getAttribute('elementId')
        accionAbm.textContent = e.target.textContent
        inputsAbm[0].parentNode.classList.remove('hide')
        categoriaAbm.classList.add('hide')
        inputsAbm[0].value = id
        const tipo = e.target.getAttribute('tipoElement')
        if (tipo == 'aereo') mostrarClase1Abm()
        else mostrarClase2Abm()
        categoriaAbm.value = tipo
        cargarVehiculoInputs(id)
        mostrarAbm()
    }
}
//--------------------------------------------eventos de form datos--------------------------------------------

tabla.addEventListener('click',callbackTabla)

categoria.addEventListener('change', eventoCambioCategoria)

divFiltro.addEventListener('click', eventoGetCheckbox)

btnAbm.addEventListener('click', eventoMostrarAbm)

//--------------------------------------------eventos de form abm--------------------------------------------

formAbm.addEventListener('submit', eventoManejadorAbm)

categoriaAbm.addEventListener('change', eventoSeleccionarCategoriaAbm)


// validaciones inputs abm
//validaciones vehiculo
inputsAbm[1].addEventListener('blur', validarTexto)
inputsAbm[2].addEventListener('blur', validarMayorAmenos1885)
inputsAbm[3].addEventListener('blur', validarMayorA0)
inputsAbm[4].addEventListener('blur', validarMayorA0) //propiedad 1 clase 1
inputsAbm[5].addEventListener('blur', validarMayorA0) //propiedad 2 clase 1
inputsAbm[6].addEventListener('blur', validarMayorAmenos1) //propiedad 1 clase 2
inputsAbm[7].addEventListener('blur', validarMayorA0) //propiedad 2 clase 2
