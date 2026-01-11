import axios from "axios";
import JSZip from "jszip";

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;

export async function deploy(req, res) {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        success: false,
        message: "HTML content missing"
      });
    }

    console.log("📦 Creating ZIP for Netlify...");

    const zip = new JSZip();

    // ✅ MAIN FILE
    zip.file("index.html", html);

    // ✅ FORCE HTML RENDERING
    zip.file("_headers", `
/*
  Content-Type: text/html; charset=utf-8
    `.trim());

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    /* -------------------------
       CREATE NETLIFY SITE
    ------------------------- */
    const siteRes = await axios.post(
      "https://api.netlify.com/api/v1/sites",
      {},
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`
        }
      }
    );

    const siteId = siteRes.data.id;
    console.log("✅ Site created:", siteId);

    /* -------------------------
       DEPLOY ZIP
    ------------------------- */
    const deployRes = await axios.post(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      zipBuffer,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          "Content-Type": "application/zip"
        }
      }
    );

    const liveUrl = deployRes.data.ssl_url;

    console.log("🚀 Netlify Live:", liveUrl);

    res.json({
      success: true,
      url: liveUrl
    });

  } catch (err) {
    console.error("❌ Deploy failed:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
}
