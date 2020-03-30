import React, { useState } from 'react';
import classNames from 'classnames';
import T from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import grey from '@material-ui/core/colors/grey';

const useCardStyles = makeStyles((_) => ({
    card: {
        width: 40,
        height: 60,
        border: '1px solid #ececec'
    },
    R: {
        backgroundColor: red[700],
        color: grey[50]
    },
    G: {
        backgroundColor: green[700],
        color: grey[50]
    },
    B: {
        backgroundColor: blue[700],
        color: grey[50]
    },
    Y: {
        backgroundColor: yellow[400]
    },
    W: {
        backgroundColor: grey[200]
    },
    hover: {
        border: '1px solid black'
    }
}));

const Card = ({ card }) => {
    const [isHover, setHover] = useState(false);
    const cardClasses = useCardStyles();

    return (
        <div
            className={classNames(cardClasses.card, cardClasses[card.color], {
                [cardClasses.hover]: isHover
            })}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div>{card.number}</div>
        </div>
    );
};

Card.propTypes = {
    card: T.shape({
        number: T.number.isRequired,
        color: T.string.isRequired
    })
};

export default Card;
