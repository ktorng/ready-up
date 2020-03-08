import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Player, { useStyles as playerStyles } from './Player';
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
    const playerClasses = playerStyles();
    const { data } = useQuery(GET_CURRENT_USER);

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
            {Array(game.size - game.users.length).fill(0).map((_, i) =>
                <div key={`open-slot-${i+1}`} className={classNames(playerClasses.player, playerClasses.empty)}>
                    (open)
                </div>
            )}
        </div>
    );
};

Lobby.propTypes = {
    game: T.object,
};

export default Lobby;
