import decode from 'jwt-decode';

class AuthHelperMethods {
    // initializing important variables
    constructor(domain) {
        this.domain = domain || 'http://localhost:3000'; // API server domain
    };
    
    login = (username, password) => {
        return this.fetch('/log-in', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(response => {
            this.setToken(response.token); // setting the token in localStorage
            return Promise.resolve(response);
        });
    };

    loggedIn = () => {
        // checks if there is a saved toke and it's still valid
        const token = this.getToken(); // getting token from localStorage
        return !!token && !this.isTokenExpired(token);
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            return decoded.exp < (Date.now() / 1000);
        } catch (err) {
            console.log('expired check failed! Line 42: AuthService.js');
            return false;
        };
    };

    setToken = idToken => {
        // saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    };

    getToken = () => {
        // retrieves user token from localStorage
        localStorage.getItem('id_token');
    };

    logout = () => {
        // clear user token and profile data from localStorage
        localStorage.removeItem("id_token");
    };

    getConfirm = () => {
        // using jwt-decode npm package to decode the token
        let answer = decode(this.getToken());
        console.log("Received answer!");
        return answer;
    };

    fetch = (url, options) => {
        // performs api calls sending the required authentication headers
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        // setting authorization header
        // authorization: bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers["Authorization"] = "Bearer " + this.getToken();
        };

        return fetch(url, {
            headers,
            ...options
        })
        .then(this._checkStatus)
        .then(response => response.json());
    };

    _checkStatus = response => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // success status lies between 200 to 300
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        };
    };
};

export default AuthHelperMethods;
