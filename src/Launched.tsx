import React from 'react';

import Container from '@material-ui/core/Container';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {District} from './model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '3em',
    },
    header: {
      padding: theme.spacing(2),
    },
  }),
);

export interface LaunchedProps {
  districts: Array<District>;
}

const Launched: React.FC<LaunchedProps> = ({districts}: LaunchedProps) => {
  const styles = useStyles();

  const districtsList = districts.map((district) => district.district_name).join(', ');

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Paper className={styles.header}>
        <Typography variant="h6" gutterBottom>Checking</Typography>
        <Typography variant="body1">{districtsList}</Typography>
      </Paper>
    </Container>
  );
};

export default Launched;
