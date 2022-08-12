const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const request = require("request")
const axios = require("axios")

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

finHoldings = []

async function getHoldings()
{
    const investments = await axios.get(`${config.investmentsServiceUrl}/investments`);
    const companies = await axios.get(`${config.companyServiceUrl}/companies`);
  
    investments.data.map(({firstName, lastName,investmentTotal, date, holdings }) => {
      holdings.map(({ id, investmentPercentage }) => {
          holdingId = id;
          const value = investmentTotal * investmentPercentage;
          const company = companies.data.find(({ id }) => id === holdingId).name
  
          finHoldings.push({
              firstName,
              lastName,
              date,
              holding: company,
              value
          });
      });
  });
  
    return finHoldings
  
}

app.get("/investments/export", async (req, res) => {
  try{
    res.send(await getHoldings())
  }
  catch(e) {
    console.error(e)
    res.send(500)
  }

}),

app.get("/investments/getHoldings", async (req, res) => {

  try{
  const investments = await axios.get(`${config.investmentsServiceUrl}/investments`);
  const companies = await axios.get(`${config.companyServiceUrl}/companies`);

  investments.data.map(({firstName, lastName,investmentTotal, date, holdings }) => {
    holdings.map(({ id, investmentPercentage }) => {
        holdingId = id;
        const value = investmentTotal * investmentPercentage;
        const company = companies.data.find(({ id }) => id === holdingId).name

        finHoldings.push({
            firstName,
            lastName,
            date,
            holding: company,
            value
        });
    });
});

  res.send(finHoldings)
  } 
  catch(e) {
    console.error(e)
    res.send(500)
  }
}),

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {
      res.send(investments)
    }
  })
}),

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
