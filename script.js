function makeGrid() {

    let tbl = document.getElementById("pixelCanvas");

    for (let i = 0; i < 11; i++) {
        let myRow = document.createElement("tr");
        myRow.id = "row" + i;
        
        tbl.appendChild(myRow);
        let rowW = document.getElementById("row" + i);

        for (let j = 0; j < 11; j++) {
            let myCell = document.createElement("td");
            myCell.setAttribute(`data-index`,`${i},${j}`)
            rowW.appendChild(myCell);
        }

    }

}

function tes(event) {
    if (event.target.nodeName == "TD") {
      console.log(event.target.getAttribute('data-index'));
    }
  }

