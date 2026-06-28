import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function testResponse() {
  try {
    console.log('Testing API endpoint...\n');
    
    const response = await axios.get(`${API_BASE_URL}/api/books/search`, {
      params: { q: 'harry potter', limit: 3 }
    });
    
    console.log('✅ Success!');
    console.log(`Success: ${response.data.success}`);
    console.log(response.data.books);
    
    // console.log('📚 Sample book:');
    // if (response.data.books?.[0]) {
    //   console.log(JSON.stringify(response.data.books[0], null, 2));
    // }
    
    // console.log('\n📊 Full response structure:');
    // console.log(Object.keys(response.data));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testResponse();