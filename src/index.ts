import "./SCSS/styles.scss";

let modal = document.getElementById('myModal');
var span = document.querySelector(".close");

const PAGES = 15;

let pagination = PAGES;
let minPage = 0;

span.addEventListener('click', () => {
    modal.style.display = "none";
});

let state: boolean = true;
type cnArray = any[][];
const xhr = new XMLHttpRequest();
const COUNTRIES: cnArray = [];

enum cellProperty {
    Name = "name",
    Capital = "capital",
    Region = "region",
    Language = "language",
    Population = "population",
    Flag = "flag"
};

const filters = [
    {
        id: 'Name',
        num: 0
    },
    {
        id: 'Capital',
        num: 1
    },
    {
        id: 'Region',
        num: 2
    },
    {
        id: 'Language',
        num: 3
    },
    {
        id: 'Population',
        num: 4
    },
    {
        id: 'Flag',
        num: 5
    },
]

const previousBtn = document.getElementById('PreviousBtn')! as HTMLButtonElement;
const nextBtn = document.getElementById('NextBtn')! as HTMLButtonElement;

previousBtn.addEventListener('click', () => {
    if (pagination > 0){
        pagination -= PAGES;
        minPage -= PAGES;
        previousBtn.disabled = false;
        nextBtn.disabled = false;
        pagination = minPage + PAGES;

        if(minPage <= 0){
            previousBtn.disabled = true;
            minPage = 0;
        }
        doTheTable();
        
    } 
});

nextBtn.addEventListener('click', () => {
    if (pagination < COUNTRIES.length){
        pagination += PAGES;
        minPage += PAGES;
        nextBtn.disabled = false;
        previousBtn.disabled = false;
        minPage = pagination - PAGES;

        if(pagination >= COUNTRIES.length){
            nextBtn.disabled = true;
            pagination = COUNTRIES.length;
        }
        doTheTable();
    }
});

function createSearch() {
    const searchBar = document.getElementById('searchFilter')! as HTMLFormElement;
    searchBar.addEventListener('keyup', (e) => {
        const filter = document.getElementById('searchTarget')! as HTMLSelectElement;
        const target = e.target as HTMLInputElement;
        const term = target.value.toLowerCase();
        let table = document.getElementById("tableCountries")! as HTMLTableElement;
        const countries = table.querySelectorAll('tr');
        for (let i = 0; i < countries.length; i++){
            const countryRoads = countries[i].querySelectorAll('td');
            for(let j = 0; j < countryRoads.length; j++){
                const takeMeHome = countryRoads[j].textContent;
                if (filter.value === filters[j].id){
                    if (takeMeHome.toLowerCase().indexOf(term) > -1){
                        countries[i].style.display = '';
                    } else {
                        countries[i].style.display = 'none';
                    }
                }
            }
        }
    });
}


xhr.open("GET", "https://restcountries.com/v3.1/all");
xhr.send();
xhr.onload = () => {
    let data: XMLHttpRequest[] = JSON.parse(xhr.response);

    for (let i = 0; i < data.length;i++){
        populate(data[i]);
    }
    
    COUNTRIES.sort();

    createTable();

}

function populate (data: any): void {
    let name: string = data.name.official;
    let capital: string = "No capital";
    if (data.capital !== undefined){
        capital = data.capital[0];
    } 
    let region: string = data.region;
    let language: string = "No language to display";
    if (data.languages !== undefined){
        language = '';
        Object.keys(data.languages).forEach((key) => {
            language += data.languages[key] + " ";
        });
    }
    let population: string = data.population;
    let flag: string = data.flag;

    COUNTRIES.push([name, capital, region, language, population, flag])
}

function addRowHandlers() {
    const table = document.getElementById("tableCountries")! as HTMLTableElement;
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
    let currentRow = table.rows[i];
    currentRow.addEventListener('click', () => {createClickHandler(currentRow)});
    }
}

function createClickHandler (row: HTMLTableRowElement): void {
    const cell = row.getElementsByTagName("td")[0];
    const id = cell.innerHTML;
    const currentDisplay = "https://en.wikipedia.org/api/rest_v1/page/summary/"+id;
    const xhr2 = new XMLHttpRequest();
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
    const body = document.getElementsByTagName("body")[0];
    const tables = document.createElement("table");
    const tblBody = document.createElement("tbody");

    for (let i = minPage; i < pagination; i++){
    let row = document.createElement("tr");

    for (let j = 0; j < COUNTRIES[i].length;j++){
        var cell = document.createElement("td");
        switch (j) {
            case 0:
                cell.className = cellProperty.Name;
                break;
            case 1:
                cell.className = cellProperty.Capital;
                break;
            case 2:
                cell.className = cellProperty.Region;
                break;
            case 3:
                cell.className = cellProperty.Language;
                break;
            case 4:
                cell.className = cellProperty.Population;
                break;
            case 5: 
            cell.className = cellProperty.Flag;
                break;
        }
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
    const filter = document.getElementById('searchFilter')! as HTMLInputElement;
    filter.value = "";
    createSearch();
}

const chngBtn = document.getElementById('sortBtn');
chngBtn.addEventListener('click', () => {
    state = !state;
    pagination = PAGES;
    minPage = 0;
    nextBtn.disabled = false;
    previousBtn.disabled = true;
    if(state){
        COUNTRIES.sort(); 
    } else {
        COUNTRIES.reverse();
    }
    doTheTable();
});

function doTheTable() {
    let elem = document.getElementById('tableCountries')! as HTMLTableElement;
    if (typeof elem != 'undefined') {
        elem.parentNode.removeChild(elem);
    }
    createTable();
}


