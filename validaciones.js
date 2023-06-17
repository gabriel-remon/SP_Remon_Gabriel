// Función de validación: solo texto
export function validarTexto(e) {
    const valor = e.target.value;
    const soloTexto = /\S/.test(valor);
  
    if (soloTexto) {
      e.target.style.borderColor = 'green'; 
    } else {
        e.target.style.borderColor = 'red'; 
      }

  }
  
  // Función de validación: solo números
export  function validarMayorA0(e) {
    const valor = e.target.value;
    const soloNumeros = /^\d+$/.test(valor);

    if (soloNumeros && parseInt(valor) >0) {
      e.target.style.borderColor = 'green'; 
    } else {
        e.target.style.borderColor = 'red'; 
      }
  }
export  function validarMayorAmenos1(e) {
    const valor = e.target.value;
    const soloNumeros = /^\d+$/.test(valor);

    if (soloNumeros && parseInt(valor) >-1) {
      e.target.style.borderColor = 'green'; 
    } else {
        e.target.style.borderColor = 'red';
      }
  }
export  function validarMayorAmenos1885(e) {
    const valor = e.target.value;
    const soloNumeros = /^\d+$/.test(valor);

    if (soloNumeros &&parseInt(valor) >1885) {
      e.target.style.borderColor = 'green';
    } else {
        e.target.style.borderColor = 'red';
      }
  }
  
