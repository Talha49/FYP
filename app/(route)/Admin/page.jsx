import React from "react";
import Header from "./_components/Header";
import Table from "./_components/Table";

const Admin = () => {
  return (
    <div className="mx-4">
      <div className="ml-5 sm:ml-0">
        <Header />
      </div>
      <div className="ml-5 sm:ml-0">
        <Table />
      </div>
    </div>
  );
};

export default Admin;
