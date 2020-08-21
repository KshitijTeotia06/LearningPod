function onSignIn(googleUser) {
    var gotuid =  googleUser.getBasicProfile().getId();
    var name = googleUser.getBasicProfile().getName()
    localStorage.setItem("uid", gotuid);
    localStorage.setItem("name", name);
    console.log(gotuid);
    var ref = firebase.database().ref(gotuid);
    gapi.auth2.getAuthInstance().signOut();
    ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
                window.location = "dashboard.html";
            }else{
                firebase.database().ref(gotuid + "/name").set(name);
                window.location = "infoform.html";
            }
        });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function moveToVirtual(){
    window.location = "virtual.html"
}

function moveToInPerson(){
    window.location = "inperson.html";
}

function clickedFunc(){
    var grade = document.getElementById("drop").value;
    var school = document.getElementById("enterin").value;
    console.log("REACHED");
    firebase.database().ref(localStorage.getItem("uid") + "/school").set(school);
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade);
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade, function(error){
        window.location = "dashboard.html";
    });
    // window.location = "dashboard.html";
}

function createPod(){
    console.log("CREATE POD BUTTON CLICKED");
    firebase.database().ref("Lobby").push({
        Host: localStorage.getItem("uid")
    });
}

function joinPod(){
    console.log("JOIN POD BUTTON CLICKED")
}