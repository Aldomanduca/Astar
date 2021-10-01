function makeGrid() {

    let tbl = document.getElementById("pixelCanvas");

    for (let i = 0; i < 11; i++) {
        let myRow = document.createElement("tr");
        myRow.id = "row" + i;
        
        tbl.appendChild(myRow);
        let rowW = document.getElementById("row" + i);

        for (let j = 0; j < 11; j++) {
            let myCell = document.createElement("td");
            myCell.setAttribute(`data-index`, `${i},${j}`)
            console.log(`data-index`, `${i},${j}`);
            rowW.appendChild(myCell);
        }
    }
}

let startSelected = false;
let endSelected = false;

function tes(event) {
    if (event.target.nodeName == "TD") {
        const dataIndex = event.target.getAttribute('data-index');
        console.log(dataIndex);
        const indexesArray = dataIndex.split(",");
        //console.log(parseInt(event.target.getAttribute('data-index')))
        const indexes = [parseInt(indexesArray[0]), parseInt(indexesArray[1])];
        if (!startSelected) {
            SelectStart(indexes);
        } else if (!endSelected) {
            SelectEnd(indexes);
        }

        
    return indexes;
    }
}
  
function SelectStart(indexes) {
    let startNode = document.querySelectorAll(`[data-index="${indexes[0]},${indexes[1]}"]`)[0];
    startNode.style.backgroundColor = "blue";
    startSelected = true;
    startNode.setAttribute('isStart', true);
}

function SelectEnd(indexes) {
    let endNode = document.querySelectorAll(`[data-index="${indexes[0]},${indexes[1]}"]`)[0];
    console.log(endNode);
    if (!endNode.getAttribute('isStart')) {
        endNode.style.backgroundColor = "red";
        endSelected = true;
        endNode.setAttribute('isEnd', true);
    }
}