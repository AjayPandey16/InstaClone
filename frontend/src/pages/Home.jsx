import React from 'react';
import NavBar from '../components/NavBar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import TopUsers from '../components/Topusers.jsx';
import Posts from '../components/Posts.jsx';

const Home = () => {
    return (
        <> 
            <NavBar />
            <TopUsers />
            <Posts />
            <BottomNav />
        </>
    );
}

export default Home;
