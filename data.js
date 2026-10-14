const CITY_DATA = {
  stats: [
    { label: 'Traffic flow', value: '72%', meta: '8% vs last week', icon: '⌁', className: 'traffic-icon' },
    { label: 'Waste collected', value: '86%', meta: '4% vs last week', icon: '♻', className: 'waste-icon' },
    { label: 'Energy usage', value: '64%', meta: '6% vs last week', icon: 'ϟ', className: 'energy-icon' },
    { label: 'Citizen complaints', value: '128', meta: '12 new today', icon: '□', className: 'complaints-icon', down: true }
  ],

  trafficByHour: [38, 42, 46, 44, 48, 60, 68, 78, 74, 66, 59, 57, 61, 65, 72, 82, 88, 81, 70, 63, 56, 51, 46, 42],

  energyByDay: [52, 58, 54, 68, 63, 78, 72, 86],
  wasteCollectionByDay: [58, 75, 64, 88, 79, 94, 86],
  reportStats: { total: 128, resolved: 58, inProgress: 27, pending: 15 },

  cityPins: [
    { name: 'MP Nagar', x: 64, y: 38, color: 'red' },
    { name: 'New Market', x: 45, y: 57, color: 'yellow' },
    { name: 'Arera Colony', x: 30, y: 30, color: 'green' },
    { name: 'Bairagarh', x: 15, y: 67, color: 'green' },
    { name: 'Habibganj', x: 53, y: 76, color: 'yellow' },
    { name: 'Kolar Road', x: 76, y: 70, color: 'yellow' },
    { name: 'Lalghati', x: 28, y: 15, color: 'red' },
    { name: 'Ayodhya Bypass', x: 76, y: 24, color: 'green' }
  ],

  zones: [
    { name: 'MP Nagar Zone 1', level: 'High congestion', speed: '18 km/h', congestion: 88, color: 'red', coords: [23.2332, 77.434] },
    { name: 'New Market', level: 'Moderate congestion', speed: '29 km/h', congestion: 61, color: 'yellow', coords: [23.2387, 77.4078] },
    { name: 'Arera Colony', level: 'Low congestion', speed: '42 km/h', congestion: 28, color: 'green', coords: [23.2182, 77.432] },
    { name: 'Habibganj Station', level: 'Moderate congestion', speed: '31 km/h', congestion: 56, color: 'yellow', coords: [23.2135, 77.4322] },
    { name: 'Bairagarh', level: 'Low congestion', speed: '45 km/h', congestion: 22, color: 'green', coords: [23.269, 77.337] },
    { name: 'Lalghati', level: 'High congestion', speed: '16 km/h', congestion: 91, color: 'red', coords: [23.275, 77.365] },
    { name: 'Kolar Road', level: 'Moderate congestion', speed: '27 km/h', congestion: 67, color: 'yellow', coords: [23.174, 77.392] },
    { name: 'Ayodhya Bypass', level: 'Low congestion', speed: '39 km/h', congestion: 34, color: 'green', coords: [23.279, 77.466] },
    { name: 'Airport Road', level: 'Moderate congestion', speed: '25 km/h', congestion: 71, color: 'yellow', coords: [23.292, 77.347] },
    { name: 'Roshanpura Square', level: 'High congestion', speed: '14 km/h', congestion: 94, color: 'red', coords: [23.232, 77.401] },
    { name: 'Kohefiza', level: 'Low congestion', speed: '41 km/h', congestion: 31, color: 'green', coords: [23.274, 77.354] },
    { name: 'Jawahar Chowk', level: 'Moderate congestion', speed: '23 km/h', congestion: 76, color: 'yellow', coords: [23.222, 77.411] }
  ],

  reports: [
    { type: 'Broken streetlight', location: 'Link Road No. 1, Arera Colony', description: 'Streetlight near community park has been off for three nights.', status: 'In Progress', date: 'Today, 09:42 AM' },
    { type: 'Garbage overflow', location: '10 No. Market, Bhopal', description: 'Collection point is full and needs pickup before evening.', status: 'Pending', date: 'Today, 08:15 AM' },
    { type: 'Pothole', location: 'Hoshangabad Road, Misrod', description: 'Large pothole in left lane near the bus stop.', status: 'Resolved', date: 'Yesterday, 04:30 PM' },
    { type: 'Garbage overflow', location: 'Shahpura Lake Road', description: 'Waste bins are overflowing near the walking track.', status: 'In Progress', date: 'Yesterday, 11:20 AM' }
  ]
};
