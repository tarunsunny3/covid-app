
const allStateTable = document.getElementById('allStates');
const stateTable = document.getElementById('stateTable');
const covidInfo = {}
$(window).on('load', async ()=>{
    const res = await axios.get('/getData');
    $(".loader-wrapper").fadeOut("slow");
    const {states, totalCases, cured, deaths } = await res.data;
    //Sum up the total number of cases active deaths and cured 
    const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
    const sumCases = totalCases.reduce(reducer);
    const sumCured = cured.reduce(reducer);
    const sumDeaths = deaths.reduce(reducer);
    $('#active').text(sumCases);
    $('#cured').text(sumCured);
    $('#deaths').text(sumDeaths);
    const storeData = async ()=>{
        covidInfo['states'] =  states;
        covidInfo['activeCases'] =  totalCases;
        covidInfo['cured'] =  cured;
        covidInfo['deaths'] =  deaths;
    }
    storeData();
})

const displayTable = (i)=>{
    
    let table;
    if(i === ""){
        table="Please select something";
    }else if(i === "all"){
        showFullTable();
        return;
    }else{
        const {states, activeCases, cured, deaths} = covidInfo;
        table = `<table class="table" ">
            <tr class="table-success">
                <th>S. no</th>
                <th>State Name</th>
                <th>Active Cases</th>
                <th>Total Deaths</th>
                <th>Total Cured</th>
            </tr>
            <tr class="table-secondary">
                <td>${Number(i)+1}</td>
                <td>${states[i]}</td>
                <td>${activeCases[i]}</td>
                <td>${deaths[i]}</td>
                <td>${cured[i]}</td>
            </tr>
        </table>`;
      
    }
    
    if(allStateTable.style.display != 'none'){
        allStateTable.style.display = 'none';
    }
    if(stateTable.style.display == 'none'){
        stateTable.style.display = 'table';
    }
    stateTable.innerHTML = table;

    
}
const showFullTable = async ()=>{
    const {states, activeCases, cured, deaths} = covidInfo;
    let tableData ;
    tableData = `
    
    <tr class="table-info">
    <th title="click to sort" onclick="sortTable(0, true);">S. no</th>
    <th onclick="sortTable(1, false);">State Name</th>
    <th onclick="sortTable(2, true);">Active Cases</th>
    <th onclick="sortTable(3, true);">Total Deaths</th>
    <th onclick="sortTable(4, true);">Total Cured</th>
    </tr>
    `;

    for(i=0;i<states.length;i++){
        tableData += `
            <tr>
                <td>${i+1}</td>
                <td>${states[i]}</td>
                <td>${activeCases[i]}</td>
                <td>${deaths[i]}</td>
                <td>${cured[i]}</td>  
            </tr>
        `;
        // var tempRow = document.createElement('tr');
        // // tempRow.className = "table-primary";
        // tempRow.innerHTML = tableData;
        // allStateTable.insertAdjacentElement("beforeend", tempRow);
    }

    allStateTable.innerHTML = tableData;
    if(allStateTable.style.display == 'none'){
        $('#showHint').css('display', 'block');
        allStateTable.style.display = 'table';
    }
    if(stateTable.style.display != 'none'){
        stateTable.style.display = 'none';
    }
}
function sortTable(n, isNumber) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("allStates");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
            if(isNumber){
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                  }
            }else{
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                  }
            }
           
         
        } else if (dir == "desc") {
            if(isNumber){
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                  }
            }else{
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                  }
            }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;      
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }


