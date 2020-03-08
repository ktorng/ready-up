import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Link } from '@reach/router';
import { Button } from '@material-ui/core';

import useStyles from '../common/useStyles';
import { USER_DATA } from '../common/schema';
import { useQuery } from '@apollo/react-hooks';

const GET_CURRENT_USER = gql`
    query me {
        me {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const Menu = () => {
    const classes = useStyles();
    const { data, loading, error, client } = useQuery(GET_CURRENT_USER, { fetchPolicy: 'network-only' });

    useEffect(() => {
        if (!loading && !error) {
            client.writeData({ data: { me: data.me }})
        }
    }, [data, loading, error, client]);

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
