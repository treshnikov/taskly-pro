import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { t } from "i18next";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useHttp } from "../hooks/http.hook";
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { Logout } from '@mui/icons-material';


export const SidebarMenu: React.FunctionComponent = () => {
    const [toggled, setToggled] = useState<boolean>(false)
    const navigate = useNavigate()
    const { logout } = useHttp()

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setToggled(false)}
        >
            <List>
                <ListItem disablePadding onClick={() => navigate("/")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('home') as string} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding onClick={() => navigate("/projects")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ArticleOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('projects') as string} />
                    </ListItemButton>
                </ListItem>


                <ListItem disablePadding onClick={() => navigate("/departmentPlans")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountTreeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('departments') as string} />
                    </ListItemButton>
                </ListItem>

            </List>
            <Divider />
            <List>

                <ListItem disablePadding onClick={() => navigate("/settings")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('settings') as string} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding onClick={() => logout()}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary={t('logout') as string} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <div >
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => setToggled(true)}
                >
                    <MenuIcon />
                </IconButton>
            </div>
            <Drawer
                anchor={'left'}
                open={toggled}
                onClose={() => setToggled(false)}
            >
                {list()}
            </Drawer>
        </div>)
}