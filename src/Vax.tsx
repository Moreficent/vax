import React from 'react';

import {OrderedMap} from 'immutable';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import {fetchLocations} from './api';
import Launched from './Launched';
import {StateAndDistrict, District} from './model';
import TopBar from './TopBar';
import UserInput from './UserInput';

const INVARIANT_FAILURE_MSG = 'Invariant Failure';

enum Status {
  FetchingDistricts,
  PendingInput,
  Launched,
  Failure,
}

class State {
  readonly status: Status;

  readonly locs: OrderedMap<number, StateAndDistrict>;

  readonly launchDistricts: Array<District>;

  readonly failureMsg: string;

  private constructor(
    status: Status,
    locs: OrderedMap<number, StateAndDistrict>,
    launchDistricts: Array<District>,
    failureMsg: string,
  ) {
    this.status = status;
    this.locs = locs;
    this.launchDistricts = launchDistricts;
    this.failureMsg = failureMsg;
  }

  static FETCHING_DISTRICTS: State = new State(Status.FetchingDistricts, OrderedMap(), [], '');

  static pendingInputs(locs: OrderedMap<number, StateAndDistrict>): State {
    return new State(Status.PendingInput, locs, [], '');
  }

  static launched(launchDistricts: Array<District>): State {
    return new State(Status.Launched, OrderedMap(), launchDistricts, '');
  }

  static failure(failureMsg: string): State {
    return new State(Status.Failure, OrderedMap(), [], failureMsg);
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: '3em',
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
      fetchLocations()
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
        <UserInput locs={state.locs} launchCB={(districts) => setState(State.launched(districts))} />
      </>
    );
  }

  if (state.status === Status.Launched) {
    return (
      <>
        <TopBar />
        <Launched districts={state.launchDistricts} />
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
