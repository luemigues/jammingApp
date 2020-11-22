let accessToken;
// import { clientID } from './Ids.js';
const redirectURI = "http://localhost:3000/";

const Spotify = {

    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        const tokenMatched = window.location.href.match(/access_token=([^&]*)/);
        const expirationMatched = window.location.href.match(/expires_in=([^&]*)/);
        
        if(tokenMatched && expirationMatched){
            accessToken = tokenMatched[1];
            const expirationTime = Number(expirationMatched[1]);

            window.setTimeout(()=> accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
        }

    }   
};


export default Spotify;