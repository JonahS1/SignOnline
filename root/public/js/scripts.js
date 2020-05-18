var db = firebase.firestore();
var userEmail = JSON.parse(sessionStorage.userEmail);


var sendRequest = () => {

var sendRequestSuccessful = () => {
    db.collection('students').where("email", "==", document.getElementById("reqEmail").value).get()
    .then(querySnapshot => {
        document.getElementById("reqEmail").value = "Success";
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').add({
            authorEmail: userEmail,
            svgString: '',
            access: false,
            request: true
        })
        .then(function(docRef){
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error){
            console.error("Error adding document: ", error);
        });
    })
    .catch(function(error){
        document.getElementById("reqEmail").value = "not a valid email!";        
        console.error("Error with the QUERY: ", error);
    });
}

var sendRequestFailure = () => {
    document.getElementById('reqEmail').value = "invalid email";
}

var sendRequest = () => {
    doesUserExistInstruction(document.getElementById('reqEmail').value, sendRequestSuccessful, sendRequestFailure);
};



var sendInviteSuccessful = () => {
    db.collection('students').where("email", "==", userEmail).get()
                    .then(querySnapshot => {
                        var doc = querySnapshot.docs[0];
                        console.log(querySnapshot.docs);
                        db.collection('students').doc(doc.id).collection('sigs').add({
                            authorEmail: document.getElementById("invEmail").value,
                            svgString: '',
                            access: true,
                            request: false
                        })
                        .then(function(docRef){
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch(function(error){
                            console.error("Error adding document: ", error);
                        });
                    })
                    .catch(function(error){
                        console.error("Error with the QUERY: ", error);
                    });
                    //send invite to person
                    db.collection('students').where("email", "==", document.getElementById("invEmail").value ).get()
                    .then(querySnapshot => {
                        var doc = querySnapshot.docs[0];
                        console.log(querySnapshot.docs);
                        db.collection('students').doc(doc.id).collection('sigs').add({
                            authorEmail: document.getElementById("invEmail").value,
                            senderEmail: userEmail,
                            svgString: '',
                            access: true,
                            request: false
                        })
                        .then(function(docRef){
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch(function(error){
                            console.error("Error adding document: ", error);
                        });
                        document.getElementById("invEmail").value = "Success";
                    })
                    .catch(function(error){
                        console.error("Error with the QUERY: ", error);
                    });
}

var sendInviteFailure = () => {
    document.getElementById('invEmail').value = "invalid email";
}


var sendInvite = () => {
       doesUserExistInstruction(document.getElementById('invEmail').value, sendInviteSuccessful, sendInviteFailure);
};

        var makeIncomingRequestList = () => {
            document.getElementById('inReqList').innerHTML = "";
            db.collection('students').where("email", "==", userEmail).get()
            .then(querySnapshot => {
                var doc = querySnapshot.docs[0];
                db.collection('students').doc(doc.id).collection('sigs').where("request", "==", true).get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        document.getElementById('inReqList').innerHTML += `<br>${doc.get('authorEmail')}  <i class="material-icons green-text" id="${doc.get('authorEmail')}" onClick='acceptRequestOfEmail("${doc.get('authorEmail')}")'>check</i>  <i class="material-icons red-text" id="${doc.get('authorEmail')}" onClick='rejectRequestOfEmail("${doc.get('authorEmail')}")'>clear</i>`;
                    })
                })
                .catch(function(error){    
                    console.error("Error with the QUERY: ", error);
                });
            })
            .catch(function(error){     
                console.error("Error with the QUERY: ", error);
            });
        };

        var makeIncomingInviteList = () => {
            document.getElementById('inInvList').innerHTML = "";
            db.collection('students').where("email", "==", userEmail).get()
            .then(querySnapshot => {
                var doc = querySnapshot.docs[0];
                db.collection('students').doc(doc.id).collection('sigs').where("authorEmail", "==", userEmail).get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        document.getElementById('inInvList').innerHTML += `<br>${doc.get('senderEmail')}  <i class="material-icons green-text" id="${doc.get('senderEmail')}" onClick='prepareForDrawingPage("${doc.get('senderEmail')}")'>edit</i>  <i class="material-icons red-text" id="${doc.get('senderEmail')}" onClick='rejectRequestOfEmail("${doc.get('senderEmail')}")'>clear</i>`;
                    });
                })
                .catch(function(error){     
                    console.error("Error with the QUERY: ", error);
                });
            })
            .catch(function(error){ 
                console.error("Error with the QUERY: ", error);
            });
        }


function doesUserExistInstruction(email, instruction, other) {
    userExists = false;
    db.collection('students').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if (doc.get("email").toUpperCase() == email.toUpperCase()) {
                instruction();
            }
        })
        other();
    })
    .catch(function(error){ 
        console.error("Error with the search: ", error);
    });
};


function removeInvitationFromEmail(email) {
    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').where("senderEmail", "==", email).get()
        .then(querySnapshot => {
           var doc2 = querySnapshot.docs[0];
           db.collection('students').doc(doc.id).collection('sigs').doc(doc2.id).delete()
           .then(() => {
               console.log("successfully deleted");
           })
           .catch(error => {
               console.error("deletion error ", error);
           })
        })
        .catch(error => {
            console.error("query error: ", error);
        })
    }) 
    .catch(error => {
        console.error("query error: ", error);
    })
}

function sendInvitationToEmail(email) {
    db.collection('students').where("email", "==", email).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').add({
            authorEmail: email,
            senderEmail: userEmail,
            svgString: '',
            access: true,
            request: false
        })
        .then(function(docRef){
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error){
            console.error("Error adding document: ", error);
        });
        document.getElementById("invEmail").value = "Success";
    })
    .catch(function(error){
        console.error("Error with the QUERY: ", error);
    });
}

function removeRequestFromEmail(email) {
    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').where("authorEmail", "==", email).get()
        .then(querySnapshot => {
           var doc2 = querySnapshot.docs[0];
           db.collection('students').doc(doc.id).collection('sigs').doc(doc2.id).delete()
           .then(() => {
               console.log("successfully deleted");
           })
           .catch(error => {
               console.error("deletion error ", error);
           })
        })
        .catch(error => {
            console.error("query error: ", error);
        })
    }) 
    .catch(error => {
        console.error("query error: ", error);
    })
}

function removeInvitationFromEmail(email) {

    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').where("authorEmail", "==", userEmail).where("senderEmail", "==", email).get()
        .then(querySnapshot => {
           var doc2 = querySnapshot.docs[0];
           db.collection('students').doc(doc.id).collection('sigs').doc(doc2.id).delete()
           .then(() => {
               console.log("successfully deleted");
           })
           .catch(error => {
               console.error("deletion error ", error);
           })
        })
        .catch(error => {
            console.error("query error: ", error);
        })
    }) 
    .catch(error => {
        console.error("query error: ", error);
    })


}


function prepareForDrawingPage(email) {
    sessionStorage.senderEmail = email;
    window.open('../html/canvas.html')
}