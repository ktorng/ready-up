import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Player from './Player';

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
    },
    player: {
        height: 120,
    },
    playerTop: {
        height: 60,
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

    // const gameState = JSON.parse(game.gameState);
    const myPlayerIndex = game.users.findIndex(user => user.id === me.id);

    return (
        <div className={classNames(classes.containerCenter, classes.stretch)}>
            <div className={classes.containerCenter}>Header</div>
            <div className={layoutClasses.game}>
                <div className={classNames(layoutClasses.playerTop, layoutClasses.border)}>
                    Player Top
                </div>
                <div className={layoutClasses.mid}>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        Player Left
                    </div>
                    <div className={layoutClasses.board}>
                        Board
                    </div>
                    <div className={classNames(layoutClasses.playerVertical)}>
                        Player Right
                    </div>
                </div>
                <div className={classNames(layoutClasses.player, layoutClasses.border)}>
                    <Player user={game.users[myPlayerIndex]} />
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
