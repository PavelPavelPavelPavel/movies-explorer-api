const urlRegexp = /(http(s?):\/\/)(w{3}\.)?([\w\d\W\D]*)(\w?)[#]?/;
const languageRuRegexp = /[А-Яа-я\d\s]/;
const languageEnRegexp = /[A-Za-z\d\s]/;

module.exports = {
  urlRegexp,
  languageRuRegexp,
  languageEnRegexp,
};
