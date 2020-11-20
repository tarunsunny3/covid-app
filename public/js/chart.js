
const button = document.getElementById("renderBtn");
$(window).on('load', async ()=>{
    const res = await axios.get('/getData');
    $(".loader-wrapper").fadeOut("slow");
    const {states, totalCases, cured, deaths } = await res.data;
    labels = states;
    renderChart(totalCases, cured, deaths, labels);
});
function renderChart(totalCases, cured, deaths, labels) {
    // document.querySelector("body").style.width = "90vw";
    var ctx = document.getElementById("myChart").getContext('2d');
    // console.log(document.getElementById("myChart").width);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of total active',
                backgroundColor: 'rgb(255, 205, 86)',
                data: totalCases,
                
            }, 
            {
                label: '# of cured',
                backgroundColor: 'rgb(54, 162, 235)',
                data: cured,
                
            }, 
            {
                label: '# of total deaths',
                backgroundColor: 'rgb(255, 99, 132)',
                data: deaths,
                
            }, 
        ]
        },
        options: {
            title: {
                display: true,
                text: 'COVID- India'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },

            responsive: true,
            maintainAspectRatio: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
 
}


