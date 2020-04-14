import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useLocation } from '@reach/router';
import copy from 'copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { useGameContext } from '../common/utils';

import useStyles from '../common/useStyles';

const getStatus = (game, gameState, me) => {
    if (game.status === 'WAITING') {
        return 'Waiting for players...';
    } else {
        const { turnPlayerId, turn } = gameState;
        // TODO: fix
        const currentPlayer = game.players.find(p => p.id === turnPlayerId) || { name: 'fix this later' };

        return (
            <>
                <p style={{ marginTop: 0 }}>
                    {turn ? `Turn: ${gameState.turn}` : 'Assigning Tasks...'}
                </p>
                <p style={{ marginTop: 0 }}>
                    {me.id === currentPlayer.userId ? 'Waiting on you!' : `Waiting on player: ${currentPlayer.name}`}
                </p>
            </>
        )
    }
};

const Header = ({ showAccessCode, me }) => {
    const game = useGameContext();
    const { gameState } = game;
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
            <h1>Game: {game.name}</h1>
            {showAccessCode && (
                <h3 className={classNames(classes.containerCenter, classes.flexRow)}>
                    Access code: {game.accessCode}
                    <div
                        className={classNames(classes.pointer, classes.marginLeft8)}
                        onClick={() => copy(location.href.replace('game', 'join'))}
                        title="Copy join game link"
                    >
                        <FileCopyOutlinedIcon />
                    </div>
                </h3>
            )}
            <h3 className={classNames(classes.containerCenter, classes.grey)}>{getStatus(game, gameState, me)}</h3>
        </>
    );
};

Header.propTypes = {
    showAccessCode: T.bool,
    me: T.object,
};

export default Header;
