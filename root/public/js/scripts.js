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
    document.getElementById('inReqList') = "";
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
    document.getElementById('inInvList') = "";
    db.collection('students').where("email", "==", userEmail).get()
    .then(querySnapshot => {
        var doc = querySnapshot.docs[0];
        db.collection('students').doc(doc.id).collection('sigs').where("request", "==", false).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                document.getElementById('inInvList').innerHTML += "<br>" + doc.get('authorEmail');
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


