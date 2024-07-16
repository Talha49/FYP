"use client"
import { useState } from 'react';
import Navbar from './Navbar';
import Projects from './Projects';
import Captures from './Captures';
import FieldNotes from './FieldNotes';
import Activty from './Activty';

const Page = () => {
  const [activeTab, setActiveTab] = useState('Projects'); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="mt-4">
        {activeTab === 'Projects' && <Projects />}
        {activeTab === 'Captures' && <Captures />}
        {activeTab === 'FieldNotes' && <FieldNotes />}
        {activeTab === 'Activty' && <Activty />}
        
      </div>
    </div>
  );
};

export default Page;