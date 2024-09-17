export class AddCustomerPage extends HTMLElement {
  customer = {
    name: "",
    email: "",
    password: "",
    avatar: "",
  };
  template = document.getElementById("add-customer-page");
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  async loadCSS() {
    const style = document.createElement("style");
    this.root.appendChild(style);
    const css = await fetch("/components/addCustomerPage.css");
    const text = await css.text();
    style.textContent = text;
  }
  async connectedCallback() {
    // Create and show loading indicator
    const loading = document.createElement("div");
    loading.style = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  `;
    loading.innerHTML = "Loading...";
    this.root.appendChild(loading);

    // Load CSS
    await this.loadCSS();

    // Remove loading indicator
    this.root.removeChild(loading);

    // Append the clone and render content
    const clone = this.template.content.cloneNode(true);
    this.root.appendChild(clone);
    this.render();
  }
  async render() {
    const data = await this.getAvatars();
    this.renderAvatars(data);

    this.setFormBinding(this.root.querySelector("form"));
  }
  async getAvatars() {
    const response = await fetch("/data/data.json");
    const data = await response.json();
    return data;
  }
  renderAvatars(data) {
    const customSelectTrigger = this.root.querySelector(
      ".custom-select-trigger"
    );
    const customOptionsContainer = this.root.querySelector(".custom-options");
    customOptionsContainer.style.display = "none";
    if (data?.success) {
      const avatars = data?.photos;
      avatars.forEach((avatar) => {
        const option = document.createElement("div");
        option.classList.add("custom-option");
        option.innerHTML = `
          <img src="${avatar.url}" alt="${avatar.title}" />
          <span>${avatar.title}</span>
        `;
        option.addEventListener("click", () => {
          customSelectTrigger.textContent = avatar.title;
          this.customer.avatar = avatar.url;
          customOptionsContainer
            .querySelectorAll(".custom-option")
            .forEach((option) => {
              option.classList.remove("selected");
            });
          option.classList.add("selected");
          customOptionsContainer.style.display = "none";
        });
        customOptionsContainer.appendChild(option);
      });
    }
    customSelectTrigger.addEventListener("click", function () {
      customOptionsContainer.style.display =
        customOptionsContainer.style.display === "none" ? "block" : "none";
    });
    this.root.addEventListener("click", function (event) {
      if (!customSelectTrigger.contains(event.target)) {
        customOptionsContainer.style.display = "none";
      }
    });
  }
  setFormBinding(form) {
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.submitter.disabled = true;
        event.submitter.style.cursor = "not-allowed";
        if (!this.customer.avatar) {
          alert("Avatar is required");
          return;
        }
        const created = await this.createUser();
        if (!created) {
          event.submitter.disabled = false;
          event.submitter.style.cursor = "pointer";
          return;
        }
        this.customer.name = "";
        this.customer.email = "";
        this.customer.password = "";
        this.customer.avatar = "";
        this.root.querySelector(".custom-select-trigger").textContent = "";
        event.submitter.disabled = false;
        event.submitter.style.cursor = "pointer";
      });
      this.customer = new Proxy(this.customer, {
        set(target, property, value) {
          target[property] = value;
          if (property !== "avatar") form.elements[property].value = value;
          return true;
        },
      });
      Array.from(form?.elements).forEach((ele) => {
        ele?.addEventListener("change", (event) => {
          this.customer[ele.name] = ele.value;
        });
      });
    }
  }
  async createUser() {
    await fetch("https://api.escuelajs.co/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this?.customer.name,
        email: this?.customer.email,
        password: this?.customer.password,
        avatar: this?.customer.avatar,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (data?.id) {
        app.router.navigate("/");
        app.store.functions.loadData();
        return true;
      } else {
        alert("Error creating user");
        return false;
      }
    });
  }
}
customElements.define("add-customer", AddCustomerPage);
