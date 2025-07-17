import Layout from "./Layout.jsx";

import Home from "./Home";

import Aurora from "./Aurora";

import ApprenticePortal from "./ApprenticePortal";

import LearnEngage from "./LearnEngage";

import Calculator from "./Calculator";

import Literature from "./Literature";

import Media from "./Media";

import Interactive from "./Interactive";

import FiveSGame from "./FiveSGame";

import RSLegoBuilder from "./RSLegoBuilder";

import SpinningDiskSimulation from "./SpinningDiskSimulation";

import TimeFrequencyDomain from "./TimeFrequencyDomain";

import StaticUnbalanceSimulator from "./StaticUnbalanceSimulator";

import Register from "./Register";

import NotFound from "./NotFound";

import SawdustSocial from "./SawdustSocial";

import About from "./About";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Aurora: Aurora,
    
    ApprenticePortal: ApprenticePortal,
    
    LearnEngage: LearnEngage,
    
    Calculator: Calculator,
    
    Literature: Literature,
    
    Media: Media,
    
    Interactive: Interactive,
    
    FiveSGame: FiveSGame,
    
    RSLegoBuilder: RSLegoBuilder,
    
    SpinningDiskSimulation: SpinningDiskSimulation,
    
    TimeFrequencyDomain: TimeFrequencyDomain,
    
    StaticUnbalanceSimulator: StaticUnbalanceSimulator,
    
    Register: Register,
    
    NotFound: NotFound,
    
    SawdustSocial: SawdustSocial,
    
    About: About,
    
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
                
                <Route path="/Aurora" element={<Aurora />} />
                
                <Route path="/ApprenticePortal" element={<ApprenticePortal />} />
                
                <Route path="/LearnEngage" element={<LearnEngage />} />
                
                <Route path="/Calculator" element={<Calculator />} />
                
                <Route path="/Literature" element={<Literature />} />
                
                <Route path="/Media" element={<Media />} />
                
                <Route path="/Interactive" element={<Interactive />} />
                
                <Route path="/FiveSGame" element={<FiveSGame />} />
                
                <Route path="/RSLegoBuilder" element={<RSLegoBuilder />} />
                
                <Route path="/SpinningDiskSimulation" element={<SpinningDiskSimulation />} />
                
                <Route path="/TimeFrequencyDomain" element={<TimeFrequencyDomain />} />
                
                <Route path="/StaticUnbalanceSimulator" element={<StaticUnbalanceSimulator />} />
                
                <Route path="/Register" element={<Register />} />
                
                <Route path="/NotFound" element={<NotFound />} />
                
                <Route path="/SawdustSocial" element={<SawdustSocial />} />
                
                <Route path="/About" element={<About />} />
                
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