# Sprint Flow

Sprint Flow adalah aplikasi manajemen tugas yang dirancang untuk membantu individu dan tim mengelola proyek dan tugas dengan efisien. Aplikasi ini dikembangkan sebagai bagian dari studi kasus untuk posisi Full Stack Engineer.

## Fitur

- Manajemen tugas dengan status: To Do, In Progress, dan Completed
- Subtask untuk setiap tugas utama
- Deadline untuk tugas dengan indikator visual untuk tugas yang terlambat
- Progress bar untuk melacak penyelesaian subtask
- Antarmuka pengguna yang intuitif dan responsif

## Teknologi yang Digunakan

### Backend

- Laravel (PHP)
- MySQL

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI

## Instalasi

### Prasyarat

- PHP >= 7.4
- Composer
- Node.js >= 14
- NPM atau Yarn
- MySQL

### Langkah-langkah

1. Clone repositori

   ```
   git clone https://github.com/Hapidzfadli/sprint_flow.git
   cd sprint_flow
   ```

2. Setup Backend

   ```
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

   Konfigurasikan database di file `.env`

   ```
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

3. Setup Frontend

   ```
   cd ../frontend
   npm install
   cp .env.example .env
   ```

   Konfigurasikan `REACT_APP_API_URL` di file `.env` untuk mengarah ke backend

   ```
   npm start
   ```

## Penggunaan

1. Buka aplikasi di browser (biasanya di `http://localhost:3000`)
2. Tambahkan tugas baru dengan mengklik tombol "Add new task"
3. Edit tugas dengan mengklik ikon pensil pada kartu tugas
4. Tandai subtask sebagai selesai dengan mencentang kotak di samping subtask
5. Lihat progress tugas melalui progress bar di kartu tugas
6. Tugas akan otomatis berpindah kolom sesuai dengan statusnya

## Struktur Database (ERD)

Berikut adalah Entity Relationship Diagram (ERD) untuk Sprint Flow:

Diagram ini menunjukkan dua entitas utama dalam sistem:

1. **Tasks**: Merepresentasikan tugas utama dalam sistem.

   - Memiliki atribut: id, title, description, deadline, status, is_completed, created_at, dan updated_at.
   - Status dapat berupa 'todo', 'in_progress', atau 'completed'.
   - Satu Task dapat memiliki banyak Subtasks.

2. **Subtasks**: Merepresentasikan sub-tugas yang terkait dengan tugas utama.
   - Memiliki atribut: id, task_id, title, is_completed, created_at, dan updated_at.
   - Setiap Subtask terkait dengan satu Task melalui task_id.

Relasi:

- Satu Task dapat memiliki nol atau banyak Subtasks (one-to-many relationship).
- Setiap Subtask harus terkait dengan tepat satu Task.

Struktur ini memungkinkan sistem untuk melacak tugas utama beserta sub-tugasnya, mendukung fitur-fitur seperti progress tracking dan status updating berdasarkan penyelesaian subtasks.

## Kontak

Hafid Fadli - [@hapidzfadli](https://twitter.com/hapidzfadli)

Link Proyek: [https://github.com/Hapidzfadli/sprint_flow](https://github.com/Hapidzfadli/sprint_flow)
