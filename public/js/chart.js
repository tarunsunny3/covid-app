
const button = document.getElementById("renderBtn");
function renderChart(totalCases, cured, deaths, labels) {
    document.querySelector("body").style.width = "90vw";
    var ctx = document.getElementById("myChart").getContext('2d');

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
const showChart = async ()=>{
    const res = await axios.get('/getData');
    $(".loader-wrapper").fadeOut("slow");
    const {states, totalCases, cured, deaths } = res.data;
    const ids =  [{"id":"IN.AN"},
    {"id":"IN.AP"},
    {"id":"IN.AR"},
    {"id":"IN.AS"},
    {"id":"IN.BR"},
    {"id":"IN.CH"},
    {"id":"IN.CT"},
    {"id":"IN.DN"},
    {"id":"IN.DD"},
    {"id":"IN.DL"},
    {"id":"IN.GA"},
    {"id":"IN.GJ"},
    {"id":"IN.HR"},
    {"id":"IN.HP"},
    {"id":"IN.JH"},
    {"id":"IN.KA"},
    {"id":"IN.KL"},
    {"id":"IN.LD"},
    {"id":"IN.MP"},
    {"id":"IN.MH"},
    {"id":"IN.MNL"},
    {"id":"IN.ML"},
    {"id":"IN.MZ"},
    {"id":"IN.NL"},
    {"id":"IN.OR"},
    {"id":"IN.PY"},
    {"id":"IN.PB"},
    {"id":"IN.RJ"},
    {"id":"IN.SK"},
    {"id":"IN.TN"},
    {"id":"IN.TR"},
    {"id":"IN.UP"},
    {"id":"IN.UT"},
    {"id":"IN.WB"},
    {"id":"IN.TG"},
    {"id":"IN.JK"},
    {"id":"IN.LA"}]
    labels = states;
    // console.log(labels);
    renderChart(totalCases, cured, deaths, labels);
}
showChart();

// button.onclick = async ()=>{
//     const chart = document.getElementById('myChart');
//     if(chart.style.display == 'none'){
//         showChart();

//         chart.style.display = 'block';
//     }else{
        
//         chart.style.display = 'none';
//     }
// }
