import Layout from "./Layout.jsx";

import MealPicker from "./MealPicker";

import RestaurantSearch from "./RestaurantSearch";

import RestaurantResult from "./RestaurantResult";

import History from "./History";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    MealPicker: MealPicker,
    
    RestaurantSearch: RestaurantSearch,
    
    RestaurantResult: RestaurantResult,
    
    History: History,
    
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
                
                    <Route path="/" element={<MealPicker />} />
                
                
                <Route path="/MealPicker" element={<MealPicker />} />
                
                <Route path="/RestaurantSearch" element={<RestaurantSearch />} />
                
                <Route path="/RestaurantResult" element={<RestaurantResult />} />
                
                <Route path="/History" element={<History />} />
                
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