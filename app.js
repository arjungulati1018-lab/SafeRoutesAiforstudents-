import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let map = L.map("map").setView([39.25, -76.93], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let userPos, routeLine;

window.signup = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

window.login = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

window.logout = () => signOut(auth);

onAuthStateChanged(auth, user => {
  if (user) {
    authDiv.classList.add("hidden");
    appDiv.classList.remove("hidden");
    userEmail.textContent = user.email;
  }
});

window.locate = () =>
  navigator.geolocation.getCurrentPosition(p => {
    userPos = [p.coords.latitude, p.coords.longitude];
    L.marker(userPos).addTo(map);
    map.setView(userPos, 15);
  });

const ORS = "YOUR_OPENROUTESERVICE_KEY";

window.route = async mode => {
  const res = await fetch(
    `https://api.openrouteservice.org/v2/directions/${mode}`,
    {
      method: "POST",
      headers: {
        Authorization: ORS,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinates: [[userPos[1], userPos[0]], [-76.93, 39.25]]
      })
    }
  );

  const data = await res.json();
  const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
  if (routeLine) map.removeLayer(routeLine);
  routeLine = L.polyline(coords).addTo(map);
};

window.saveRoute = async () =>
  addDoc(collection(db, "routes"), {
    user: auth.currentUser.uid,
    created: Date.now()
  });

