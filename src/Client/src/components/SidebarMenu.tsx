import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { t } from "i18next";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from "../hooks/auth.hook";

export const SidebarMenu: React.FunctionComponent = () => {
    const [toggled, setToggled] = useState<boolean>(false)
    const navigate = useNavigate()
    const { logout } = useAuth()

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setToggled(false)}
        >
            <List>
                <ListItem button key={t('home') as string}
                    onClick={() => navigate("/")}>
                    <ListItemText primary={t('home') as string} />
                </ListItem>
                <ListItem button key={t('users') as string}
                    onClick={() => navigate("/users")}>
                    <ListItemText primary={t('users') as string} />
                </ListItem>
                <ListItem button key={t('units') as string}
                    onClick={() => navigate("/units")}>
                    <ListItemText primary={t('units') as string} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key={t('settings') as string}
                    onClick={() => navigate("/settings")}>
                    <ListItemText primary={t('settings') as string} />
                </ListItem>
                <ListItem button key={t('logout') as string}
                    onClick={() => logout()}>
                    <ListItemText primary={t('logout') as string} />
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