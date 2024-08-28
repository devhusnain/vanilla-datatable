const Router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        let path = e.target.getAttribute("href");
        Router.navigate(path);
      });
    });

    document.addEventListener("popstate", (e) => {
      Router.navigate(location.pathname);
    });

    Router.navigate(location.pathname);
  },
  navigate: (path, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ path }, "", path);
    }
    let pageElement = null;
    switch (path) {
      case "/":
        pageElement = document.createElement("home-page");
        break;
      case "/index.html":
        pageElement = document.createElement("home-page");
        break;
      case "/add-customer":
        pageElement = document.createElement("add-customer");
        break;
      default:
        if (path.startsWith("/customer-detail-")) {
          const customerId = path.split("-")[2];
          if (customerId) {
            pageElement = document.createElement("customer-detail-page");
            pageElement.dataset.customerId = customerId;
          }
        }
        if (path.startsWith("/edit-customer-")) {
          const customerId = path.split("-")[2];
          if (customerId) {
            pageElement = document.createElement("edit-customer-page");
            pageElement.dataset.customerId = customerId;
          }
        }
    }
    if (pageElement) {
      const app = document.querySelector("main");
      app.innerHTML = "";
      app.appendChild(pageElement);
      window.scrollTo(0, 0);
    } else {
      pageElement = document.createElement("page-not-found");
    }
  },
};
export default Router;
