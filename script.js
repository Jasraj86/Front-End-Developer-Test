const searchText = document.getElementById('search');
const matchList = document.getElementById('match');
const squareMeter = document.getElementById('sqm');
const sqmVal = document.getElementById('sqmVal');
const numSeats = document.getElementById('seat-selection');
const propPrice = document.getElementById('price');
const priceVal = document.getElementById('priceVal');

//Show price value as it change
priceVal.innerHTML = 'Price: $' + propPrice.value;
propPrice.oninput = function() {
    priceVal.innerHTML = 'Price: $' + this.value;
}

//Show square meters as user move the slider
sqmVal.innerHTML = 'Square Meters:' + squareMeter.value;
squareMeter.oninput = function() {
    sqmVal.innerHTML = 'Square Meters:' + this.value;
}

//Load intial data from JSON file and display on page load
const loadData = async fData => {
    const properties = await fetchData();
    outputHtml(properties);
};

//Filter data and search from the fetched data
const searchData = async data => {
    const properties = await fetchData();

    //filter data using regular expressions
    let matches = properties.filter(property => {
        const regex = new RegExp(`^${data}`, 'gi');
        return property.title.match(regex);
    });
    outputHtmlmatch(matches);
};

//Display results on input match in search bar
const outputHtmlmatch = matches => {
    if (matches.length > 0) {
        const html = matches
            .map(
                match => propertyDisplayHTML(match)).join('');
        matchList.innerHTML = html;
    } else if (matches.length == 0) {
        matchList.innerHTML = '<b>No result found</b>';
    }
};

//filter results on click button
const filterResults = async() => {
    const priceFilter = propPrice.value;
    const sqmFilter = squareMeter.value;
    const seatsFilter = numSeats.value;

    const properties = await fetchData();

    let matches = properties.filter(property => {
        if (priceFilter >= property.price_per_month || sqmFilter >= property.sqm || seatsFilter >= property.seats) {
            return property.title;
        }
    });
    outputHtmlmatch(matches);
};

// Clear Filter Data

const clearResults = () => {
    propPrice.value = propPrice.min;
    squareMeter.value = squareMeter.min;
    numSeats.value = "";
    priceVal.innerHTML = 'Price: $' + propPrice.value;
    sqmVal.innerHTML = 'Square Meters:' + squareMeter.value;
};

//Fetch JSON data from file
async function fetchData() {
    const res = await fetch('../front_end_developer_test.json');
    const properties = await res.json();
    return properties;
}
//Function to display data in HTML template
const outputHtml = properties => {
    const html = properties
        .map(
            property => propertyDisplayHTML(property)).join('');
    matchList.innerHTML = html;
};

//Display properties in HTML template
const propertyDisplayHTML = property => {
    return `
    <div class="flip-card">
    <div class="flip-card-inner">
    <div class="flip-card-front">
    <a href="${property.profile_image}">
    <img src="${property.profile_image}" style="width:400px;height:300px;">
              </a>
              <div id="imgCaption">${property.title}</div>
              </div>
              <div class="flip-card-back">
              
                <h1>${property.title} <img id="fav" src="../images/heart.png" onclick="favItem()" title="Add to favourite list"></h1> 
                <p>${property.description}</p> 
                <ul>
                <li> <b>Created at:</b> ${property.created_at}</li>
                <li> <b>Price per month:</b>$${property.price_per_month} AUD</li>
                <li> <b>Seats:</b> ${property.seats}</li>
                <li> <b>Square meters:</b> ${property.sqm}</li>
                </ul>
                <div class="action-btn"><a href="#" id="abtn"> View Property</a> </div>
              </div>
            </div>
          </div>
    `;
};

//On input in search bar call searchData()
searchText.addEventListener('input', () => searchData(search.value));

//Highlight active button for grid/list view
const container = document.getElementById("btnContainer");
const btns = container.getElementsByClassName("btn");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        const current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

//List view
const listView = async() => {
    const properties = await fetchData();
    outputHtmlListView(properties);
};

const outputHtmlListView = properties => {
    const html = properties
        .map(
            property => propertyDisplayHTMLListView(property)).join('');
    matchList.innerHTML = html;
};

//Grid View
const gridView = async() => {
    const properties = await fetchData();
    outputHtml(properties);
};

//User login simulation
var status = false;
const username = document.getElementById('username');

const login = () => {
    status = true;
    document.getElementById('loginDiv').innerHTML = "Welcome " + username.value;
};

//HTML template for list view
const propertyDisplayHTMLListView = property => {
    return `
    <div class="list-card">
    <div class="list-card-left">
    <a href="${property.profile_image}">
    <img src="${property.profile_image}" style="width:400px;height:300px;">
              </a>
              </div>
              <div class="list-card-right">
                <h1>${property.title}</h1> 
                <p>${property.description}</p> 
                <ul>
                <li> <b>Created at:</b> ${property.created_at}</li>
                <li> <b>Price per month:</b>$${property.price_per_month} AUD</li>
                <li> <b>Seats:</b> ${property.seats}</li>
                <li> <b>Square meters:</b> ${property.sqm}</li>
                </ul>
                <div class="action-btn"><a href="#" id="abtn"> View Property</a> </div>
              </div>
              <div class="fav-property"><img id="fav" src="../images/heart.png" onclick="favItem()" title="Add to favourite list"></div>
          </div>
    `;
};

const favItem = () => {
    if (status == "true") {
        document.getElementById('fav').src = '../images/heart-red.png'

    } else {
        alert("Please login first");
    }
};
