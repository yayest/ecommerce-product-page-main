function gallery(current, documentNode) {
  const view = document.getElementById(current);
  const thumbnails = documentNode.querySelectorAll(".thumbnails img");
  const navigationButtons = documentNode.querySelectorAll(".navigation button");

  thumbnails.forEach((element) => {
    element.addEventListener("click", () => {
      view.src = element.dataset.srcset;
      removeClassCurrent(thumbnails);
      element.classList.add("current");
    });

    element.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
        case " ":
          view.src = element.dataset.srcset;
          removeClassCurrent(thumbnails);
          element.classList.add("current");
          break;
      }
    });
  });

  navigationButtons.forEach((element) => {
    element.addEventListener("click", () => {
      const currentView = document.getElementById(current);

      let i = 0;
      thumbnails.forEach((img, index) => {
        if (img.dataset.srcset === currentView.attributes.src.value) {
          i = index;
        }
      });

      switch (element.attributes.rel.value) {
        case "next":
          ++i;
          thumbnails.length > i ? i : (i = 0);
          break;
        case "prev":
          --i;
          i >= 0 ? i : (i = thumbnails.length - 1);
          break;
      }

      view.src = thumbnails[i].dataset.srcset;
      removeClassCurrent(thumbnails);
      thumbnails[i].classList.add("current");
    });
  });
}

gallery("currentView", document);

function removeClassCurrent(thumbnails) {
  thumbnails.forEach((img) => {
    img.classList.remove("current");
  });
}

const quantityButtons = document.querySelectorAll(".quantity button");

quantityButtons.forEach((element) => {
  element.addEventListener("click", () => {
    const quantity = document.getElementById("quantity");

    switch (element.attributes.rel.value) {
      case "plus":
        quantity.innerHTML++;
        break;
      case "minus":
        let n = quantity.innerHTML;
        +n >= 1 ? quantity.innerHTML-- : (quantity.innerHTML = 0);
        break;
    }
  });
});

const add = document.getElementById("add");
const template = document.getElementById("item");
const product = {
  id: 123456789,
  name: "Fall Limited Edition Sneakers",
  price: 125.0,
};
let buttonsDelete;

add.addEventListener("click", () => {
  const wrapper = document.getElementById("goods");
  const quantity = document.getElementById("quantity");

  if (+quantity.innerHTML == 0) return;

  const status = document.getElementById("status");
  status.dataset.status = quantity.innerHTML == 0 ? "" : quantity.innerHTML;

  const referenceItem = wrapper.children[0];
  const item = template.content.cloneNode(true);
  item.querySelector("[data-id]").dataset.id = product.id;
  item.querySelector(".name").textContent = product.name;
  item.querySelector(".price").textContent = formatUSD(product.price);
  const number = item.querySelector(".number");
  const total = item.querySelector(".total");

  if (!wrapper.querySelector(".item")) {
    number.textContent = quantity.innerHTML;
    total.textContent = formatUSD(product.price * +quantity.innerHTML);

    wrapper.insertBefore(item, referenceItem.nextSibling);
  } else {
    const dataIds = wrapper.querySelectorAll("[data-id]");

    dataIds.forEach((dataId) => {
      if (dataId.dataset.id == add.dataset.id) {
        dataId.remove();
        number.textContent = quantity.innerHTML;
        total.textContent = formatUSD(product.price * +quantity.innerHTML);

        wrapper.insertBefore(item, referenceItem.nextSibling);
      }
    });
  }

  document.getElementById("cart").showPopover();

  buttonsDelete = wrapper.querySelectorAll("button");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-id]").remove();
      let n = +status.dataset.status - number.textContent;
      status.dataset.status = n == 0 ? "" : n;
    });
  });
});

function formatUSD(price) {
  return Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

const galleryView = document.querySelector(".view img");

galleryView.addEventListener("click", () => {
  const galleryNode = document.querySelector(".gallery");
  const cloneGallery = galleryNode.cloneNode(true);
  const dialogGallery = document.getElementById("gallery");

  if (dialogGallery.getElementsByClassName("gallery")[0]) {
    dialogGallery.showPopover();
    return;
  }

  let img = cloneGallery.querySelector("#currentView");
  img.id = "currentViewClone";

  dialogGallery.append(cloneGallery);
  dialogGallery.showPopover();
  gallery("currentViewClone", cloneGallery);
});
