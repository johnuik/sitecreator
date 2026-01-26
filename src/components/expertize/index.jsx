import React, { useEffect, useState } from "react";
import { sendRpcRequest, uploadFileViaRpc } from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import { useZirhStref } from "../../context/ZirhContext";
import Select from "react-select";

const vulnLevelOptions = [
  { value: "1", label: "Yuqori" },
  { value: "2", label: "O'rta" },
  { value: "3", label: "Past" },
];

const ExpertizeModal = ({ link="word", open, onClose, item, itemId, onSaveDoc }) => {
  const [selectedVuln, setSelectedVuln] = useState("");
  const [zaiflikText, setZaiflikText] = useState("");
  const [oqibatlarText, setOqibatlarText] = useState("");
  const [tavsiyaText, setTavsiyaText] = useState("");
  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const { stRef } = useZirhStref();
  const [vuln, setVuln] = useState([]);
  const [highVuln, setHighVuln] = useState([]);
  const [middleVuln, setMiddleVuln] = useState([]);
  const [lowVuln, setLowVuln] = useState([]);
  const [vulnLevel, setVulnLevel] = useState("");
  const [platform, setPlatform] = useState("");
  const [filteredVuln, setFilteredVuln] = useState([]);
  const [newDocVuln, setNewDocVuln] = useState({});

  const handleVulnChange = (selected) => {
    if (!selected) {
      setSelectedVuln(null);
      setZaiflikText("");
      setOqibatlarText("");
      setTavsiyaText("");
      return;
    }

    const selectedId = selected.value;
    setSelectedVuln(selectedId);

    const found = filteredVuln.find((v) => v._id === selected.value);
    setNewDocVuln(found);
    // console.log(found);
    if (!found) return;

    const data = found[1];
    setZaiflikText(data[2] || "");
    setOqibatlarText(data[3] || "");
    setTavsiyaText(data[4] || "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    return;

    const map = {
      surname: 4.2,
      name: 4.3,
      partName: 4.4,
      role: 3,
      department: 4.1,
      phone: 4.5,
      image: 4.6,
    };

    // const code = map[name];
    // if (!code) return;

    // if (value === editItemOld[name]) {
    //   setChangedFields((prev) => prev.filter((c) => c !== code));
    // } else {
    // //   setChangedFields((prev) =>
    //     prev.includes(code) ? prev : [...prev, code],
    //   );
    // }
  };

  const saveAllPages = async () => {
    try {
      if (formData.contract && formData.contract instanceof File) {
        setUploadProgress(0);
        setIsUploading(true);

        const uploadRes = await uploadFileViaRpc(
          stRef,
          formData.contract,
          null,
          (p) => {
            setUploadProgress(p);
            if (p === 100) setIsUploading(false);
          },
        );

        formData.contract = uploadRes.result["fileId"];
      }

     

      const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, {
        19: itemId,
        1.16: formData.userValues,
      });
      // console.log(res);
      //   console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const getVuln = async () => {
    try {
      const res = await sendRpcRequest(stRef, METHOD.VULN_GET, { 1: 1 });
      if (res.status === METHOD.OK) {
        // console.log(res.result[1]);
        const high = res.result[1].filter((v) => v[1]?.[0] === 1);
        const middle = res.result[1].filter((v) => v[1]?.[0] === 2);
        const low = res.result[1].filter((v) => v[1]?.[0] === 3);
        setHighVuln(high);
        setMiddleVuln(middle);
        setLowVuln(low);
        setVuln(res.result[1]);
        // console.log(res.result[1]);
        // console.log(low);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVuln();
    // console.log(vulnOptions);
  }, []);

  const handleSelectVuln = (selected) => {
    if (!selected) {
      setVulnLevel("");
      setFilteredVuln([]);
      return;
    }

    setVulnLevel(selected.value);

    if (selected.value === "1") setFilteredVuln(highVuln);
    else if (selected.value === "2") setFilteredVuln(middleVuln);
    else if (selected.value === "3") setFilteredVuln(lowVuln);
  };

  const handleSaveDoc = () => {
    if (!newDocVuln) return;
    onSaveDoc({
      vuln: newDocVuln,
      platform: platform,
      vulnLevel: vulnLevel,
      vulnCount: formData.count || 1
    });
  };

  const vulnOptions = filteredVuln.map((v) => ({
    value: v._id,
    label: v["1"]?.[1],
  }));

  if (!open) return null;

  return (
    <div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <button
            className="mt-4 px-[10px] pt-[10px] bg-gray-50 text-gray-700 rounded absolute top-[30px] right-[13px] shadow-md"
            onClick={onClose}
          >
            <iconify-icon
              icon="mdi:close"
              width="28"
              height="28"
            ></iconify-icon>
          </button>
          <div className="bg-white dark:bg-[#2b2c40] rounded-lg shadow-lg p-6 w-[55%] relative overflow-y-scroll max-h-[100vh]">
            <h2 className="text-lg font-semibold mb-4 text-gray-500 dark:text-gray-200">
              {item?.[3]}
            </h2>
            <div className="mt-4">
              {/* 1-5 textarea'lar o'zgarmagan */}
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">
                  Qayd yozuvi (role|login|parol)
                </label>
                <textarea
                  rows="3"
                  name="userValues"
                  value={formData.userValues}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Login , parollar"
                ></textarea>
              </div>
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">
                  [Dasturchi]-[rasmiy_sayt]-[ilova_kategoriyasi]-[fayl_nomi]-[paket_nomi]-[talqin]-[min_iOS]-[joriy_iOS]-[app_store_havola]-[app_store_reyting]-[logo]-[md5]-[sha1]-[sha256]
                </label>
                <textarea
                  rows="3"
                  name="controlValues"
                  value={formData.controlValues}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nazorat qiymatlari"
                ></textarea>
              </div>
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">
                  [Dasturchi]-[rasmiy_sayt]-[ilova_kategoriyasi]-[fayl_nomi]-[paket_nomi]-[talqin]-[min_iOS]-[joriy_iOS]-[app_store_havola]-[app_store_reyting]-[logo]-[md5]-[sha1]-[sha256]
                </label>
                <textarea
                  rows="3"
                  name="controlValues2"
                  value={formData.controlValues2}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nazorat qiymatlari"
                ></textarea>
              </div>
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">MOBIL IPLAR</label>
                <textarea
                  rows="3"
                  name="mobileIps"
                  value={formData.mobileIps}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Domain va iplar"
                ></textarea>
              </div>
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">MOBIL PORTLAR</label>
                <textarea
                  rows="3"
                  name="mobilePorts"
                  value={formData.mobilePorts}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ip va portlar"
                ></textarea>
              </div>
              {/* 9 Soni */}
              <div className="mb-3 fv-plugins-icon-container">
                <label className="form-label">Soni</label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Soni"
                  defaultValue="1"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-between mt-6">
              <div className="flex w-[400px] justify-between items-center">
                <div className="w-[190px]">
                  <select
                    className="border rounded-md px-3 py-2 text-sm text-slate-500 w-full bg-transparent"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option value="">Platformani tanlang</option>
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="umumiy">Umumiy</option>
                  </select>
                </div>
                <div className="w-[190px] ml-6">
                  <Select
                    options={vulnLevelOptions}
                    placeholder="Tanlang..."
                    isSearchable
                    value={
                      vulnLevelOptions.find((o) => o.value === vulnLevel) ||
                      null
                    }
                    onChange={handleSelectVuln}
                  />
                </div>
              </div>
              <div className="w-[500px]">
                <Select
                  options={vulnOptions}
                  placeholder="Zaiflik turini tanlang..."
                  isSearchable
                  isClearable
                  value={vulnOptions.find((o) => o._id === selectedVuln)}
                  onChange={handleVulnChange}
                />
              </div>
            </div>

            <div className="w-full mx-auto my-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <i className="ri-upload-cloud-2-line text-4xl text-blue-600 mb-4"></i>
                <span className="text-gray-600 text-base font-semibold dark:text-white">
                  Maydonni bosing
                </span>
                <input id="file-upload" type="file" className="hidden" />
              </label>
            </div>

            <div className="btn-group flex justify-end items-center gap-2">
              <button
                className="btn btn-primary py-2"
                data-bs-dismiss="modal"
                onClick={handleSaveDoc}
                aria-label="Close"
              >
                Qo'shish
              </button>
              <button
                className="btn btn-primary py-2"
                data-bs-dismiss="modal"
                onClick={saveAllPages}
                aria-label="Close"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertizeModal;
