import { Card, Button, CardActions, CardContent, Grid, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { t } from 'i18next';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from '../redux/reducer';
import { addNote } from '../redux/actions';


interface NewNoteInputProps {
  addNote(note: string): void;
}

export const NewNoteInput: React.FC<NewNoteInputProps> = ({ addNote }) => {
  const [note, setNote] = React.useState("");

  return (
    <div>
      <input
        onChange={(e) => setNote(e.target.value)}
        value={note}
        type="text"
        name="note"
        placeholder="Note"
      />
      <button onClick={
        (e) => {
          addNote(note);
          setNote("");

        }
      }>Add note</button>
    </div>
  );
};

export const Home: React.FunctionComponent = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const notes = useSelector<AuthState, AuthState["notes"]>(
    (state) => state.notes
  );

  const onAddNote = (note: string) => {
    dispatch(addNote(note));
  };

  return (
    <Container>

      <NewNoteInput addNote={onAddNote} />
      <hr />
      <ul>
        {notes.map((note) => {
          return <li key={note}>{note}</li>;
        })}
      </ul>

      <Grid
        container
        padding={1}
        direction="row"
        alignItems="flex-start"
      >

        <Card sx={{ width: 275, margin: 1 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <PeopleIcon />&nbsp;{t('users') as string}
            </Typography>
            <Typography variant="body2">
              <>{t('users-welcome')}</>
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={e => { navigate("/users") }}>{t('users') as string}</Button>
          </CardActions>
        </Card>

        <Card sx={{ width: 275, margin: 1 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <AccountTreeIcon />&nbsp;{t('units') as string}
            </Typography>
            <Typography variant="body2">
              <>{t('units-welcome')}</><br />&nbsp;
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={e => { navigate("/units") }}>{t('units') as string}</Button>
          </CardActions>
        </Card>

        <Card sx={{ width: 275, margin: 1 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <SettingsIcon />&nbsp;{t('settings') as string}
            </Typography>
            <Typography variant="body2">
              <>
                {t('settings-welcome')}<br />&nbsp;
              </>
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={e => { navigate("/settings") }}>{t('settings') as string}</Button>
          </CardActions>
        </Card>

      </Grid>
    </Container>
  )
}
