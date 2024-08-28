const Store = {
  Totalcustomers: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    customers: null,
    isNextPage: function () {
      return this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage);
    },
    isPrevPage: function () {
      return this.currentPage > 1;
    },
    nextPage: function () {
      if (this.isNextPage()) {
        this.currentPage += 1;
        this.computeCustomersData();
        window.dispatchEvent(new Event("customerschange"));
      }
    },
    prevPage: function () {
      if (this.isPrevPage()) {
        this.currentPage -= 1;
        this.computeCustomersData();
        window.dispatchEvent(new Event("customerschange"));
      }
    },
    computeCustomersData: function () {
      let start,
        end = null;
      if (this.currentPage === 1) {
        start = 0;
        end = this.itemsPerPage;
      } else {
        start = (this.currentPage - 1) * this.itemsPerPage;
        end = this.currentPage * this.itemsPerPage;
      }
      this.customers = Store.Totalcustomers.slice(start, end);
    },
  },
};
const proxiedStore = new Proxy(Store, {
  set: (targrt, key, value) => {
    targrt[key] = value;
    if (key === "Totalcustomers") {
      Store.pagination.totalItems = value.length;
      Store.pagination.computeCustomersData();
      window.dispatchEvent(new Event("customerschange"));
    }
    return true;
  },
});

export default proxiedStore;
