const xSize = 10;
const ySize = 10;


function MakeGrid() {

    let tbl = document.getElementById("pixelCanvas");

    for (let x = 0; x <= xSize; x++) {
        let myRow = document.createElement("tr");
        myRow.id = "row" + x;

        tbl.appendChild(myRow);
        let rowW = document.getElementById("row" + x);

        for (let y = 0; y <= ySize; y++) {
            let myCell = document.createElement("td");
            myCell.setAttribute(`data-index`, `${x},${y}`)
            rowW.appendChild(myCell);
        }
    }
}

let startSelected = false;
let endSelected = false;

function GetIndexes(cell) {
    const dataIndex = cell.getAttribute('data-index');
    const indexesArray = dataIndex.split(",");
    const indexes = [parseInt(indexesArray[0]), parseInt(indexesArray[1])];
    return indexes;
}

function tes(event) {
    if (event.target.nodeName == "TD") {

        const indexes = GetIndexes(event.target);

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
    //console.log(endNode);
    if (!endNode.getAttribute('isStart')) {
        endNode.style.backgroundColor = "red";
        endSelected = true;
        endNode.setAttribute('isEnd', true);
    }
}

function gCost(start, actual) {
    return findDistance(start, actual) * 10;
}

function hCost(end, actual) {
    return findDistance(end, actual) * 10;
}

function fCost(start, end, cell) {
    return gCost(start, cell) + hCost(end, cell);
}

function findDistance(start, end) {

    const xStart = GetIndexes(start)[0];
    const yStart = GetIndexes(start)[1];

    const xEnd = GetIndexes(end)[0];
    const yEnd = GetIndexes(end)[1];

    return Math.sqrt(Math.pow(xEnd - xStart, 2) + Math.pow(yEnd - yStart, 2));
}




function FindNeighbors(indexes) {

    console.log("sono in FindNeighbors");
    console.log(document.querySelectorAll(`isNeighbor`));
    
    document.querySelectorAll(`isNeighbor`).forEach(function (element) {
        element.style.backgroundColor = "white";
        element.innerHTML = "";
    })
    
    /* schema dei vicini al blocco comparato
        _____________________________________
        |           |           |           |
        | x-1 , y-1 |  x-1 , y  | x-1 , y+1 |
        |___________|___________|___________|
        |           |           |           |
        | x ,  y-1  |  actual   | x ,  y+1  |
        |___________|___________|___________|
        |           |           |           |
        | x+1 , y-1 |  x+1 , y  | x+1 , y+1 |
        |___________|___________|___________|
    */

    const xActual = indexes[0];
    const yActual = indexes[1];

    const neighbors = [];

    if (xActual < xSize) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual + 1},${yActual}"]`)[0]);
    }

    if (xActual < xSize && yActual < ySize) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual + 1},${yActual + 1}"]`)[0]);
    }

    if (yActual < ySize) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual},${yActual + 1}"]`)[0]);
    }

    if (xActual > 0 && yActual < ySize) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual - 1},${yActual + 1}"]`)[0]);
    }

    if (xActual > 0) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual - 1},${yActual}"]`)[0]);
    }

    if (xActual > 0 && yActual > 0) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual - 1},${yActual - 1}"]`)[0]);
    }

    if (yActual > 0) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual},${yActual - 1}"]`)[0]);
    }

    if (xActual < xSize && yActual > 0) {
        neighbors.push(document.querySelectorAll(`[data-index="${xActual + 1},${yActual - 1}"]`)[0]);
    }

    const startCell = document.querySelectorAll(`[isStart=true]`)[0];
    const endCell = document.querySelectorAll(`[isEnd=true]`)[0];

    neighbors.forEach(function (element) {
        element.setAttribute = ('isNeighbor', true);
        element.style.backgroundColor = "#7FFFD4";
        element.innerHTML = parseInt(fCost(startCell, endCell, element));
    })

    return neighbors;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function Path() {

    const startCell = document.querySelectorAll(`[isStart=true]`)[0];
    const endCell = document.querySelectorAll(`[isEnd=true]`)[0];

    const xStart = GetIndexes(startCell)[0];
    const yStart = GetIndexes(startCell)[1];

    const xEnd = GetIndexes(endCell)[0];
    const yEnd = GetIndexes(endCell)[1];
    
    /*
    let neighbors = FindNeighbors(GetIndexes(startCell));
    //console.log(FindNeighbors(startIndexes));

    neighbors.forEach(function (element) {
        element.style.backgroundColor = "green";
        element.innerHTML = parseInt(fCost(startCell, endCell, element));
    })
    */
    
    let open = [];
    let closed = [];

    open.push(startCell);

    let finished = false;
    let steps = 2;

    while (!finished) {

        let lowestFcost = Number.MAX_SAFE_INTEGER;
        let current;

        open.forEach(async function (element) {

            console.log("dentro il foreach per il confronto dell'Fcost")
            console.log(`analizzo la cella ${GetIndexes(element)[0]} , ${GetIndexes(element)[1]}`)
            console.log(`fCost(startCell, endCell, element) ${fCost(startCell, endCell, element)}`)
            console.log(`lowestFcost ${lowestFcost}`)

            let previousColor = element.style.backgroundColor;
            element.style.backgroundColor = "yellow";

            await sleep(1000);

            if (fCost(startCell, endCell, element) < lowestFcost) {
                current = element;
                lowestFcost = fCost(startCell, endCell, element);
            }

            await sleep(1000);
            element.style.backgroundColor = previousColor;
            
        })

        await sleep(2500)

        open.splice(open.indexOf(current, 0), 1);
        closed.push(current);

        if (current == endCell) {
            finished = true;
        } else {

            neighbors = FindNeighbors(GetIndexes(current));

            neighbors.forEach(function (element) {
                console.log("dentro il foreach dei vicini")
                console.log(`analizzo la cella ${GetIndexes(element)[0]} , ${GetIndexes(element)[1]}`)
                console.log(`closed.indexOf(element, 0) = ${closed.indexOf(element, 0)}`)
                if (closed.indexOf(element, 0) === -1) {
                    console.log("la cella analizzata non è nella lista closed")
                    if (open.indexOf(element, 0) === -1) {
                        console.log("la cella analizzata non è nella lista degli open")
                        element.parent = current;
                        //element.setAttribute('parent', current);
                        open.push(element);
                    }
                }
            })

            await sleep(1000)
            open.forEach(function (element) {
                element.style.backgroundColor = "green";
                element.innerHTML = parseInt(fCost(startCell, endCell, element));
            })

            closed.forEach(function (element) {
                element.style.backgroundColor = "red";
            })


        }

        endCell.style.backgroundColor = "red";
        /*
        steps--;
        if (steps === 0) {
            finished = true;
        }
        */
    }






}