import React, { useMemo, useState } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useMutation } from '@apollo/react-hooks';

import Card from './Card';
import TaskList from './TaskList';
import ConfirmModal from './ConfirmModal';
import { PLAY_CARD } from './actions';
import { useGameContext, useMeContext } from '../../common/utils';

import useStyles from '../../common/useStyles';
import useCrewStyles from './useCrewStyles';

const CurrentPlayer = ({ player, tasks }) => {
    const game = useGameContext();
    const me = useMeContext();
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const sortedHand = useMemo(() => {
        return sortHand(player.hand);
    }, [player.hand]);
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [playCard] = useMutation(PLAY_CARD);
    const isCurrentTurn = game.gameState.turnPlayerId === me.playerId;

    const handleClickCard = (card) => {
        setOpen(true);
        setSelectedCard(card);
    };

    const handleConfirmPlayCard = () => {
        const { color, number } = selectedCard.card;
        playCard({
            variables: {
                gameId: game.id,
                card: { color, number, playerId: me.playerId },
                isLast: tasks.length === 1
            },
        });
        setOpen(false);
    };

    const handleClose = () => setOpen(false);

    return (
        <div className={crewClasses.playerContainer}>
            <h4 className={classNames(classes.bold, classes.noMargin)}>
                {player.name}
            </h4>
            <div className={crewClasses.cardContainer}>
                {sortedHand.map((card, i) => (
                    <Card
                        key={`player-${me.playerId}-card-${i}`}
                        card={card}
                        isCurrent={true}
                        {...(isCurrentTurn ? { handleClick: handleClickCard } : { hideHover: true })}
                    />
                ))}
            </div>
            {!!tasks.length && (
                <TaskList tasks={tasks} title="Tasks to complete" />
            )}
            {open && (
                <ConfirmModal
                    open={open}
                    onConfirm={handleConfirmPlayCard}
                    onClose={handleClose}
                >
                    <h4>Are you sure you want to play this card?</h4>
                    <Card
                        card={selectedCard}
                        hideHover
                    />
                </ConfirmModal>
            )}
        </div>
    );
};

CurrentPlayer.propTypes = {
    player: T.object,
    tasks: T.array,
};

function sortHand(hand) {
    const colors = {};

    for (let card of hand) {
        if (!colors[card.color]) {
            colors[card.color] = [];
        }
        colors[card.color].push(card);
    }

    Object.keys(colors).forEach(color => {
        colors[color].sort((a, b) => a.number - b.number);
    });

    return ['R', 'G', 'B', 'Y', 'W'].reduce((res, color) => {
        if (colors[color]) {
            res = res.concat(colors[color]);
        }
        return res;
    }, [])
}

export default CurrentPlayer;
