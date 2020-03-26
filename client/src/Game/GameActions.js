import React from 'react';
import T from 'prop-types';
import { Button } from '@material-ui/core';

import useStyles from '../common/useStyles';

const GameActions = ({ isStartDisabled, isHost, startGame, leaveGame }) => {
    const classes = useStyles();

    return (
        <div>
            {isHost && (
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={isStartDisabled}
                    onClick={startGame}
                >
                    Start
                </Button>
            )}
            <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={leaveGame}
            >
                Leave
            </Button>
        </div>
    );
};

GameActions.propTypes = {
    isStartDisabled: T.bool.isRequired,
    isHost: T.bool.isRequired,
    startGame: T.func.isRequired,
    leaveGame: T.func.isRequired,
};

export default GameActions;
