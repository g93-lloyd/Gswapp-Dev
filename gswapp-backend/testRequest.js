const axios = require('axios');

(async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/create-wallet');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
})();
