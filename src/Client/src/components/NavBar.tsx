import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, thin } from '@fortawesome/fontawesome-svg-core/import.macro'
import React, { SyntheticEvent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../context/AuthContext'


export const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const logoutHandler = async (event: SyntheticEvent) => {
    logout()
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (


    <Box sx={{ flexGrow: 1 }}>
      <FormGroup>
      </FormGroup>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <FontAwesomeIcon icon={regular('comment')} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Taskly
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <FontAwesomeIcon icon={regular('user-circle')} />

            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={(logoutHandler)}>
                <FontAwesomeIcon icon={regular('user-circle')} />
                &nbsp;{t("logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>

  )
}


{/* <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to=""><FontAwesomeIcon icon={regular('comment')} /> Taskly</Link>
        <div>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link" onClick={logoutHandler} to={'/'}>{t("logout")}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav> */}
