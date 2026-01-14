// app.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ===== KEYS =====
const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjVmNjk3YTk2YWQzYTRmODU4NjZiN2FiMDhjYjkwZDYyIiwiaCI6Im11cm11cjY0In0=";
const WEATHER_KEY = "77f9ce623c375c5310ddb9f1e8229c66";

// ===== AUTH =====
window.signup = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try { await createUserWithEmailAndPassword(auth, email, pass); alert("Account created!"); }
  catch(err){ alert(err.message); }
};

window.login = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try { await signInWithEmailAndPassword(auth, email, pass); }
  catch(err){ alert(err.message); }
};

window.logout = () => signOut(auth);

onAuthStateChanged(auth, user => {
  if(user){
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("userEmail").textContent = `👤 ${user.email}`;
    loadSavedRoutes();
  } else {
    document.getElementById("auth").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
  }
});

// ===== MAP =====
const map = L.map("map").setView([39.25,-76.93],13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// ===== SCHOOL ZONES =====
const schools = [
   { name: "Atholton High School", type: "high", lat: 39.2069, lng: -76.8813, address: "6520 Freetown Rd, Columbia, MD 21044", students: 1400 },
  { name: "Centennial High School", type: "high", lat: 39.2342, lng: -76.8341, address: "4300 Centennial Ln, Ellicott City, MD 21042", students: 1700 },
  { name: "Glenelg High School", type: "high", lat: 39.2625, lng: -76.9856, address: "14025 Burntwoods Rd, Glenelg, MD 21737", students: 1200 },
  { name: "Hammond High School", type: "high", lat: 39.1963, lng: -76.8902, address: "8800 Guilford Rd, Columbia, MD 21046", students: 1500 },
  { name: "Howard High School", type: "high", lat: 39.2546, lng: -76.8676, address: "8700 Old Annapolis Rd, Ellicott City, MD 21043", students: 1600 },
  { name: "Long Reach High School", type: "high", lat: 39.2094, lng: -76.8159, address: "6101 Old Dobbin Ln, Columbia, MD 21045", students: 1300 },
  { name: "Marriotts Ridge High School", type: "high", lat: 39.3189, lng: -76.8994, address: "12100 Woodford Dr, Marriottsville, MD 21104", students: 1250 },
  { name: "Mt. Hebron High School", type: "high", lat: 39.2697, lng: -76.8416, address: "9440 Old Frederick Rd, Ellicott City, MD 21042", students: 1450 },
  { name: "Oakland Mills High School", type: "high", lat: 39.2157, lng: -76.8829, address: "9410 Kilimanjaro Rd, Columbia, MD 21045", students: 1100 },
  { name: "Reservoir High School", type: "high", lat: 39.1564, lng: -76.8975, address: "11550 Scaggsville Rd, Fulton, MD 20759", students: 1550 },
  { name: "River Hill High School", type: "high", lat: 39.1459, lng: -76.9341, address: "12101 Clarksville Pike, Clarksville, MD 21029", students: 1650 },
  { name: "Wilde Lake High School", type: "high", lat: 39.2246, lng: -76.8675, address: "5460 Trumpeter Rd, Columbia, MD 21044", students: 1150 },

  // Middle Schools (20)
  { name: "Bonnie Branch Middle School", type: "middle", lat: 39.2591, lng: -76.8532, address: "4979 Ilchester Rd, Ellicott City, MD 21043", students: 850 },
  { name: "Clarksville Middle School", type: "middle", lat: 39.2032, lng: -76.9525, address: "6535 S Trotter Rd, Clarksville, MD 21029", students: 900 },
  { name: "Dunloggin Middle School", type: "middle", lat: 39.2589, lng: -76.8418, address: "9129 Northfield Rd, Ellicott City, MD 21042", students: 800 },
  { name: "Elkridge Landing Middle School", type: "middle", lat: 39.2029, lng: -76.7589, address: "7085 Landing Rd, Elkridge, MD 21075", students: 950 },
  { name: "Ellicott Mills Middle School", type: "middle", lat: 39.2740, lng: -76.8057, address: "4445 Montgomery Rd, Ellicott City, MD 21043", students: 820 },
  { name: "Folly Quarter Middle School", type: "middle", lat: 39.3007, lng: -76.8869, address: "13500 Triadelphia Rd, Ellicott City, MD 21042", students: 780 },
  { name: "Harper's Choice Middle School", type: "middle", lat: 39.2205, lng: -76.8819, address: "5450 Beaverkill Rd, Columbia, MD 21044", students: 870 },
  { name: "Lake Elkhorn Middle School", type: "middle", lat: 39.2024, lng: -76.8595, address: "6680 Cradlerock Way, Columbia, MD 21045", students: 830 },
  { name: "Lime Kiln Middle School", type: "middle", lat: 39.1838, lng: -76.9585, address: "11650 Scaggsville Rd, Fulton, MD 20759", students: 910 },
  { name: "Mayfield Woods Middle School", type: "middle", lat: 39.2144, lng: -76.8308, address: "7950 Red Barn Way, Elkridge, MD 21075", students: 790 },
  { name: "Murray Hill Middle School", type: "middle", lat: 39.1827, lng: -76.8835, address: "9989 Winter Sun Rd, Laurel, MD 20723", students: 860 },
  { name: "Oakland Mills Middle School", type: "middle", lat: 39.2183, lng: -76.8669, address: "9540 Kilimanjaro Rd, Columbia, MD 21045", students: 810 },
  { name: "Patapsco Middle School", type: "middle", lat: 39.2306, lng: -76.8090, address: "8885 Old Frederick Rd, Ellicott City, MD 21043", students: 880 },
  { name: "Patuxent Valley Middle School", type: "middle", lat: 39.1791, lng: -76.8244, address: "9151 Vollmerhausen Rd, Savage, MD 20763", students: 840 },
  { name: "Thomas Viaduct Middle School", type: "middle", lat: 39.2180, lng: -76.7753, address: "7000 Banbury Dr, Hanover, MD 21076", students: 920 },
  { name: "Wilde Lake Middle School", type: "middle", lat: 39.2335, lng: -76.8669, address: "10481 Cross Fox Ln, Columbia, MD 21044", students: 770 },
  { name: "Windsor Mill Middle School", type: "middle", lat: 39.3306, lng: -76.7585, address: "8600 Lucille Ave, Baltimore, MD 21244", students: 890 },
  { name: "Burleigh Manor Middle School", type: "middle", lat: 39.2540, lng: -76.9055, address: "4200 Centennial Ln, Ellicott City, MD 21042", students: 820 },
  { name: "Mount View Middle School", type: "middle", lat: 39.1863, lng: -76.9377, address: "9989 Winter Sun Rd, Marriottsville, MD 21104", students: 780 },
  { name: "Hammond Middle School", type: "middle", lat: 39.1860, lng: -76.8900, address: "8100 Aladdin Dr, Laurel, MD 20723", students: 830 },

  // Elementary Schools (41)
  { name: "Bellows Spring Elementary", type: "elementary", lat: 39.1824, lng: -76.8505, address: "8125 Old Stockbridge Dr, Elkridge, MD 21075", students: 450 },
  { name: "Bollman Bridge Elementary", type: "elementary", lat: 39.1459, lng: -76.8988, address: "8200 Savage-Guilford Rd, Savage, MD 20763", students: 420 },
  { name: "Bryant Woods Elementary", type: "elementary", lat: 39.2154, lng: -76.8752, address: "5450 Blue Heron Ln, Columbia, MD 21044", students: 380 },
  { name: "Bushy Park Elementary", type: "elementary", lat: 39.1959, lng: -76.9419, address: "14601 Carrs Mill Rd, Glenwood, MD 21738", students: 410 },
  { name: "Clemens Crossing Elementary", type: "elementary", lat: 39.2305, lng: -76.8923, address: "10320 Quarterstaff Rd, Columbia, MD 21044", students: 390 },
  { name: "Cradlerock Elementary", type: "elementary", lat: 39.2044, lng: -76.8585, address: "6700 Cradlerock Way, Columbia, MD 21045", students: 360 },
  { name: "Deep Run Elementary", type: "elementary", lat: 39.3102, lng: -76.9202, address: "6925 Old Waterloo Rd, Elkridge, MD 21075", students: 430 },
  { name: "Ducketts Lane Elementary", type: "elementary", lat: 39.1821, lng: -76.7835, address: "6501 Ducketts Ln, Elkridge, MD 21075", students: 440 },
  { name: "Elkridge Elementary", type: "elementary", lat: 39.2044, lng: -76.7585, address: "7075 Montgomery Rd, Elkridge, MD 21075", students: 400 },
  { name: "Forest Ridge Elementary", type: "elementary", lat: 39.3474, lng: -76.7974, address: "9550 Gorman Rd, Laurel, MD 20723", students: 370 },
  { name: "Fulton Elementary", type: "elementary", lat: 39.1544, lng: -76.9252, address: "11600 Scaggsville Rd, Fulton, MD 20759", students: 350 },
  { name: "Gorman Crossing Elementary", type: "elementary", lat: 39.2127, lng: -76.8419, address: "9999 Winter Sun Rd, Laurel, MD 20723", students: 420 },
  { name: "Guilford Elementary", type: "elementary", lat: 39.1724, lng: -76.8724, address: "7335 Oakland Mills Rd, Columbia, MD 21046", students: 390 },
  { name: "Hammond Elementary", type: "elementary", lat: 39.1960, lng: -76.8835, address: "8110 Aladdin Dr, Laurel, MD 20723", students: 410 },
  { name: "Hollifield Station Elementary", type: "elementary", lat: 39.2919, lng: -76.8419, address: "8701 Stonehouse Dr, Ellicott City, MD 21043", students: 380 },
  { name: "Ilchester Elementary", type: "elementary", lat: 39.2585, lng: -76.8419, address: "4981 Ilchester Rd, Ellicott City, MD 21043", students: 360 },
  { name: "Jeffers Hill Elementary", type: "elementary", lat: 39.2085, lng: -76.8752, address: "6001 Tamar Dr, Columbia, MD 21045", students: 340 },
  { name: "Longfellow Elementary", type: "elementary", lat: 39.2585, lng: -76.8419, address: "5470 Hesperus Dr, Columbia, MD 21044", students: 320 },
  { name: "Manor Woods Elementary", type: "elementary", lat: 39.2224, lng: -76.8919, address: "11575 Frederick Rd, Ellicott City, MD 21042", students: 410 },
  { name: "Northfield Elementary", type: "elementary", lat: 39.2669, lng: -76.8419, address: "9125 Northfield Rd, Ellicott City, MD 21042", students: 390 },
  { name: "Pointers Run Elementary", type: "elementary", lat: 39.2073, lng: -76.9305, address: "6600 S Trotter Rd, Clarksville, MD 21029", students: 430 },
  { name: "Rockburn Elementary", type: "elementary", lat: 39.2030, lng: -76.7835, address: "6145 Montgomery Rd, Elkridge, MD 21075", students: 420 },
  { name: "Running Brook Elementary", type: "elementary", lat: 39.2252, lng: -76.8669, address: "5215 W Running Brook Rd, Columbia, MD 21044", students: 380 },
  { name: "St. John's Lane Elementary", type: "elementary", lat: 39.2752, lng: -76.8419, address: "3270 St. John's Ln, Ellicott City, MD 21042", students: 370 },
  { name: "Stevens Forest Elementary", type: "elementary", lat: 39.2169, lng: -76.8669, address: "6045 Stevens Forest Rd, Columbia, MD 21045", students: 350 },
  { name: "Swansfield Elementary", type: "elementary", lat: 39.2224, lng: -76.8669, address: "5610 Cedar Ln, Columbia, MD 21044", students: 340 },
  { name: "Talbot Springs Elementary", type: "elementary", lat: 39.1821, lng: -76.8669, address: "9550 Basket Ring Rd, Columbia, MD 21045", students: 320 },
  { name: "Thunder Hill Elementary", type: "elementary", lat: 39.2335, lng: -76.8835, address: "9357 Mellenbrook Rd, Columbia, MD 21045", students: 410 },
  { name: "Triadelphia Ridge Elementary", type: "elementary", lat: 39.2252, lng: -76.9419, address: "13400 Triadelphia Rd, Ellicott City, MD 21042", students: 390 },
  { name: "Waterloo Elementary", type: "elementary", lat: 39.3002, lng: -76.9202, address: "5940 Waterloo Rd, Columbia, MD 21045", students: 370 },
  { name: "Waverly Elementary", type: "elementary", lat: 39.2502, lng: -76.8669, address: "10220 Wetherburn Rd, Ellicott City, MD 21042", students: 360 },
  { name: "West Friendship Elementary", type: "elementary", lat: 39.2919, lng: -76.9585, address: "12500 Frederick Rd, West Friendship, MD 21794", students: 290 },
  { name: "Veterans Elementary", type: "elementary", lat: 39.1860, lng: -76.8127, address: "4355 Montgomery Rd, Elkridge, MD 21075", students: 420 },
  { name: "Laurel Woods Elementary", type: "elementary", lat: 39.1221, lng: -76.8280, address: "9250 North Laurel Rd, Laurel, MD 20723", students: 380 },
  { name: "Water's Edge Elementary", type: "elementary", lat: 39.1677, lng: -76.8977, address: "4601 Terrapin Xing, Columbia, MD 21044", students: 410 },
  { name: "Dasher Green Elementary", type: "elementary", lat: 39.2183, lng: -76.8808, address: "6680 Cradlerock Way, Columbia, MD 21045", students: 370 },
  { name: "Phelps Luck Elementary", type: "elementary", lat: 39.2124, lng: -76.8419, address: "5370 Oldstone Dr, Columbia, MD 21045", students: 390 },
  { name: "Hickory Ridge Elementary", type: "elementary", lat: 39.2269, lng: -76.8419, address: "10205 Hickory Ridge Rd, Columbia, MD 21044", students: 350 },
  { name: "Centennial Lane Elementary", type: "elementary", lat: 39.2519, lng: -76.8319, address: "3825 Centennial Ln, Ellicott City, MD 21042", students: 420 },
  { name: "Worthington Elementary", type: "elementary", lat: 39.2319, lng: -76.8819, address: "4570 Roundhill Rd, Ellicott City, MD 21043", students: 360 },
  { name: "Dayton Oaks Elementary", type: "elementary", lat: 39.2419, lng: -76.9919, address: "4691 Ten Oaks Rd, Dayton, MD 21036", students: 310 }
];

schools.forEach(s=>{
  L.circle([s.lat,s.lng], {radius:300,color:"orange",fillColor:"orange",fillOpacity:0.15})
  .addTo(map)
  .bindPopup(`🏫 ${s.name} School Zone`);
});

// ===== GEOLOCATION =====
let userPos; let routeLine;
window.locate = ()=>{
  if(!navigator.geolocation) return alert("Geolocation not supported");
  navigator.geolocation.getCurrentPosition(pos=>{
    userPos=[pos.coords.latitude,pos.coords.longitude];
    L.marker(userPos).addTo(map).bindPopup("You are here").openPopup();
    map.setView(userPos,15);
  });
};

// ===== AI RISK SCORING =====
function calculateRisk(lat,lng){
  let risk=0;
  schools.forEach(s=>{
    const d=map.distance([lat,lng],[s.lat,s.lng]);
    if(d<300) risk+=3;
  });
  if(Math.random()<0.2) risk+=2; // placeholder for real traffic data
  return risk;
}

// ===== ROUTING =====
window.route = async mode=>{
  if(!userPos) return alert("Get your location first");
  const res = await fetch(`https://api.openrouteservice.org/v2/directions/${mode}`,{
    method:"POST",
    headers:{Authorization:ORS_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({coordinates:[[userPos[1],userPos[0]],[-76.93,39.25]]})
  });
  const data = await res.json();
  const coords=data.features[0].geometry.coordinates;
  let totalRisk=0;
  coords.forEach(c=>{ totalRisk+=calculateRisk(c[1],c[0]); });
  const riskLevel= totalRisk<50?"🟢 Low Risk":totalRisk<100?"🟡 Medium Risk":"🔴 High Risk";
  if(routeLine) map.removeLayer(routeLine);
  routeLine=L.polyline(coords.map(c=>[c[1],c[0]]),{color:riskLevel.includes("Low")?"green":riskLevel.includes("Medium")?"orange":"red",weight:4}).addTo(map);
  alert(`Route Safety: ${riskLevel}`);
};

// ===== WEATHER =====
window.loadWeather = async ()=>{
  const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=39.25&lon=-76.93&units=imperial&appid=${WEATHER_KEY}`);
  const d = await r.json();
  document.getElementById("weather").innerHTML=`🌡 ${d.main.temp}°F — ${d.weather[0].description}`;
};

// ===== SAVE / LOAD ROUTES =====
async function loadSavedRoutes(){
  if(!auth.currentUser) return;
  const snapshot = await getDocs(collection(db,"routes"));
  const ul=document.getElementById("saved"); ul.innerHTML="";
  snapshot.forEach(doc=>{
    if(doc.data().user===auth.currentUser.uid){
      const li=document.createElement("li");
      li.textContent=`Route ${doc.id} - ${new Date(doc.data().created).toLocaleString()}`;
      ul.appendChild(li);
    }
  });
}

window.saveRoute = async ()=>{
  if(!auth.currentUser) return alert("Login first");
  if(!routeLine) return alert("No route to save");
  try{
    await addDoc(collection(db,"routes"),{user:auth.currentUser.uid,created:Date.now(),coords:routeLine.getLatLngs()});
    alert("Route saved!"); loadSavedRoutes();
  } catch(err){ alert(err.message); }
};

// ===== PUSH NOTIFICATIONS HOOKS =====
// Register your service worker and FCM later
// navigator.serviceWorker.register("sw.js").then(()=>{console.log("Service worker ready for notifications");});
