import express, { json } from 'express';
import 'dotenv/config';
import Redis from 'ioredis';
import cors from 'cors';
import getApi from './utils/index.js';


const app = express();
const redis = new Redis();
const port = process.env.PORT;

app.use(cors())

app.get('/', async(req,res) => {
    
   res.send('Hello World!')
    
})

app.get('/api/v1',async(req,res) => {
    console.log(req.query)
    if(!req.query.search) return res.send('Hello World!');
    let data = {
        location : req.query.search.toLowerCase(),
        dataLocation : null
    };
    if(data.location.length <= 3) return res.status(411).json({message : "Minimal length is 4 or above!"});
    data.dataLocation = await redis.get(data.location);
    if(data.dataLocation){
        console.log("Cache in")
        data.dataLocation = JSON.parse(data.dataLocation);
        res.json(data.dataLocation);
    }else{
        console.log("Passing Caches")
        const api = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.location}?unitGroup=metric&key=FVPCQLYWXFUNP4WE5F3TGDHCV&contentType=json`
        )
        const apiJson =  await api.json();
        await redis.set(data.location,JSON.stringify(apiJson));
        res.json(apiJson)
    }

})

app.post('/search',async(req,res) => {
    console.log('hey')
    
    console.log(api)
})



app.listen(port,() => console.log(`Application Running On Port : ${port}`))