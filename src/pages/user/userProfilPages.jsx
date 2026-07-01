import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiUser,
  HiEnvelope,
  HiCheck,
  HiPencil,
  HiKey,
  HiEye,
  HiEyeSlash,
  HiCamera,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export function UserProfil() {
  const { user, api, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [form, setForm] = useState({ nama: "", email: "" });

  useEffect(() => {
    if (user) {
      setForm({ nama: user.nama || "", email: user.email || "" });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.nama.trim()) return toast.error("Nama tidak boleh kosong");
    setSaving(true);
    try {
      const res = await api.put("/api/user/my-profile", form);
      const updated = res.data.data || res.data;
      updateUser((p) => ({ ...p, ...updated }));
      setEditing(false);
      toast.success("Profil berhasil diperbarui!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }
    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);
      const res = await api.post("/api/user/my-foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFotoLocal(URL.createObjectURL(file));
      updateUser((p) => ({ ...p, foto: res.data.data.foto }));
      toast.success("Foto berhasil diupload!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal upload foto");
    } finally {
      setUploadingFoto(false);
    }
  };

  const fotoSrc = fotoLocal || (user?.foto ? `${BASE_URL}${user.foto}` : null);

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Edit Profil</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola informasi akun Anda
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-6 border-b border-slate-100 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 border border-slate-100">
              {fotoSrc ? (
                <img
                  src={fotoSrc}
                  alt={user?.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-500">
                  {user?.nama?.slice(0, 2).toUpperCase() || "?"}
                </div>
              )}
            </div>
            <label
              className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow ${
                uploadingFoto ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploadingFoto ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiCamera className="w-3.5 h-3.5 text-white" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFotoChange}
                disabled={uploadingFoto}
              />
            </label>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-lg">{user?.nama}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <p className="text-xs text-slate-300 mt-1 capitalize">
              Role: {user?.role}
            </p>
          </div>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              editing
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {editing ? (
              <>
                <HiCheck className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </>
            ) : (
              <>
                <HiPencil className="w-4 h-4" /> Edit
              </>
            )}
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              <HiUser className="w-3.5 h-3.5" /> Nama Lengkap
            </label>
            {editing ? (
              <input
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-xl bg-slate-50 text-sm font-medium text-slate-800">
                {user?.nama || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              <HiEnvelope className="w-3.5 h-3.5" /> Email
            </label>
            {editing ? (
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-xl bg-slate-50 text-sm font-medium text-slate-800">
                {user?.email || "-"}
              </p>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function UserGantiPassword() {
  const { api } = useAuth();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleShow = (k) => setShow((p) => ({ ...p, [k]: !p[k] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword) {
      return toast.error("Lengkapi semua field");
    }
    if (form.newPassword.length < 6) {
      return toast.error("Password baru minimal 6 karakter");
    }
    if (form.newPassword !== form.confirm) {
      return toast.error("Konfirmasi password tidak cocok");
    }
    setSaving(true);
    try {
      await api.put("/api/user/my-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password berhasil diubah!");
      setForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      key: "oldPassword",
      showKey: "old",
      label: "Password Lama",
      placeholder: "Masukkan password lama",
    },
    {
      key: "newPassword",
      showKey: "new",
      label: "Password Baru",
      placeholder: "Minimal 6 karakter",
    },
    {
      key: "confirm",
      showKey: "confirm",
      label: "Konfirmasi Password Baru",
      placeholder: "Ulangi password baru",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Ganti Password</h1>
        <p className="text-sm text-slate-400 mt-1">
          Pastikan password baru Anda kuat dan mudah diingat
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
      >
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
          <HiKey className="w-6 h-6 text-blue-500" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, showKey, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow(showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show[showKey] ? (
                    <HiEyeSlash className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {key === "confirm" && form.confirm && (
                <p
                  className={`text-xs mt-1 ${
                    form.confirm === form.newPassword
                      ? "text-emerald-500"
                      : "text-red-400"
                  }`}
                >
                  {form.confirm === form.newPassword
                    ? "✓ Password cocok"
                    : "✗ Password tidak cocok"}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {saving ? "Menyimpan..." : "Ubah Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
