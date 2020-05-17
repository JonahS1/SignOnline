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
        console.error("Error with the QUERY: ", error);
    });
};

