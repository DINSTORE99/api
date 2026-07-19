// =======================
// CONFIG
// =======================

const BASE_URL = "/api/proxy";

// =======================
// CEK SALDO
// =======================

async function cekSaldo() {
  
  document.getElementById("saldo").innerHTML = "Loading...";
  
  try {
    
    const res = await fetch(
  `${BASE_URL}?endpoint=saldo`
);
    
    const data = await res.json();
    
    console.log(data);
    
    const saldo =
      data.saldo ??
      data.balance ??
      data.data?.saldo ??
      data.data?.balance ??
      0;
    
    document.getElementById("saldo").innerHTML =
      "Rp " + Number(saldo).toLocaleString("id-ID");
    
  } catch (err) {
    
    document.getElementById("saldo").innerHTML = "Gagal";
    
    Swal.fire(
      "Error",
      err.message,
      "error"
    );
    
  }
  
}

// =======================
// DEPOSIT
// =======================

async function deposit() {
  
  const nominal =
    document.getElementById("depositNominal").value;
  
  if (!nominal) {
    
    return Swal.fire(
      "Oops",
      "Masukkan nominal",
      "warning"
    );
    
  }
  
  document.getElementById("depositResult").innerHTML =
    "Membuat QRIS...";
  
  try {
    
    const res = await fetch(
  `${BASE_URL}?endpoint=deposit&amount=${nominal}`
);
    
    const data = await res.json();

console.log(data);

if (data.status === "success") {

    document.getElementById("depositResult").innerHTML = `
    <center>

    <h2>QRIS PAYMENT</h2>

    <img src="${data.data.qris_url}"
         style="width:280px;max-width:100%;border-radius:12px;">

    <br><br>

    <h2>Rp ${Number(data.data.total_amount).toLocaleString("id-ID")}</h2>

    <p>Nominal : Rp ${Number(data.data.amount).toLocaleString("id-ID")}</p>

    <p>Fee : Rp ${Number(data.data.fee).toLocaleString("id-ID")}</p>

    <p><b>ID</b><br>${data.data.transaction_id}</p>

    <p>Expired<br>${new Date(data.data.expired_at).toLocaleString("id-ID")}</p>

    </center>
    `;

    Swal.fire(
        "Berhasil",
        "QRIS berhasil dibuat",
        "success"
    );

} else {

    document.getElementById("depositResult").innerHTML =
    `<pre>${JSON.stringify(data, null, 2)}</pre>`;

}
    
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

async function withdraw() {
  
  const wallet =
    document.getElementById("wallet").value;
  
  const nomor =
    document.getElementById("nomor").value;
  
  const nominal =
    document.getElementById("nominal").value;
  
  if (!nomor || !nominal) {
    
    return Swal.fire(
      "Oops",
      "Lengkapi data",
      "warning"
    );
    
  }
  
  try {
    
    const res = await fetch(
  `${BASE_URL}?endpoint=wd&wallet=${wallet}&nomor=${nomor}&nominal=${nominal}`
);
    
    const data = await res.json();
    
    console.log(data);
    
    Swal.fire(
      "Response",
      JSON.stringify(data, null, 2),
      "success"
    );
    
  } catch (err) {
    
    Swal.fire(
      "Error",
      err.message,
      "error"
    );
    
  }
  
}

// =======================
// RIWAYAT
// =======================

async function riwayat() {
  
  document.getElementById("history").innerHTML =
    "Loading...";
  
  try {
    
    const res = await fetch(
  `${BASE_URL}?endpoint=trx`
);
    
    const data = await res.json();
    
    console.log(data);
    
    document.getElementById("history").innerHTML =
      `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    
  } catch (err) {
    
    document.getElementById("history").innerHTML =
      "Gagal mengambil data";
    
  }
  
}

// =======================
// AUTO LOAD
// =======================

cekSaldo();
riwayat();
