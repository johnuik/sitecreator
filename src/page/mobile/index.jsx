import React, { useState, useEffect } from 'react'
import '../dashboard/dashboard.css'
import ExpertizaTable from '../../components/table';
import { useNavigate } from 'react-router-dom';

const Card = ({ label, value, icon, accent = 'teal' }) => {
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return (
    <div className="bg-white dark:bg-[#2b2c40] bg-gradient-to-r from-cyan-600/10 to-bg-white stat-card stat-card" data-accent={accent}>
      <div className="stat-card__top">
        <div className="stat-card__label text-[#718193] dark:text-gray-200 text-lg">{label}</div>
        <div className="stat-card__icon" style={{ color: accent == "muted" ? '#8592a3' : accent, background: hexToRgba(accent, 0.1) }} aria-hidden>
          <i className={`${icon} text-4xl`} style={{ width: 36, height: 36 }}></i>
          {/* <iconify-icon icon={icon} width="36" height="36" /> */}
        </div>
      </div>
      <div className="stat-card__value text-[#566a7f] dark:text-gray-300">{value}</div>
    </div>
  )
}

const Section = ({ title, items }) => (
  <section className="stats-section">
    <h3 className="stats-section__title">{title}</h3>
    <div className="stats-grid">
      {items.map((it, i) => (
        <Card key={i} label={it.label} value={it.value} icon={it.icon} accent={it.accent} />
      ))}
    </div>
  </section>
)

const Mobile = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedVuln, setSelectedVuln] = useState('');
  const [zaiflikText, setZaiflikText] = useState('');
  const [oqibatlarText, setOqibatlarText] = useState('');
  const [tavsiyaText, setTavsiyaText] = useState('');

  const mobile = [
    { label: 'Jami:', value: 4, accent: 'blue', icon: 'bx bxs-circle' },
    { label: "To'liq yakunlangan:", value: 0, accent: 'green', icon: 'bx bxs-circle-half' },
    { label: "Qisman yakunlangan:", value: 1, accent: 'aqua', icon: 'bx bxs-circle-quarter' },
    { label: 'Xat chiqarilgan:', value: 1, accent: 'muted', icon: 'bx bxs-circle-quarter' },
    { label: 'Jarayonda:', value: 0, accent: 'aqua', icon: 'bx bxs-circle-half' },
    { label: "O'tib ketgan:", value: 0, accent: 'red', icon: 'bx bxs-circle-half' },
    { label: 'Hisobotga chiqarilgan:', value: 2, accent: 'blue', icon: 'bx bxs-circle-three-quarter' },
    { label: 'Qayta ekspertizada:', value: 0, accent: 'aqua', icon: 'bx bxs-circle-quarter' },
    { label: "Vaqtincha to'xtatilgan:", value: 0, accent: 'red', icon: 'bx bxs-circle-three-quarter' },
    { label: "Tizimga qo'shilgan:", value: 0, accent: 'muted', icon: 'bx bxs-circle-quarter' }
  ]
  const handlePdf = () => {
    navigate('/page/viewer');
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])


  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setSelectedVuln('');
      setZaiflikText('');
      setOqibatlarText('');
      setTavsiyaText('');
    }
  }

  const handleVulnChange = (e) => {
    const value = e.target.value;
    setSelectedVuln(value);

    if (value === 'Ilova kodini yaxlitligi joriy etilmaganligi') {
      setZaiflikText(`Ilova o‘z kodlari va imzo ma’lumotlarining yaxlitligini va haqiqiyligini tekshirmaydi. Bunday holatda ilova qayta yig’ilgan, statik modifikatsiyaga uchragan yoki noto‘g‘ri/soxta sertifikat bilan imzolangan bo‘lsa, server yoki ilova buni aniqlay olmaydi. Mazkur turdagi zaiflik “MASWE-0104” (inglizcha. App Integrity Not Verified – Ilova yaxlitligi tasdiqlanmasligi) identifikator raqamiga ega kategoriyaga mansub.`);
      setOqibatlarText(`Ilovani kodiga o’zgartirish kiritish va uni qayta yig‘ish, zararli kod qo‘shish yoki imzoni almashtirib, foydalanuvchilarga zarar yetkazuvchi soxta talqinlarni tarqatish.`);
      setTavsiyaText(`Ilova ishga tushganida o‘zining imzosini, to’liqligini tekshirish mexanizmini quyi darajadagi (Native C++) dasturlash tillaridan foydalangan holda joriy etish.`);
    } else if (value === 'Malumotlarni oshkor etilishi') {
      setZaiflikText(`Ekspertiza davrida axborot tizimiga tegishli ichki ma’lumotlar, xususan muhim qismlarga kirish oynalari, turli xil kengaytmadagi fayllar Internet tarmog‘ining barcha foydalanuvchilari uchun ochiq holatdaligi, ya’ni ichki resurslarga bo‘ladigan murojaatlarni boshqarish hamda nazorat qilish mexanizmlari qo‘llanmaganlik holati aniqlandi.

Mazkur turdagi zaiflik CWE (Common Weaknes Enumeration) dasturiy va apparat ta’minotlarning zaifliklarini kategoriyalash tizimida “CWE-200” (inglizcha. Exposure of Sensitive Information to an Unauthorized Actor – Ishonchsiz foydalanuvchiga ma’lumotlarni ochiqlanishi) identifikator raqamiga ega kategoriyaga mansub.

Bundan tashqari, “Open Web Application Security Project” (Veb-ilovalarning xavfsizligini ta’minlash ochiq loyihasi) OWASP Top 2021 reytingida: 1-o‘rindagi (inglizcha. Broken Access Control – Ruxsatlar nazoratini buzilishi) zaiflik turiga kiritilgan.

Quyidagi misolda aniqlangan zaiflik ekspluatatsiyasi holati taqdim etilgan.`);
      setOqibatlarText(`Mazkur holat, ixtiyoriy Internet tarmog‘i foydalanuvchisiga resurslarga murojaat qilish orqali ulardan foydalanish imkoniyatini taqdim etadi.`);
      setTavsiyaText(`Ushbu qism bilan bog‘liq dasturiy kodni qayta ko‘rib chiqish hamda takomillashtirish.`);
    } else if (value === 'Himoyalanmagan havolalar') {
      setZaiflikText(`Ilovadagi URL manzillar teskari muhandislik usulini ishlatgan holda oxirgi nuqtalar va/yoki kutubxonalar haqida maʼlumotlarni olish imkoniyatini beradi. Ushbu ma’lumotlardan uchinchi tomon ruxsatsiz ilovalar yoki skriptlar yozish uchun foydalanishi mumkin.

Bundan tashqari, agar shifrlash to‘g‘ri sozlanmagan bo‘lsa, tarmoqdagi tajovuzkor barcha aloqalarni ko‘rishi va tarkibni o‘zboshimchalik bilan o‘zgartirishi mumkin. Agar ma’lumotlar ilovaning nozik joylarida ishlatilsa yoki ma’lumotlar ijroga ta’sir qilsa, bu ilovada jiddiy oqibatlarga olib kelishi mumkin.

Mazkur turdagi zaiflik “MASWE-0058” (inglizcha. Insecure Deep Links – Xavfsiz bo‘lmagan havolalar) identifikator raqamiga ega kategoriyaga mansub. Shuningdek, OWASP Mobile Top 10 2024 reytingida 8-o‘rinda (inglizcha. Security Misconfiguration – Noto‘g‘ri xavfsizlik konfiguratsiyasi) zaiflik turiga kiritilgan.`);
      setOqibatlarText(`Ochiq havolalar to‘g‘risida ma’lumotlarni qo‘lga kiritish holatiga olib kelishi mumkin.`);
      setTavsiyaText(`Ilovada foydalanilayotgan tashqi va ichki resurs havolalarini ochiq matn shaklida saqlamaslik.`);
    } else {
      setZaiflikText('');
      setOqibatlarText('');
      setTavsiyaText('');
    }
  }


  return (
    <>
      <div className="dashboard-page bg-[#f5f5f9] dark:bg-[#1e1e2f] " style={{ margin: '-20px' }}>

        <Section title="Mobil ekspertizalar" items={mobile} />


        <div className="mt-10">
          <div className="bg-white rounded-md shadow-sm pb-20 dark:bg-[#2b2c40]">
            <div className="mb-6 px-6 pt-6">
              <h4 className="text-sm text-slate-400 font-medium">Qidiruv filter</h4>
              <div className="mt-3 flex items-center gap-4">
                <select className="border rounded-md px-3 py-2 text-sm text-slate-500 w-64 bg-transparent">
                  <option>Foydalanuvchini tanlang ...</option>
                </select>
                <div className="ml-auto">
                  <div className="relative">
                    <input className="border rounded-md px-3 py-2 text-sm text-slate-500 outline-none bg-transparent" placeholder="Qidirish..." />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                      <iconify-icon icon="mdi:magnify" width="18" height="18"></iconify-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 text-xs border-t border-b">
                    <th className="px-4 py-3 text-[14px] font-normal border-r">N</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">TASHKILOT NOMI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">AXBOROT TIZIMINING NOMI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">SHARTNOMA RAQAMI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">NAZORATCHI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">BAJARUVCHI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">EKSPERTIZANING BOSHLANISH SANASI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">EKSPERTIZANING YAKUNLANISH SANASI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">HISOB MA'LUMOTI</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">BALL</th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">QAYSI BOSQICHDA</th>
                    <th className="px-4 py-3 text-[14px] font-normal">HOLATLAR</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      org: 'BIZNESNI RIVOJLANTIRISH BANKI AKSIYADORLIK TIJORAT BANKI',
                      system: 'BRB',
                      contract: '296-M',
                      nazoratchi: 'Jamoldinov Xojiakbar',
                      bajaruvchi: ['Tojaliyev Shoxbozbek', 'Yo\'ldoshov Umrzoq'],
                      start: '',
                      end: '2025-12-19',
                      hisobot: 'Chiqarilmagan',
                      ball: '0/0',
                      stage: 'XAT CHIQARILGAN',
                      statuses: [
                        { id: 1, label: "Tizimga qo‘shilgan", status: true },
                        { id: 2, label: "Xat chiqarilgan", status: true },
                        { id: 3, label: "Xat kelgan", status: false },
                        { id: 4, label: "Jarayonda", status: false },
                        { id: 5, label: "Tekshirilmoqda", status: false},
                        { id: 6, label: "Hisobotga chiqarilgan", status: false },
                        { id: 7, label: "Qisman yakunlangan", status: false  },
                        { id: 8, label: "Qayta expertizada", status: false },
                        { id: 8, label: "Yakunlangan", status: false },
                      ]
                    },
                    {
                      id: 2,
                      org: 'TRASTBANK XUSUSIY AKSIYADORLIK BANKI',
                      system: '"Trast mobile" B2B',
                      contract: '1039-M',
                      nazoratchi: 'Saidvaliyev Isroiljon',
                      bajaruvchi: ['Yo\'ldoshov Umrzoq'],
                      start: '',
                      end: '2025-12-03',
                      hisobot: 'Chiqarilmagan',
                      ball: '0/13',
                      stage: 'XAT CHIQARILGAN',
                      statuses: [
                        { id: 1, label: "Tizimga qo‘shilgan", status: true },
                        { id: 2, label: "Xat chiqarilgan", status: true },
                        { id: 3, label: "Xat kelgan", status: true },
                        { id: 4, label: "Jarayonda", status: true },
                        { id: 5, label: "Tekshirilmoqda", status: true },
                        { id: 6, label: "Hisobotga chiqarilgan", status: true },
                        { id: 7, label: "Qisman yakunlangan", status: true },
                        { id: 8, label: "Qayta expertizada", status: true},
                        { id: 8, label: "Yakunlangan", status: true },
                      ]
                    }
                  ].map((r, i) => (
                    <tr key={r.id} className="border-b align-middle py-6 hover:bg-gray-50 dark:hover:bg-[#2b2c40]">
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{i + 1}</td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.org}</td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.system}</td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.contract}</td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.nazoratchi}</td>
                      <td className="px-4 py-4 align-middle whitespace-pre-line text-[15px] text-[#8895a4] border-r">
                        {r.bajaruvchi.map((b, idx) => (
                          <span className='mb-3' key={idx}>{b}</span>
                        ))}

                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.start}</td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.end}</td>
                      <td className="px-4 py-4 align-middle border-r">
                        <span className="inline-block px-2 py-1 text-xs rounded-md bg-red-100 dark:bg-red-400 text-red-600 dark:text-red-50 text-[13px] uppercase">{r.hisobot}</span>
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">{r.ball}</td>
                      <td className="px-4 py-4 align-middle border-r">
                        <div className="h-full flex relative">
                          {r?.statuses?.map((item, index) => (
                            <div
                              key={item.id}
                              className="relative group"
                              style={{ marginLeft: index === 0 ? 0 : -14, zIndex: index }}
                            >
                              <span
                                className={`w-7 h-7 cursor-pointer rounded-full border border-gray-400 ${item.status?"bg-blue-700":"bg-gray-400"} flex items-center justify-center`}
                              ></span>
                              <div
                                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-sm text-white bg-black rounded opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none"
                              >
                                {item.label}
                                <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-black rotate-45 -translate-x-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-md bg-sky-50 text-sky-400 font-bold">
                            <iconify-icon icon="tabler:edit" width="20" height="20"></iconify-icon>
                          </button>
                          <button onClick={handleModal} className="p-2 rounded-md bg-violet-50 text-violet-600">
                            <iconify-icon icon="mdi:dots-vertical" width="20" height="20"></iconify-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <button
            className="mt-4 px-[10px] pt-[10px] bg-gray-50 text-gray-700 rounded absolute top-[30px] right-[13px] shadow-md"
            onClick={handleModal}>
            <iconify-icon icon="mdi:close" width="28" height="28"></iconify-icon>
          </button>
          <div className="bg-white dark:bg-[#2b2c40] rounded-lg shadow-lg p-6 w-[55%] relative overflow-y-scroll max-h-[100vh]">
            <h2 className="text-lg font-semibold mb-4 text-gray-500 dark:text-gray-200">Batafsil</h2>
            <ExpertizaTable />
            <div className='mt-4'>
              {/* 1-5 textarea'lar o'zgarmagan */}
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">Qayd yozuvi (role|login|parol)</label><textarea rows="3" className="form-control" placeholder="Login , parollar"></textarea></div>
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">[Dasturchi]-[rasmiy_sayt]-[ilova_kategoriyasi]-[fayl_nomi]-[paket_nomi]-[talqin]-[min_iOS]-[joriy_iOS]-[app_store_havola]-[app_store_reyting]-[logo]-[md5]-[sha1]-[sha256]</label><textarea rows="3" className="form-control" placeholder="Nazorat qiymatlari"></textarea></div>
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">[Dasturchi]-[rasmiy_sayt]-[ilova_kategoriyasi]-[fayl_nomi]-[paket_nomi]-[talqin]-[min_iOS]-[joriy_iOS]-[app_store_havola]-[app_store_reyting]-[logo]-[md5]-[sha1]-[sha256]</label><textarea rows="3" className="form-control" placeholder="Nazorat qiymatlari"></textarea></div>
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">MOBIL IPLAR</label><textarea rows="3" className="form-control" placeholder="Domain va iplar"></textarea></div>
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">MOBIL PORTLAR</label><textarea rows="3" className="form-control" placeholder="Ip va portlar"></textarea></div>

              {/* 6 Zaiflik haqida */}
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">Zaiflik haqida</label><textarea rows="6" className="form-control" value={zaiflikText} onChange={(e) => setZaiflikText(e.target.value)} placeholder="Hisobot"></textarea></div>

              {/* 7 Ekspluatatsiya oqibatlari */}
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">Ekspluatatsiya oqibatlari</label><textarea rows="3" className="form-control" value={oqibatlarText} onChange={(e) => setOqibatlarText(e.target.value)} placeholder="Oqibatlari"></textarea></div>

              {/* 8 Tavsiya */}
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">Tavsiya</label><textarea rows="3" className="form-control" value={tavsiyaText} onChange={(e) => setTavsiyaText(e.target.value)} placeholder="Tavsiya"></textarea></div>

              {/* 9 Soni */}
              <div className="mb-3 fv-plugins-icon-container"><label className="form-label">Soni</label><input type="number" className="form-control" placeholder="Soni" defaultValue="1" /></div>
            </div>

            <div className="flex gap-4 justify-between mt-6">
              <div className="flex w-[400px] justify-between items-center">
                <div className="w-[190px]">
                  <select className="border rounded-md px-3 py-2 text-sm text-slate-500 w-full bg-transparent">
                    <option>Android</option>
                    <option>iOS</option>
                    <option>Umumiy</option>
                  </select>
                </div>
                <div className="w-[190px] ml-6">
                  <select className="border rounded-md px-3 py-2 text-sm text-slate-500 w-full bg-transparent">
                    <option>Yuqori</option>
                    <option>O'rta</option>
                    <option>Past</option>
                  </select>
                </div>
              </div>
              <div className="w-[500px]">
                <select
                  className="border rounded-md px-3 py-2 text-sm text-slate-500 w-full bg-transparent"
                  value={selectedVuln}
                  onChange={handleVulnChange}
                >
                  <option value="">Zaiflik turini tanlang...</option>
                  <option value="Ilova kodini yaxlitligi joriy etilmaganligi">Ilova kodini yaxlitligi joriy etilmaganligi</option>
                  <option value="Malumotlarni oshkor etilishi">Malumotlarni oshkor etilishi</option>
                  <option value="Himoyalanmagan havolalar">Himoyalanmagan havolalar</option>
                </select>
              </div>
            </div>


            <div className="w-full mx-auto my-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <i className="ri-upload-cloud-2-line text-4xl text-blue-600 mb-4"></i>
                <span className="text-gray-600 text-base font-semibold dark:text-white">Maydonni bosing</span>
                <input id="file-upload" type="file" className="hidden" />
              </label>
            </div>


            <div className="btn-group flex justify-end items-center gap-2">
              <button className="btn btn-primary py-2" data-bs-dismiss="modal" aria-label="Close">Qo'shish</button>
              <button className="btn btn-primary py-2" data-bs-dismiss="modal" aria-label="Close">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Mobile