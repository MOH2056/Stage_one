require('dotenv').config();
 const express = require('express');

 //importing axios module
const axios = require('axios');
//creating a server instance
const instance = express();

const PORT = 4000;

instance.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const location = geoResponse.data.city || 'location not known';
        const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/current`, {
            params: {
                key: process.env.KEY_WEATHER,
                city: location
            }
        });

        const temperature = weatherResponse.data.data[0].temp;

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        console.error('Error response data:', error.response ? error.response.data : 'No response data');
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

instance.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
