const express = require("express");
global.fetch = require("node-fetch");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

let currencyData = [];
let timestamps=[];
let prices=[];
let index=0;
let refresh = true;

let currencyDescription, currencyWebsite, currencyTechDoc,currencyLogo;


app.get("/", function (req, res) {
  if(refresh){
    getCmcId()
    .then(()=>getDataSet(index)).then(() =>getMetaData(index).then(()=> {
        renderPage(res, index);
        refresh=false;
      }))
      .catch((err) => console.error(err));
  }else{
    getDataSet(index).then(()=>getMetaData(index).then(()=>renderPage(res, index)));
  }
});


async function getCmcId() {
  const apikey_cmc = "1234";
  // const apikey_cmc =
  let billion = 1000000000;
   let url= "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY="+
    apikey_cmc;
  let response = await fetch(url);
  let responseObject = await response.json();
  for (let i = 0; i <= 99; i++) {
    const currencies = {
      dateAdded:responseObject.data[i].date_added,
      rank: responseObject.data[i].cmc_rank,
      id: responseObject.data[i].id,
      name: responseObject.data[i].name,
      symbol: responseObject.data[i].symbol,
      slug:responseObject.data[i].slug,
      maxSupply: responseObject.data[i].max_supply / billion,
      circulatingSupply: responseObject.data[i].circulating_supply / billion,
      totalSupply: responseObject.data[i].total_supply / billion,
      price: (responseObject.data[i].quote.USD.price),
      volume24Hour: responseObject.data[i].quote.USD.volume_24h / billion,
      percentageChange1H: Math.round(responseObject.data[i].quote.USD.percent_change_1h),
      percentageChange24H: Math.round(responseObject.data[i].quote.USD.percent_change_24h),
      percentageChange7D: Math.round(responseObject.data[i].quote.USD.percent_change_7d),
      marketCap: responseObject.data[i].quote.USD.market_cap / billion,
      lastUpdated: responseObject.data[i].last_updated
    };
    currencyData.push(currencies);
  }
}


async function getDataSet(index){
  const sym = currencyData[index].symbol;
  const apikey_nomics = "1234";
  const endDate = moment().format("YYYY-MM-DD");
  const startDate = moment().subtract(6,'days').format("YYYY-MM-DD");
  const url = "https://api.nomics.com/v1/currencies/sparkline?key="+apikey_nomics+"&ids="+sym+"&start="+startDate+"T00%3A00%3A00Z&end="+endDate+"T00%3A00%3A00Z";
  let response = await fetch(url);
  let responseObject = await response.json();
  // the response of the api returns object without a key. console log responseObject to understand more.
  responseObject.forEach((data)=>{
    timestamps = data.timestamps,
    prices = data.prices
  })

  for(let k=0;k<timestamps.length;k++){
    timestamps[k]=timestamps[k].slice(5,10);
  }

  for(let k=0;k<prices.length;k++){
    prices[k]=prices[k]/1000;
  }

}


async function getMetaData(index){

//  the api response schema is : response object -> data -> url ->website:"https://..." but we cannot access website by responseObject.data.url.website
//  because the data that is inside response object is not an object. it is an object map. So first we get all the keys of the map into an array using Object.keys(map_name) then for each key the value that is mapped is an object. So we can proceed with dot
//  notaion after that like map[key].object.objectinside

  const apikey_cmc = "1234";
  const id = currencyData[index].id.toString();
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY="+apikey_cmc+"&id="+id;
  
  let response = await fetch(url);
  let responseObject = await response.json();
  const dataMap = responseObject.data;
    currencyWebsite = dataMap[id].urls.website,
    currencyDescription = dataMap[id].description,
    currencyTechDoc = dataMap[id].urls.technical_doc,
    currencyLogo = dataMap[id].logo
}


// other routes





app.get("/currencies/:name",function(req,res){
  let c=0;
  const queryName=req.params.name;
  for(let j = 0;j<currencyData.length;j++){
    if(currencyData[j].name===queryName){
      index=j;
      c++;
      break;
    }
  }
  if(c==0){
    res.render("failure");
  }else{
 res.redirect("/");
  }
 
});


app.get("/search",(req,res)=>{
  res.render("search", {
    currentHourEjs: moment().hour(),
    currentMinuteEjs: moment().minute(),
    currentDateEjs: moment().date(),
    dayStringEjs: moment().local().format("dddd"),
    currencyData: currencyData,
  });
});


app.post("/search/:category",(req,res)=>{
  if(req.params.category=="byName"){
    const givenName=req.body.nameCurrency;
    res.redirect("/currencies/"+givenName);
  }else if (req.params.category == "byId") {
      if (req.body.idCurrency > 100) {
        res.render("failure");
      } else {
        index = req.body.idCurrency - 1;
        res.redirect("/");
      }
    }
});


app.get("/aboutus", (req, res) =>
  res.render("aboutus", {
    currentHourEjs: moment().hour(),
    currentMinuteEjs: moment().minute(),
    currentDateEjs: moment().date(),
    dayStringEjs: moment().local().format("dddd"),
    currencyData: currencyData
  })
);


app.get("/credits",(req,res)=>(res.render("credits")));


app.get("/getsomething",(req,res)=>{
  const sendToClient = {
    timestamps : timestamps,
    prices : prices
  }
  res.json(sendToClient);
});



app.get("/refresh",function(req,res){
  index=0;
  currencyData=[];
  timestamps=[];
  prices=[];
  refresh=true;
  currencyWebsite="";
  currencyTechDoc="";
  currencyDescription="",
  currencyLogo="";
  res.redirect("/");
});

function renderPage(res,index){
  res.render("home", {
    currencyWebsiteEjs:currencyWebsite,
     currencyTechDocEjs:currencyTechDoc,
     currencyDescriptionEjs:currencyDescription.slice(0,191),
     currencyLogoEjs:currencyLogo,
    currentHourEjs: moment().hour(),
    currentMinuteEjs: moment().minute(),
    currentDateEjs: moment().date(),
    dayStringEjs: moment().local().format("dddd"),
    nameEjs: currencyData[index].name,
    symbolEjs: currencyData[index].symbol,
    marketCapEjs: currencyData[index].marketCap.toString().slice(0, 5),
    totalSupplyEjs: currencyData[index].totalSupply.toString().slice(0, 5),
    priceEjs: currencyData[index].price,
    volume24HourEjs: currencyData[index].volume24Hour.toString().slice(0, 5),
    circulatingSupplyEjs: currencyData[index].circulatingSupply
      .toString()
      .slice(0, 5),
    percentageChange24HEjs: currencyData[index].percentageChange24H,
    percentageChange7DEjs: currencyData[index].percentageChange7D,
    rankEjs: currencyData[index].rank,
    slugEjs: currencyData[index].slug,
    maxSupplyEjs: currencyData[index].maxSupply,
    dateAddedEjs: currencyData[index].dateAdded.slice(0, 10),
    lastUpdatedEjs: currencyData[index].lastUpdated.slice(11, 16),
    currencyData:currencyData,
  });
}








app.listen(process.env.PORT || 3000, function () {
  console.log("Server is UP");
});

