import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Container } from '@material-ui/core';
import { Router } from '@reach/router';

import Login from './Login';
import Menu from './Menu';
import Create from './Create';
import Game from './Game';

import './App.scss';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

// TODO
const Join = () => <div>Join</div>;

function App() {
  const { data } = useQuery(IS_LOGGED_IN);

  return (
      <Container maxWidth="sm">
          {!data.isLoggedIn ? (
              <Login />
          ) : (
              <Router>
                  <Menu path="/" />
                  <Create path="/create" />
                  <Join path="/join" />
                  <Game path="/game/:accessCode" />
              </Router>
          )}
      </Container>
  );
}

export default App;
