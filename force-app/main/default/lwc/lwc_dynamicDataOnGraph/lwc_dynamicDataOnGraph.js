import {
    LightningElement,
    track
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';

// import library files that you have uploaded as static resource in the org
import chartjs from '@salesforce/resourceUrl/Chartjs';
import chartjsCss from '@salesforce/resourceUrl/Chartjs_CSS';

// add the URL of the resource here from where you wanna fetch the data
const QUERY_URL = "https://api.covid19api.com/summary";
const DELAY = 200;
export default class Lwc_dynamicDataOnGraph extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;

    selected = "India";
    totalRecovered = 0;
    totalConfirmed = 0;
    totalDeaths = 0;
    countryWiseData;
    allCountries = [];

    get options() {
        return this.allCountries;
    }

    // TODO -> Dataset to be presented on graph

    config = {
        type: 'bar',
        data: {
            labels: ["Total Confirmed", "Total Recovered", "Total Deaths"],
            datasets: [{
                label: "Covid-19 Cases",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
                data: []

            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Country wise Covid-19 Cases'
            }
        }

    };

    renderedCallback() {

        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        Promise.all([
                loadScript(this, chartjs),
                loadStyle(this, chartjsCss)
            ])
            .then(() => {

                window.Chart.platform.disableCSSInjection = true;

                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chart = new window.Chart(ctx, this.config);
            })
            .catch((error) => {
                this.error = error;
            });

        fetch(QUERY_URL)
            .then((response) => {
                if (!response.ok) {
                    this.error = error;
                }
                return response.json();
            })
            .then((jsonResponse) => {

                /// TODO -> manipulate the fetched data here

                let {
                    Countries
                } = jsonResponse;

                this.countryWiseData = Countries;

                this.allCountries = Countries.map(data => {
                    return {
                        label: data.Country,
                        value: data.Country
                    };
                });

                this.fetchDataByCountry();
            })
            .catch((error) => {
                this.error = error;
                this.apiResponse = undefined;
            });
    }

    handleChange(event) {

        this.selected = event.target.value;
        this.fetchDataByCountry();
    }

    //This method will fetch the data according to the country selected by the user

    fetchDataByCountry() {

        const casesByCountry = this.countryWiseData.filter((data) => {
            return data.Country === this.selected;
        });

        let {
            TotalConfirmed,
            TotalRecovered,
            TotalDeaths
        } = casesByCountry[0];

        this.totalConfirmed = TotalConfirmed;
        this.totalRecovered = TotalRecovered;
        this.totalDeaths = TotalDeaths;

        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            if (casesByCountry != undefined) {
                this.updateMapData(this.totalConfirmed, this.totalRecovered, this.totalDeaths);
            }
        }, DELAY);
    }

    //This method updates the graph
    // TODO -> Modify according to your need

    updateMapData(totalConfirmed, totalRecovered, totalDeaths) {
        this.config.data.datasets[0].data = [totalConfirmed, totalRecovered, totalDeaths];
        this.chart.update();
    }
}
