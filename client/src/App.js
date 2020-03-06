import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Login from './Login';

import './App.scss';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function App() {
  const { data } = useQuery(IS_LOGGED_IN);

  return (
      !data.isLoggedIn ? (
          <Login />
      ) : (
          <div>
              Add routes here
          </div>
      )
  );
}

export default App;
