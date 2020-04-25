import { makeStyles } from '@material-ui/core/styles';

const useCrewStyles = makeStyles((_) => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    playerContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
}));

export default useCrewStyles;
