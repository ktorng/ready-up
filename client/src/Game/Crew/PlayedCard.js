import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import { cardShape } from './utils/propTypes';

import useCrewStyles from './hooks/useCrewStyles';
import useStyles from '../../common/useStyles';

const PlayedCard = ({ card }) => {
    const classes = useStyles();
    const crewClasses = useCrewStyles();

    return (
        <div>
            <h5 className={classNames(classes.bold, classes.noMargin)}>Played card</h5>
            <div className={crewClasses.cardContainer}>
                <Card card={card} shouldShow hideHover />
            </div>
        </div>
    );
};

PlayedCard.propTypes = {
    card: cardShape.isRequired,
};

export default PlayedCard;
