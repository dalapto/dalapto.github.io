import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { blue } from '@mui/material/colors';
import {Link} from "react-router-dom";

const projects = [{ name: 'WebDev - ArcGIS JS', route: "arcgis"  }, 
{name: 'Modding: Rise of Nations - WW2', route: "ron"}, {name: 'Modding: M2TW - Early to Late', route: "m2tw"}];
const pages = ['About', 'Projects' , 'Blog'];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElProjects, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenProjectsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseProjectsMenu = () => {
    setAnchorElUser(null);
  };

  return (
<AppBar id="NavBar" position="static">
<Container maxWidth={false}>
  <Toolbar disableGutters>
    <SickSharpIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }} />
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      LOGO
    </Typography>

    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none'} }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu //burger menu for mobile
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page} onClick={handleCloseNavMenu}>
            <Typography textAlign="center">
            { (page == "Projects") ? page : <Link style={{textDecoration:"none", color: "black"}}to={`/${page}`}>{page}</Link> } 
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
    <SickSharpIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
    <Typography
      variant="h5"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: { xs: 'flex', md: 'none' },
        flexGrow: 1,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      LOGO
    </Typography>
    <Box sx={{ flexGrow: 1, display: { justifyContent: "flex-end", xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, color: 'white', display: 'block' }}>
            { (page == "Projects") ? page : <Link style={{textDecoration:"none", color: "white"}}to={`/${page}`}>{page}</Link> }
        </Button>
      ))}
    </Box>


    <Box sx={{ flexGrow: 0, display: 'flex', mr: 2}}>
            <Tooltip title="Link to LinkedIn">
              <a href="https://www.linkedin.com/in/david-mcalister/" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ p: 0 }}>
                    <LinkedInIcon sx={{ color: blue[500] }} />
                </IconButton>
              </a>
            </Tooltip>
          </Box>
        <Box sx={{ flexGrow: 0, display: 'flex', mr:1, justifyContent: "" }}>
            <Tooltip title="Link to GitHub">
            <a href="https://github.com/dalapto/react-arcgis" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ p: 0 }}>
                    <GitHubIcon sx={{ color: blue[50] }} />
                </IconButton>
            </a>
            </Tooltip>
    </Box>
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenProjectsMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElProjects}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElProjects)}
        onClose={handleCloseProjectsMenu}
      >
        {projects.map((project) => (
          <MenuItem key={project.route} onClick={handleCloseProjectsMenu}>
            <Typography textAlign="center">
              <Link style={{textDecoration:"none", color: "black"}}to={`/${project.route}`}>{project.name}</Link>
              </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  </Toolbar>
</Container>
</AppBar>
);
}
export default NavBar;