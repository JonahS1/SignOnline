var db = firebase.firestore();
var userEmail = JSON.parse(sessionStorage.userEmail);


var sendRequest = () => {

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
};





var sendInvite = () => {
    //if (doesUserExist()) {
    //send invite to self   
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
    //}
    //else {
     //   document.getElementById("invEmail").value = "not a valid email!";
    //}
};

var makeIncomingRequestList = () => {
    document.getElementById('inReqList').innerHTML = "";
    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        db.collection('students').doc(doc.id).collection('sigs').where("request", "==", true).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                document.getElementById('inReqList').innerHTML += "<br>" + doc.get('authorEmail');
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
                document.getElementById('inInvList').innerHTML += "<br>" + doc.get('senderEmail');
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


function doesUserExist(email) {
    db.collection('students').where("email", "==", email).get()
   .then(querySnapshot => {
        return querySnapshot.docs.length > 0;
   })
   .catch(function(error){
    console.error("Error with the Query: ", error);
    });
}


function removeInvitationFromEmail(email) {
    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').where("senderEmail", "==", email).get()
        .then(querySnapshot => {
           var doc = querySnapshot.docs[0];
           doc.remove()
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
           var doc = querySnapshot.docs[0];
           doc.remove()
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



