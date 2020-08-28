firebase.database().ref("Lobby/" ).on('value', function(snap){
    console.log(snap.val());
    console.log(snap.numChildren());
});

var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

firebase.database().ref(localStorage.getItem("uid")).once('value', function(snap){
    var data = snap.val();
    firebase.database().ref("Lobby/" + data["lobby"]).on('value', function(snap2){

        var table = document.getElementById('myTable');
        for(var i = table.rows.length - 1; i > 0; i--)
        {
            table.deleteRow(i);
        }

        var people = snap2.val();
        var keys = Object.keys(people);
        for(var i = 0; i<keys.length; i++){
            var k = keys[i];
            var getuid = people[k];
            console.log(getuid);
            firebase.database().ref(getuid).once('value', function(snap3){
                var getall =snap3.val();

                var newRow   = tableRef.insertRow();

                // Insert a cell in the row at index 0
                var newCell  = newRow.insertCell(0);

                // Append a text node to the cell
                var newText  = document.createTextNode(getall["name"]);
                newCell.appendChild(newText);

                var newCell2 = newRow.insertCell(1);
                var newText2 = document.createTextNode(getall["school"]);
                newCell2.append(newText2);

                var newCell3 = newRow.insertCell(2);
                var newText3 = document.createTextNode(getall["email"]);
                newCell3.append(newText3);

            })
        }
    });
})