
var haslobby = false;

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
                // firebase.database().ref(gotuid + "/lobby").once('value', function(snap){
                //     var ref = firebase.database().ref("VLobby/"+snap.val());
                //     ref.once("value")
                // });
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
    var zip = document.getElementById("getzip").value;
    console.log("REACHED");
    firebase.database().ref(localStorage.getItem("uid") + "/school").set(school);
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade);
    firebase.database().ref(localStorage.getItem("uid") + "/email").set(email);
    firebase.database().ref(localStorage.getItem("uid") + "/zip").set(zip);
    firebase.database()
    firebase.database().ref(localStorage.getItem("uid") + "/grade").set(grade, function(error){
        window.location = "dashboard.html";
    });
    // window.location = "dashboard.html";
}


function createVPod(){
    var ref = firebase.database().ref(localStorage.getItem("uid") + "/lobby");
    ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
                console.log("Got Here") 
                window.location = "displaypod.html";
            }else{
                var ref = firebase.database().ref("VLobby").push({
                    Host: localStorage.getItem("uid")
                });
                firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key);
                firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key, function(error){
                    window.location = "displaypod.html"
                    return;
                });
            }
        });
}

function joinVPod(){
    var ref = firebase.database().ref(localStorage.getItem("uid") + "/lobby");
    ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
                console.log("Got Here") 
                window.location = "displaypod.html";
            }else{
                firebase.database().ref("VLobby/").once('value', function(snap){
                    var data = snap.val();
                    var keys = Object.keys(data);
                    if(keys.length == 0){
                        createVPod();
                        return;
                    }
                    var grade;
                    var completed = false;
                    firebase.database().ref(localStorage.getItem("uid") + "/grade").once('value', function(snap2){
                        grade = snap2.val();
                        for(var i = 0; i < keys.length; i++){
                            var k = keys[i];
                            firebase.database().ref("VLobby/" + k + "/Host").once('value', function(snap3){
                                var get = snap3.val();
                                firebase.database().ref(get + "/grade").once('value', function(snap4){
                                    var get2 = snap4.val();
                                    if(get2 == grade){
                                        console.log("same");
                                        var id = localStorage.getItem("uid");
                                        firebase.database().ref(id + "/lobby").set(k);
                                        firebase.database().ref("VLobby/" + k + "/" + localStorage.getItem("uid")).set(localStorage.getItem("uid"));
                                        firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(k, function(error){
                                            window.location = "displaypod.html";
                                            return;
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    // createVPod();
}

function getData(id) {
    return firebase.database().ref(id).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }


function joinPod(){
    var ref = firebase.database().ref(localStorage.getItem("uid") + "/lobby");
    ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
                console.log("Got Here") 
                window.location = "displaypodInPerson.html";
            }else{
                firebase.database().ref("Lobby/").once('value', function(snap){
                    var data = snap.val();
                    var keys = Object.keys(data);
                    if(keys.length == 0){
                        createVPod();
                        return;
                    }
                    var grade;
                    var completed = false;
                    var min = 1000000;
                    var key;
                    var count = 0
                    firebase.database().ref(localStorage.getItem("uid") + "/zip").once('value', function(snap2){
                        grade = snap2.val();
                        for(var i = 0; i < keys.length; i++){
                            var k = keys[i];
                            var hostid = getData("Lobby/" + k + "/Host");
                            hostid.then(function(result) {
                                var hostzip = getData(result + "/zip");
                                hostzip.then(function(result2){
                                    count++;
                                    var num = parseInt(result2);
                                    if(Math.abs(num - grade) < min){
                                        key = keys[count-1];
                                        min = Math.abs(num - grade);
                                    }
                                    var id = localStorage.getItem("uid");
                                        firebase.database().ref(id + "/lobby").set(key);
                                        firebase.database().ref("Lobby/" + key + "/" + localStorage.getItem("uid")).set(localStorage.getItem("uid"));
                                        firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(key, function(error){
                                            window.location = "displaypodInPerson.html";
                                            return;
                                        });
                                })
                            });
                        }
                    });
                });
            }
        });

}

function createPod(){
    var ref = firebase.database().ref(localStorage.getItem("uid") + "/lobby");
    ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.exists();  
            if(a){
                console.log("Got Here") 
                window.location = "displaypodInPerson.html";
            }else{
                var ref = firebase.database().ref("Lobby").push({
                    Host: localStorage.getItem("uid")
                });
                firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key);
                firebase.database().ref(localStorage.getItem("uid") + "/lobby").set(ref.key, function(error){
                    window.location = "displaypodInPerson.html"
                    return;
                });
            }
        });
}

function editInfo(){
    window.location = "infoform.html";
}

function leavePod(){
    firebase.database().ref("VLobby/" + firebase.database().get(localStorage.getItem("uid") + "/lobby"));
    window.location.href = "./displaypod.html";
}
