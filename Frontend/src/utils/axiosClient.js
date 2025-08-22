import axios from 'axios'

let AUTHSERVICE_URL =   (window.location.origin + "/backend1");
let PROBLEMSERVICE_URL =  (window.location.origin + "/backend2");


const axiosAuth = axios.create({
    baseURL: `${AUTHSERVICE_URL}/api/v1/`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})


const axiosProblem = axios.create({
    baseURL: `${PROBLEMSERVICE_URL}/api/v1/`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export {axiosAuth, axiosProblem};


