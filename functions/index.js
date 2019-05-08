const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

// JSON keys
const KEY_TEMPERATURE = 't';
const KEY_HUMIDITY = 'h';
const KEY_TIMESTAMP = 'ts';
const PATH_RECORDS = '/records';

admin.initializeApp();

// Toma los parámetros enviados y los guarda como un registro nuevo en Database
exports.saveRecord = functions.https.onRequest((req, res) => {
  if (req.method === 'POST') {
    var data = req.body;

    // Validaciones
    if (typeof data !== 'object') {
      return res.status(400).send('Bad Request (Reason: empty body)');
    }
    if (isNaN(data[KEY_TEMPERATURE])) {
      return res.status(400).send('Bad Request (Reason: temperature is NaN)');
    }
    if (isNaN(data[KEY_HUMIDITY])) {
      return res.status(400).send('Bad Request (Reason: humidity is NaN)');
    }

    // Agregar timestamp
    data[KEY_TIMESTAMP] = moment().valueOf();

    // Guardar en DB
    return admin.database()
      .ref(PATH_RECORDS)
      .push(data, (error) => {
        if (error) {
          return res.status(500).end();
        }
        return res.status(200).send(data);
      })
  }

  return res.status(405).send(`[${req.method}] Method Not Allowed`);
});
