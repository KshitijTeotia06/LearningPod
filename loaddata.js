var array = [];
var lobby;
firebase.database().ref(localStorage.getItem("uid") + "/lobby").once('value').then(function(snapshot) { 
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child("Lobby/"+snapshot.val());
    urlRef.once("value", function(snappy) {
        var parentcount = 0;
        snappy.forEach(function(child) {
            var root2Ref = firebase.database().ref();
            var url2Ref = root2Ref.child(child.val());
            console.log("PARENT NODE: " + child.val())
            var count = 0;
            url2Ref.once("value", function(snappy) {
                snappy.forEach(function(child) {
                    if(count !=2 && count != 3){
                        array.splice(parentcount, count, child.val());
                        console.log(child.val());
                    }
                    count++;
                });
            });
        });
        parentcount++;
    });
});