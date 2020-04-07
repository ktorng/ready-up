import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(_ => ({
    textField: {
        display: 'block',
    },
    button: {
        marginTop: 16,
        '&:not(:last-child)': {
            marginRight: 16,
        },
    },
    containerCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
    },
    linkPlain: {
        textDecoration: 'none',
        color: 'white',
    },
    sliderWrapper: {
        marginTop: 16,
        color: '#575757',
    },
    noBorder: {
        border: 'none',
    },
    stretch: {
        alignItems: 'stretch',
    },
    pointer: {
        cursor: 'pointer',
    },
    marginLeft8: {
        marginLeft: 8
    }
}));

export default useStyles;
