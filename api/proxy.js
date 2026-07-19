const API_KEY = "e33ea8a9-ad31-4ee4-8a18-cb67f2edba5e";
const BASE_URL = "https://payment.mybotv1.workers.dev/api";

export default async function handler(req, res) {
  try {
    const {
      endpoint = "saldo",
        amount,
        wallet,
        nomor,
        nominal,
        webhook
    } = req.query;
    
    let url = `${BASE_URL}/${endpoint}?apikey=${API_KEY}`;
    
    switch (endpoint) {
      case "deposit":
        if (!amount) {
          return res.status(400).json({
            success: false,
            message: "Parameter amount wajib diisi"
          });
        }
        
        url += `&amount=${encodeURIComponent(amount)}`;
        
        if (webhook) {
          url += `&webhook=${encodeURIComponent(webhook)}`;
        }
        break;
        
      case "wd":
        if (!wallet || !nomor || !nominal) {
          return res.status(400).json({
            success: false,
            message: "wallet, nomor, dan nominal wajib diisi"
          });
        }
        
        url += `&wallet=${encodeURIComponent(wallet)}`;
        url += `&nomor=${encodeURIComponent(nomor)}`;
        url += `&nominal=${encodeURIComponent(nominal)}`;
        break;
        
      case "saldo":
      case "trx":
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: "Endpoint tidak dikenal"
        });
    }
    
    const response = await fetch(url);
    
    const text = await response.text();
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    
    res.status(response.status).send(text);
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
