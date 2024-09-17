import Store from "./services/Store.js";
import Router from "./services/Router.js";
import "./components/homePage.js";
import "./components/addCustomerPage.js";
import "./components/editCustomerPage.js";
window.app = {};
app.store = Store;
app.router = Router;
window.addEventListener("DOMContentLoaded", async () => {
  app.store.functions.loadData();
  app.router.init();
});
