const functions = require('firebase-functions');
//const nodeMailer = requore('nodeMailer');
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

require('dotenv').config()
const {SENDER_EMAIL, SENDER_PASSWORD}= process.env;
/*
exports.sendEmailNotification=functions.firestore.document('submissions/{docID}')
.onCreate((snap, ctx)=>{
    const data=snap.data();
    let authData=nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD
        }
    })
authData.sendMail({
    from : 'zacksussman@gmail.com',
    to:`${data.email}` ,
    subject: 'Request',
    text: `${data.email}` ,
    html: `${data.email}`,

}).then(res=>console.log('very good')).catch(err=>console.log(err));
})*/