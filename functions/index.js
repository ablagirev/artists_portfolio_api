const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const config = require("./config");

admin.initializeApp();

const cors = require("cors");
app.use(cors());

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
      return res.json({ rows: actors, total: actors.length });
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
      return res.json({ rows: actresses, total: actresses.length });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

app.get("/actresses/:artistId", (req, res) => {
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

app.get("/header", (req, res) => {
  admin
    .firestore()
    .collection("header")
    .get()
    .then((data) => {
      let header = {};
      data.forEach((doc) => {
        const objKey = Object.keys(doc.data())[0];
        header[objKey] = doc.data()[objKey];
      });
      return res.json(header);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

app.get("/footer", (req, res) => {
  admin
    .firestore()
    .collection("footer")
    .get()
    .then((data) => {
      let footer = {};
      data.forEach((doc) => {
        const objKey = Object.keys(doc.data())[0];
        footer[objKey] = doc.data()[objKey];
      });
      return res.json(footer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

app.get("/about", (req, res) => {
  admin
    .firestore()
    .collection("about")
    .get()
    .then((data) => {
      let about = {};
      data.forEach((doc) => {
        about[doc.id] = doc.data();
      });
      return res.json(about);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

const randomPhoto = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

app.get("/main/:photos", (req, res) => {
  let menPhotos = [];
  let womenPhotos = [];
  db.doc(`/main/${req.params.photos}`)
    .get()
    .then((doc) => {
      manPhoto = randomPhoto(doc.data().men);
      womanPhoto = randomPhoto(doc.data().women);
      return res.json({
        men: { picture: manPhoto, title: "Актёры" },
        women: { picture: womanPhoto, title: "Актрисы" },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
