import { clientID } from './Ids.js';
let accessToken;
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
        }else{
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }

    },
    
    search(term){

        const spotifyAccessToken = Spotify.getAccessToken()
        console.log(accessToken)

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${spotifyAccessToken}`}
          })
          .then( res => res.json())
          .then(response => {

              if(!response.tracks){
                  return []
              }else{
                  
                  return response.tracks.items.map(track => (
                       {
                          id: track.id,
                          name: track.name,
                          artist: track.artists[0].name,
                          album: track.album.name,
                          uri: track.uri
                      }
                  ))
              }
          })
    },

    savePlaylist(name, uris){
        if(!name || !uris.length){
            return
        }else{
            const spotifyAccessToken = Spotify.getAccessToken();
            const headers = {Authorization: `Bearer ${spotifyAccessToken}`}
            let userID;

            return fetch('https://api.spotify.com/v1/me', {
                headers: headers
            })
            .then(res => res.json())
            .then(res => {
                userID = res.id

                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: name})
                })
                .then(res => res.json())
                .then(response => {
                    const playlistID = response.id;

                    return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                        headers: headers, 
                        method: 'POST', 
                        body: JSON.stringify({uris: uris})
                    })
                })
            });
            
        }
    }
};


export default Spotify;