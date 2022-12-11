async function main() {

    let apiKey = 'f44303f265034089b6da32a1ef1b95b7';
    let endpoint = `https://api.twelvedata.com`;

    let symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];

    let url = `${endpoint}/time_series?symbol=${symbols.join(',')}&interval=1day&apikey=${apiKey}`;

    let res = await fetch(url);
    let data = await res.json();

    if (!!data.code) {
        console.log('api request failed')
        data = mockData;
    }

    // console.log(data);

    /* TIME CHART */

    const timeChartCanvas = document.querySelector('#time-chart');

    let datasets = [];
    let labels = Object.entries(data)[0][1].values.map(val => val.datetime);
    // console.log(labels);

    for (let symbol in data) {
        let obj = {};
        let values = data[symbol].values;
        obj.label = symbol;
        obj.data = values.map(val => val.high).reverse();
        obj.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
        obj.borderColor = ['rgba(255, 99, 132, 1)'];
        obj.borderWidth = 1;
        datasets.push(obj);
    }

    // console.log(datasets);

    const timeChart = new Chart(timeChartCanvas, {
        type: 'line',
        data: { labels: labels.reverse(), datasets },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    /* HIGHEST CHART */

    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');

    let highest = [];

    Object.entries(data).forEach(([ symbol, { meta, values }], idx) => {
        values.forEach(({ high }) => {
            if (highest[idx] == undefined || Number(high) > Number(highest[idx])) highest[idx] = high;
        })
    })

    console.log(highest);

    // const data = {
    //     labels: labels,
    //     datasets: [{
    //         label: 'My First Dataset',
    //         data: [65, 59, 80, 81, 56, 55, 40],
    //         backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(255, 159, 64, 0.2)',
    //         'rgba(255, 205, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(201, 203, 207, 0.2)'
    //         ],
    //         borderColor: [
    //         'rgb(255, 99, 132)',
    //         'rgb(255, 159, 64)',
    //         'rgb(255, 205, 86)',
    //         'rgb(75, 192, 192)',
    //         'rgb(54, 162, 235)',
    //         'rgb(153, 102, 255)',
    //         'rgb(201, 203, 207)'
    //         ],
    //         borderWidth: 1
    //     }]
    // };

    const highChart = new Chart(highestPriceChartCanvas, {
        type: 'bar',
        data: { labels: Object.keys(data), datasets: [{
            label: 'Highest Price',
            data: highest
        }]},
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });



    /* AVERAGE CHART */
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
}

main()