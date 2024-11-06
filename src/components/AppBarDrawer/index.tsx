import React, { useState } from 'react';
import MainAppBar from './MainAppBar';
import ResponsiveDrawer from './ResponsiveDrawer';

function AppBarDrawer({isLoggedIn}: {isLoggedIn:boolean}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <MainAppBar handleDrawerToggle={handleDrawerToggle} isLoggedIn={isLoggedIn} />
            {isLoggedIn && (
                <ResponsiveDrawer drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} isLoggedIn={isLoggedIn}/>
            )}
        </>
    );
}

export default AppBarDrawer;