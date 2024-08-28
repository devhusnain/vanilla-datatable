export class AddCustomerPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    this.root.appendChild(style);
    async function loadCSS() {
      const css = await fetch("/components/addCustomerPage.css");
      const text = await css.text();
      style.textContent = text;
    }
    loadCSS();
  }
  connectedCallback() {
    const template = document.getElementById("add-customer-page");
    const clone = template.content.cloneNode(true);
    this.root.appendChild(clone);
    this.render();
  }
  render() {}
}
customElements.define("add-customer", AddCustomerPage);
