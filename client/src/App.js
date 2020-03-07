import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Container } from '@material-ui/core';
import { Router } from '@reach/router';

import Login from './Login';
import Games from './Games';
import Create from './Create';

import './App.scss';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

// TODO
const Join = () => <div>Join</div>;
const Game = () => <div>Game</div>;

function App() {
  const { data } = useQuery(IS_LOGGED_IN);

  return (
      <Container maxWidth="sm">
          {!data.isLoggedIn ? (
              <Login />
          ) : (
              <Router>
                  <Games path="/" />
                  <Create path="/create" />
                  <Join path="/join" />
                  <Game path="/game/:accessCode" />
              </Router>
          )}
      </Container>
  );
}

export default App;
