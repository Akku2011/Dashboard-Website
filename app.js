const app = document.querySelector('#app');
const storedReports = JSON.parse(localStorage.getItem('nagarpulse-reports') || 'null');
let reports = storedReports || [...CITY_DATA.reports];
let trafficMap;
let trafficMarkers = [];
const demoUsers = {
  'admin@nagarpulse.demo': {
  password: 'admin123', role: 'Administrator', name: 'Akshat', initials: 'AK'
},
  'citizen@nagarpulse.demo': {
  password: 'citizen123', role: 'Citizen', name: 'Citizen', initials: 'CT'
}
};
let session = JSON.parse(localStorage.getItem('nagarpulse-session') || 'null');
if(session && demoUsers[session.email]){
  session={email:session.email,...demoUsers[session.email]};
  localStorage.setItem('nagarpulse-session',JSON.stringify(session));
 
}

function route(){
  return location.hash.replace('#','') || 'dashboard';
 
}
function loginPage(){
  document.body.classList.add('login-mode');
  app.innerHTML = `<div class="login-screen"><form class="login-card" id="login-form"><div class="login-brand"><span class="brand-mark"><span></span><span></span><span></span></span><span><strong>NagarPulse</strong><small>City operations</small></span></div><h1>Welcome back</h1><p>Sign in to access Bhopal city operations.</p><div class="login-error" id="login-error">Administrator email or password not valid.</div><div class="field"><label for="login-email">Administrator email</label><input id="login-email" type="email" placeholder="admin@nagarpulse.demo" required /></div><div class="field"><label for="login-password">Password</label><input id="login-password" type="password" placeholder="Enter password" required /></div><button class="primary-button">Sign in as administrator</button><button class="citizen-button" type="button" id="citizen-access">Continue as citizen</button><div class="login-help"><strong>Administrator demo</strong><br />admin@nagarpulse.demo / admin123</div></form></div>`;
  document.querySelector('#login-form').addEventListener('submit', signIn);
  document.querySelector('#citizen-access').addEventListener('click', continueAsCitizen);
 
}
function signIn(event){
  event.preventDefault();
  const email=document.querySelector('#login-email').value.trim().toLowerCase(), password=document.querySelector('#login-password').value;
  const user=demoUsers[email];
  if(!user || user.role!=='Administrator' || user.password!==password){
  document.querySelector('#login-error').classList.add('show');
  return;
 
} session={email,...user};
  localStorage.setItem('nagarpulse-session',JSON.stringify(session));
  location.hash=session.role==='Administrator'?'dashboard':'reports';
  render();
  showToast(`Signed in as ${session.role}`);
 
}
function continueAsCitizen(){
  session={email:'citizen@nagarpulse.demo',...demoUsers['citizen@nagarpulse.demo']};
  localStorage.setItem('nagarpulse-session',JSON.stringify(session));
  location.hash='reports';
  render();
  showToast('Continuing as citizen');
}
function signOut(){
  session=null;
  localStorage.removeItem('nagarpulse-session');
  location.hash='';
  render();
 
}
function updateChrome(){
  document.body.classList.remove('login-mode');
  document.querySelector('#user-avatar').textContent=session.initials;
  document.querySelector('#top-avatar').textContent=session.initials;
  document.querySelector('#user-name').textContent=session.name;
  document.querySelector('#user-role').textContent=session.role;
  document.querySelectorAll('[data-admin-only]').forEach(el=>el.hidden=session.role!=='Administrator');
  document.querySelector('#reports-nav-label').textContent=session.role==='Citizen'?'Raise a Complaint':'Citizen reports';
  document.querySelector('#logout-button').onclick=signOut;
  document.querySelector('#top-logout').onclick=signOut;
 
}
function shell(title, subtitle, action='') {
  return `<div class="page-head"><div><p class="eyebrow">Bhopal city operations</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</div>`;
 
}
function statCards(){
  return `<div class="stats-grid">${CITY_DATA.stats.map(s => `<article class="stat-card"><div class="stat-top"><span class="stat-label">${s.label}</span></div><div class="stat-value">${s.value}</div><div class="stat-meta"><strong class="${s.down?'down':''}">${s.down?'↓':'↑'} ${s.meta.split(' ')[0]}</strong> ${s.meta.split(' ').slice(1).join(' ')}</div></article>`).join('')}</div>`;
 
}
function chart(){
  const points = CITY_DATA.trafficByHour.map((v,i)=>`${(i/23)*100},${100-v}`).join(' ');
  return `<div class="panel"><div class="panel-header"><div><h2 class="panel-title">Traffic flow</h2><p class="panel-note">Average congestion level by hour</p></div><select class="select-mini"><option>Today</option><option>Yesterday</option></select></div><div class="chart-wrap"><svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><line class="chart-grid-line" x1="0" y1="20" x2="100" y2="20"/><line class="chart-grid-line" x1="0" y1="45" x2="100" y2="45"/><line class="chart-grid-line" x1="0" y1="70" x2="100" y2="70"/><polyline points="${points}" fill="none" stroke="#238e88" stroke-width="1.5" vector-effect="non-scaling-stroke"/><polyline points="0,100 ${points} 100,100" fill="#dff3ef" opacity=".7" stroke="none"/></svg><div style="display:flex;justify-content:space-between;margin-top:8px" class="chart-label"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div></div></div>`;
 
}
function miniMap(){
  return `<div class="panel"><div class="panel-header"><div><h2 class="panel-title">Bhopal traffic map</h2><p class="panel-note">OpenStreetMap zone overview</p></div><a class="outline-button" href="#traffic">Details</a></div><div id="dashboard-map" class="dashboard-map"></div><div class="map-caption"><span>Updated 2 min ago</span><div class="legend"><span><i class="green-dot"></i>Low</span><span><i class="yellow-dot"></i>Moderate</span><span><i class="red-dot"></i>High</span></div></div></div>`;
 
}
function insightGraphs(){
  return `<div class="dashboard-insights"><div class="panel"><div class="panel-header"><div><h2 class="panel-title">Energy usage</h2><p class="panel-note">Daily consumption, kWh</p></div><strong class="graph-value">64%</strong></div><div class="small-chart"><svg viewBox="0 0 300 95" preserveAspectRatio="none"><polyline points="0,68 42,60 84,66 126,42 168,51 210,28 252,37 300,18" fill="none" stroke="#42a878" stroke-width="3"/><polyline points="0,95 0,68 42,60 84,66 126,42 168,51 210,28 252,37 300,18 300,95" fill="#e5f4e9" opacity=".8"/></svg></div><div class="graph-axis"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div></div><div class="panel"><div class="panel-header"><div><h2 class="panel-title">Waste collection</h2><p class="panel-note">Collection completion</p></div><strong class="graph-value">86%</strong></div><div class="bar-chart"><span style="height:58%"><i>Mon</i></span><span style="height:75%"><i>Tue</i></span><span style="height:64%"><i>Wed</i></span><span style="height:88%"><i>Thu</i></span><span style="height:79%"><i>Fri</i></span><span style="height:94%"><i>Sat</i></span><span style="height:86%"><i>Sun</i></span></div></div><div class="panel"><div class="panel-header"><div><h2 class="panel-title">Report resolution</h2><p class="panel-note">Current report status</p></div></div><div class="resolution-chart"><div class="donut"><strong>128</strong><span>Total</span></div><div class="resolution-legend"><span><i class="green-dot"></i>Resolved <b>58%</b></span><span><i class="yellow-dot"></i>In progress <b>27%</b></span><span><i class="red-dot"></i>Pending <b>15%</b></span></div></div></div></div>`;
 
}

function insightGraphsV2() {
  const energyPoints = CITY_DATA.energyByDay
    .map((value, index) => `${index * 42.8},${100 - value}`)
    .join(' ');
  const energyArea = `0,95 ${energyPoints} 300,95`;
  const { total, resolved, inProgress, pending } = CITY_DATA.reportStats;
  const wasteBars = CITY_DATA.wasteCollectionByDay
    .map((value, index) => `<span style="height:${value}%"><i>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</i></span>`)
    .join('');

  return `<div class="dashboard-insights">
    <div class="panel">
      <div class="panel-header">
        <div><h2 class="panel-title">Energy usage</h2><p class="panel-note">Daily consumption, kWh</p></div>
        <strong class="graph-value">${CITY_DATA.energyByDay.at(-1)}%</strong>
      </div>
      <div class="small-chart"><svg viewBox="0 0 300 95" preserveAspectRatio="none">
        <polyline points="${energyPoints}" fill="none" stroke="#42a878" stroke-width="3"/>
        <polyline points="${energyArea}" fill="#e5f4e9" opacity=".8"/>
      </svg></div>
      <div class="graph-axis"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div><h2 class="panel-title">Waste collection</h2><p class="panel-note">Collection completion</p></div>
        <strong class="graph-value">${CITY_DATA.wasteCollectionByDay.at(-1)}%</strong>
      </div>
      <div class="bar-chart">${wasteBars}</div>
    </div>

    <div class="panel">
      <div class="panel-header"><div><h2 class="panel-title">Report resolution</h2><p class="panel-note">Current report status</p></div></div>
      <div class="resolution-chart">
        <div class="donut" style="background:conic-gradient(var(--green) 0 ${resolved}%,var(--amber) ${resolved}% ${resolved + inProgress}%,var(--red) ${resolved + inProgress}% 100%)"><strong>${total}</strong><span>Total</span></div>
        <div class="resolution-legend">
          <span><i class="green-dot"></i>Resolved <b>${resolved}%</b></span>
          <span><i class="yellow-dot"></i>In progress <b>${inProgress}%</b></span>
          <span><i class="red-dot"></i>Pending <b>${pending}%</b></span>
        </div>
      </div>
    </div>
  </div>`;
}
function dashboard(){
  app.innerHTML = shell(`Good morning, ${session.name}.`, 'Here is what is happening across Bhopal today.', '<div class="date-badge">Tuesday, 14 October 2026</div>') + statCards() + `<div class="dashboard-grid">${chart()}${miniMap()}</div>${insightGraphsV2()}`;
  setTimeout(initDashboardMap,0);
 
}
function traffic(){
  const high=CITY_DATA.zones.filter(z=>z.color==='red').length, average=Math.round(CITY_DATA.zones.reduce((sum,z)=>sum+parseInt(z.speed),0)/CITY_DATA.zones.length);
  app.innerHTML = shell('Traffic management', 'Monitor congestion and average speed across key city zones.', '<div class="date-badge">Updated 2 min ago</div>') + `<div class="traffic-summary"><div class="traffic-kpi"><span>Monitored zones</span><strong>${CITY_DATA.zones.length}</strong><small>Across Bhopal</small></div><div class="traffic-kpi"><span>High congestion</span><strong class="kpi-red">${high}</strong><small>Needs attention</small></div><div class="traffic-kpi"><span>Average speed</span><strong>${average} <em>km/h</em></strong><small>City-wide estimate</small></div></div><div class="traffic-page-grid"><div class="panel traffic-map-panel"><div class="traffic-map-header"><div><h2 class="panel-title">Live zone map</h2><p class="panel-note">Select marker to view traffic details</p></div><div class="map-controls"><button class="map-control active">All zones</button><button class="map-control">High traffic</button></div></div><div id="traffic-map" class="leaflet-map"></div><div class="map-panel-foot"><span class="panel-note">OpenStreetMap · Simulated traffic data</span><div class="legend"><span><i class="green-dot"></i>Low</span><span><i class="yellow-dot"></i>Moderate</span><span><i class="red-dot"></i>High</span></div></div></div><div class="panel zone-panel"><div class="panel-header"><div><h2 class="panel-title">Zone status</h2><p class="panel-note">${CITY_DATA.zones.length} monitored locations</p></div></div><div class="zone-list">${CITY_DATA.zones.map(z=>`<div class="zone-row"><i class="zone-color ${z.color}-dot"></i><div class="zone-info"><strong>${z.name}</strong><small>${z.level}</small><span class="zone-bar"><i style="width:${z.congestion}%" class="${z.color}-bar"></i></span></div><span class="zone-speed">${z.speed}</span></div>`).join('')}</div></div></div>`;
  setTimeout(initMap, 0);
 
}
function pinIcon(color){
  return L.divIcon({className:'custom-pin', html:`<span style="display:block;width:16px;height:16px;border-radius:50%;background:var(--${color === 'green' ? 'green' : color === 'yellow' ? 'amber' : 'red'});border:3px solid white;box-shadow:0 2px 5px #58746d"></span>`, iconSize:[16,16], iconAnchor:[8,8]});
 
}
function initMap(){
  if(trafficMap) trafficMap.remove();
  trafficMap=L.map('traffic-map').setView([23.235,77.405],12.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(trafficMap);
  trafficMarkers=CITY_DATA.zones.map(z=>L.marker(z.coords,{icon:pinIcon(z.color)}).addTo(trafficMap).bindPopup(`<div class="popup-title">${z.name}</div><div class="popup-line"><span>Traffic level</span><strong>${z.congestion}%</strong></div><div class="popup-line"><span>Status</span><strong>${z.level.replace(' congestion','')}</strong></div><div class="popup-line"><span>Average speed</span><strong>${z.speed}</strong></div>`));
  document.querySelectorAll('.map-control').forEach(button=>button.addEventListener('click',()=>{
  const highOnly=button.textContent==='High traffic';
  document.querySelectorAll('.map-control').forEach(item=>item.classList.toggle('active',item===button));
  trafficMarkers.forEach((marker,index)=>{
  const visible=!highOnly||CITY_DATA.zones[index].color==='red';
  if(visible) marker.addTo(trafficMap);
  else trafficMap.removeLayer(marker);
 
});
 
}));
 
}
function initDashboardMap(){
  const map=L.map('dashboard-map',{zoomControl:false}).setView([23.235,77.405],11.8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);
  CITY_DATA.zones.forEach(z=>L.marker(z.coords,{icon:pinIcon(z.color)}).addTo(map).bindPopup(`<div class="popup-title">${z.name}</div><div class="popup-line"><span>Traffic level</span><strong>${z.congestion}%</strong></div><div class="popup-line"><span>Average speed</span><strong>${z.speed}</strong></div>`));
 
}
function statusClass(status){
  return status==='Pending'?'status-pending':status==='In Progress'?'status-progress':'status-resolved';
 
}
function reportItem(r,index){
  const adminControl=session.role==='Administrator'?`<select class="status-select ${statusClass(r.status)}" data-report-index="${index}" aria-label="Update report status"><option ${r.status==='Pending'?'selected':''}>Pending</option><option ${r.status==='In Progress'?'selected':''}>In Progress</option><option ${r.status==='Resolved'?'selected':''}>Resolved</option></select>`:`<span class="status ${statusClass(r.status)}">${r.status}</span>`;
  return `<article class="report-item"><div class="report-main"><h3 class="report-title">${r.type}</h3><div class="report-location">⌖ ${r.location}</div><p class="report-desc">${r.description}</p><div class="report-date">${r.date}</div></div>${adminControl}</article>`;
 
}
function reportsPage(){
  const admin=session.role==='Administrator';
  app.innerHTML = shell(admin?'Citizen reports':'Raise a Complaint', admin?'Review incoming issues and update their progress.':'Submit an issue and track its status in Bhopal.') + `<div class="reports-layout"><form class="panel form-panel" id="report-form"><h2>Report an issue</h2><p>Share details with city operations. Your report will be added to the queue.</p><div class="field"><label for="issue-type">Issue type</label><select id="issue-type" required><option value="">Select issue type</option><option>Pothole</option><option>Garbage overflow</option><option>Broken streetlight</option></select></div><div class="field"><label for="location">Location</label><input id="location" required placeholder="e.g. MP Nagar, Zone 1" /></div><div class="field"><label for="description">Description</label><textarea id="description" required placeholder="Tell us what happened..."></textarea></div><button class="primary-button">Submit report</button></form><section class="panel list-panel"><div class="list-header"><h2>${admin?'Recent reports':'My report status'}</h2><span class="report-count">${reports.length} total reports</span></div><div class="report-list">${reports.length ? reports.map(reportItem).join('') : '<div class="empty-state">No reports yet. Submit first report.</div>'}</div></section></div>`;
  document.querySelector('#report-form').addEventListener('submit', submitReport);
  document.querySelectorAll('[data-report-index]').forEach(select=>select.addEventListener('change', event=>updateReportStatus(Number(event.target.dataset.reportIndex),event.target.value)));
 
}
function submitReport(e){
  e.preventDefault();
  const type=document.querySelector('#issue-type').value, location=document.querySelector('#location').value.trim(), description=document.querySelector('#description').value.trim();
  if(!type||!location||!description)return;
  reports.unshift({type,location,description,status:'Pending',date:'Just now'});
  localStorage.setItem('nagarpulse-reports',JSON.stringify(reports));
  reportsPage();
  showToast('Report added to city operations queue');
 
}
function updateReportStatus(index,status){
  reports[index].status=status;
  localStorage.setItem('nagarpulse-reports',JSON.stringify(reports));
  reportsPage();
  showToast(`Report marked ${status}`);
 
}
function showToast(message){
  const toast=document.querySelector('#toast');
  toast.textContent=message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2800);
 
}
function updateScrollHint(){
  const hint=document.querySelector('#scroll-hint');
  if(!hint)return;
  const scrollRoot=document.scrollingElement||document.documentElement;
  const maxScroll=scrollRoot.scrollHeight-window.innerHeight;
  const atTop=scrollRoot.scrollTop<=8;
  const loggedIn=Boolean(session)&&!document.body.classList.contains('login-mode');
  hint.classList.toggle('visible',maxScroll>24&&atTop&&loggedIn);
 
}
function render(){
  if(!session){
  loginPage();
  updateScrollHint();
  return;
 
} updateChrome();
  const current=route(), allowed=session.role==='Administrator'?['dashboard','traffic','reports']:['reports'];
  const page=allowed.includes(current)?current:'reports';
  document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===page));
  ({dashboard,traffic,reports:reportsPage}[page] || dashboard)();
  window.scrollTo(0,0);
  setTimeout(updateScrollHint,100);
  setTimeout(updateScrollHint,700);
 
}
window.addEventListener('hashchange',render);
  render();
window.addEventListener('scroll',updateScrollHint,{passive:true});
  document.addEventListener('scroll',updateScrollHint,{passive:true,capture:true});
  window.addEventListener('resize',updateScrollHint);
  new ResizeObserver(updateScrollHint).observe(document.documentElement);
  document.querySelector('#scroll-hint').addEventListener('click',()=>{
  const root=document.scrollingElement||document.documentElement;
  root.scrollBy({top:Math.min(window.innerHeight*.72,560),behavior:'smooth'});
 
});
