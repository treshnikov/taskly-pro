import { CircularProgress } from "@mui/material"
import { LOADING_SCREEN_ID } from "../redux/appSlice"

export const LoadingScreen: React.FunctionComponent = () => {
    
    return <div
        id={LOADING_SCREEN_ID}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(248, 248, 249, 0.5)',
            zIndex: 999999,
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'silver'
        }}>
        <div>
            <CircularProgress color="inherit" />
        </div>
    </div>

}