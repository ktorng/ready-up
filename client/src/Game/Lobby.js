import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Player, { useStyles as playerStyles } from './Player';
import { USER_DATA } from '../common/schema';
import useStyles from '../common/useStyles';

const GET_CURRENT_USER = gql`
    query me {
        me {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const Lobby = ({ game }) => {
    const classes = useStyles();
    const playerClasses = playerStyles();
    const client = useApolloClient();
    const data = client.readQuery({ query: GET_CURRENT_USER });

    return (
        <div className={classes.containerCenter}>
            <h1>Game lobby: {game.name}</h1>
            <h3>Access code: {game.accessCode}</h3>
            <div className={classNames(playerClasses.player, playerClasses.header)}>
                <div className={playerClasses.name}>Name</div>
                <div className={playerClasses.ready}>Ready</div>
                <div className={playerClasses.note}>Note</div>
            </div>
            {game.users.map(user =>
                <Player key={user.email} user={user} current={data.me} />
            )}
            {Array(game.size - game.users.length).fill(0).map(() =>
                <div className={classNames(playerClasses.player, playerClasses.empty)}>(open)</div>
            )}
        </div>
    );
};

Lobby.propTypes = {
    game: T.object,
};

export default Lobby;
