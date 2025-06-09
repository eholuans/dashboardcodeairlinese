const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const moment = require("moment");
moment.locale("pt-br");

const app = express();

app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  helpers: {
    formatDate: function(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    formatTime: function(date) {
      return moment(date).format("HH:mm");
    },
    formatDateTime: function(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    eq: function (a, b) {
      return a === b;
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dashboardRoutes = require("./routes/dashboardRoutes");
const vooRoutes = require("./routes/vooRoutes");

app.use("/", dashboardRoutes);
app.use("/voos", vooRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dashboard Admin rodando na porta ${PORT}`);
});


