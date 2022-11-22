var currentUser;

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameIn").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolIn").value = userSchool;
                    }
                    // if (userCity != null) {
                    //     document.getElementById("cityIn").value = userCity;
                    // }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}
populateInfo();


function editUserInfo() {
    //Enable the form fields
    document.getElementById('info_forms').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('nameIn').value;
    userSchool = document.getElementById('schoolIn').value;
    // userCity = document.getElementById('cityIn').value;

    currentUser.update({
        name: userName,
        school: userSchool,
        // city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('info_forms').disabled = true;
}