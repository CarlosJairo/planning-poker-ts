/** primera validacion */
const validMinMaxCharacters = (
  texto: string,
  min: number,
  max: number
): boolean => {
  if (texto.length >= min && texto.length <= max) return true;
  return false;
};

/** segunda validacion */

const validNoCharactersSpecials = (texto: string): boolean => {
  if (texto.match(/\W/) === null) return true;
  return false;
};

/** tercera validacion */

const maxLengtNumbersInCharacters = (
  texto: string,
  maxNumber: number
): boolean => {
  let cantNumber = 0;
  for (let i = 0; i < texto.length; i++) {
    if (Number.isInteger(parseInt(texto.charAt(i)))) {
      cantNumber++;
    }
  }
  if (cantNumber <= maxNumber) return true;
  return false;
};

/** Cuarta validacion */

const noOnlyNumbersInCharacters = (texto: string): boolean => {
  if (/^([0-9])*$/.test(texto)) return false;
  return true;
};

export const validInputCreatePartida = (texto: string): boolean => {
  if (
    validMinMaxCharacters(texto, 5, 20) &&
    validNoCharactersSpecials(texto) &&
    maxLengtNumbersInCharacters(texto, 3) &&
    noOnlyNumbersInCharacters(texto)
  )
    return true;
  return false;
};
