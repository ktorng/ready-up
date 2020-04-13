import gql from 'graphql-tag';

export const ASSIGN_TASK = gql`
    mutation assignTask($gameId: ID!, $card: CardInput!) {
        assignTask(gameId: $gameId, card: $card) {
            success
            game {
                gameState {
                    tasks {
                        playerId
                    }
                }
            }
        }
    }
`;
