import { makeStyles } from '@material-ui/core/styles';

const usePlayerStyles = makeStyles(_ => ({
    player: {
        width: '100%',
        display: 'flex',
        background: '#ececec',
        padding: 8,
        marginBottom: 8,
        fontSize: 14,
        alignItems: 'center',
    },
    header: {
        fontSize: 10,
        fontWeight: 600,
        lineHeight: 0.5,
    },
    empty: {
        justifyContent: 'center',
        fontSize: 12,
    },
    name: {
        flex: '0 0 25%',
    },
    ready: {
        flex: '0 0 15%',
        display: 'flex',
        alignItems: 'center',
    },
    note: {
        flex: '0 0 50%',
    },
}));

export default usePlayerStyles;
