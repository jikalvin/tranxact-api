const admin = require('firebase-admin');
const serviceAccount = require('./tranxact-a0900-firebase-adminsdk-wjd8c-21d72eac6e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tranxact-a0900.firebaseio.com"
});

module.exports = admin;
