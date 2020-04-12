import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useLocation } from '@reach/router';
import copy from 'copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import useStyles from '../common/useStyles';

const getStatus = (game, gameState) => {
    if (game.status === 'WAITING') {
        return 'Waiting for players...';
    } else {
        const { turnPlayerId, turn } = gameState;
        const currentPlayer = game.players.find(p => p.id === turnPlayerId);

        return (
            <>
                <p style={{ marginTop: 0 }}>
                    {turn ? `Turn: ${gameState.turn}` : 'Assigning Tasks...'}
                </p>
                <p style={{ marginTop: 0 }}>
                    {`Waiting on player: ${currentPlayer.name}`}
                </p>
            </>
        )
    }
};

const Header = ({ game, showAccessCode, gameState }) => {
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
            <h3 className={classNames(classes.containerCenter, classes.grey)}>{getStatus(game, gameState)}</h3>
        </>
    );
};

Header.propTypes = {
    game: T.object.isRequired,
    showAccessCode: T.bool,
    gameState: T.object,
};

export default Header;
