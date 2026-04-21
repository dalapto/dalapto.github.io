import * as React from 'react';
import './FooterBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { SvgIconComponent } from '@mui/icons-material';
import { IconButtonLink } from '../../common/IconButton/IconButtonLink';
import { Tooltip } from '@mui/material';

export interface FooterBarExternalLink {
    href: string;
    icon: SvgIconComponent;
}

interface FooterBarProps {
    externalLinks?: FooterBarExternalLink[];
    copyrightText?: string;
}

const tooltips = [
    { text: 'Vite', link: 'https://vitejs.dev/', img: 'vite.png' },
    { text: 'React', link: 'https://react.dev/', img: 'react.webp' },
    { text: 'TypeScript', link: 'https://www.typescriptlang.org/', img: 'ts.png' },
    { text: 'Material UI', link: 'https://mui.com/', img: 'mui.png' },
    { text: 'GitHub Pages', link: 'https://pages.github.com/', img: 'gh.png' },
];

const tooltipLinks = tooltips.map((tooltip) => (
    <span key={tooltip.text}>
        {tooltip.text != tooltips[tooltips.length - 1].text ? ' ' : ' and '}
        <br />
        <Tooltip followCursor={true} placement="top" title={<img width={25} height={25} src={`/img/logo/${tooltip.img}`}></img>}>
            <a href={tooltip.link} target="_blank" rel="noopener noreferrer">
                <span>{tooltip.text}</span>
            </a>
        </Tooltip>
        {tooltip.text != tooltips[tooltips.length - 1].text ? ', ' : '.'}
    </span>
));

function FooterBar({ externalLinks = [], copyrightText }: FooterBarProps) {
    return (
        <AppBar id="footerbar" position="static" component="footer">
            <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-center' }}>

                {/* icons & links for each package */}
                <Typography fontSize={'1.1rem'} fontFamily={'monospace'} marginTop={'100px'}>
                    <span>This page is built with</span>
                    {tooltipLinks}
                </Typography>

                <Toolbar disableGutters>
                    {copyrightText && (
                        <Typography id="footer-copyright" variant="body2" sx={{ mr: 2 }}>
                            {copyrightText}
                        </Typography>
                    )}

                    {externalLinks.map((link, index) => (
                        <Box key={index} sx={{ flexGrow: 0, display: 'flex', mr: index === externalLinks.length - 1 ? 0 : 1 }}>
                            <IconButtonLink href={link.href} icon={link.icon} ariaLabel={link.href} style={{ color: 'white' }} />
                        </Box>
                    ))}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export { FooterBar };
