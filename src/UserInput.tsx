import React from 'react';

import {OrderedMap, OrderedSet} from 'immutable';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

import {District, StateAndDistrict} from './model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '3em',
    },
    launchButton: {
      margin: theme.spacing(2),
      width: '100%',
    },
    paper: {
      padding: theme.spacing(1),
    },
    listHeader: {
      textAlign: 'center',
      background: theme.palette.background.paper,
    },
    list: {
      maxHeight: '45em',
      overflow: 'auto',
    },
  }),
);

export interface UserInputProps {
  locs: OrderedMap<number, StateAndDistrict>;
  launchCB: (districts: Array<District>) => void;
}

const UserInput: React.FC<UserInputProps> = ({locs, launchCB}: UserInputProps) => {
  const styles = useStyles();
  const [selectedState, setSelectedState] = React.useState<number>(-1);
  const [selectedDistricts, setSelectedDistricts] = React.useState<OrderedSet<District>>(OrderedSet());

  const StatesList: React.FC<{}> = () => {
    const items = locs.entrySeq().map(([id, elem]) => {
      const selected = selectedState === id;
      return (
        <ListItem button key={id} selected={selected} autoFocus={selected} onClick={(ev) => setSelectedState(id)}>
          <ListItemText primary={elem.name} />
        </ListItem>
      );
    });

    return (
      <List
        component="nav"
        aria-labelledby="states-list-subheader"
        subheader={
          <ListSubheader component="div" id="states-list-subheader" className={styles.listHeader}>
            <Typography variant="h6">State</Typography>
          </ListSubheader>
        }
        className={styles.list}
      >
        <Divider />
        {items}
      </List>
    );
  };

  const DistrictList: React.FC<{}> = () => {
    const districts = locs.get(selectedState)?.districts || [];
    const items = districts.map((district) => {
      return (
        <ListItem
          button
          key={district.district_id}
          onClick={(ev) => setSelectedDistricts(selectedDistricts.add(district))}
        >
          <ListItemText primary={district.district_name} />
        </ListItem>
      );
    });
    return (
      <List
        component="nav"
        aria-labelledby="districts-list-subheader"
        subheader={
          <ListSubheader component="div" id="districts-list-subheader" className={styles.listHeader}>
            <Typography variant="h6">District</Typography>
          </ListSubheader>
        }
        className={styles.list}
      >
        <Divider />
        {items}
      </List>
    );
  };

  const SelectionList: React.FC<{}> = () => {
    const items = selectedDistricts.toSeq().map((district) => {
      return (
        <ListItem key={district.district_id}>
          <ListItemText primary={district.district_name} />
          <ListItemSecondaryAction>
            <IconButton onClick={(ev) => setSelectedDistricts(selectedDistricts.remove(district))}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });

    return (
      <List
        component="nav"
        aria-labelledby="states-list-subheader"
        subheader={
          <ListSubheader component="div" id="states-list-subheader" className={styles.listHeader}>
            <Typography variant="h6">Selected</Typography>
          </ListSubheader>
        }
        className={styles.list}
      >
        <Divider />
        {items}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={selectedDistricts.isEmpty()}
            className={styles.launchButton}
            onClick={(ev) => launchCB(selectedDistricts.toArray())}
          >
            Launch
          </Button>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={4}>
          <Paper className={styles.paper}>
            <StatesList />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={styles.paper}>
            <DistrictList />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={styles.paper}>
            <SelectionList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserInput;
