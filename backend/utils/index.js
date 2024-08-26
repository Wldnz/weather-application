import axios from "axios";

const version_api = 'v1'

export default function getApi(){
    const api = axios.create({
        baseURL : `http://localhost:3000/api/${version_api}`
    })
    return api;
}