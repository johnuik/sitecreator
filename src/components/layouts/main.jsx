import { Outlet, useLocation } from "react-router-dom";
import Aside from "./aside";
import Header from "./header";
import Footer from "./footer";
import { useEffect } from "react";

const Main = () => {
  const location = useLocation();
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    async function loadAllScripts() {
      await loadScript("/assets/js/lib/jquery-3.7.1.min.js");
      await loadScript("/assets/js/lib/apexcharts.min.js");
      await loadScript("/assets/js/lib/simple-datatables.min.js");
      await loadScript("/assets/js/lib/iconify-icon.min.js");
      await loadScript("/assets/js/lib/jquery-ui.min.js");
      await loadScript("/assets/js/lib/jquery-jvectormap-2.0.5.min.js");
      await loadScript("/assets/js/lib/jquery-jvectormap-world-mill-en.js");
      await loadScript("/assets/js/lib/magnifc-popup.min.js");
      await loadScript("/assets/js/lib/slick.min.js");
      await loadScript("/assets/js/lib/prism.js");
      await loadScript("/assets/js/lib/file-upload.js");
      await loadScript("/assets/js/lib/audioplayer.js");
      await loadScript("/assets/js/flowbite.min.js");
      await loadScript("/assets/js/app.min.js");

      if (location.pathname === "/") {
        await loadScript("/assets/js/homeOneChart.js");
      }
    }

    loadAllScripts();
  }, [location.pathname]);

  return (
    <div className="dark:bg-neutral-800 bg-neutral-100 dark:text-white">
      <Aside />
      <main className="dashboard-main" >
        <Header />
        <div className="dashboard-main-body">
          <Outlet />
        </div>
        <Footer />
      </main>


    </div>
  );
};


export default Main;