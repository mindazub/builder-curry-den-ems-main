// Test script to show timestamp formatting
const testTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
const date = new Date(testTimestamp * 1000);

// Format timestamp as requested: "Tue 2025-07-22 14:31:50:279"
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayName = dayNames[date.getDay()];
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');
const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

const formattedTimestamp = `${dayName} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;

console.log('Original Unix Timestamp:', testTimestamp);
console.log('Formatted Timestamp:', formattedTimestamp);
console.log('Example format: Thu 2025-08-01 16:54:25:123');
