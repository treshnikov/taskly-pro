import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import React, { SyntheticEvent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarMenu } from './SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import { UserVm } from '../models/Users/UserVm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Logout } from '@mui/icons-material';
import { useHttp } from '../hooks/http.hook';

export const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { request, logout } = useHttp();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, setUser] = useState<UserVm>(new UserVm());
  const navigate = useNavigate()

  const logoutHandler = async (event: SyntheticEvent) => {
    logout()
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const u = await request<UserVm>("/api/v1/users/user")
      setUser(u as UserVm)
    }
    fetchUser()
  }, [request])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormGroup>
      </FormGroup>
      <AppBar position="static" style={{
        backgroundColor: "rgb(243, 244, 245)",
        boxShadow: "#eeeeee 0px 0px 20px 0px",
        color: "rgb(44, 44, 44)",
        height: "60px"
      }}>
        <Toolbar>
          <SidebarMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <p className='logo' onClick={e => { navigate("/") }} >{t('app-name')}</p>
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
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
              <div style={{ paddingLeft: 10, paddingRight: 10, cursor: 'default', textAlign: 'center' }}>
                {user.name}
              </div>
              <Divider />
              <MenuItem onClick={(logoutHandler)}>
                <Logout />
                &nbsp;{t("logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>

  )
}