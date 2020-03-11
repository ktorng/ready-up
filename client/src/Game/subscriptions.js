import gql from 'graphql-tag';
import { mergeWith } from 'lodash';
import { USER_DATA } from '../common/schema';

const PLAYER_JOINED = gql`
    subscription playerJoined($gameId: ID!) {
        playerJoined(gameId: $gameId) {
            user {
                ...UserData
            }
            isNew
        }
    }
    ${USER_DATA}
`;

export const playerJoined = (data) => ({
    document: PLAYER_JOINED,
    variables: { gameId: data.game.id },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.playerJoined.isNew) return prev;

        return mergeWith(
            {},
            prev,
            {game: {users: [subscriptionData.data.playerJoined.user]}},
            (dst, src) => Array.isArray(dst) ? [...dst, ...src] : undefined
        );
    }
});
