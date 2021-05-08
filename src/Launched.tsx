import React from 'react';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import {fetchSessions} from './api';
import {District, FlatSession} from './model';

const FETCH_INTERVAL = 15 * 60 * 1000;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '3em',
    },
    paper: {
      padding: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    checkButton: {
      marginTop: theme.spacing(1),
    },
  }),
);

export interface LaunchedProps {
  districts: Array<District>;
}

class State {
  readonly timestamp: string;

  readonly sessions: Array<FlatSession>;

  constructor(sessions: Array<FlatSession>) {
    this.timestamp = moment().format('HH:mm:ss');
    this.sessions = sessions;
  }
}

const Launched: React.FC<LaunchedProps> = ({districts}: LaunchedProps) => {
  const styles = useStyles();
  const sendNotification = React.useRef<boolean>(Notification.permission === 'granted');
  const executeFetch = React.useRef<boolean>(true);
  const [checkCounter, setCheckCounter] = React.useState<number>(0);
  const [state, setState] = React.useState<State>(new State([]));

  const districtNames = districts.map((district) => district.district_name).join(', ');

  const executeCheck = () => {
    executeFetch.current = true;
    setCheckCounter(checkCounter + 1);
  };

  React.useEffect(() => {
    try {
      if (!sendNotification.current && Notification.permission === 'default') {
        Notification.requestPermission().then((resp) => {
          sendNotification.current = Notification.permission === 'granted';
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (executeFetch.current) {
      const districtIds = districts.map((district) => district.district_id);
      fetchSessions(districtIds).then((resp) => {
        executeFetch.current = false;
        setState(new State(resp));
      });
    } else if (sendNotification.current && state.sessions.length > 0) {
      new Notification('Vaccination slots are available');
    }

    const timeoutID = setTimeout(executeCheck, FETCH_INTERVAL);
    return () => {
      clearTimeout(timeoutID);
    };
  });

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Paper className={styles.paper}>
        <Typography variant="h6" gutterBottom>
          Checking
        </Typography>
        <Typography variant="body1" gutterBottom>
          {districtNames}
        </Typography>
        <Typography variant="body2">
          NB: Only showing slots where those under the age of 45 can get vaccinated
        </Typography>
        <Divider className={styles.divider} />
        <Typography variant="h6" gutterBottom>
          Last Check
        </Typography>
        <Typography variant="body1">{state.timestamp}</Typography>
        <Typography variant="body2">
          The districts will be periodically checked, and you will be notified if any slots become available
        </Typography>
        <Button variant="outlined" color="secondary" onClick={executeCheck} className={styles.checkButton}>
          Check Now
        </Button>
        <Divider className={styles.divider} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>District</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.centerName}</TableCell>
                <TableCell>{session.centerAddress}</TableCell>
                <TableCell>{session.capacity}</TableCell>
                <TableCell>{session.centerDistrict}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Launched;
