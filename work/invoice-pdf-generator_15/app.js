// ==========================
// COCOA TOOLS v2.0
// 見積書・請求書ジェネレーター
// Part5-1
// ==========================

const itemsDiv = document.getElementById("items");

const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const gensenEl = document.getElementById("gensen");
const totalEl = document.getElementById("grandTotal");

const useTax = document.getElementById("useTax");
const useGensen = document.getElementById("useGensen");

const addBtn = document.getElementById("addItem");
const pdfBtn = document.getElementById("pdfBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

let itemCount = 0;

//==========================
// 明細追加
//==========================

function addItem(data={}){

itemCount++;

const row=document.createElement("div");

row.className="item-row";

row.innerHTML=`

<input
class="item-name"
placeholder="品名"
value="${data.name||""}">

<div class="row">

<div class="group">

<label>数量</label>

<input
type="number"
class="qty"
value="${data.qty||1}">

</div>

<div class="group">

<label>単価</label>

<input
type="number"
class="price"
value="${data.price||0}">

</div>

</div>

<div class="row">

<div class="group">

<label>金額</label>

<input
class="amount"
readonly>

</div>

</div>

`;

itemsDiv.appendChild(row);

const qty=row.querySelector(".qty");
const price=row.querySelector(".price");
const amount=row.querySelector(".amount");

function calcRow(){

const total=
(Number(qty.value)||0)*
(Number(price.value)||0);

amount.value=total.toLocaleString();

calculateTotal();

}

qty.addEventListener("input",calcRow);
price.addEventListener("input",calcRow);

calcRow();

}//==========================
// 合計計算
//==========================

function calculateTotal(){

let subtotal=0;

document.querySelectorAll(".item-row").forEach(row=>{

const qty=Number(row.querySelector(".qty").value)||0;
const price=Number(row.querySelector(".price").value)||0;

subtotal+=qty*price;

});

const tax=useTax.checked
?Math.floor(subtotal*0.10)
:0;

const gensen=useGensen.checked
?Math.floor(subtotal*0.1021)
:0;

const grand=subtotal+tax-gensen;

subtotalEl.textContent=
"¥"+subtotal.toLocaleString();

taxEl.textContent=
"¥"+tax.toLocaleString();

gensenEl.textContent=
"¥"+gensen.toLocaleString();

totalEl.textContent=
"¥"+grand.toLocaleString();

saveData();

}

//==========================
// LocalStorage保存
//==========================

function saveData(){

const data={

docType:
document.getElementById("docType").value,

docNo:
document.getElementById("docNo").value,

issueDate:
document.getElementById("issueDate").value,

dueDate:
document.getElementById("dueDate").value,

client:
document.getElementById("client").value,

subject:
document.getElementById("subject").value,

myName:
document.getElementById("myName").value,

invoiceNo:
document.getElementById("invoiceNo").value,

address:
document.getElementById("address").value,

bank:
document.getElementById("bank").value,

useTax:
useTax.checked,

useGensen:
useGensen.checked,

items:[]

};

document.querySelectorAll(".item-row").forEach(row=>{

data.items.push({

name:
row.querySelector(".item-name").value,

qty:
row.querySelector(".qty").value,

price:
row.querySelector(".price").value

});

});

localStorage.setItem(
"cocoa_invoice_data",
JSON.stringify(data)
);

}

//==========================
// 自動保存イベント
//==========================

document.querySelectorAll("input,textarea,select").forEach(el=>{

el.addEventListener("input",calculateTotal);

el.addEventListener("change",calculateTotal);

});

useTax.addEventListener("change",calculateTotal);

useGensen.addEventListener("change",calculateTotal);

saveBtn.addEventListener("click",saveData);//==========================
// LocalStorage復元
//==========================

function loadData(){

const json=localStorage.getItem("cocoa_invoice_data");

if(!json){

addItem();

return;

}

const data=JSON.parse(json);

document.getElementById("docType").value=data.docType||"請求書";
document.getElementById("docNo").value=data.docNo||"";

document.getElementById("issueDate").value=data.issueDate||"";
document.getElementById("dueDate").value=data.dueDate||"";

document.getElementById("client").value=data.client||"";
document.getElementById("subject").value=data.subject||"";

document.getElementById("myName").value=data.myName||"";
document.getElementById("invoiceNo").value=data.invoiceNo||"";

document.getElementById("address").value=data.address||"";
document.getElementById("bank").value=data.bank||"";

useTax.checked=data.useTax!==false;
useGensen.checked=data.useGensen===true;

itemsDiv.innerHTML="";

if(data.items&&data.items.length){

data.items.forEach(item=>{

addItem(item);

});

}else{

addItem();

}

calculateTotal();

}

//==========================
// 入力クリア
//==========================

clearBtn.addEventListener("click",()=>{

if(!confirm("入力内容をすべて削除しますか？")) return;

localStorage.removeItem("cocoa_invoice_data");

location.reload();

});

//==========================
// 明細追加ボタン
//==========================

addBtn.addEventListener("click",()=>{

addItem();

calculateTotal();

});

//==========================
// 初期化
//==========================

window.addEventListener("load",()=>{

loadData();

});
