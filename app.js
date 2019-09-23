const app = require('./src/config/server')();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server ON. Listening on port ${port}`);
});
