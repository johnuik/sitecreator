import React, { use, useEffect, useState } from "react";
import { Modal } from "../../components";
import { useZirhStref } from "../../context/ZirhContext";
import { useZirhEvent } from "../../api/useZirh";
import {
  downloadFileViaRpc,
  sendRpcRequest,
  uploadFileViaRpc,
} from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import toast from "react-hot-toast";

const UserAdd = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { stRef } = useZirhStref();
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState(null);
  const [editId, setEditId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const changedRef = React.useRef([]);
  const [changedFields, setChangedFields] = useState([]);
  const [editItemOld, setEditItemOld] = useState({
    id: "",
    surname: "",
    name: "",
    partName: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    image: "",
  });

  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    partName: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    image: "",
  });

  function bufferToObjectId(bufferObj) {
    const bytes = Object.values(bufferObj);
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const fetchProfile = async () => {
 
  };

  const openDrawer = () => {
    setFormData({
      surname: "",
      name: "",
      partName: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      image: "",
    });
    setFileName(null);
    setIsUpdate(false);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const downloadFileAll = async (id) => {
    await downloadFileViaRpc(stRef, id, id, (p) => {
      console.log(p);
      setUploadProgress(p);
      setIsUploading(true);
      if (p === 100) setIsUploading(false);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!isUpdate) return;

    const map = {
      surname: 4.2,
      name: 4.3,
      partName: 4.4,
      role: 3,
      department: 4.1,
      phone: 4.5,
      image: 4.6,
    };

    const code = map[name];
    if (!code) return;

    if (value === editItemOld[name]) {
      setChangedFields((prev) => prev.filter((c) => c !== code));
    } else {
      setChangedFields((prev) =>
        prev.includes(code) ? prev : [...prev, code],
      );
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.surname || !formData.partName) return;
    setUploadProgress(0);
    setIsUploading(true);

    const file = formData.image;

    const doneRes = await uploadFileViaRpc(
      stRef,
      file,
      null,

      (p) => {
        // console.log(p);
        setUploadProgress(p);
      },
    );

    formData.image = doneRes.result["fileId"];
    const res = await sendRpcRequest(stRef, METHOD.USER_CREATE, {
      1: formData.surname,
      2: formData.name,
      3: formData.partName,
      4: formData.email,
      5: formData.role,
      6: formData.department,
      7: formData.phone,
      8: formData.image,
    });

    await downloadFileAll(formData.image || "9276c76090ee854fbea8670b32975676");

    // console.log("addUser:", res);

    setItems([
      ...items,
      {
        id: Date.now(),
        ...formData,
      },
    ]);

    setFormData({
      surname: "",
      name: "",
      partName: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      image: "",
    });
    closeDrawer();
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
    };

    const getAllUser = async () => {
      try {
        const res = await sendRpcRequest(stRef, METHOD.USER_GET_FULL, {});
        // console.log(res);
        if (res.status === METHOD.OK) {
          const mappedItems = await Promise.all(
            res.result[1].map(async (user, index) => {
              const info = user["4"] || [];

              let imageFileId = info[5] || "";
              if (
                imageFileId == "6968e7a2e3b6146a0601b78f" ||
                imageFileId.length < 30
              ) {
                imageFileId = "9276c76090ee854fbea8670b32975676";
              }
              const checkFileId = localStorage.getItem(imageFileId);
              if (imageFileId && !checkFileId) {
                await downloadFileAll(
                  imageFileId || "9276c76090ee854fbea8670b32975676",
                );
              }

              return {
                id: bufferToObjectId(user._id?.buffer),
                email: user["1"] || "",
                role: user["3"] || "",
                department: info[0] || "",
                surname: info[1] || "",
                name: info[2] || "",
                partName: info[3] || "",
                phone: info[4] || "",
                image: imageFileId,
              };
            }),
          );
          setItems(mappedItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllUser();

    fetchData();
  }, []);

  const getAvatar = (fileId) => {
    const imageAvatar = localStorage.getItem(
      fileId || "9276c76090ee854fbea8670b32975676",
    );
    if (!imageAvatar) {
      return "https://via.placeholder.com/150";
    }
    return imageAvatar;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (isUpdate) {
      const isChanged = true;
      setChangedFields((prev) => {
        if (isChanged && !prev.includes(4.6)) {
          return [...prev, 4.6];
        }
        return prev;
      });
    }
  };

  const handleEdit = async (item) => {
    try {
      if (item) {
        setFormData({
          ...formData,
          id: item.id,
          surname: item.surname,
          name: item.name,
          partName: item.partName,
          email: item.email,
          role: item.role,
          department: item.department,
          phone: item.phone,
          image: item.image,
        });
        setEditItemOld({
          ...formData,
          id: item.id,
          surname: item.surname,
          name: item.name,
          partName: item.partName,
          email: item.email,
          role: item.role,
          department: item.department,
          phone: item.phone,
          image: item.image,
        });
        setEditId(item.id);
        setIsUpdate(true);
        setDrawerOpen(true);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const payload = { 1: formData.id };

      if (formData.image && formData.image instanceof File) {
        setUploadProgress(0);
        setIsUploading(true);

        const uploadRes = await uploadFileViaRpc(
          stRef,
          formData.image,
          null,
          (p) => {
            setUploadProgress(p);
            if (p === 100) setIsUploading(false);
          },
        );

        formData.image = uploadRes.result["fileId"];
        await downloadFileAll(formData.image);
      }

      const fieldMap = {
        surname: 4.2,
        name: 4.3,
        partName: 4.4,
        role: 3,
        department: 4.1,
        phone: 4.5,
        image: 4.6,
      };

      const updatedFieldCodes = [];

      Object.keys(fieldMap).forEach((key) => {
        if (formData[key] !== editItemOld[key]) {
          const code = fieldMap[key];

          if (key === "department" || key === "role") {
            payload[code] = parseInt(formData[key]);
          } else {
            payload[code] = formData[key];
          }

          updatedFieldCodes.push(code);
        }
      });

      if (updatedFieldCodes.length === 0) {
        toast.error("Hech qanday o'zgarish qilinmadi");
        return;
      }

      // console.log("Payload:", payload);
      const res = await sendRpcRequest(stRef, METHOD.USER_UPDATE, payload);

      if (res.status === METHOD.OK) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === formData.id ? { ...item, ...formData } : item,
          ),
        );

        setChangedFields((prev) =>
          prev.filter((code) => !updatedFieldCodes.includes(code)),
        );

        setEditItemOld({ ...formData });

        toast.success("Foydalanuvchi muvaffaqiyatli yangilandi");
      } else {
        toast.error("Xatolik: Server ma'lumotni qabul qilmadi");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Foydalanuvchi yangilanmadi, tizim xatosi");
    }
  };

  return (
    <>
      {drawerOpen && (
        <div onClick={closeDrawer} className="fixed inset-0 bg-black/40 z-40" />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[400px] pr-[30px] bg-white dark:bg-[#2b2c40] z-50 transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-500">
            Foydalanuvchi qo'shish
          </h2>
          <button onClick={closeDrawer} className="text-xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">Familiya</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
              placeholder="Foydalanuvchining familiyasi"
            />
            {changedFields.includes(4.2) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>
          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">Ism</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
              placeholder="Foydalanuvchining ismi"
            />
            {changedFields.includes(4.3) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>
          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">Otasi</label>
            <input
              type="text"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
              placeholder="Otasini ismi"
            />
            {changedFields.includes(4.4) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>
          {!isUpdate && (
            <div>
              <label className="text-sm text-gray-500 uppercase">Pochta</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="info@csec.uz"
              />
            </div>
          )}
          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">Telefon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
              placeholder="Foydalanuvchining familiyasi"
            />
            {changedFields.includes(4.5) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>

          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">
              Bo'limni tanlang
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
            >
              <option value="" disabled selected>
                Bo'limni tanlang
              </option>
              <option value="1">Axborot tizimlari kiberxavfsizligi</option>
              <option value="2">Mobil ilovalar kiberxavfsizligi</option>
              <option value="3">Kiberxavfsizlik uzelini kuzatib borish</option>
            </select>
            {changedFields.includes(4.1) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>

          <div className="relative">
            <label className="text-sm text-gray-500 uppercase">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
            >
              <option value="" disabled selected>
                Lavozimni tanlang
              </option>
              <option value="1">Superadmin</option>
              <option value="2">Departament boshlig'i</option>
              <option value="3">Bo'lim boshlig'i</option>
              <option value="4">Bosh mutaxassis</option>
              <option value="5">Yetakchi mutaxassis</option>
              <option value="6">Birinchi toifali</option>
              <option value="7">Shartnoma bo'limi</option>
              <option value="8">Tashkilot</option>
            </select>
            {changedFields.includes(3) && (
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
            )}
          </div>

          <div className="w-full mx-auto my-4 relative">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 dark:bg-[#2b2c40] cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <i className="ri-upload-cloud-2-line text-4xl text-blue-600 mb-4"></i>
              <span className="text-gray-600 text-base font-semibold dark:text-white">
                {fileName || "Rasm yuklash"}
              </span>
              {changedFields.includes(4.6) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {!isUpdate && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreate}
                className="bg-[#696cff] text-white px-4 py-2 rounded-md"
              >
                Yaratish
              </button>
              <button
                onClick={closeDrawer}
                className="bg-gray-200 dark:bg-gray-400 px-4 py-2 rounded-md"
              >
                Bekor qilish
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-screen bg-transparent p-4 md:p-8">
        <div className="bg-white dark:bg-[#2b2c40] rounded-lg shadow-md overflow-hidden pt-2">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div></div>
            <div className="flex">
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-sm bg-transparent dark:text-white"
              />

              <div>
                <button
                  className="bg-[#696cff] text-white font-bold py-2 px-4 rounded-md ml-4 hover:bg-[#565edc] transition-colors"
                  onClick={openDrawer}
                >
                  + Foydalanuvchi qo'shish
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300">
                    N
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Rasm
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Foydalanuvchi
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Pochta
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    telefon
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    Bo'lim
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">
                    role
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300">
                    Izoh
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-[#2e2f4b] transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium dark:text-gray-300">
                      {item?.image ? (
                        <img
                          src={getAvatar(item?.image)}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        "Rasm mavjud emas"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.surname} {item.name} {item.partName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.department}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.role}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <button
                        className="p-2 rounded-md bg-sky-200 text-sky-400 font-bold"
                        onClick={() => handleEdit(item)}
                      >
                        <iconify-icon
                          icon="tabler:edit"
                          width="20"
                          height="20"
                        ></iconify-icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAdd;
