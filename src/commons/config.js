
const config = process.env.NODE_ENV === 'development' ? {
  host: window.host,
  api: window.api
} : {
  host: window.host,
  api: window.api
}

export default config