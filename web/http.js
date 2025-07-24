const http = axios.create({
    baseURL: `${window.location.origin}/coachlab`,
    timeout: 5000,
  })

export default http