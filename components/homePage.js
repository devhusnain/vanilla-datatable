export class HomePage extends HTMLElement {
  loading = document.createElement("div");
  body = document.createElement("tbody");
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    this.root.appendChild(style);
    async function loadCSS() {
      const css = await fetch("/components/homePage.css");
      const text = await css.text();
      style.textContent = text;
    }
    loadCSS();
  }
  connectedCallback() {
    const template = document.getElementById("home-page-template");
    const clone = template.content.cloneNode(true);
    this.root.appendChild(clone);
    window.addEventListener("customerschange", () => {
      this.render();
    });
    this.render();
  }
  render() {
    if (app.store.Totalcustomers) {
      if (this.root.querySelector("#loading")) {
        this.root.removeChild(this.loading);
        this.loading = null;
      }
      const table = this.root.getElementById("datatable");
      if (app.store.onlyLoadOnce) {
        this.body.setAttribute("class", "datatable__body");
        table.innerHTML = "";
        const header = document.createElement("thead");

        header.setAttribute("class", "datatable__header");
        header.innerHTML = `
            <tr class="datatable__header__actions">
                <th>
                <form id="datatable__header__actions__search__form">
                <input type="text" class="datatable__header__actions__search" placeholder="Search">
                <svg width="14" class="datatable__header__actions__search__icon" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.68208 10.7458C8.66576 11.5361 7.38866 12.0067 6.00167 12.0067C2.68704 12.0067 0 9.31891 0 6.00335C0 2.68779 2.68704 0 6.00167 0C9.31631 0 12.0033 2.68779 12.0033 6.00335C12.0033 7.39059 11.533 8.66794 10.743 9.6845L13.7799 12.7186C14.0731 13.0115 14.0734 13.4867 13.7806 13.7799C13.4878 14.0731 13.0128 14.0734 12.7196 13.7805L9.68208 10.7458ZM10.5029 6.00335C10.5029 8.49002 8.48765 10.5059 6.00167 10.5059C3.5157 10.5059 1.50042 8.49002 1.50042 6.00335C1.50042 3.51668 3.5157 1.50084 6.00167 1.50084C8.48765 1.50084 10.5029 3.51668 10.5029 6.00335Z" fill="#868FA0"/>
</svg></form>
                    </th>
                <th><button type="button" class="datatable__header__actions__add" onclick="(function(path) { app.router.navigate(path); })('/add-customer')">+ Add customer</button></th>
            </tr>
            <tr class="datatable__header__columns">
            <th class="datatable__header_checkbox">
                <input type="checkbox" class="datatable__header_checkbox__input">
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Avatar</th>
            <th>Actions</th>
            </tr>
            `;
        table.appendChild(header);
      }
      app.store.onlyLoadOnce = false;
      this.body.innerHTML = "";
      app.store.pagination.customers?.forEach((item) => {
        this.body.innerHTML += `
        <tr class="datatable__body__row">
            <td class="datatable__body__row__checkbox">
                <input type="checkbox" class="datatable__body__row__checkbox__input">
            </td>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
                        <td>${item.role}</td>
                                    <td><img class="datatable__body__row__avatar" src="${item.avatar}" alt="user profile"/></td>
            <td>
                <button type="button" class="datatable__body__row__actions__edit" onclick="(function(path) { app.router.navigate(path); })('/edit-customer-${item.id}')">Edit</button>
                <button type="button" class="datatable__body__row__actions__delete" onclick="app.store.functions.deleteUser(${item.id});">Delete</button>
            </td>
        </tr>
        `;
      });
      //button for pagination
      this.body.innerHTML += `
      <div class="pagination">
         <button type="button" onclick="app.store.pagination.prevPage()">Prev</button>
         <button type="button" onclick="app.store.pagination.nextPage()">Next</button>
      </div>
      `;
      table.appendChild(this.body);

      const form = this.root.querySelector(
        "#datatable__header__actions__search__form"
      );
      const search = this.root.querySelector(
        ".datatable__header__actions__search"
      );
      form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const filtered = app.store.TotalcustomersCopy?.filter((item) =>
          item?.name?.includes(search?.value?.toLocaleLowerCase())
        );
        app.store.Totalcustomers = filtered;
      });
      const allCheckbox = this.root.querySelector(
        ".datatable__header_checkbox__input"
      );
      const checkboxes = this.root.querySelectorAll(
        ".datatable__body__row__checkbox__input"
      );

      allCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          checkboxes.forEach((ele) => {
            ele.checked = true;
          });
        } else {
          checkboxes.forEach((ele) => {
            ele.checked = false;
          });
        }
      });
    } else {
      //  show loading indicator
      this.loading.id = "loading";
      this.loading.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
      `;
      this.loading.innerHTML = "Loading...";
      this.root.appendChild(this.loading);
    }
  }
}
customElements.define("home-page", HomePage);
