firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        read_display_Quote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function read_display_Quote() {
    //console.log("inside the function")

    //get into the right collection
    db.collection("quotes").doc("tues")
        .onSnapshot(function (tuesDoc) {
            //console.log(tuesdayDoc.data());
            document.getElementById("quote-goes-here").innerHTML = tuesDoc.data().quote;
        })
}

read_display_Quote();

function insertName() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}


insertName();

function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    let hikeCardGroup = document.getElementById("hikeCardGroup");

    db.collection("Hikes")
        .orderBy("length_time")            //NEW LINE;  what do you want to sort by?
        .limit(2)
        .get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().code; //gets the unique ID field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = hikeName;     //equiv getElementByClassName
                testHikeCard.querySelector('.card-length').innerHTML = hikeLength;  //equiv getElementByClassName
                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);//equiv getElementByTagName

                testHikeCard.querySelector('i').id = 'save-' + hikeID;
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);

                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;   //equiv getElementByTagName

                testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName=" + hikeName + "&id=" + hikeID;
                hikeCardGroup.appendChild(testHikeCard);
            })

        })
}
populateCardsDynamically();

function saveBookmark(hikeID) {
    if ((document.getElementById('save-' + hikeID).innerText == 'bookmark')) {
        currentUser.set({
            bookmarks: firebase.firestore.FieldValue.delete(hikeID)
        }, {
            merge: true
        })
            .then(function () {
                var iconID = 'save-' + hikeID;
                document.getElementById(iconID).innerText = 'bookmark_border';

            });
    } else {
        currentUser.set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
        }, {
            merge: true
        })
            .then(function () {

                console.log("bookmark has been saved for: " + currentUser);
                var iconID = 'save-' + hikeID;
                //console.log(iconID);
                //this is to change the icon of the hike that was saved to "filled"
                document.getElementById(iconID).innerText = 'bookmark';

            });
    }


}

function setHikeData(id) {
    localStorage.setItem('hikeID', id);
}

function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("Hikes");

    hikesRef.add({
        code: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        length: 10,          //number value
        length_time: 60,     //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        length: 10.5,      //number value
        length_time: 80,   //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    hikesRef.add({
        code: "NV01",
        name: "Mount Seymour Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        length: 8.2,        //number value
        length_time: 120,   //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2022"))
    });
}