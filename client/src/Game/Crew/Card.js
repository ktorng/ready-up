import React, { useState } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import grey from '@material-ui/core/colors/grey';

const useCardStyles = makeStyles((_) => ({
    card: {
        width: 20,
        height: 30,
        border: '1px solid #ececec',
        display: 'flex',
        backgroundColor: grey[500],
    },
    current: {
        width: 30,
        height: 45,
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
        cursor: 'pointer',
    },
    taskSymbol: {
        alignSelf: 'flex-end',
    },
    task: {
        width: 30,
        height: 45,
    },
}));

const Card = ({ card, isTask = false, taskReq = {}, handleClick, isCurrent, hideHover = false }) => {
    const [isHover, setHover] = useState(false);
    const cardClasses = useCardStyles();
    const { tooltip, symbol } = getTaskProps(taskReq);
    const shouldShow = isCurrent || isTask;

    return (
        <div
            className={classNames(cardClasses.card, {
                [cardClasses.hover]: shouldShow && isHover && !hideHover,
                [cardClasses.task]: isTask,
                [cardClasses.current]: isCurrent,
                [cardClasses[card.color]]: shouldShow
            })}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            title={isTask ? tooltip : ''}
            {...(handleClick ? { onClick: () => handleClick(card, taskReq)} : {})}
        >
            {shouldShow && (
                <>
                    <div>{card.number}</div>
                    {isTask && <div className={cardClasses.taskSymbol}>{symbol}</div>}
                </>
            )}
        </div>
    );
};

Card.propTypes = {
    card: T.shape({
        number: T.number.isRequired,
        color: T.string.isRequired,
    }),
    isTask: T.bool,
    taskReq: T.shape({
        isFirst: T.bool,
        order: T.number,
        isLast: T.bool,
    }),
    handleClick: T.func,
    isCurrent: T.bool,
    hideHover: T.bool,
};

function getTaskProps(taskReq) {
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
