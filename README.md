# 🖋️ Komik Typesetter OCR

Aplikasi web untuk membantu translator dan typesetter komik menerjemahkan teks dari gambar secara manual setelah dideteksi otomatis menggunakan OCR (Optical Character Recognition).

### ✨ Fitur Utama

* 📄 Upload gambar komik
* 🧠 OCR teks otomatis (Tesseract.js, dukung Jepang & Inggris)
* 📝 Edit terjemahan secara manual di atas gambar
* 🌟 Posisi teks disesuaikan berdasarkan deteksi OCR
* 📅 Export hasil typeset sebagai gambar

---

## 🧱 Tech Stack

| Teknologi                                              | Deskripsi                                   |
| ------------------------------------------------------ | ------------------------------------------- |
| [Remix](https://remix.run)                             | Web framework berbasis React & file routing |
| [Tailwind CSS](https://tailwindcss.com)                | Utility-first CSS framework                 |
| [shadcn/ui](https://ui.shadcn.dev)                     | UI components siap pakai + Tailwind         |
| [Tesseract.js](https://github.com/naptha/tesseract.js) | OCR engine in-browser                       |
| [TypeScript](https://www.typescriptlang.org/)          | Static typing                               |
| [html2canvas](https://html2canvas.hertzen.com/)        | Export tampilan ke gambar PNG               |

---

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone [https://github.com/username/komik-typesetter.git](https://github.com/username/komik-typesetter.git)
cd komik-typesetter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan App

```bash
npm run dev
```

Akses di: [http://localhost:5173](http://localhost:5173)

---

## 📂 Struktur Direktori

```
app/
├── components/          # Reusable components (ImageUploader, OCRTextLayer, etc.)
├── lib/                 # OCR logic (tesseract.js wrapper)
├── routes/              # Remix routes (index.tsx utama)
├── styles/              # Tailwind config
public/                  # Static files
```

---

## 📸 Cuplikan Fitur (Screenshots)

> Belum tersedia, akan ditambahkan setelah MVP selesai.

---

## ✅ To-do & Pengembangan Selanjutnya

* [ ] Menambahkan dukungan drag untuk reposition teks
* [ ] Menyimpan & memuat ulang hasil project
* [ ] Export ke format PDF
* [ ] Dukungan multi-page komik
* [ ] Mode dark/light

---

## ⚖️ Lisensi

MIT License

---

## 🙏 Kontributor

* 👤 Feel free to contribute
* 🌐 Dibuat dengan ❤️ untuk komunitas scanlation & comic editor

---

## Progress

* Ocr Masih Kesulitan Saat Membaca Panel Komik