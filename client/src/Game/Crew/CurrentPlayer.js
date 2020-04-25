import React, { useState } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useMutation } from '@apollo/react-hooks';

import Card from './Card';
import TaskList from './TaskList';
import ConfirmModal from './ConfirmModal';
import { PLAY_CARD } from './actions';
import { useHand } from './hooks/useHand';
import { useGameContext, useMeContext } from '../../common/utils';

import useStyles from '../../common/useStyles';
import useCrewStyles from './hooks/useCrewStyles';

const CurrentPlayer = ({ player, tasks }) => {
    const game = useGameContext();
    const me = useMeContext();
    const classes = useStyles();
    const crewClasses = useCrewStyles();
    const hand = useHand(player.hand);
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [playCard] = useMutation(PLAY_CARD);

    const handleClickCard = (card) => {
        setOpen(true);
        setSelectedCard(card);
    };

    const handleConfirmPlayCard = () => {
        const { color, number } = selectedCard;
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
                {hand.map((card, i) => (
                    <Card
                        key={`player-${me.playerId}-card-${i}`}
                        card={card}
                        isCurrent={true}
                        {...(card.isPlayable ? { handleClick: handleClickCard } : { hideHover: true })}
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
                        isCurrent
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

export default CurrentPlayer;
