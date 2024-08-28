import Store from "./services/Store.js";
import Router from "./services/Router.js";
import { LoadData } from "./services/LoadData.js";
import "./components/homePage.js";
import "./components/addCustomerPage.js";
import "./components/customerDetailPage.js";
import "./components/editCustomerPage.js";
window.app = {};
app.store = Store;
app.router = Router;
window.addEventListener("DOMContentLoaded", async () => {
  LoadData();
  app.router.init();
});
