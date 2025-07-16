// Simple test script to verify API endpoints
async function testAPI() {
    try {
        console.log('Testing plant list API...');
        const response = await fetch('/api/plants/plant_list/6a36660d-daae-48dd-a4fe-000b191b13d8');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Plant list response:', data);
        
        if (data.plants && data.plants.length > 0) {
            console.log(`Found ${data.plants.length} plants`);
            console.log('First plant:', data.plants[0]);
        }
        
    } catch (error) {
        console.error('API test failed:', error);
    }
}

// Run the test
testAPI();

console.log('API test script loaded. Check console for results.');
