function checkEnv(defaultValue, envValue) {
  return process.env.NODE_ENV !== 'production' ? `${defaultValue}` : `${envValue}`;
}

module.exports = checkEnv;
