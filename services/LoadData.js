import fetchData from "./API.js";
export async function LoadData() {
  app.store.Totalcustomers = await fetchData();
}

export async function getCustomerById(id) {
  if (app.store.Totalcustomers == null) {
    await LoadData();
  }
  return app.store.Totalcustomers.find((customer) => customer.id == id);
}
