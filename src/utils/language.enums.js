const Languages = Object.freeze({
  FR: 'fr',
  EN: 'en',
});

function isValidLanguage(value) {
  return Object.values(Languages).includes(String(value).toLowerCase());
}

module.exports = {
  Languages,
  isValidLanguage,
};
