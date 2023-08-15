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
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
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
    <SickSharpIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 3 }} />
    <Typography
      variant="h5"
      noWrap
      component="p"
      sx={{
        mr: 2,
        display: { xs: 'flex', md: 'flex' },
        flexGrow: 1,
        fontSize: '1.5rem',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      DM
    </Typography>

    {/* //burger menu for mobile instead of navbar */}
    <Box sx={{ display: { xs: 'flex', md: 'none'} }}>  
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
      <Menu 
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
          <MenuItem key={page} onClick={(page == "Projects") ? handleOpenProjectsMenu : handleCloseNavMenu}>
            { (page == "Projects") ? page : <Link style={{textDecoration:"none", color: "black"}}to={`/${page}`}>{page}</Link> } 

          </MenuItem>
        ))}
      </Menu>
    </Box>

    
    {/* pages as normal */}
    <Box sx={{ flexGrow: 0.25, display: { justifyContent: "space-around", xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
        key={page}
        onClick={(page == "Projects") ? handleOpenProjectsMenu : handleCloseNavMenu}
        sx={{ my: 2, color: 'white', display: 'block' }}>
            <Typography textAlign="center" sx={{textTransform:"capitalize", fontFamily:"arial", fontSize: '1.2rem'}}>
            { (page == "Projects") ? page : <Link style={{textDecoration:"none", color: "white"}}to={`/${page}`}>{page}</Link> }
            </Typography>
        </Button>
      ))}
    </Box>


    <Box sx={{ flexGrow: 0, display: 'flex', mr: 2}}>
              <a href="https://www.linkedin.com/in/david-mcalister/" target="_blank" rel="noopener noreferrer">
                <IconButton>
                    {/* issues getting this to look 100% like normal icon, left for now */}
                    <LinkedInIcon sx={{ color: 'blue', backgroundColor: 'white' }} />
                    {/* could also move to a bottom navbar with a white bg instead, which would avert issue */}
                </IconButton>
              </a>
          </Box>
        <Box sx={{ flexGrow: 0, display: 'flex', mr:1, justifyContent: "" }}>
            <a href="https://github.com/dalapto/react-arcgis" target="_blank" rel="noopener noreferrer">
                <IconButton>
                    <GitHubIcon sx={{ color: 'white' }} />
                </IconButton>
            </a>
    </Box>
    <Box sx={{ flexGrow: 0 }}>
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