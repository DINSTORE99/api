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

        const res = await fetch(`${BASE_URL}?endpoint=saldo`);
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
        "<center>Membuat QRIS...</center>";

    try {

        const res = await fetch(
            `${BASE_URL}?endpoint=deposit&amount=${nominal}`
        );

        const data = await res.json();

        console.log(data);

        if (data.status !== "success") {
            throw new Error("Gagal membuat QRIS");
        }

        const qr = data.data.qris_url;

        document.getElementById("depositResult").innerHTML = `
        <div style="text-align:center">

            <img
                src="${qr}?t=${Date.now()}"
                style="width:300px;max-width:100%;background:#fff;padding:10px;border-radius:15px;">

            <h2 style="color:#00ff99">
                Rp ${Number(data.data.total_amount).toLocaleString("id-ID")}
            </h2>

            <p>Nominal : Rp ${Number(data.data.amount).toLocaleString("id-ID")}</p>

            <p>Fee : Rp ${Number(data.data.fee).toLocaleString("id-ID")}</p>

            <p>ID : ${data.data.transaction_id}</p>

            <p>Berlaku sampai</p>

            <b>${new Date(data.data.expired_at).toLocaleString("id-ID")}</b>

        </div>
        `;

        Swal.fire(
            "Berhasil",
            "QRIS berhasil dibuat",
            "success"
        );

    } catch (err) {

        document.getElementById("depositResult").innerHTML =
            err.message;

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
        document.getElementById("withdrawNominal").value;

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
            data.status || "Info",
            data.message || "Berhasil",
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

async function loadRiwayat() {

    const box =
        document.getElementById("riwayat");

    box.innerHTML = "Loading...";

    try {

        const res = await fetch(
            `${BASE_URL}?endpoint=trx`
        );

        const data = await res.json();

        console.log(data);

        const list =
            data.data ||
            data.result ||
            [];

        if (!list.length) {

            box.innerHTML =
                "<center>Tidak ada transaksi</center>";

            return;

        }

        box.innerHTML = "";

        list.forEach(item => {

            box.innerHTML += `
            <div class="trx-card">

                <b>${item.type || "-"}</b>

                <br>

                Rp ${Number(item.amount || 0).toLocaleString("id-ID")}

                <br>

                <small>${item.status || "-"}</small>

            </div>
            `;

        });

    } catch (err) {

        box.innerHTML =
            err.message;

    }

}

// =======================
// AUTO LOAD
// =======================

cekSaldo();
loadRiwayat();
