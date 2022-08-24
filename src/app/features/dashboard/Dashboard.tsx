import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Graph from '../graph_example/example';
import Environment from '../pact/environments/Environment';
import Environments from '../pact/environments/Environments';
import Pacticipant from '../pact/pacticipants/Pacticipant';
import Pacticipants from '../pact/pacticipants/Pacticipants';

const drawerWidth = 240;

interface MenuItem {
    displayText: string;
    path: string;
}

const menuItems: MenuItem[] = [
    {
        displayText: 'Environments',
        path: '/environments',
    },
    {
        displayText: 'Pacticipants',
        path: '/pacticipants',
    },
    {
        displayText: 'Graph',
        path: '/graph',
    },
    {
        displayText: 'Dashboard',
        path: '/dashboard',
    },
];

export default function ResponsiveDrawer() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={item.displayText} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                            }}
                        >
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={item.displayText} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="absolute"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    {!matches && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography variant="h6" noWrap component="div">
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {!matches && (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                )}

                {matches && (
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>
            <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <Routes>
                    <Route path="/" element={<div>Home</div>}></Route>
                    <Route path="environments">
                        <Route path="" element={<Environments />}></Route>
                        <Route path=":environmentId" element={<Environment />}></Route>
                    </Route>
                    <Route path="pacticipants">
                        <Route path="" element={<Pacticipants />}></Route>
                        <Route path=":pacticipantName" element={<Pacticipant />}></Route>
                    </Route>
                    <Route path="graph" element={<Graph></Graph>}></Route>
                    <Route path="dashboard" element={<div></div>}></Route>
                </Routes>
            </Box>
        </Box>
    );
}
