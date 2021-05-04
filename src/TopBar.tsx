import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';

const MOREFICENT_URL = 'https://moreficent.com';
const REPO_URL = 'https://github.com/Moreficent/vax';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontVariant: 'small-caps',
    },
    divider: {
      marginLeft: theme.spacing(3),
      width: theme.spacing(0.75),
      background: theme.palette.primary.contrastText,
    },
    subtitle: {
      marginLeft: theme.spacing(3),
      flexGrow: 1,
    },
    moreficent: {
      color: 'inherit',
      marginRight: theme.spacing(2),
    },
    github: {
      color: 'inherit',
    },
  }),
);

const TopBar: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Vax
          </Typography>
          <Divider orientation="vertical" className={classes.divider} flexItem />
          <Typography variant="h6" className={classes.subtitle}>
            Get notified when vaccine slots are available
          </Typography>
          <Button className={classes.moreficent} disableElevation href={MOREFICENT_URL}>
            <Typography variant="button" display="block">
              Moreficent
            </Typography>
          </Button>
          <IconButton className={classes.github} href={REPO_URL}>
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopBar;
