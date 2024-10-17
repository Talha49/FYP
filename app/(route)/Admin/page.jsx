"use client"
import React, { useState } from "react";
import Header from "./_components/Header";
import Table from "./_components/Table";

function Admin()  {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="mx-4">
      <div className="ml-5 sm:ml-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className="ml-5 sm:ml-0">
        <Table searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Admin;
