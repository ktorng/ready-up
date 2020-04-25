import T from 'prop-types';

export const cardShape = T.shape({
    color: T.string.isRequired,
    number: T.number.isRequired,
    isLead: T.bool,
    playerId: T.string,
});
