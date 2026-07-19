const BASE_URL = "/api/proxy";

// =======================
// CEK SALDO
// =======================
async function cekSaldo() {
    try {
        const res = await fetch(`${BASE_URL}?endpoint=saldo`);
        const data = await res.json();

        const saldo =
            data.saldo ??
            data.balance ??
            data.data?.saldo ??
            data.data?.balance ??
            0;

        document.getElementById("saldo").innerHTML =
            "Rp " + Number(saldo).toLocaleString("id-ID");

    } catch (e) {
        document.getElementById("saldo").innerHTML = "Error";
    }
}

// =======================
// DEPOSIT
// =======================
async function deposit() {

    const nominal =
        document.getElementById("depositNominal").value;

    if (!nominal)
        return Swal.fire("Oops","Masukkan nominal","warning");

    document.getElementById("depositResult").innerHTML =
        "<center>Membuat QRIS...</center>";

    try {

        const res = await fetch(
            `${BASE_URL}?endpoint=deposit&amount=${nominal}`
        );

        const data = await res.json();

        console.log(data);

        if (data.status !== "success")
            throw new Error(data.message || "Gagal membuat QRIS");

        const qr =
            data.data.download_url ||
            data.data.qris_url;

        document.getElementById("depositResult").innerHTML = `
        <div style="text-align:center">

            <img
            id="imgQris"
            src="${qr}?t=${Date.now()}"
            style="
            width:300px;
            max-width:100%;
            background:#fff;
            padding:10px;
            border-radius:15px;
            ">

            <h2 style="margin-top:20px;color:#00ff99">
            Rp ${Number(data.data.total_amount || data.data.amount).toLocaleString("id-ID")}
            </h2>

            <p>Nominal :
            Rp ${Number(data.data.amount).toLocaleString("id-ID")}</p>

            <p>Fee :
            Rp ${Number(data.data.fee).toLocaleString("id-ID")}</p>

            <p>ID :
            ${data.data.transaction_id}</p>

            <p>Expired :</p>

            <b>
            ${new Date(data.data.expired_at).toLocaleString("id-ID")}
            </b>

        </div>
        `;

        const img = document.getElementById("imgQris");

        img.onerror = function () {

            document.getElementById("depositResult").innerHTML += `
            <br>
            <div style="color:red">
            QRIS gagal dimuat.<br>
            URL dari API tidak valid.
            </div>
            `;

        };

    } catch (err) {

        Swal.fire(
            "Error",
            err.message,
            "error"
        );

    }

}

// =======================
// WITHDRAW
// =======================
async function withdraw(){

const wallet=document.getElementById("wallet").value;
const nomor=document.getElementById("nomor").value;
const nominal=document.getElementById("withdrawNominal").value;

if(!nomor||!nominal)
return Swal.fire("Oops","Lengkapi data","warning");

const res=await fetch(
`${BASE_URL}?endpoint=wd&wallet=${wallet}&nomor=${nomor}&nominal=${nominal}`
);

const data=await res.json();

Swal.fire(
data.status||"Info",
data.message||"-",
"success"
);

}

// =======================
// RIWAYAT
// =======================
async function loadRiwayat(){

const box=document.getElementById("riwayat");

try{

const res=await fetch(
`${BASE_URL}?endpoint=trx`
);

const data=await res.json();

const list=data.data||[];

box.innerHTML="";

if(list.length==0){

box.innerHTML="Belum ada transaksi";
return;

}

list.forEach(x=>{

box.innerHTML+=`
<div class="trx-card">
<b>${x.type||"-"}</b><br>
Rp ${Number(x.amount||0).toLocaleString("id-ID")}<br>
${x.status||"-"}
</div>
`;

});

}catch(e){

box.innerHTML="Gagal memuat";

}

}

cekSaldo();
loadRiwayat();
