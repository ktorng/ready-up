import React, { useState } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
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
        border: '1px solid #ececec',
        display: 'flex',
    },
    R: {
        backgroundColor: red[700],
        color: grey[50],
    },
    G: {
        backgroundColor: green[700],
        color: grey[50],
    },
    B: {
        backgroundColor: blue[700],
        color: grey[50],
    },
    Y: {
        backgroundColor: yellow[400],
    },
    W: {
        backgroundColor: grey[200],
    },
    hover: {
        border: '1px solid black',
    },
    taskSymbol: {
        alignSelf: 'flex-end',
    },
    task: {
        cursor: 'pointer',
    },
}));

const Card = ({ card, isTask = false, taskReq = {}, handleClick }) => {
    const [isHover, setHover] = useState(false);
    const cardClasses = useCardStyles();
    const { tooltip, symbol } = getTaskProps(taskReq);

    return (
        <div
            className={classNames(cardClasses.card, cardClasses[card.color], {
                [cardClasses.hover]: isHover,
                [cardClasses.task]: isTask
            })}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            title={isTask ? tooltip: ''}
        >
            <div>{card.number}</div>
            {isTask && <div className={cardClasses.taskSymbol}>{symbol}</div>}
        </div>
    );
};

Card.propTypes = {
    card: T.shape({
        number: T.number.isRequired,
        color: T.string.isRequired
    }),
    isTask: T.bool,
    taskReq: T.shape({
        isFirst: T.bool,
        order: T.number,
        isLast: T.bool
    }),
    handleClick: T.func
};

function getTaskProps(taskReq) {
    if (isEmpty(taskReq)) return {};
    const props = { symbol: '' };

    if (taskReq.isFirst) {
        props.tooltip = 'This task must be completed first.';
        props.symbol = '\u03B1';
    } else if (taskReq.isLast) {
        props.tooltip = 'This task must be completed last.';
        props.symbol = '\u03A9';
    } else if (taskReq.order) {
        props.tooltip = 'This task must be done in order.';
        props.symbol = '>'.repeat(taskReq.order);
    } else {
        props.tooltip = 'This task can be completed at any time.';
    }

    return props;
}

export default Card;
