import axios from 'axios'

const axiosAuth = axios.create({
    baseURL: `${import.meta.env.VITE_AUTHSERVICE_URL}/api/v1/`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})


const axiosProblem = axios.create({
    baseURL: `${import.meta.env.VITE_PROBLEMSERVICE_URL}/api/v1/`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export {axiosAuth, axiosProblem};


