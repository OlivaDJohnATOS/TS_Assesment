import "./SCSS/styles.scss";

let modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

span.addEventListener('click', () => {
    modal.style.display = "none";
});

let state: boolean = true;
type cnArray = string[][];
let xhr = new XMLHttpRequest();
const COUNTRIES: cnArray = [];

xhr.open("GET", "https://restcountries.com/v3.1/all");
xhr.send();
xhr.onload = () => {
    let data: XMLHttpRequest[] = JSON.parse(xhr.response);

    for (let i = 0; i < data.length;i++){
        populate(i, data);
    }
    
    COUNTRIES.sort();

    createTable();

}

function populate (x: number, data: any): void {
    let name: string = data[x].name.official;
    let capital: string = "No capital";
    if (data[x].capital !== undefined){
        capital = data[x].capital[0];
    } 
    let region: string = data[x].region;
    let language: string = "No language to display";
    if (data[x].languages !== undefined){
        language = '';
        Object.keys(data[x].languages).forEach((key) => {
            language += data[x].languages[key] + " ";
        });
    }
    let population: string = data[x].population;
    let flag: string = data[x].flag;

    COUNTRIES.push([name, capital, region, language, population, flag])
}

function addRowHandlers() {
    let table = document.getElementById("tableCountries")! as HTMLTableElement;
    let rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
    let currentRow = table.rows[i];
    currentRow.addEventListener('click', () => {createClickHandler(currentRow)});
    }
}

function createClickHandler (row: HTMLTableRowElement): void {
    let cell = row.getElementsByTagName("td")[0];
    let id = cell.innerHTML;
    let currentDisplay = "https://en.wikipedia.org/api/rest_v1/page/summary/"+id;
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", currentDisplay);
    xhr2.send();
    xhr2.onload = () => {
        let data2 = JSON.parse(xhr2.response);
        document.getElementById('modal__title').innerHTML = data2.title;
        document.getElementById('modal__text').innerHTML = data2.extract_html;
    }
    modal.style.display = "block";
}

function createTable() {
    let body = document.getElementsByTagName("body")[0];
    let tables = document.createElement("table");
    let tblBody = document.createElement("tbody");

    for (let i = 0; i < COUNTRIES.length; i++){
    let row = document.createElement("tr");

    for (let j = 0; j < COUNTRIES[i].length;j++){
        var cell = document.createElement("td");
        var cellContent = document.createTextNode(COUNTRIES[i][j]);
        cell.appendChild(cellContent);
        row.appendChild(cell);
    }
    tblBody.appendChild(row);
    }
    tables.appendChild(tblBody);
    body.appendChild(tables);
    tables.setAttribute("border", "2");
    tables.setAttribute("id", "tableCountries");
    addRowHandlers();
}

const chngBtn = document.getElementById('sortBtn');
chngBtn.addEventListener('click', () => {
    let elem = document.getElementById('tableCountries')! as HTMLTableElement;
    if (typeof elem != 'undefined') {
        elem.parentNode.removeChild(elem);
    }

    state = !state;
    if(state){
        COUNTRIES.sort();
        createTable();
    } else {
        COUNTRIES.reverse();
        createTable();
    }
});



