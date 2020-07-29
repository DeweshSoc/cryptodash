# Cryptodash
An express.js based dashboard application for analysis of top 100 cryptocurrencies.

#### Screenshots --- [Here!](https://github.com/DeweshSoc/cryptodash/issues/1#issue-667958915)

### Requirements
- Node.js v10.19.0 or above
- Nodemon (optional)

### Setup

1. Using terminal change directory into the working directory of this project or just open this directory in your terminal.
2. Use npm command to install all dependencies from package.json.
              
               
                npm i .
                
3. Go to Coin Market Cap API --- [here!](https://coinmarketcap.com/api/)
4. Get you API key for free. This will be your CMC_API_KEY.
5. Go to Nomics API --- [here!](https://p.nomics.com/cryptocurrency-bitcoin-api)
6. Get your API key for free. This will be your NOMICS_API_KEY.
7. Open app.js in your editor and replace:

                
                apikey_cmc="1234" with apikey_cmc="[CMC_API_KEY]" at line 37 and 99
                
                apikey_nomics="1234" with apikey_nomics="[NOMICS_API_KEY]" at line 70
                
           
8. Save it. 
9. Now in your terminal (in the working directory of this project) use 

        - nodemon command to run app.js. (skip if you have'nt installed Nodemon)
                
                nodemon app.js
               
        - node command to run app.js. (skip if you have used Nodemon command)
                
                node app.js
                
10. Open your browser and go to localhost:3000 and view the dashboard
