import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Container } from '@material-ui/core';
import { Router, Link } from '@reach/router';

import Login from './Login';

import './App.scss';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

// TODO
const Games = () => <div>Games</div>;
const Create = () => <div>Create</div>;
const Join = () => <div>Join</div>;

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
              </Router>
          )}
      </Container>
  );
}

export default App;
