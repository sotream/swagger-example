const IDS_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZABCDEFGHJKMNPQRSTUVWXYZ2345689';
const CODE_ALPHABET = IDS_ALPHABET.split('');

const random = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

/**
 * Generate ID hash of required length
 * @param {number} idLength length of ID
 */
const generateId = (idLength = 12) => {
  const max = CODE_ALPHABET.length;
  let generatedID = '';

  for (let i = 0; i < idLength; i++) {
    generatedID += CODE_ALPHABET[random(0, max - 1)];
  }

  return generatedID.toUpperCase();
};

module.exports = {
  generateId,
};
