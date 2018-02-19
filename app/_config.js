var config = {};

config.mongoURI = {
  development: 'mongodb://pepe_dev:devonly@ds143744.mlab.com:43744/timeapp_dev',
  test: 'mongodb://pepe_test:testonly@ds119508.mlab.com:19508/timeapp_test',
  production: 'mongodb://pepe:q1w2e3r4t5@ds163034.mlab.com:63034/timeapp'
};

config.db = {
  development: 'timeapp_dev',
  test: 'timeapp_test',
  production: 'timeapp'
};

module.exports = config;
