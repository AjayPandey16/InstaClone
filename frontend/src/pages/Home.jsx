import React from 'react';
import NavBar from '../components/NavBar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import TopUsers from '../components/Topusers.jsx';
import Posts from '../components/Posts.jsx';

const Home = () => {
    return (
        <main className="feed-shell min-h-screen pb-16 md:pb-8">
            <NavBar />
            <TopUsers />
            <Posts />
            <BottomNav />
        </main>
    );
}

export default Home;
