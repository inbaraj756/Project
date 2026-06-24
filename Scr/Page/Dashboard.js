import React, { useState } from "react";
import { signOut } from "../firebase/auth";
import AIAssistant from "../components/AIAssistant";
import GlobeView from "../components/GlobeView";
import MissionPlanner from "../pages/MissionPlanner";
import Statistics from "../pages/Statistics";
import AboutPage from "../pages/AboutPage";
import "../styles/Dashboard.css";
import { DEBRIS_DATA, RISK_STYLE } from "../data/debrisData";

const STATS = [
  { icon:"🛰️", value:"54,000+", label:"Tracked Objects",   color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.25)" },
  { icon:"🔴", value:"140M",    label:"Total Pieces",       color:"#f97316", bg:"rgba(249,115,22,0.1)",  border:"rgba(249,115,22,0.25)" },
  { icon:"⚠️", value:"73%",    label:"Kessler Risk Index", color:"#eab308", bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.25)" },
  { icon:"💰", value:"$480B",  label:"Economy at Risk",    color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.25)" },
];


const TABS = ["Globe View","Debris Catalog","Mission Planner","Statistics","ℹ️ About"];

const Dashboard = ({ user }) => {
  const [activeTab,   setActiveTab]   = useState("Debris Catalog");
  const [selectedObj, setSelectedObj] = useState(null);
  const [search,      setSearch]      = useState("");

  const filtered = DEBRIS_DATA.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.norad.includes(search) ||
    d.risk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="db-root">

      {/* NAV */}
      <nav className="db-nav">
        <div className="db-nav__brand">
          <span className="db-nav__emoji">🛰️</span>
          <span className="db-nav__title">AstroIntellect</span>
        </div>
        <div className="db-nav__tabs" role="tablist">
          {TABS.map(tab => (
            <button key={tab} id={`tab-${tab.replace(/\s+/g,"-").toLowerCase()}`}
              role="tab" aria-selected={activeTab===tab}
              className={`db-nav__tab${activeTab===tab?" db-nav__tab--active":""}`}
              onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
        <div className="db-nav__user">
          {user?.photoURL && <img src={user.photoURL} alt="avatar" className="db-nav__avatar"/>}
          <span className="db-nav__username">{user?.displayName?.split(" ")[0] || "Operator"}</span>
          <button id="btn-signout" className="db-nav__signout" onClick={signOut}>Sign Out</button>
        </div>
      </nav>

      {/* STATS */}
      <section className="db-stats">
        {STATS.map(({ icon, value, label, color, bg, border }) => (
          <div key={label} className="db-stat-card" style={{"--sc":color,"--sb":bg,"--sbr":border}}>
            <span className="db-stat-card__icon">{icon}</span>
            <div>
              <div className="db-stat-card__value">{value}</div>
              <div className="db-stat-card__label">{label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* CONTENT */}
      {activeTab === "Globe View" ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <GlobeView onSelectObject={(obj) => {
            setSelectedObj(obj);
            setActiveTab("Debris Catalog");
          }} />
        </div>
      ) : activeTab === "Mission Planner" ? (
        <MissionPlanner />
      ) : activeTab === "Statistics" ? (
        <Statistics />
      ) : activeTab === "ℹ️ About" ? (
        <AboutPage />
      ) : (
        <div className="db-content">

          {/* CATALOG */}
          <main className="db-catalog">
            <div className="db-catalog__header">
              <div>
                <h2 className="db-catalog__title">Space Debris Catalog</h2>
                <p className="db-catalog__sub">{filtered.length} objects · Click a row to inspect</p>
              </div>
              <input id="input-search" type="search" placeholder="Search objects…"
                className="db-catalog__search" value={search}
                onChange={e => setSearch(e.target.value)} aria-label="Search debris catalog"/>
            </div>

            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Object Name</th><th>NORAD ID</th><th>Altitude</th>
                    <th>Inclination</th><th>Risk Level</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(obj => {
                    const rs = RISK_STYLE[obj.risk] || RISK_STYLE.LOW;
                    const active = selectedObj?.id === obj.id;
                    return (
                      <tr key={obj.id}
                        className={`db-table__row${active?" db-table__row--active":""}`}
                        onClick={() => setSelectedObj(obj)} aria-selected={active}>
                        <td className="db-table__name">{obj.name}</td>
                        <td className="db-table__mono">{obj.norad}</td>
                        <td>{obj.altitude}</td>
                        <td>{obj.inclination}</td>
                        <td><span className="db-risk-badge" style={{background:rs.bg,color:rs.color}}>{obj.risk}</span></td>
                        <td>
                          <button id={`btn-select-${obj.norad}`} className="db-table__select-btn"
                            onClick={e=>{e.stopPropagation();setSelectedObj(obj);}}>Select</button>
                        </td>
                      </tr>
                    );
                  })}
                  {!filtered.length && (
                    <tr><td colSpan={6} className="db-table__empty">No objects match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className={`db-sidebar${selectedObj?" db-sidebar--open":""}`}>
            {selectedObj ? (
              <>
                <div className="db-sidebar__header">
                  <div>
                    <h3 className="db-sidebar__name">{selectedObj.name}</h3>
                    <span className="db-risk-badge" style={{background:RISK_STYLE[selectedObj.risk].bg,color:RISK_STYLE[selectedObj.risk].color}}>
                      {selectedObj.risk}
                    </span>
                  </div>
                  <button id="btn-close-sidebar" className="db-sidebar__close"
                    onClick={() => setSelectedObj(null)}>✕</button>
                </div>

                <div className="db-sidebar__orbit" aria-hidden="true">
                  <div className="orbit-ring"/><div className="orbit-ring orbit-ring--2"/>
                  <span className="orbit-dot">🛸</span>
                </div>

                <div className="db-sidebar__details">
                  {[
                    ["NORAD ID",    selectedObj.norad],
                    ["Object Type", selectedObj.type],
                    ["Country",     selectedObj.country],
                    ["Altitude",    selectedObj.altitude],
                    ["Inclination", selectedObj.inclination],
                    ["Launched",    selectedObj.launched],
                    ["Est. Mass",   selectedObj.mass],
                  ].map(([k,v]) => (
                    <div key={k} className="db-sidebar__row">
                      <span className="db-sidebar__key">{k}</span>
                      <span className="db-sidebar__val">{v}</span>
                    </div>
                  ))}
                </div>

                <AIAssistant selectedObj={selectedObj} />
              </>
            ) : (
              <div className="db-sidebar__empty">
                <span style={{fontSize:"3rem"}}>🔭</span>
                <p>Select a debris object<br/>to view its details</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
