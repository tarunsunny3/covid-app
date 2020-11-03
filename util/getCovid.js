const puppeteer = require('puppeteer');
const Covid = require('../models/CovidData');
const states = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal'
]

const url = 'https://www.mohfw.gov.in/';
async function main1(){
    try {
        console.log("main1 is called");
        const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", '--disable-setuid-sandbox']});
        console.log("sandbox");
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: ['networkidle2',"domcontentloaded"], timeout: 0});
        console.log("dom after");
        // await page.waitForNavigation({waitUntil: ['load',"domcontentloaded"], timeout: 0});
        await page.waitForSelector('.statetable > tbody > tr > td');
        // const result = page.content();
        // const result = await request.get(url);
        // const $ = cheerio.load(page);
        // page.$()
    
        const res  = await page.evaluate(()=>{
        // const tds = Array.from(document.querySelectorAll('.statetable > tbody > tr'));
        // > td:nth-child(n+2):nth-child(-n+7)
        const tds = Array.from(document.querySelectorAll(".statetable > tbody > tr:nth-child(-n+35)"));
         return tds.map(td=>{
             const data = Array.from(td.querySelectorAll("td:nth-child(n+2):nth-child(-n+7)"));
             return data.map(item=>item.textContent);
         });
     });
     console.log("got the scraped data");
    const scrapedData =[];
    res.forEach(el =>{
        const stateName = el[0];
        const totalActiveCases = el[1];
        const curedOrDischarged = el[3];
        const deaths = el[5];
        const row = {stateName, totalActiveCases, curedOrDischarged, deaths };
        scrapedData.push(row);
        });
        // console.log(scrapedData);
        const stateNames =[], totalCasesArray=[], curedArray=[], deathsArray=[];
        scrapedData.forEach(item=>{
            stateNames.push(item.stateName);
            totalCasesArray.push(item.totalActiveCases);
            curedArray.push(item.curedOrDischarged);
            deathsArray.push(item.deaths);
        });
        //Function to store in DataBase
        // const moddate = new Date();
        // moddate.setHours(06);
        const saveDataDB = ()=>{
          const covidData = new Covid({
            cured: curedArray,
            deaths: deathsArray,
            totalCases: totalCasesArray
          })
          covidData.save().then((data)=>{
            console.log("Successfully saved Covid data");
          
          }).catch((err)=>{
            console.log(err);
          })
        };
        //Save in Database only if it is not present already
        Covid.find({}).sort({date: -1}).exec((err, result)=>{
            if(result.length > 0){
              const date = new Date(result[0].date);
              const now = new Date();
              const atEight = now.getHours() == '8' && now.getSeconds() <= 20;
              const isDiffDay = date.getDate() != now.getDate();
              const sameDay = (date.getDate() == now.getDate()) && (date.getHours() < 8 && now.getHours() > 8);
              if(atEight || isDiffDay || sameDay){
                console.log("yes");
                saveDataDB();
              }else{
                console.log("NO");
              }
            }else{
              console.log("yes");
              saveDataDB();
    
            }
        });
        // return {states: stateNames, totalCases: totalCasesArray, cured: curedArray, deaths: deathsArray };
        
    } catch (e) {
        console.log("My error is", e);
    }
  }
  module.exports = {main1, states};