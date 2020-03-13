import React from 'react';
import T from 'prop-types';
import { Button } from '@material-ui/core';

import useStyles from '../common/useStyles';

const GameActions = ({ isStartDisabled, isHost }) => {
    const classes = useStyles();

    return (
        <div>
            {isHost && (
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={isStartDisabled}
                >
                    Start
                </Button>
            )}
            <Button
                className={classes.button}
                variant="contained"
                color="secondary"
            >
                Leave
            </Button>
        </div>
    );
};

GameActions.propTypes = {
    isStartDisabled: T.bool.isRequired,
    isHost: T.bool.isRequired,
};

export default GameActions;
