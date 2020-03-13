import React, { useEffect } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Player from './Player';
import GameActions from './GameActions';
import { USER_DATA } from '../common/schema';

import usePlayerStyles from './usePlayerStyles';
import useStyles from '../common/useStyles';

const GET_CURRENT_USER = gql`
    query me {
        me @client {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const Lobby = ({ game, subscribe }) => {
    const classes = useStyles();
    const playerClasses = usePlayerStyles();
    const isStartDisabled = game.users.some(user => user.status !== 'READY');
    const { data } = useQuery(GET_CURRENT_USER);

    /**
     * Add subscriptions for players joining, user updates, game updates
     */
    useEffect(() => {
        subscribe(data.me.id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.containerCenter}>
            <h1>Game lobby: {game.name}</h1>
            <h3>Access code: {game.accessCode}</h3>
            <div className={classNames(playerClasses.player, playerClasses.header)}>
                <div className={playerClasses.name}>Name</div>
                <div className={playerClasses.ready}>Ready</div>
                <div className={playerClasses.note}>Note</div>
            </div>
            {game.users.map((user) => (
                <Player key={user.email} game={game} userId={user.id} current={data.me} />
            ))}
            {Array(game.size - game.users.length)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={`open-slot-${i + 1}`}
                        className={classNames(playerClasses.player, playerClasses.empty)}
                    >
                        (open)
                    </div>
                ))}
            <GameActions isStartDisabled={isStartDisabled} />
        </div>
    );
};

Lobby.propTypes = {
    game: T.object,
    subscribe: T.func.isRequired
};

export default Lobby;
