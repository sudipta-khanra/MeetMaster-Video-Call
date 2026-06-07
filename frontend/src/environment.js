// const server = "http://localhost:8000";
// export default server;

let IS_PROD = false;
const server = IS_PROD
  ? 'https://meetmaster-backend.onrender.com'
  : 'http://localhost:8000';
export default server;
