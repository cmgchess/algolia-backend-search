const express    = require('express');  
const app = express();
var cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const searchRouter = require("./routes/search");


app.get("/", (req, res) => {
  res.send('API is running...');
});

app.use("/search", searchRouter);


app.get("/*", (req, res) => {
  res.status(404).json({
    sucess: 0,
    message: "Page Not Found",
  });
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));


module.exports = server;