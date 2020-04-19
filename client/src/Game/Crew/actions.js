import gql from 'graphql-tag';

import { GAME_STATE_DATA } from '../../common/fragments';

export const ASSIGN_TASK = gql`
    mutation assignTask($gameId: ID!, $card: CardInput!, $isLast: Boolean!) {
        assignTask(gameId: $gameId, card: $card, isLast: $isLast) {
            success
            game {
                id
                gameState {
                    ...GameStateData
                }
            }
        }
    }
    ${GAME_STATE_DATA}
`;

export const PLAY_CARD = gql`
    mutation playCard($gameId: ID!, $card: CardInput!) {
        playCard(gameId: $gameId, card: $card) {
            success
            game {
                id
                gameState {
                    ...GameStateData
                }
            }
        }
    }
    ${GAME_STATE_DATA}
`;
