import { useState } from "react";

interface Props {
  signatureUrl: string;
  resourceType?: "auto" | "raw" | "image" | "video";
  onUploaded: (url: string, publicId: string) => void;
  label?: string;
}

export default function FileUploader({
  signatureUrl,
  resourceType = "auto",
  onUploaded,
  label = "Upload file",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const sigRes = await fetch(signatureUrl);
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig.error || "Signature error");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""}/${resourceType}/upload`,
        { method: "POST", body: form }
      );
      const data = await cloudRes.json();
      if (!cloudRes.ok) throw new Error(data.error?.message || "Upload failed");
      onUploaded(data.secure_url, data.public_id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
        {busy ? "Uploading..." : label}
        <input
          type="file"
          className="hidden"
          disabled={busy}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
