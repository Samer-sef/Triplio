import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


export default function CustomFab({onClick}) {
  return (
    <Fab style={style} color="primary" aria-label="Create a trip" onClick={() => onClick()}>
      <AddIcon />
    </Fab>
  )
}

const style = {
  margin: 0,
  top: 'auto',
  left: 20,
  bottom: 20,
  right: 'auto',
  position: 'fixed',
};