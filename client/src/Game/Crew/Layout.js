import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Board from './Board';
import Player from './Player';
import Header from '../Header';
import { useTasks } from './useTasks';
import { usePlayers } from './usePlayers';

import useStyles from '../../common/useStyles';

const useLayoutStyles = makeStyles((_) => ({
    mid: {
        height: 400,
        display: 'flex',
        flexDirection: 'row',
    },
    game: {
        height: 600,
    },
    board: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    player: {
        height: 120,
    },
    playerTop: {
        height: 90,
    },
    playerVertical: {
        width: 60,
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },
    border: {
        border: '1px solid gray',
    },
}));

const Layout = ({ me, game }) => {
    const classes = useStyles();
    const layoutClasses = useLayoutStyles();

    const gameState = useMemo(() => {
        return JSON.parse(game.gameState);
    }, [game.gameState]);
    // build dict of tasks by user id
    const tasks = useTasks(gameState.tasks, game.users.map(user => user.id));
    // build ordered list of players
    const players = usePlayers(game.users, me);

    return (
        <div className={classNames(classes.containerCenter, classes.stretch)}>
            <div className={classes.containerCenter}>
                <Header game={game} gameState={gameState} />
            </div>
            <div className={layoutClasses.game}>
                <div className={classNames(layoutClasses.playerTop, layoutClasses.border)}>
                    {players[2] && (
                        <Player
                            user={players[2]}
                            tasks={tasks[players[2].id]}
                        />
                    )}
                </div>
                <div className={layoutClasses.mid}>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        {players[1] && (
                            <Player
                                user={players[1]}
                                tasks={tasks[players[1].id]}
                            />
                        )}
                    </div>
                    <div className={layoutClasses.board}>
                        <Board gameState={gameState} tasks={tasks.unassigned} />
                    </div>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        {players[3] && (
                            <Player
                                user={players[3]}
                                tasks={tasks[players[3].id]}
                            />
                        )}
                    </div>
                </div>
                <div className={classNames(layoutClasses.player, layoutClasses.border)}>
                    <Player
                        user={players[0]}
                        tasks={tasks[players[0].id]}
                        isCurrent
                    />
                </div>
            </div>
        </div>
    );
};

Layout.propTypes = {
    me: T.object,
    game: T.object.isRequired
};

export default Layout;
