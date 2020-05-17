var db = firebase.firestore();
var user = firebase.auth.currentUser;
function sendRequest() {
    db.collection('students').where("email", "==", document.getElementById("reqEmail")).get()
    .then(querySnapshot => {
        db.collection('students').doc(querySnapshot.docs[0].id).collection('sigs').add({
            authorEmail: user.email,
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



