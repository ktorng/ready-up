import React, { useMemo } from 'react';
import T from 'prop-types';

import Card from './Card';
import useCrewStyles from './useCrewStyles';

const Player = ({ user }) => {
    const { id, playerState } = user;
    const crewClasses = useCrewStyles();
    const sortedHand = useMemo(() => {
        const { hand } = JSON.parse(playerState);

        return sortHand(hand);
    }, [playerState]);

    return (
        <div>
            <div>
                {user.name}
            </div>
            <div className={crewClasses.cardContainer}>
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
