import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import {fetch_locations} from './api';
import {StateAndDistrict} from './model';
import TopBar from './TopBar';

const INVARIANT_FAILURE_MSG = 'Invariant Failure';

enum Status {
  FetchingDistricts,
  PendingInput,
  Failure,
}

class State {
  readonly status: Status;

  readonly locs: Array<StateAndDistrict>;

  readonly failureMsg: string;

  private constructor(status: Status, locs: Array<StateAndDistrict>, failureMsg: string) {
    this.status = status;
    this.locs = locs;
    this.failureMsg = failureMsg;
  }

  static FETCHING_DISTRICTS: State = new State(Status.FetchingDistricts, [], '');

  static pendingInputs(locs: Array<StateAndDistrict>): State {
    return new State(Status.PendingInput, locs, '');
  }

  static failure(failureMsg: string): State {
    return new State(Status.Failure, [], failureMsg);
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: '5em',
      minWidth: 275,
      textAlign: 'center',
    },
    cardContent: {
      '& > * + *': {
        marginTop: theme.spacing(5),
      },
    },
    error: {
      color: theme.palette.text.secondary,
    },
  }),
);

const FetchingDistrictsContent: React.FC<{}> = () => {
  return (
    <>
      <Typography variant="h4">Fetching Districts</Typography>
      <LinearProgress color="secondary" />
    </>
  );
};

const Vax: React.FC<{}> = () => {
  const styles = useStyles();

  const [state, setState] = React.useState<State>(State.FETCHING_DISTRICTS);

  React.useEffect(() => {
    if (state.status === Status.FetchingDistricts) {
      fetch_locations()
        .then((resp) => {
          if (resp.success) {
            setState(State.pendingInputs(resp.locs));
          } else {
            setState(State.failure(resp.failureRep));
          }
        })
        .catch((err) => {
          console.error(err);
          setState(State.failure(INVARIANT_FAILURE_MSG));
        });
    }
  });

  if (state.status === Status.FetchingDistricts) {
    return (
      <>
        <TopBar />
        <Container maxWidth="md">
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <FetchingDistrictsContent />
            </CardContent>
          </Card>
        </Container>
      </>
    );
  }

  if (state.status == Status.PendingInput) {
    return (
      <>
        <TopBar />
        <Container maxWidth="md">
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>pending input</CardContent>
          </Card>
        </Container>
      </>
    );
  }

  // invariant: is failure
  return (
    <>
      <TopBar />
      <Container maxWidth="md">
        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <Typography variant="h4" color="secondary">
              {state.failureMsg}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Vax;
