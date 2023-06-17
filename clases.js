export class Spinner {
    #spinnerElement;
  
    constructor() {
    const spiner = document.createElement('div');
    spiner.classList.add('spinner');

    const newElement = document.createElement('div');
    newElement.classList.add('overlay');
    
    newElement.appendChild(spiner)
      this.#spinnerElement = newElement
    }
  
    add() {
      document.body.appendChild(this.#spinnerElement);
    }
  
    remove() {
      if (this.#spinnerElement.parentNode === document.body) {
        document.body.removeChild(this.#spinnerElement);
      }
    }
  }
  
  export class Vehiculo {

    constructor(id, modelo, anoFab, velMax) {

        if (!id || !modelo || !anoFab || !velMax) {
            throw new Error("uno de los campos del vehiculo es null");
        }
        if (id < -1 || anoFab < 1885|| velMax < 0) {
            throw new Error("error en los datos id,anoFab o velMax");
        }

        if (typeof modelo !== 'string' ) {
            throw new Error("error con el dato modelo");
        }

        this.id = parseInt(id)
        this.anoFab = parseInt(anoFab)
        this.velMax = parseInt(velMax)
        this.modelo = modelo
    }
}

export class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax)

        if (!altMax || !autonomia ) {
            throw new Error("uno de los campos del vehiculo aereo es null");
        }
        if (altMax < 0 || autonomia < 0) {
            throw new Error("la propiedad altMax y autonomia no son validas");
        }

        altMax = parseInt(altMax)
        autonomia = parseInt(autonomia)

        this.altMax = altMax
        this.autonomia = autonomia
    }
}

export class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax)
        if (cantPue === null ||  cantRue === null) {
            throw new Error("uno de los campos del vehiculo terrestre es null");
        }
        if (cantPue < -1 || cantRue < 0) {
            throw new Error("la propiedad cantPue o cantRue no son validas");
        }
      
        cantPue = parseInt(cantPue)
        cantRue = parseInt(cantRue)

        this.cantPue = cantPue
        this.cantRue = cantRue
    }
}
