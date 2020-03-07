import React from 'react';
import { Link } from '@reach/router';
import { Button } from '@material-ui/core';

import useStyles from '../common/useStyles';

const Menu = () => {
    const classes = useStyles();

    // TODO: Split into GamesList and GamesActions components
    return (
        <div className={classes.containerCenter}>
            <h1>Games</h1>
            <div className="Games-actions">
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >
                    <Link className={classes.linkPlain} to="/create">
                        Create
                    </Link>
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >
                    <Link className={classes.linkPlain} to="/join">
                        Join
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Menu;
