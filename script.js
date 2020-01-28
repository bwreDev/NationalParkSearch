'use strict';
/*
Base components for API GET 
*/
const apiKey = 'zB0CRgcuLdDGSYgi4BNIlWtGK0xvzZCKM5jgQSHq'

const searchURL = 'https://developer.nps.gov/api/v1/parks';

/*
Encodes parameters and combines them with ampersands separating
*/

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&')
}

/*
Loops over results and creates HTML elements to show data in the DOM
*/

function displayResults(responseJson) {

    $('#results-list').empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li><h2>${responseJson.data[i].fullName}</h2>
            <p>${responseJson.data[i].description}</p>
            <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a>
            </li>`
        )};
        $('#results').removeClass('hidden');
};

/*
Get inputs passed from watchForm
Builds url and queryString to make fetchable API GET
Creates new header to contain api key
*/

function getNationalParks(query, maxResults) {
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    /*
    Fetch request for API based on new url created above
    */

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

/*
Watches form for manipulation
Supplies variables with values based off user input and strips the spaces from the text input
Sends new variables to getNationalParks function
*/

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val().replace(/\s/g,'');
        const maxResults = $('#js-max-results').val();
        getNationalParks(searchTerm, maxResults);
    })
}

$(watchForm);