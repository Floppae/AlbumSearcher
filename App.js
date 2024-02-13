import logo from "./logo.svg";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "5771b2c5b7d8481186aec69219e1ece8";
const CLIENT_SECRET = "0866daaf414840cf8b772840b6124a5e";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    {
      /*basic syntax in react to have a function run only once*/
    }
    //API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      //fetch is like python request.get(). It goes to the url provided using the authentication parameters (like apiurl and apikey) to access data from API.
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //Search
  async function search() {
    //Function needs to be asynchronous inside function we need lots of different fetch statements, and we need them to "wait their turn" so we need to use wait function
    //console.log("Search for " + searchInput);
    //get request using search to get ARTIST ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    //console.log(artistID);
    //get request with artist id grab all the albums from that artist
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setAlbums(data.items);
      });
    //Display those albums to the user
  }
  //console.log(albums);
  return (
    <div className="App">
      {/*SEARCH BAR WITH WORKING BUTTON SENDS INFO TO WEBSITE IF BUTTON CLICK OR USER PRESSES ENTER*/}
      <Container>
        <InputGroup className="mb-3" size="lg">
          {/*margin bottom = 3 size = large*/}

          <FormControl
            placeholder="Search for artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      {/*SEARCH BAR WITH WORKING BUTTON SENDS INFO TO WEBSITE IF BUTTON CLICK OR USER PRESSES ENTER*/}

      <Container>
        {/*CREATING CARD NAMES WITH ALBUMS TO CREATE SPACE FOR EACH ALBUM COVER. ROW ROW-COLS-4 CREATES A ROW OF MAX 4 ENTITIES PER ROW AND MOVES DOWN A ROW WHEN EXCEEDED
      WE ARE GOING TO HAVE DATA THAT SAYS WHENEVER WE RETRIEVE AN ALBUM FROM SPOTIFY, CREATE THIS CARD*/}
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            //console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
