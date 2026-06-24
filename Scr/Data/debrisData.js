export const DEBRIS_DATA = [
  { id:1, name:"FENGYUN 1C",      norad:"25730", altitude:"863 km",  inclination:"98.6°", risk:"CRITICAL", type:"Defunct Satellite",  country:"China",   launched:"1999-05-10", mass:"958 kg",    description:"Destroyed in a 2007 ASAT test, creating the largest single debris cloud in history with 3,500+ trackable fragments." },
  { id:2, name:"COSMOS 2251",     norad:"22675", altitude:"784 km",  inclination:"74.0°", risk:"HIGH",     type:"Defunct Satellite",  country:"Russia",  launched:"1993-06-16", mass:"900 kg",    description:"Russian military satellite destroyed in the 2009 Iridium–Cosmos collision, generating hundreds of fragments." },
  { id:3, name:"SL-8 Rocket Body",norad:"16657", altitude:"970 km",  inclination:"82.9°", risk:"HIGH",     type:"Rocket Body",        country:"Russia",  launched:"1986-09-19", mass:"1,440 kg",  description:"Soviet Kosmos-3M upper stage — one of many spent rocket bodies in highly-inclined orbits posing long-term risks." },
  { id:4, name:"IRIDIUM 33",      norad:"24946", altitude:"776 km",  inclination:"86.4°", risk:"MEDIUM",   type:"Fragment Field",     country:"USA",     launched:"1997-09-14", mass:"689 kg",    description:"Commercial satellite destroyed in the 2009 Iridium–Cosmos collision. Fragments remain across a wide debris field." },
  { id:5, name:"NOAA 16",         norad:"26536", altitude:"849 km",  inclination:"99.0°", risk:"MEDIUM",   type:"Defunct Satellite",  country:"USA",     launched:"2000-09-21", mass:"1,457 kg",  description:"Weather satellite that suffered an anomaly in 2014 and broke into at least 200 tracked pieces in polar orbit." },
  { id:6, name:"Envisat",         norad:"27386", altitude:"790 km",  inclination:"98.5°", risk:"LOW",      type:"Defunct Satellite",  country:"ESA",     launched:"2002-03-01", mass:"8,211 kg",  description:"The largest Earth-observation satellite ever built. Lost contact in 2012. Prime Active Debris Removal candidate." },
  { id:7, name:"Meteor 2-5",      norad:"09245", altitude:"977 km",  inclination:"81.2°", risk:"LOW",      type:"Defunct Satellite",  country:"Russia",  launched:"1975-07-08", mass:"1,200 kg",  description:"One of the oldest derelict satellites still tracked in a near-circular LEO orbit." },
];

export const RISK_STYLE = {
  CRITICAL:{ bg:"#FDECEA", color:"#c62828" },
  HIGH:    { bg:"#FFF3E0", color:"#e65100" },
  MEDIUM:  { bg:"#FFFDE7", color:"#f57f17" },
  LOW:     { bg:"#E8F5E9", color:"#2e7d32" },
};
