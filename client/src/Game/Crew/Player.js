import React, { useMemo } from 'react';
import T from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Card from './Card';

const usePlayerStyles = makeStyles((_) => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
}));

const Player = ({ user }) => {
    const { id } = user;
    const { hand } = JSON.parse(user.playerState);
    const playerClasses = usePlayerStyles();
    const sortedHand = useMemo(() => sortHand(hand), [hand]);

    return (
        <div>
            <div>
                {user.name}
            </div>
            <div className={playerClasses.cardContainer}>
                {sortedHand.map((card, i) => (
                    <Card
                        key={`player-${id}-card-${i}`}
                        card={card}
                    />
                ))}
            </div>
        </div>
    );
};

Player.propTypes = {
    user: T.object,
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

export default Player;
