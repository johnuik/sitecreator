import { useEffect } from "react";
import { sendRpcRequest } from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import "./dashboard.css";
import { useZirhStref } from "../../context/ZirhContext";
import { useNavigate } from "react-router-dom";

const Card = ({ label, value, icon, accent = "teal" }) => {
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return (
    <div
      className="bg-white dark:bg-[#2b2c40] bg-gradient-to-r from-cyan-600/10 to-bg-white stat-card"
      data-accent={accent}
    >
      <div className="stat-card__top">
        <div className="stat-card__label text-[#718193] dark:text-gray-200 text-lg">
          {label}
        </div>
        <div
          className="stat-card__icon"
          style={{
            color: accent == "muted" ? "#8592a3" : accent,
            background: hexToRgba(accent, 0.1),
          }}
          aria-hidden
        >
          <i
            className={`${icon} text-4xl`}
            style={{ width: 36, height: 36 }}
          ></i>
          {/* <iconify-icon icon={icon} width="36" height="36" /> */}
        </div>
      </div>
      <div className="stat-card__value text-[#566a7f] dark:text-gray-300">
        {value}
      </div>
    </div>
  );
};

const Section = ({ title, items }) => (
  <section className="stats-section">
    <h3 className="stats-section__title">{title}</h3>
    <div className="stats-grid">
      {items.map((it, i) => (
        <Card
          key={i}
          label={it.label}
          value={it.value}
          icon={it.icon}
          accent={it.accent}
        />
      ))}
    </div>
  </section>
);

const DashboardPage = () => {
  const system = [
    { label: "Jami:", value: 0, accent: "blue", icon: "bx bxs-circle" },
    {
      label: "To'liq yakunlangan:",
      value: 0,
      accent: "green",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Qisman yakunlangan:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Xat chiqarilgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Xat kelgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Jarayonda:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-half",
    },
    {
      label: "O'tib ketgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Hisobotga chiqarilgan:",
      value: 0,
      accent: "blue",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Qayta ekspertizada:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Vaqtincha to'xtatilgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Tizimga qo'shilgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
  ];

  const mobile = [
    { label: "Jami:", value: 4, accent: "blue", icon: "bx bxs-circle" },
    {
      label: "To'liq yakunlangan:",
      value: 0,
      accent: "green",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Qisman yakunlangan:",
      value: 1,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Xat chiqarilgan:",
      value: 1,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Jarayonda:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-half",
    },
    {
      label: "O'tib ketgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Hisobotga chiqarilgan:",
      value: 2,
      accent: "blue",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Qayta ekspertizada:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Vaqtincha to'xtatilgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Tizimga qo'shilgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
  ];

  const { stRef } = useZirhStref();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const resU = await sendRpcRequest(stRef, METHOD.USER_GET, {});
      if(resU.status === METHOD.OK){
      }else if(resU.status === METHOD.Not_Found){
        localStorage.removeItem("checkUser")
        navigate("/login");
      }
    };

    getUser();
  }, []);

  return (
    <div
      className="dashboard-page dark:bg-[#1e1e2f] "
      style={{ margin: "-20px" }}
    >
      <div className="mt-4 text-xl text-gray-400 font-medium mb-4 ">
        {" "}
        Bosh sahifa / <span className="text-gray-600">Tizim ekspertizalar</span>
      </div>

      <Section title="Tizim ekspertizalar" items={system} />

      <div className="mt-8 text-xl text-gray-400 font-medium mb-4 ">
        {" "}
        Bosh sahifa / <span className="text-gray-600">Mobil ekspertizalar</span>
      </div>

      <Section title="Mobil ekspertizalar" items={mobile} />

      <div className="mt-10 text-xl text-gray-400 font-medium mb-2 ">
        {" "}
        Bosh sahifa / <span className="text-gray-600">Kunlik topshiriqlar</span>
      </div>

      <div className="mt-4">
        <div className="lt-row">
          <div className="lt-card bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600  bg-white dark:bg-[#2b2c40]">
            <div
              className="lt-card__dot w-6 h-6"
              style={{ background: "var(--accent-purple)" }}
            ></div>
            <div className="lt-card__label dark:text-gray-200">Jami</div>
            <div className="lt-card__value dark:text-gray-300">0</div>
          </div>
          <div className="lt-card bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600 bg-white dark:bg-[#2b2c40] ">
            <div
              className="lt-card__dot w-6 h-6"
              style={{ color: "var(--accent-green)" }}
            >
              <i class="bx bxs-time-five text-success display-6 text-2xl"></i>
            </div>
            <div className="lt-card__label dark:text-gray-200">Tugatilgan</div>
            <div className="lt-card__value dark:text-gray-300">0</div>
          </div>
          <div className="lt-card bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600 bg-white dark:bg-[#2b2c40] ">
            <div
              className="lt-card__dot w-6 h-6"
              style={{ color: "var(--accent-teal)" }}
            >
              <i class="bx bxs-time text-info display-6 text-2xl"></i>
            </div>
            <div className="lt-card__label dark:text-gray-200">Jarayonda</div>
            <div className="lt-card__value dark:text-gray-300">0</div>
          </div>
          <div className="lt-card bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600 bg-white dark:bg-[#2b2c40] ">
            <div
              className="lt-card__dot w-6 h-6"
              style={{ color: "var(--accent-red)" }}
            >
              <i class="bx bxs-time text-danger display-6 text-2xl"></i>
            </div>
            <div className="lt-card__label dark:text-gray-200">
              Vaqti o'tib ketgan
            </div>
            <div className="lt-card__value dark:text-gray-300">0</div>
          </div>
          <div className="lt-card bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600 bg-white dark:bg-[#2b2c40]">
            <div className="lt-card__dot w-6 h-6" style={{ color: "#8592a3" }}>
              <i class="bx bxs-time text-secondary display-6 text-2xl"></i>
            </div>
            <div className="lt-card__label dark:text-gray-200">
              Bajarilmagan
            </div>
            <div className="lt-card__value dark:text-gray-300">0</div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-xl text-gray-400 font-medium mb-2 ">
        {" "}
        Bosh sahifa / <span className="text-gray-600">Summa</span>
      </div>

      <div className="mt-4">
        <div className="lt-sum dark:bg-[#2b2c40] bg-gradient-to-r from-cyan-600/10 to-bg-white border border-gray-200 dark:border-neutral-600">
          <div
            className="lt-sum__dot w-6 h-6"
            style={{ background: "var(--accent-purple)" }}
          ></div>
          <div className="lt-sum__label dark:text-gray-200">Jami summa</div>
          <div className="lt-sum__value dark:text-gray-300">0</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
