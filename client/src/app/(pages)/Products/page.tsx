"use client";
import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { CalendarDateRangeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import SotetlLogo from "@/assets/images/sotetel_logo.png";
import ExcelIcon from "@/assets/icons/excel.png";
import img_not_found_trash from "@/assets/images/not_found_trash.svg";

// type ProductStatus = "Published" | "Out Stock" | "Draft List" | "Inactive";

// const statusColors: Record<ProductStatus, string> = {
//   Published: "success",
//   "Out Stock": "warning",
//   "Draft List": "ghost",
//   Inactive: "error"
// };

// Utility functions
const formatCurrency = (value: string) => {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
};

const formatStock = (value: string) => {
  return parseInt(value.replace(/\D/g, ""), 10).toLocaleString("en-US");
};

export default function ProductsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const transformed = json.map((item: any) => {
        const rawDate = new Date(item["Date"]);
        const isValidDate = !isNaN(rawDate.getTime());

        return {
          name: item["Product Name"] || "Unnamed Product",
          category: item["Category"] || "No Category",
          id: item["Product ID"]?.toString() || "N/A",
          date: isValidDate ? format(rawDate, "dd MMM, yyyy") : "Invalid Date",
          price: formatCurrency(item["Price"]),
          sellPrice: formatCurrency(item["Sell Price"]),
          stock: formatStock(item["Stock"]?.toString() || "0"),
          status: item["Status"] || "Unknown"
        };
      });

      setProducts(transformed);
      localStorage.setItem("productsData", JSON.stringify(transformed));
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "All Status" ||
        product.status === selectedStatus;

      const matchesDate = !selectedDate ||
        product.date === format(selectedDate, "dd MMM, yyyy");

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [products, searchQuery, selectedStatus, selectedDate]);

  // Load from localStorage on mount
  useEffect(() => {

    const savedProducts = localStorage.getItem("productsData");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }, []);

    
    useEffect(() => {
      
    }
    , []);
  

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-black">قائمة المنتجات</h2>
          <p className="text-muted text-gray-500">قم بإدارة منتجاتك بفعالية.</p>
        </div>
        <div className="flex items-center gap-4">
            <img
              src={SotetlLogo.src}
              alt="شعار سوتيتل"
              className="w-28"
              draggable="false"
            />
            <button
              onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement)?.showModal()}
              className="btn bg-transparent border-black hover:bg-black hover:text-white text-black font-semibold  shadow-md px-4 py-2 transition duration-300 ease-in-out"
            >
              <span className="mr-2">+ إضافة منتج</span>
            </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-1/3">
          <input
            className="input input-bordered w-full pr-10"
            placeholder="ابحث بالاسم أو معرف المنتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 w-5 h-5 text-muted" />
        </div>

        <div className="flex gap-4 items-center">
          <div className="form-control w-40">
            <select
              className="select select-bordered"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>كل الحالات</option>
              <option>منشور</option>
              <option>غير متوفر</option>
              <option>قائمة المسودات</option>
              <option>غير نشط</option>
            </select>
          </div>

          <div className="popover">
            <div className="popover-content w-auto p-0">
              <input
                type="date"
                className="invisible absolute"
                id="datePicker"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
              <button
                className="btn btn-outline w-[250px] justify-start text-left font-normal"
                onClick={() => (document.getElementById("datePicker") as HTMLInputElement)?.showPicker()}
              >
                <CalendarDateRangeIcon className="mr-2 h-5 w-5" />
                {selectedDate ?
                  format(selectedDate, "dd MMM, yyyy") :
                  "تصفية حسب التاريخ"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>اسم المنتج</th>
              <th>المعرف وتاريخ الإنشاء</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>الحالة</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted">
                  <img
                    src={img_not_found_trash.src}
                    alt="No Products Found"
                    className="mx-auto mb-4"
                    width={100}
                    height={100}
                    draggable="false"
                  />
                  لم يتم العثور على منتجات تطابق معاييرك.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              product.name || "منتج"
                            )}&background=random`}
                            alt="صورة المنتج"
                            draggable="false"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-muted">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-mono">{product.id}</div>
                    <div className="text-sm text-muted">{product.date}</div>
                  </td>
                  <td>
                    <div>{product.price}</div>
                    <div className="text-sm text-muted">سعر البيع {product.sellPrice}</div>
                  </td>
                  <td className="font-mono">{product.stock}</td>
                  <td>
                    <span
                      className={`badge space-x-2 text-xs font-medium select-none border-none shadow-none duration-150 hover:shadow-sm ${
                        product.status === 'Published'
                          ? 'text-green-600 bg-[#94fcae8e] shadow-green-500'
                          : product.status === 'Out Stock'
                          ? 'bg-[#fae52a98] text-yellow-800 shadow-amber-400'
                          : product.status === 'Draft List'
                          ? 'bg-[#8c77fc75] text-indigo-700 shadow-indigo-400'
                          : product.status === 'Inactive'
                          ? 'bg-[#fc1fa05b] text-pink-700 shadow-pink-400'
                          : ''
                      }`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          product.status === 'Published'
                            ? 'bg-green-500'
                            : product.status === 'Out Stock'
                            ? 'bg-yellow-500'
                            : product.status === 'Draft List'
                            ? 'bg-indigo-500'
                            : product.status === 'Inactive'
                            ? 'bg-pink-500'
                            : ''
                        }`}
                      ></span>
                      <span>
                        {product.status === 'Published' ? 'منشور' :
                         product.status === 'Out Stock' ? 'غير متوفر' :
                         product.status === 'Draft List' ? 'قائمة المسودات' :
                         product.status === 'Inactive' ? 'غير نشط' :
                         product.status}
                      </span>
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-xs btn-outline  "
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDetailsModal(true);
                      }}
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for file upload */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-4">
            <img
              src={ExcelIcon.src}
              alt="أيقونة إكسل"
              className="w-10 h-10 mb-4"
              draggable="false"
            />
            <h2 className="text-xl mb-4 text-green-600">رفع ملف إكسل</h2>
          </div>
          <p className="mb-4">قم برفع ملف .xlsx أو .xls يحتوي على بيانات المنتجات.</p>
          <p className="mb-4">تأكد من أن الملف يحتوي على الأعمدة التالية:</p>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>اسم المنتج</li>
            <li>الفئة</li>
            <li>معرف المنتج</li>
            <li>التاريخ</li>
            <li>السعر</li>
            <li>سعر البيع</li>
            <li>المخزون</li>
            <li>الحالة</li>
          </ul>
          <p className="mb-4">انقر على <span className="text-green-600"> الزر </span> أدناه لرفع ملفك.</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="file-input file-input-bordered file-input-success w-full text-green-600"
          />
          
          <p className="mt-4 text-center"><span className="text-green-700"> ملاحظة: </span> سيتم معالجة الملف وعرض البيانات في الجدول.</p>
          
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement)?.close()}
            >
              إغلاق
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal for product details */}
      {selectedProduct && showDetailsModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg mb-4">تفاصيل المنتج</h3>
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  selectedProduct.name || "منتج"
                )}&background=random`}
                alt="صورة المنتج"
                className="w-10 h-10 rounded mb-4" />
            </div>
            <div className="space-y-2">
              <p><strong>الاسم:</strong> {selectedProduct.name}</p>
              <p><strong>الفئة:</strong> {selectedProduct.category}</p>
              <p><strong>المعرف:</strong> {selectedProduct.id}</p>
              <p><strong>التاريخ:</strong> {selectedProduct.date}</p>
              <p><strong>السعر:</strong> {selectedProduct.price}</p>
              <p><strong>سعر البيع:</strong> {selectedProduct.sellPrice}</p>
              <p><strong>المخزون:</strong> {selectedProduct.stock}</p>
              <p><strong>الحالة:</strong> {selectedProduct.status === 'Published' ? 'منشور' :
                         selectedProduct.status === 'Out Stock' ? 'غير متوفر' :
                         selectedProduct.status === 'Draft List' ? 'قائمة المسودات' :
                         selectedProduct.status === 'Inactive' ? 'غير نشط' :
                         selectedProduct.status}</p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDetailsModal(false)}>إغلاق</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
