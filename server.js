const app = require("./app/app");
const http = require("http");
const PORT = process.env.PORT;
const server = http.createServer(app);
server.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("- ".repeat(15));
  console.log("server running on port " + PORT);
  console.log("url : http://localhost:" + PORT);
});
