const axios = require("axios").default;
const https = require("https");
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        "content-type": "application/json",
    },
});

let base_url;
let token;
let username;
let password;

const setBaseUrl = (baseUrl) => (base_url = baseUrl);
const getBaseUrl = () => base_url;

const setToken = (newToken) => (token = newToken);
const getToken = () => token;

const setUsername = (newUsername) => (username = newUsername);
const getUsername = () => username;
const setPassword = (newPassword) => (password = newPassword);
const getPassword = () => password;

module.exports = {
    axiosInstance,
    setBaseUrl,
    setToken,
    setUsername,
    setPassword,
    getBaseUrl,
    getToken,
    getUsername,
    getPassword,
};
