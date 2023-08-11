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

const projects = ['WebDev - ArcGIS JS', 'Modding: Rise of Nations - WW2', 'Modding: M2TW - Early to Late'];
const routes = ["about", "projects", "blog", "arcgis", "ron", "m2tw"];
const pages = ['About', 'Projects' , 'Blog'];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar id="NavBar" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Box sx={{ flexGrow: 100, display: { xs: 'none', md: 'flex' } }}>
          <SickSharpIcon/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: 4,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
        </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleOpenUserMenu}
                sx={{ my: 2, color: 'white' }}>
                {page}
              </Button>
            ))}
            {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
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
                {projects.map((project) => (
                    <MenuItem key={project} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{project}</Typography>
                    </MenuItem>
                ))}
            </Menu>
            </MenuItem>
            ))}
          </Box>
          
          
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, mr: 2}}>
            <Tooltip title="Link to LinkedIn">
              <a href="https://www.linkedin.com/in/david-mcalister/" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ p: 0 }}>
                    <LinkedInIcon sx={{ color: blue[500] }} />
                </IconButton>
              </a>
            </Tooltip>
          </Box>
        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, mr:1 }}>
            <Tooltip title="Link to GitHub">
            <a href="https://github.com/dalapto/react-arcgis" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ p: 0 }}>
                    <GitHubIcon sx={{ color: blue[50] }} />
                </IconButton>
            </a>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;