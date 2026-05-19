export type MockQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type MockArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  difficulty: "Pemanasan" | "Menengah" | "Tantangan";
  completionRate: number;
  accent: string;
  insight: string;
  paragraphs: string[];
  questions: MockQuizQuestion[];
};

export const mockArticles: MockArticle[] = [
  {
    id: "art-eco-hutan-kota",
    title: "Hutan Kota dan Cara Kota Bernapas",
    category: "Lingkungan",
    summary:
      "Sebuah bacaan ringan tentang bagaimana ruang hijau kecil bisa menurunkan suhu, menahan air hujan, dan membuat kota lebih nyaman dihuni.",
    readTime: "6 menit",
    difficulty: "Pemanasan",
    completionRate: 81,
    accent: "from-emerald-200 via-lime-100 to-amber-50",
    insight: "Bacaan ini cocok untuk warm-up karena paragrafnya ringkas dan poin utamanya jelas.",
    paragraphs: [
      "Banyak orang membayangkan hutan sebagai kawasan luas yang jauh dari gedung dan kendaraan. Padahal, di tengah kota pun terdapat ruang hijau yang berfungsi menyerupai paru-paru kecil. Hutan kota tidak harus megah; deretan pepohonan, semak, dan tanah terbuka yang terawat pun bisa menciptakan dampak lingkungan yang nyata.",
      "Salah satu manfaat paling terasa adalah penurunan suhu udara. Permukaan beton menyerap panas sepanjang hari, lalu melepaskannya kembali saat malam. Pepohonan membantu memutus siklus itu dengan memberi bayangan dan menjaga kelembapan di sekitarnya. Karena itu, area dengan tutupan pohon yang baik cenderung terasa lebih teduh dibanding kawasan yang gersang.",
      "Selain soal suhu, hutan kota juga berperan penting saat hujan turun deras. Akar tanaman membantu air meresap ke dalam tanah, sementara daun dan batang memperlambat laju jatuhnya air. Dengan begitu, limpasan air berkurang dan risiko genangan bisa ditekan. Fungsi ini menjadi semakin penting ketika kota dipenuhi permukaan keras seperti aspal dan paving.",
      "Manfaat lain yang sering terlupakan adalah efek psikologisnya. Ruang hijau memberi jeda visual dari hiruk-pikuk kota. Orang yang berjalan, membaca, atau sekadar duduk di dekat pohon sering merasa lebih tenang. Itulah sebabnya pembangunan kota yang sehat tidak hanya menghitung jalan dan bangunan, tetapi juga memberi ruang bagi alam untuk tetap hadir.",
    ],
    questions: [
      {
        id: "eco-1",
        question: "Menurut bacaan, manfaat yang paling terasa dari hutan kota adalah...",
        options: [
          "menambah jumlah kendaraan listrik",
          "menurunkan suhu udara di sekitar kota",
          "menggantikan fungsi seluruh drainase kota",
          "mengurangi kebutuhan bangunan bertingkat",
        ],
        answer: "menurunkan suhu udara di sekitar kota",
      },
      {
        id: "eco-2",
        question: "Mengapa hutan kota membantu mengurangi genangan?",
        options: [
          "karena seluruh air hujan dipompa keluar kota",
          "karena akar tanaman membantu air meresap ke tanah",
          "karena daun tanaman menyimpan air selamanya",
          "karena aspal menjadi lebih licin",
        ],
        answer: "karena akar tanaman membantu air meresap ke tanah",
      },
      {
        id: "eco-3",
        question: "Efek psikologis ruang hijau dalam teks adalah...",
        options: [
          "membuat orang lebih tenang",
          "membuat kota lebih bising",
          "membuat hujan turun lebih lama",
          "membuat jalan lebih lebar",
        ],
        answer: "membuat orang lebih tenang",
      },
    ],
  },
  {
    id: "art-sejarah-surat-laut",
    title: "Surat, Laut, dan Jaringan Dagang Nusantara",
    category: "Sejarah",
    summary:
      "Bacaan tentang bagaimana pelabuhan, surat dagang, dan kepercayaan membentuk hubungan antarkota di masa lalu.",
    readTime: "8 menit",
    difficulty: "Menengah",
    completionRate: 67,
    accent: "from-sky-200 via-cyan-100 to-stone-50",
    insight: "Fokus utama ada pada hubungan antara perdagangan, komunikasi, dan kepercayaan.",
    paragraphs: [
      "Jaringan dagang di Nusantara tidak hanya bergantung pada kapal dan pelabuhan, tetapi juga pada komunikasi yang teratur. Para pedagang harus memastikan barang tiba di tempat yang tepat, harga disepakati, dan mitra dagang dapat dipercaya. Dalam konteks itu, surat menjadi alat yang sangat penting.",
      "Surat dagang bukan sekadar catatan pemesanan. Ia sering memuat informasi tentang kualitas barang, kondisi cuaca, kabar perjalanan laut, bahkan reputasi seorang perantara. Artinya, satu lembar surat bisa menentukan apakah sebuah transaksi besar akan terjadi atau batal dilakukan.",
      "Kepercayaan tumbuh bukan hanya dari keuntungan, tetapi dari konsistensi. Pedagang yang menepati janji, mengirim barang sesuai kesepakatan, dan merespons surat dengan cepat akan lebih mudah membangun jaringan yang luas. Karena itu, pelabuhan bukan hanya pusat ekonomi, melainkan juga pusat pertukaran informasi.",
      "Dari sini terlihat bahwa sejarah perdagangan maritim bukan cuma soal perpindahan barang. Ia juga tentang bagaimana manusia membangun relasi, menjaga reputasi, dan merawat koneksi antarkota melalui komunikasi yang terus berlangsung.",
    ],
    questions: [
      {
        id: "hist-1",
        question: "Dalam teks, surat dagang digambarkan sebagai...",
        options: [
          "hiasan resmi bagi pelabuhan",
          "alat penting untuk menjaga komunikasi dagang",
          "pengganti kapal pengangkut barang",
          "dokumen yang hanya memuat harga pajak",
        ],
        answer: "alat penting untuk menjaga komunikasi dagang",
      },
      {
        id: "hist-2",
        question: "Apa yang membuat pedagang lebih mudah membangun jaringan luas?",
        options: [
          "sering mengganti pelabuhan",
          "menyimpan seluruh informasi sendiri",
          "menjaga konsistensi dan menepati janji",
          "menghindari surat dari mitra dagang",
        ],
        answer: "menjaga konsistensi dan menepati janji",
      },
      {
        id: "hist-3",
        question: "Menurut bacaan, pelabuhan juga berfungsi sebagai...",
        options: [
          "pusat pertukaran informasi",
          "tempat penyimpanan surat rahasia saja",
          "wilayah yang terpisah dari ekonomi",
          "simbol cuaca buruk sepanjang tahun",
        ],
        answer: "pusat pertukaran informasi",
      },
      {
        id: "hist-4",
        question: "Kesimpulan utama bacaan adalah sejarah perdagangan maritim juga tentang...",
        options: [
          "memindahkan bangunan antarkota",
          "membangun relasi dan menjaga reputasi",
          "menghapus peran manusia dalam perdagangan",
          "menghindari komunikasi yang terlalu sering",
        ],
        answer: "membangun relasi dan menjaga reputasi",
      },
    ],
  },
  {
    id: "art-sains-tidur-fokus",
    title: "Mengapa Tidur Cukup Membantu Otak Fokus",
    category: "Sains",
    summary:
      "Penjelasan sederhana tentang hubungan tidur, konsolidasi memori, dan kemampuan otak menyaring informasi penting.",
    readTime: "7 menit",
    difficulty: "Tantangan",
    completionRate: 54,
    accent: "from-amber-200 via-orange-100 to-rose-50",
    insight: "Bacaan ini lebih analitis karena menautkan proses biologis dengan kebiasaan belajar.",
    paragraphs: [
      "Saat tidur, tubuh memang terlihat diam, tetapi otak tetap bekerja. Beberapa peneliti menjelaskan bahwa tidur memberi kesempatan bagi otak untuk mengatur ulang informasi yang diperoleh sepanjang hari. Proses ini membantu pengalaman baru tidak bercampur secara acak dengan informasi lama.",
      "Salah satu fungsi penting tidur adalah membantu konsolidasi memori. Dengan kata lain, otak memperkuat jejak informasi yang dianggap penting. Itulah sebabnya belajar semalaman tanpa istirahat sering terasa produktif di awal, tetapi hasilnya tidak selalu bertahan lama.",
      "Tidur yang cukup juga membantu perhatian. Ketika seseorang kurang tidur, otak lebih sulit menyaring gangguan kecil di sekitarnya. Akibatnya, fokus mudah pecah dan keputusan sederhana pun terasa lebih berat. Dalam kegiatan membaca atau mengerjakan kuis, kondisi ini tentu mengurangi kualitas pemahaman.",
      "Karena itu, tidur bukan lawan dari belajar, melainkan bagian dari strategi belajar. Bukan berarti semua orang harus punya jadwal yang sama, tetapi kebutuhan istirahat sebaiknya dipandang sebagai fondasi, bukan bonus.",
    ],
    questions: [
      {
        id: "sci-1",
        question: "Menurut bacaan, yang terjadi saat tidur adalah...",
        options: [
          "otak berhenti bekerja total",
          "otak tetap bekerja mengatur informasi",
          "seluruh memori dihapus",
          "tubuh menghasilkan jawaban kuis baru",
        ],
        answer: "otak tetap bekerja mengatur informasi",
      },
      {
        id: "sci-2",
        question: "Apa yang dimaksud dengan konsolidasi memori dalam teks?",
        options: [
          "otak memperkuat informasi penting",
          "otak melupakan semua pengalaman",
          "tubuh meningkatkan suhu secara permanen",
          "mata menjadi lebih sensitif terhadap cahaya",
        ],
        answer: "otak memperkuat informasi penting",
      },
      {
        id: "sci-3",
        question: "Kurang tidur membuat fokus menurun karena...",
        options: [
          "otak sulit menyaring gangguan kecil",
          "bacaan berubah jadi lebih panjang",
          "semua informasi otomatis hilang",
          "orang menjadi lebih cepat bosan pada semua hal",
        ],
        answer: "otak sulit menyaring gangguan kecil",
      },
    ],
  },
];

export function getMockArticle(articleId: string) {
  return mockArticles.find((article) => article.id === articleId) ?? null;
}
