export class HomePage extends HTMLElement {
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
      const table = this.root.getElementById("datatable");
      table.innerHTML = "";
      const header = document.createElement("thead");
      header.setAttribute("class", "datatable__header");
      header.innerHTML = `
            <tr class="datatable__header__actions">
                <th>
                <input type="text" class="datatable__header__actions__search" placeholder="Search">
                <svg width="14" class="datatable__header__actions__search__icon" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.68208 10.7458C8.66576 11.5361 7.38866 12.0067 6.00167 12.0067C2.68704 12.0067 0 9.31891 0 6.00335C0 2.68779 2.68704 0 6.00167 0C9.31631 0 12.0033 2.68779 12.0033 6.00335C12.0033 7.39059 11.533 8.66794 10.743 9.6845L13.7799 12.7186C14.0731 13.0115 14.0734 13.4867 13.7806 13.7799C13.4878 14.0731 13.0128 14.0734 12.7196 13.7805L9.68208 10.7458ZM10.5029 6.00335C10.5029 8.49002 8.48765 10.5059 6.00167 10.5059C3.5157 10.5059 1.50042 8.49002 1.50042 6.00335C1.50042 3.51668 3.5157 1.50084 6.00167 1.50084C8.48765 1.50084 10.5029 3.51668 10.5029 6.00335Z" fill="#868FA0"/>
</svg>
                    </th>
                <th><button type="button" class="datatable__header__actions__add" onclick="(function(path) { app.router.navigate(path); })('/add-customer')">+ Add customer</button></th>
            </tr>
            <tr class="datatable__header__columns">
            <th class="datatable__header_checkbox">
                <input type="checkbox" class="datatable__header_checkbox__input">
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Actions</th>
            </tr>
            `;
      table.appendChild(header);
      const body = document.createElement("tbody");
      body.setAttribute("class", "datatable__body");
      body.innerHTML = "";
      app.store.pagination.customers?.forEach((item) => {
        body.innerHTML += `
        <tr class="datatable__body__row">
            <td class="datatable__body__row__checkbox">
                <input type="checkbox" class="datatable__body__row__checkbox__input">
            </td>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.status}</td>
            <td>${item.phone}</td>
            <td>${item.amount1}</td>
            <td>${item.currency}</td>
            <td>
                <button type="button" class="datatable__body__row__actions__edit">Edit</button>
                <button type="button" class="datatable__body__row__actions__delete">Delete</button>
            </td>
        </tr>
        `;
      });
      //button for pagination
      body.innerHTML += `
      <div class="pagination">
         <button type="button" onclick="app.store.pagination.prevPage()">Prev</button>
         <button type="button" onclick="app.store.pagination.nextPage()">Next</button>
      </div>
      `;
      table.appendChild(body);
    } else {
      this.root.querySelector("#datatable").innerHTML = "Loading ...";
    }
  }
}
customElements.define("home-page", HomePage);
