import React from 'react';
import T from 'prop-types';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import Player from './Player';
import { USER_DATA } from '../common/schema';
import useStyles from '../common/useStyles';

const GET_CURRENT_USER = gql`
    query me {
        me @client {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const Lobby = ({ game }) => {
    const classes = useStyles();
    const client = useApolloClient();
    const data = client.readQuery({ query: GET_CURRENT_USER });

    return (
        <div className={classes.containerCenter}>
            <h1>Game lobby: {game.name}</h1>
            <h3>Access code: {game.accessCode}</h3>
            {game.users.map(user =>
                <Player key={user.email} user={user} current={data.me} />
            )}
        </div>
    );
};

Lobby.propTypes = {
    game: T.object,
};

export default Lobby;
