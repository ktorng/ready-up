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
    linkPlain: {
        textDecoration: 'none',
        color: 'white',
    },
}));

export default useStyles;
