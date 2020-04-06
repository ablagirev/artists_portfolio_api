const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const config = require("./config");

admin.initializeApp();

const db = admin.firestore();

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/actors", (req, res) => {
  admin
    .firestore()
    .collection("actors")
    .get()
    .then((data) => {
      let actors = [];
      data.forEach((doc) => {
        actors.push({
          id: doc.data().id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          age: doc.data().age.value,
          photo: doc.data().photo.main,
        });
      });
      return res.json(actors);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/actors/:artistId", (req, res) => {
  let artistData = {};
  db.doc(`/actors/${req.params.artistId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Artist not found" });
      }
      artistData = doc.data();
      return res.json(artistData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

app.get("/actresses", (req, res) => {
  admin
    .firestore()
    .collection("actresses")
    .get()
    .then((data) => {
      let actresses = [];
      data.forEach((doc) => {
        actresses.push({
          id: doc.data().id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          age: doc.data().age.value,
          photo: doc.data().photo.main,
        });
      });
      return res.json(actresses);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/actress/:artistId", (req, res) => {
  let artistData = {};
  db.doc(`/actresses/${req.params.artistId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Artist not found" });
      }
      artistData = doc.data();
      return res.json(artistData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
