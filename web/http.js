const http = axios.create({
    //@TODO: use env to determine base URL
    baseURL: 'http://localhost:4001',
    timeout: 3000,
  });