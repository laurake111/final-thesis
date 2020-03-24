let parentElementMainRow = null;

window.addEventListener('load', function() {
    parentElementMainRow = document.getElementsByClassName("btC")[0];
    console.log('class', parentElementMainRow);

    let cell = parentElementMainRow.insertCell(1);
    cell.innerHTML = "<button class='btn-box btn-gradient btn-pos'>Kõnetuvastus</button>";

    console.log('All assets are loaded')

    let button = document.createElement("input");
    button.type = "button";
    button.value = "im a button";
})



//THIS KINDA WORKS
// window.onload = function(){
//     parentElementMainTable = document.getElementById(":sd");
//     console.log('textfield by id', parentElementMainTable);
//
//     let button = document.createElement("input");
//     button.type = "button";
//     button.value = "im a button";
//     parentElementMainTable.appendChild(button);
// }

//ANOTHER
// window.onload = function(){
//     var elements = document.getElementsByClassName("T-I J-J5-Ji T-I-KE L3");
//
//     var myFunction = function() {
//         var attribute = this.getAttribute("data-myattribute");
//         alert(attribute);
//     };
//
//     for (var i = 0; i < elements.length; i++) {
//         elements[i].addEventListener('click', myFunction, false);
//     }
//
//     let parentElementMainRow = document.getElementsByClassName("btC")[0];
//     console.log('class', parentElementMainRow);
//
//     let cell = parentElementMainRow.insertCell(1);
//     cell.innerHTML = "<button class='btn-box btn-gradient btn-pos'>Kõnetuvastus</button>";
//
//     console.log('All assets are loaded')
//
//     let button = document.createElement("input");
//     button.type = "button";
//     button.value = "im a button";
// }