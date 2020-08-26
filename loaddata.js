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
                var inar = [];
                snappy.forEach(function(child) {
                    array.splice(parentcount, count, child.val());
                    inar.push(child.val());
                    count++;
                });
                console.log("ARRAY SADFASDF: " + inar);
                array.push(inar);
                let table = document.createElement('table');
                for (let row of array) {
                table.insertRow();
                for (let cell of row) {
                    let newCell = table.rows[table.rows.length - 1].insertCell();
                    newCell.textContent = cell;
                }
                }
                document.body.appendChild(table);
            });
        });
        parentcount++;
    });
});

