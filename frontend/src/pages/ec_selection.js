import React from "react";
import "./ec_selection.css";
import SidebarDrawer from "../common/components/SidebarDrawer";

const EcSelection = () => {
  // Modified navigateTo to support query params
  const navigateTo = (url, ecName) => {
    if (ecName) {
      window.location.href = `${url}?ec=${encodeURIComponent(ecName)}`;
    } else {
      window.location.href = url;
    }
  };

  return (
    <div>
      {/* Sidebar Drawer */}
      <div className="sidebar-drawer">
        <SidebarDrawer
          menuItems={[
            { name: "Recruit", icon: "GroupIcon", path: "/apprecruit" },
            { name: "Prescreening", icon: "ListAltIcon", path: "/prescreening-form" },
          ]}
        />
      </div>
      {/* Back Button */}
      <div className="backbutton" onClick={() => navigateTo("index")}>
        <i className="fas fa-arrow-left"></i>
      </div>

      {/* Cards Section */}
      <div className="card-container">
        <div
          className="card"
          onClick={() => navigateTo("cloudrecruit", "Cloud EC")}
        >
          <i className="fas fa-cloud card-icon"></i>
          <div className="card-title">Cloud EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("apprecruit", "App EC")}
        >
          <i className="fas fa-cogs card-icon"></i>
          <div className="card-title">App EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("datarecruit", "Data EC")}
        >
          <i className="fas fa-database card-icon"></i>
          <div className="card-title">Data EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("corerecruit", "Core EC")}
        >
          <i className="fas fa-microchip card-icon"></i>
          <div className="card-title">Core EC</div>
        </div>
      </div>
    </div>
  );
};

export default EcSelection;