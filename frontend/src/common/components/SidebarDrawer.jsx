import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import GroupIcon from '@mui/icons-material/Group'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import HomeIcon from '@mui/icons-material/Home';
import Groups2Icon from '@mui/icons-material/Groups2';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LogoutIcon from '@mui/icons-material/Logout'

const MENU_BUTTON_HEIGHTS = { xs: 40, sm: 50, md: 50 }

const iconMap = {
  DashboardIcon: <DashboardIcon />,
  CloudUploadIcon: <CloudUploadIcon />,
  GroupIcon: <GroupIcon />,
  ListAltIcon: <ListAltIcon />,
  AssignmentIcon: <AssignmentIcon />,
  PeopleAltIcon: <PeopleAltIcon />,
  HomeIcon: <HomeIcon />,
  Groups2Icon: <Groups2Icon />,
  FormatListBulletedIcon: <FormatListBulletedIcon />,
  LogoutIcon: <LogoutIcon />,
}

const SidebarDrawer = ({ menuItems = [] }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const navigate = useNavigate();

  // Responsive drawer width
  const drawerWidths = { xs: 60, sm: 160, md: 200 }
  const iconSizes = { xs: 20, sm: 24, md: 24 }
  const textSizes = { xs: '9px', sm: '16px', md: '16px' }

  const handleMenuClick = () => setOpen(prev => !prev)

  // Split menu items into normal and logout
  const normalItems = menuItems.filter(item => item.action !== "logout");
  const logoutItem = menuItems.find(item => item.action === "logout");

  const handleLogout = async () => {
    const loginId = localStorage.getItem('loggin-id');
    if (loginId) {
      try {
        await fetch('/api/log-logout', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: loginId }),
        });
      } catch (error) {
        console.error('Error during logout API call:', error);
      }
    }
    localStorage.clear();
    navigate('/');
  };

  const handleItemClick = (item, event) => {
    setOpen(false);
    if (item.action === "logout") {
      handleLogout();
    }
    // For navigation, let RouterLink handle it
  };

  return (
    <>
      {/* Menu Button */}
      <Box
        sx={{
          position: isXs ? 'fixed' : 'fixed',
          top: isXs ? 0 : undefined,
          left: isXs ? 0 : undefined,
          fontSize: { xs: '12px', sm: '16px', md: '16px' },
          background: '#fff',
          borderRadius: isXs ? '0px 0px 5px 5px' : '0px 5px 5px 0',
          width: isXs ? '100vw' : drawerWidths,
          height: isXs ? MENU_BUTTON_HEIGHTS.xs : { xs: MENU_BUTTON_HEIGHTS.xs, sm: MENU_BUTTON_HEIGHTS.sm, md: MENU_BUTTON_HEIGHTS.md },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1201
        }}
      >
        <IconButton
          onClick={handleMenuClick}
          disableRipple
          disableFocusRipple
          sx={{
            width: isXs ? '100vw' : drawerWidths,
            height: isXs ? MENU_BUTTON_HEIGHTS.xs : { xs: MENU_BUTTON_HEIGHTS.xs, sm: MENU_BUTTON_HEIGHTS.sm, md: MENU_BUTTON_HEIGHTS.md },
            color: 'black',
            bgcolor: '#fff !important',
            '&:hover': {
              bgcolor: '#fff !important',
            },
            '&:active': {
              bgcolor: '#fff !important',
            },
            '&:focus': {
              bgcolor: '#fff !important',
            }
          }}>
          <MenuIcon sx={{ fontSize: iconSizes }} />
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              display: { xs: 'none', sm: 'inline' },
              fontSize: textSizes
            }}>
            Menu
          </Typography>
        </IconButton>
      </Box>
      {/* Drawer */}
      <Drawer
        anchor={isXs ? "top" : "left"}
        open={open}
        onClose={() => setOpen(false)}
        variant={isXs ? "persistant" : "persistent"}
        PaperProps={{
          sx: isXs
            ? {
                width: '100vw',
                height: 'auto',
                borderRadius: '0px 0px 8px 8px',
                boxShadow: 3,
                zIndex: 1200,
                overflowX: 'auto',
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                p: 1,
              }
            : {
                width: drawerWidths,
                position: 'fixed',
                mt:'20px',
                top: {
                  xs: `${MENU_BUTTON_HEIGHTS.xs + 8}px`,
                  sm: `${MENU_BUTTON_HEIGHTS.sm + 8}px`,
                  md: `${MENU_BUTTON_HEIGHTS.md + 8}px`
                },
                left: 0,
                height: {
                  xs: `calc(100vh - ${MENU_BUTTON_HEIGHTS.xs + 8}px)`,
                  sm: `calc(100vh - ${MENU_BUTTON_HEIGHTS.sm + 8}px)`,
                  md: `calc(100vh - ${MENU_BUTTON_HEIGHTS.md + 8}px)`
                },
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                boxShadow: 3,
                zIndex: 1200,
                overflowX: 'hidden',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }
        }}
        ModalProps={{
          keepMounted: true
        }}
      >
        {/* Main menu items */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <List
            disablePadding
            sx={{
              display: isXs ? 'flex' : 'block',
              flexDirection: isXs ? 'row' : 'column',
              width: isXs ? '100vw' : 'auto',
              p: isXs ? 1 : 0,
              pt: isXs ? 2 : 0,
            }}
          >
            {normalItems.map((item, idx) => (
              <ListItem
                button
                key={item.name}
                component={item.action === "logout" ? "button" : RouterLink}
                to={item.action === "logout" ? undefined : (item.path || item.link || "#")}
                onClick={(e) => handleItemClick(item, e)}
                sx={{
                  px: { xs: 1, sm: 2 },
                  minHeight: { xs: 44, sm: 48, md: 52 },
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'black',
                  bgcolor: '#fff !important',
                  flexDirection: isXs ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isXs ? 'auto' : '100%',
                  '&:hover': {
                    bgcolor: '#dcf4b6 !important',
                    borderBottom: "2px solid black"
                  },
                  '&:active': {
                    bgcolor: '#dcf4b6 !important',
                    color: 'black',
                  },
                  '&:focus': {
                    bgcolor: '#dcf4b6 !important',
                    color: 'black',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'black',
                    minWidth: 0,
                    mr: { xs: 0.2, sm: 0.5 },
                    fontSize: textSizes,
                    '& svg': { fontSize: iconSizes },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {iconMap[item.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: textSizes,
                    noWrap: false
                  }}
                  sx={{
                    ml: { xs: 0, sm: 1 },
                    display: { xs: 'block', sm: 'block', md: 'block' },
                    textAlign: isXs ? 'center' : 'left'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Divider and Logout at bottom */}
        {logoutItem && (
          <Box>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              <ListItem
                button
                key={logoutItem.name}
                component="button"
                onClick={handleLogout}
                sx={{
                  px: { xs: 1, sm: 2 },
                  minHeight: { xs: 44, sm: 48, md: 52 },
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'black',
                  bgcolor: '#fff !important',
                  flexDirection: isXs ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isXs ? 'auto' : '100%',
                  '&:hover': {
                    bgcolor: '#dcf4b6 !important',
                    borderBottom: "2px solid black"
                  },
                  '&:active': {
                    bgcolor: '#dcf4b6 !important',
                    color: 'black',
                  },
                  '&:focus': {
                    bgcolor: '#dcf4b6 !important',
                    color: 'black',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'black',
                    minWidth: 0,
                    mr: { xs: 0.2, sm: 0.5 },
                    fontSize: textSizes,
                    '& svg': { fontSize: iconSizes },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {iconMap[logoutItem.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={logoutItem.name}
                  primaryTypographyProps={{
                    fontSize: textSizes,
                    noWrap: false
                  }}
                  sx={{
                    ml: { xs: 0, sm: 1 },
                    display: { xs: 'block', sm: 'block', md: 'block' },
                    textAlign: isXs ? 'center' : 'left'
                  }}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Drawer>
    </>
  )
}

export default SidebarDrawer