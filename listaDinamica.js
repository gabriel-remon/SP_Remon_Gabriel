/**
* 
* @param {array} lista lista de objetos 
* @param {array} filtros nombre de las key que no se mostraran del objeto
* 
* consigue todas las key de la lista de objetos sin contar las que coinciden con la lista
* de fitltros y crea un encabezado estilo Thead. tambien agrega un evento click al Thead
* el cual al momento de precionar cualquier pocicion de este renderiza toda la tabla ordenando la 
* misma con el atributo seleccionado
* 
* @returns {HTMLTableSectionElement} thead con las key de los objetos
*/
export function getThead(lista, filtros) {
    const categorys = getCategory(lista, filtros)
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')
    categorys.forEach(category => {
        const th = document.createElement('th')
        th.textContent = category
        tr.appendChild(th)
    })
    thead.appendChild(tr)

    return thead
}

/**
* 
* @param {array} lista lista de objetos 
* @param {array} filtros nombre de las key que no se mostraran del objeto
* 
* esta funcion recibe como parametro una lista de objetos y una lista de filtros
* primero se consiguen todas las key de la lista y luego se van mostrando en la posicion de cada key
* el valor que consitiene, si hay un objeto que no tiene una de las key se muestra el valor "--"
* luego retorna un tbody con todo el contenido
* 
* @returns {HTMLTableSectionElement} Tbody con el contendio de la lista de objetos 
*/
export function getTbody(lista, filtros) {
    const categorys = getCategory(lista, filtros)
    const tbody = document.createElement('tbody')

    lista.forEach(element => {
        const tr = document.createElement('tr')
        tr.setAttribute('elementId', element.id)

        //aca se agrega el encavezado
        categorys.forEach(category => {
            const td = document.createElement('td')
            if (category in element) {
                td.textContent = element[category]
            }
            else {
                td.textContent = "N/A"
            }
            tr.appendChild(td)
        })
        var tipo = "null"
        if ( 'altMax' in element)
        tipo = "aereo"
        if ( 'cantPue' in element)
        tipo = "terrestre"

        const eliminar = document.createElement('button')
        eliminar.setAttribute('elementId', element.id)
        eliminar.textContent = 'eliminar'
        eliminar.setAttribute('tipoElement', tipo)
        tr.appendChild(eliminar)

        const modificar = document.createElement('button')
        modificar.setAttribute('tipoElement', tipo)
        modificar.setAttribute('elementId', element.id)
        modificar.textContent = 'modificar'
        tr.appendChild(modificar)
   
        tbody.appendChild(tr)
    })

    return tbody
}



/**
* 
* @param {array} lista lista de objetos 
* @param {array} filtros nombre de las key que no se mostraran del objeto
* 
* consigue todas las key que incluyen los objetos de un array 
* 
* @returns array de string de las keys de la lista de objetos
*/
function getCategory(lista, filtros) {
    const categorys = new Array()
    lista.forEach(element => {
        Object.keys(element).forEach(category => {
            if (!filtros || !filtros.includes(category)) {
                if (!categorys.includes(category))
                    categorys.push(category)
            }

        })
    });
    return categorys
}