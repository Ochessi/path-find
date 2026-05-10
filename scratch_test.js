const axios = require('axios');
axios.post('https://path-find-backend.onrender.com/api/jobs/applications/', { job_listing: "test", status: "applied" })
  .catch(e => console.log(e.response?.data));
