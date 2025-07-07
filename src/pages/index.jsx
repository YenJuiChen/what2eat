import Layout from "./Layout.jsx";

import Home from "./Home";

import RestaurantList from "./RestaurantList";

import RestaurantDetail from "./RestaurantDetail";

import History from "./History";

import Favorites from "./Favorites";

import Settings from "./Settings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    RestaurantList: RestaurantList,
    
    RestaurantDetail: RestaurantDetail,
    
    History: History,
    
    Favorites: Favorites,
    
    Settings: Settings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/RestaurantList" element={<RestaurantList />} />
                
                <Route path="/RestaurantDetail" element={<RestaurantDetail />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/Favorites" element={<Favorites />} />
                
                <Route path="/Settings" element={<Settings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}