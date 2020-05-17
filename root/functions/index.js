const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.firestore();
// var db = firebase.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.addUserToDB = functions.auth.user().onCreate((user) => {
    db.collection("students").add({
        email: user.email,
        name: user.displayName
    })
    .then((docRef) => {
        return console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
});
