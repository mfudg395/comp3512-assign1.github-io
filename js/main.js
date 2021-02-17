const companiesAPI = "https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php";

document.addEventListener('DOMContentLoaded', function() {

    const defaultViewElements = document.querySelectorAll(".defaultView");
    const chartViewElements = document.querySelectorAll(".chartView");
    const viewButtons = document.querySelectorAll(".changeViewButton");

    let htmlCompanyList = document.querySelector("#companyList");
    // Adding event listeners for the button that switches between views.
    for (let button of viewButtons) {
        button.addEventListener('click', function() {
            if (button.id == "viewChartsButton") {
                enableChartView();
            } else {
                enableDefaultView();
            }
        })
    }

    // Hides all elements in the Default view and shows all elements in Chart view.
    function enableChartView() {
        for (let element of defaultViewElements) {
            element.style.display = "none";
        }
        for (let element of chartViewElements) {
            element.style.display = "block";
        }
    }

    // Hides all elements in the Chart view and shows all elements in Default view.
    function enableDefaultView() {
        for (let element of defaultViewElements) {
            element.style.display = "block";
        }
        for (let element of chartViewElements) {
            element.style.display = "none";
        }
    }

    /* Builds the 'Company List' panel by displaying the list of companies and adding
    * event listeners for the Filter box and the 'Go'/'Clear' buttons.
    */
    createCompanyList();

    async function createCompanyList() {
        let companies = await setCompanies();
        document.querySelector('#companyLoadingAnimation').style.display = 'none';

        setCompanyList(companies);
        createFilter(companies);

    }

    async function setCompanies() {
        if (localStorage.getItem('companies')) {
            return JSON.parse(localStorage.getItem('companies'));
        } else {
            const response = await fetch(companiesAPI);
            const data = await response.json();
            localStorage.setItem('companies', JSON.stringify(data));
            return data;
        }
    }

    // Creates an <li> HTML element for each company and appends it to the HTML list in the DOM.
    function setCompanyList(companies) {
        for (let company of companies) {
            let element = document.createElement('li');
            element.textContent = company.name;
            htmlCompanyList.append(element);
        }
    }

    /* Creates event listener for the Filter search bar in the Company List panel. When the text
    *  field is populated, the list of companies 
    */
    function createFilter(companies) {
        const searchFilter = document.querySelector('#companySearch');
        searchFilter.addEventListener('input', function() {
            const matches = findMatches(searchFilter.value, companies);
            htmlCompanyList.innerHTML = "";
            setCompanyList(matches);
        });
    }

    // Returns a filtered array of Company objects whose names start with the given 'value' parameter. 
    function findMatches(value, companies) {
        return companies.filter(obj => {
            const regex = new RegExp(`^${value}`, 'i');
            return obj.name.match(regex);
          });
    }

    // former solution, not sure if I like it
    // console.log(companies);
    // let companies = getCompanies();
    // console.log(companies);

    // async function getCompanies() {
    //     if (localStorage.getItem('companies')) {
    //         console.log('local');
    //         return JSON.parse(localStorage.getItem('companies'));
    //     } else {
    //         console.log('fetch');
    //         const response = await fetch(companiesAPI);
    //         const data = await response.json();
    //         console.log(data);
    //         localStorage.setItem('companies', JSON.stringify(companies));
    //         return data;
    //     }
    // }
    // function getCompanies() {
    //     if (localStorage.getItem('companies')) {
    //         return JSON.parse(localStorage.getItem('companies'));
    //     } else {
    //         fetch(companiesAPI)
    //             .then((resp) => resp.json())
    //             .then((data) => {
    //                 localStorage.setItem('companies', JSON.stringify(data));
    //                 return data;
    //             });
    //     }
    // }
});