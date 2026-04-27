import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;

    if (type === "image") {
      const file = formData.get("file") as File;
      const pinataForm = new FormData();
      pinataForm.append("file", file);
      pinataForm.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        pinataForm,
        {
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        }
      );
      return NextResponse.json({ url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}` });
    }

    if (type === "metadata") {
      const metadata = JSON.parse(formData.get("metadata") as string);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      return NextResponse.json({ url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}` });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e: any) {
    console.error("Upload error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}