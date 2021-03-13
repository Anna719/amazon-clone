import  axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/challenge-5383a/us-central1/api' //the api url(cloudfunction)
});

export default instance;