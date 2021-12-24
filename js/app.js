// 我網址路徑
const api_path = "peter77730";
const token = "mMbOGWzLLGahdTzsOQ5Giq6aTOA3";

// 取得產品列表初始化
let productListData = [];

function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productListData = response.data.products;
      selectCategoryData();
      dataList(productListData);
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 下拉選單
const productSelect = document.querySelector(".productSelect");

function selectCategoryData() {
  let arr = [];
  let uniqueArr;
  let str = "";
  productListData.forEach((item) => arr.push(item.category));
  uniqueArr = [...new Set(arr)]; //篩選單一category
  str += `<option value="全部" selected>全部</option>`;
  uniqueArr.forEach((el) => {
    str += `<option value="${el}">${el}</option>`;
  });
  productSelect.innerHTML = str;
}

// 產品列表渲染
const productWrap = document.querySelector(".productWrap");
function dataList(e) {
  let str = "";
  e.forEach((item) => {
    str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt="${item.title}"
    />
    <a href="##" data-title="${item.title}" class="addCardBtn">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>`;
  });
  productWrap.innerHTML = str;
  buttonGet();
}

// 關鍵字搜尋
const keywordSelect = document.querySelector(".keywordSelect");
const keywordBtn = document.querySelector(".keywordBtn");
const keywordNullWord = document.querySelector(".keywordNullWord");
keywordBtn.addEventListener("click", (e) => {
  keywordNullWord.textContent = "";
  let keyword = keywordSelect.value;
  keyword = keyword.trim().toLowerCase();
  if (keyword == "") {
    keywordNullWord.textContent = "沒有輸入關鍵字喔!";
    return;
  }
  let productSearchData = [];
  productListData.forEach((item) => {
    let str = item.title;
    str = str.toLowerCase();
    if (str.match(keyword) != null) {
      productSearchData.push(item);
    }
  });
  if (productSearchData.length == 0) {
    keywordNullWord.textContent = "試試其他關鍵字吧！";
  }
  dataList(productSearchData);
});

// 選擇種類列表渲染
productSelect.addEventListener("change", (e) => {
  keywordNullWord.textContent = "";
  let productSelectData = [];
  productListData.forEach((item) => {
    if (item.category == e.target.value) {
      productSelectData.push(item);
    } else if (e.target.value == "全部") {
      productSelectData = productListData;
    }
  });
  dataList(productSelectData);
});

// 購物車資訊
const shoppingCart = document.querySelector(".shoppingCart-table");
let carData;
function carDataList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      carData = response.data.carts;
      if (carData.length == 0){
        carRenderListNo();
      }else{
        carRenderList();
      }     
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

// 空空購物車
function carRenderListNo() {
  let str="";
  str += `<tr>
  <th width="35%">品項</th>
  <th width="15%">單價</th>
  <th width="10%">數量</th>
  <th width="15%">金額</th>
  <th width="10%">刪除</th>
</tr>`;
  shoppingCart.innerHTML = str;
}

//滿滿購物車
function carRenderList() {
  let str = "";
  let priceNum = 0;
  let number = 0;
  str += `<tr>
  <th width="35%">品項</th>
  <th width="15%">單價</th>
  <th width="10%">數量</th>
  <th width="15%">金額</th>
  <th width="10%">刪除</th>
</tr>`;
  carData.forEach((item) => {
    let price = Number.parseInt(item.product.price);
    let num = Number.parseInt(item.quantity);
    let NT = price * num;
    let id = item.product.id;
    priceNum += NT;
    str += `<tr>
    <td>
      <div class="cardItem-title">
        <img src="${item.product.images}" alt="${item.product.title}" />
        <p>${item.product.title}</p>
      </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>
    <div class="buttonClass">
    <a href="#" class="subtractionNum" data-sub=${id}><span class="material-icons cartAmount-icon">remove</span></a>
        <span id="${item.id}" data-id=${id}>${num}</span>
        <a href="#" class="additionNum" data-add=${id}><span class="material-icons cartAmount-icon">add</span></a>
    </div>
    </td>
    <td>NT$${NT}</td>
    <td class="discardBtn">
      <a href="##" data-number=${number} class="material-icons"> clear </a>
    </td>
  </tr>`;
    number++;
  });
  str += `<tr>
  <td>
    <a href="##" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${priceNum}</td>
</tr>`;
const discardAllB = document.querySelector('discardAllBtn')
if(carData.length == 0){
  discardAllB.classList.add('flex-none');
}
  shoppingCart.innerHTML = str;
  discardAll();
  deleteCart();
  cangeNum();
}

//修改數量
let carId;
let quantity;
let count;
function cangeNum() {
  const additionNum = document.querySelectorAll('[data-add]');
  const subtractionNum = document.querySelectorAll('[data-sub]');
  const valueAddSub = document.querySelectorAll("[data-id]");

  additionNum.forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      valueAddSub.forEach(items=>{
        count = items.textContent
        if(item.dataset.add == items.dataset.id){
          count ++;
          items.textContent = count;
          carId = items.id;
          quantity = parseInt(count, 10);
          changeCarNum(carId, quantity);
        }
      })
    })
  })
  subtractionNum.forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      valueAddSub.forEach(items=>{
        count = items.textContent
        if(item.dataset.sub == items.dataset.id){
          if(count == 1){
            return;
          }else{
            count --;
            items.textContent = count;
            carId = items.id;
            quantity = parseInt(count, 10);
            changeCarNum(carId, quantity);
          }
        }
      })
    })
  })
}

// 修改購物車數量
function changeCarNum(carId, quantity) {
  axios
    .patch(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          id: carId,
          quantity: quantity,
        },
      }
    )
    .then(function (response) {
      carDataList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

// 清除購物車內全部產品
function discardAll() {
  const discardAllBtn = document.querySelector(".discardAllBtn");
  discardAllBtn.addEventListener("click", (e) => {
    deleteAllCartList();
  });
}

function deleteAllCartList() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      carDataList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 刪除購物車內特定產品
function deleteCart() {
  const deleteItem = document.querySelectorAll("[data-number]");
  deleteItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      let cartId = carData[item.dataset.number].id;
      carData.splice(item.dataset.number, 1);
      deleteCartItem(cartId);
    });
  });
}

function deleteCartItem(cartId) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      carDataList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 加入購物車
let oneCarItem;
function buttonGet() {
  let addCardBtn = document.querySelectorAll("[data-title]");
  addCardBtn.forEach((item) => {
    item.addEventListener("click", (e) => {
      productListData.forEach((el) => {
        if (item.dataset.title == el.title) {
          oneCarItem = el;
        }
      });
      addCartItem();
    });
  });
}

function addCartItem() {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: `${oneCarItem.id}`,
          quantity: 1,
        },
      }
    )
    .then(function (response) {
      carData = response.data.carts;
      carRenderList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 送單加驗證
let alertMsgAll = document.querySelectorAll("[data-message]");
const addBtn = document.querySelector(".orderInfo-btn");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerAddress = document.getElementById("customerAddress");
const tradeWay = document.getElementById("tradeWay");

addBtn.addEventListener("click", (e) => {
  if (carData.length == 0) {
    alert("當前購物車內沒有產品，所以無法送出訂單 RRR ((((；゜Д゜)))");
    return;
  } else if (
    customerName.value == "" ||
    customerPhone.value == "" ||
    customerEmail.value == "" ||
    customerAddress.value == ""
  ) {
    alertMsgAll.forEach((item) => {
      item.textContent = `${item.dataset.message} 必填`;
      return;
    });
  } else {
    alert("訂單成功送出");
    let item = {
      name: customerName.value,
      tel: customerPhone.value,
      email: customerEmail.value,
      address: customerAddress.value,
      payment: tradeWay.value,
    };
    createOrder(item);
    clearData();
  }
});

// 清空表單資料
function clearData() {
  customerName.value = "";
  customerPhone.value = "";
  customerEmail.value = "";
  customerAddress.value = "";
  alertMsgAll.forEach((item) => {
    item.textContent = "";
  });
}

// 送出購買訂單
function createOrder(item) {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: item.name,
            tel: item.tel,
            email: item.email,
            address: item.address,
            payment: item.payment,
          },
        },
      }
    )
    .then(function (response) {
      init();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// **產品初始化**
function init() {
  getProductList();
  carDataList();
}

init();
