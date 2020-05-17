var db = firebase.firestore();
var userEmail = JSON.parse(sessionStorage.userEmail);


var sendRequest = () => {

    db.collection('students').where("email", "==", document.getElementById("reqEmail").value).get()
    .then(querySnapshot => {
        document.getElementById("reqEmail").value = "";
        var doc = querySnapshot.docs[0];
        console.log(querySnapshot.docs);
        db.collection('students').doc(doc.id).collection('sigs').add({
            authorEmail: userEmail,
            svgString: '',
            access: false
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
    if (doesUserExist(userEmail)) {
        db.collection('students').where("email", "==", userEmail).get()
        .then(querySnapshot => {
            var doc = querySnapshot.docs[0];
            console.log(querySnapshot.docs);
            db.collection('students').doc(doc.id).collection('sigs').add({
                authorEmail: document.getElementById("invEmail").value,
                svgString: '',
                access: true
            })
            .then(function(docRef){
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error){
                console.error("Error adding document: ", error);
            });
            document.getElementById("invEmail").value = "";
        })
        .catch(function(error){
            console.error("Error with the QUERY: ", error);
        });
    }
    else {
        document.getElementById("invEmail").value = "not a valid email!";
    }
};

function doesUserExist(email) {
    db.collection('students').where("email", "==", email).get()
   .then(querySnapshot => {
        return querySnapshot.docs.length > 0;
   })
   .catch(function(error){
    console.error("Error with the Query: ", error);
    });
}


