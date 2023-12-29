import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import AdbIcon from '@mui/icons-material/Adb';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { selectCurrentUser } from "../features/auth/authSlice"
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import { useSelector } from "react-redux"

import { useNavigate } from 'react-router-dom'

const notLoggedInPages = {
  'Login': 'login',
  'register': 'register',
}
const loggedInPages = {
  'Profile': 'profile',
  'Account Settings': 'settings',
  'Logout': 'logout',
}

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function ScrollTop(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor',
      );
  
      if (anchor) {
        anchor.scrollIntoView({
          block: 'center',
        });
      }
    };
  
    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Fade>
    );
  }
  
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};


const RenderLoggedInUserOptions = () => {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [sendLogout, {
      isLoading,
      isSuccess,
      isError,
      error
  }] = useSendLogoutMutation()

    const navigate = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOptionClicked = (page) => {
      // Close the menu and navigate to the inteded page/logout.
      handleCloseUserMenu()
      const pageDir = loggedInPages[page]
      pageDir === 'logout' ? sendLogout() : navigate(`/${pageDir}`)
    }

    return(
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="person" src="" />
            </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {Object.keys(loggedInPages).map((setting) => (
                    <MenuItem key={setting} onClick={() => handleOptionClicked(setting)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

const RenderLoggedOutUserOptions = () => {

  const navigate = useNavigate()

  const handleOptionClicked = (page) => {
    navigate(`/${notLoggedInPages[page]}`)
  }

  return(
    Object.keys(notLoggedInPages).map((page) => (
          <Button
            key={page}
            onClick={() => handleOptionClicked(page)}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {page}
          </Button>
      ))
  )
}

const RenderPages = () => {
    const user = useSelector(selectCurrentUser)
    return user ? <RenderLoggedInUserOptions/> : <RenderLoggedOutUserOptions/>
}


export default function HideAppBar(props) {
    
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
                variant="h6"
                noWrap
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                TRIPLIO
            </Typography>

            <RenderPages/>

          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <Box sx={{ my: 2 }}>
          {[...new Array(12)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            )
            .join('\n')}
        </Box>
      </Container>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
