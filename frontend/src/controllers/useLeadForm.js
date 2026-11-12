import { useState } from "react";
import { api } from "../services/api";

export function useLeadForm() {
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", level: "iniciante" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const payload = { ...form, email: form.email || null };
      const res = await api.createLead(payload);
      setStatus({ state: "ok", message: res.message });
      setForm({ name: "", whatsapp: "", email: "", level: "iniciante" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  return { form, set, submit, status };
}
