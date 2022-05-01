import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react"

export const SidebarMenu: React.FunctionComponent = () => {
    const [toggled, setToggled] = useState<boolean>(false)

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setToggled(false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setToggled(true)}
            >
                <FontAwesomeIcon icon={solid('bars')} />
            </IconButton>
            <Drawer
                anchor={'left'}
                open={toggled}
                onClose={() => setToggled(false)}
            >
                {list()}
            </Drawer>
        </div>)
}