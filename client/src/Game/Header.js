import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useLocation } from '@reach/router';
import copy from 'copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import useStyles from '../common/useStyles';

const Header = ({ game, showAccessCode }) => {
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
        </>
    );
};

Header.propTypes = {
    game: T.object.isRequired,
    showAccessCode: T.bool,
};

export default Header;
