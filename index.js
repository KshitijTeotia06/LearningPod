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
            if(!a){
                firebase.database().ref(gotuid + "/name").set(name);
                window.location = "infoform.html";
            }
        });
    var lobref = firebase.database().ref(gotuid + "/lobby");
    lobref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
               window.location = "displaypod.html"; 
            }else{
                window.location = "dashboard.html";
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
    var email = document.getElementById("getemail").value;
    console.log("REACHED");
    firebase.database().ref(localStorage.getItem("uid") + "/school").set(school);
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade);
    firebase.database().ref(localStorage.getItem("uid") + "/email").set(email);
    firebase.database()
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade, function(error){
        window.location = "dashboard.html";
    });
    // window.location = "dashboard.html";
}

function createPod(){
    console.log("CREATE POD BUTTON CLICKED");
    var ref = firebase.database().ref("Lobby").push({
        Host: localStorage.getItem("uid")
    });
    firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key);
    firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key, function(error){
        window.location = "displaypod.html"
        return;
    });
}

function joinPod(){
    console.log("JOIN POD BUTTON CLICKED")
}

function editInfo(){
    window.location = "infoform.html";
}
