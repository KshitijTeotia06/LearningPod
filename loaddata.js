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
                //iterate over every array(row) within tableArr
                for (let row of array) {
                //Insert a new row element into the table element
                table.insertRow();
                //Iterate over every index(cell) in each array(row)
                for (let cell of row) {
                //While iterating over the index(cell)
                //insert a cell into the table element
                    let newCell = table.rows[table.rows.length - 1].insertCell();
                //add text to the created cell element
                    newCell.textContent = cell;
                }
                }
                //append the compiled table to the DOM
                document.body.appendChild(table);
            });
        });
        parentcount++;
    });
});

