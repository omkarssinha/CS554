import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
//import '../App.css' from '../src/App.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appbar: {
        alignItems: 'center',
        backgroundColor: 'green'
    },
    toolbar: {
        color: 'green'
    }
}));
function NavBar() {


    const class1 = useStyles();
    return (<div>
        <AppBar position="static" alignItems='center' className={class1.appbar}  >

            <Toolbar className="toolbar" align='center' color='green'>
                <Typography variant="h6" color="green" align='center' className={class1.title}>
                    Welcome to Binterest
                </Typography>
            </Toolbar>
        </AppBar>
    </div>
    )
}

export default NavBar;