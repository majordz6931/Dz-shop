const defaultProducts=[{id:1,name:"شاحن سريع USB-C 30W",cat:"electronics",price:2490,old:2990,tag:"الأكثر طلبًا",img:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80"},{id:2,name:"سماعات لاسلكية Premium",cat:"phones",price:3490,old:4290,tag:"-19%",img:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"},{id:3,name:"لوحة مفاتيح Gaming RGB",cat:"gaming",price:5990,old:6990,tag:"HOT",img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"},{id:4,name:"مصباح LED ذكي",cat:"home",price:2990,old:3690,tag:"جديد",img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"},{id:5,name:"حامل هاتف للسيارة",cat:"auto",price:1890,old:2290,tag:"عرض",img:"https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=700&q=80"},{id:6,name:"ساعة ذكية Sport",cat:"phones",price:7490,old:8990,tag:"-17%",img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},{id:7,name:"حقيبة ظهر عملية",cat:"fashion",price:3990,old:4590,tag:"جديد",img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"},{id:8,name:"شاحن سيارة Dual USB",cat:"auto",price:1590,old:1990,tag:"عرض",img:"https://images.unsplash.com/photo-1617886322168-72b886573c90?auto=format&fit=crop&w=700&q=80"}];;
let products=[];
const money=n=>Number(n).toFixed(2)+" USDT";
const grid=document.getElementById("productsGrid"),count=document.getElementById("count"),items=document.getElementById("cartItems"),total=document.getElementById("total"),cartBox=document.getElementById("cart"),overlay=document.getElementById("overlay");
let cart=JSON.parse(localStorage.getItem("dz_cart")||"[]");

async function loadProducts(){
 const {data,error}=await window.supabaseClient.from("products").select("*").eq("active",true).order("sort_order",{ascending:true});
 products=(error||!data?.length)?defaultProducts:data.map(p=>({
   id:p.id,name:p.name,cat:p.category,price:Number(p.price),old:Number(p.old_price||0),
   tag:p.tag||"جديد",img:p.image_url,
   imgs:Array.isArray(p.image_urls)&&p.image_urls.length?p.image_urls:[p.image_url],
   binance_pay_url:p.binance_pay_url||""
 }));
 render();update();
}
function render(list=products){
 grid.innerHTML=list.length?list.map(p=>`<article class="product"><div class="productImg"><img src="${p.img}" alt="${p.name}"><span class="tag">${p.tag}</span>${p.imgs?.length>1?`<span class="photoCount">📷 ${p.imgs.length}</span>`:""}</div><div class="info"><h3>${p.name}</h3><div class="stars">★★★★★</div><div class="price"><strong>${money(p.price)}</strong>${p.old?'<span class="old">'+money(p.old)+'</span>':''}</div>${p.binance_pay_url?`<a class="binanceProductBtn" target="_blank" rel="noopener noreferrer" href="${p.binance_pay_url}">🟡 ادفع عبر Binance Pay</a>`:""}<button class="add" onclick="add('${p.id}')">+ أضف إلى السلة</button></div></article>`).join(""):'<div class="empty">لا توجد منتجات مطابقة.</div>'
}
function add(id){const p=products.find(x=>String(x.id)===String(id));if(p)cart.push(p);localStorage.setItem("dz_cart",JSON.stringify(cart));update();openCart()}
function update(){count.textContent=cart.length;items.innerHTML=cart.length?cart.map((p,i)=>`<div class="cartItem"><img src="${p.img}"><div><b>${p.name}</b><small>${money(p.price)}</small><button class="remove" onclick="removeItem(${i})">حذف</button></div></div>`).join(""):'<div class="empty">🛒<br><br>السلة فارغة حاليًا</div>';total.textContent=money(cart.reduce((s,p)=>s+Number(p.price),0))}
function removeItem(i){cart.splice(i,1);localStorage.setItem("dz_cart",JSON.stringify(cart));update()}
function openCart(){cartBox.classList.add("show");overlay.classList.add("show")}function closeCart(){cartBox.classList.remove("show");overlay.classList.remove("show")}
function filter(cat){document.querySelectorAll("[data-cat]").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));let list=cat==="all"?products:cat==="offers"?products.filter(p=>p.tag==="عرض"||String(p.tag).includes("%")||String(p.tag).toLowerCase().includes("offer")):products.filter(p=>String(p.cat).toLowerCase()===String(cat).toLowerCase());render(list);document.getElementById("title").textContent=cat==="all"?"الأكثر طلبًا":cat==="offers"?"🔥 العروض":(document.querySelector(`.cats button[data-cat="${cat}"]`)?.textContent||cat);window.scrollTo({top:document.querySelector(".products").offsetTop-90,behavior:"smooth"})}
document.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("click",()=>filter(b.dataset.cat)));
document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();render(q?products.filter(p=>[p.name,p.cat,p.tag].some(v=>String(v||"").toLowerCase().includes(q))):products)});
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("checkout").onclick=()=>{if(!cart.length)return alert("السلة فارغة.");localStorage.setItem("dz_cart",JSON.stringify(cart));location.href="checkout.html"};
loadProducts();update();
