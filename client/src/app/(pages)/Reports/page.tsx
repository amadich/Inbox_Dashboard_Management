"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("productsData");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const processChartData = () => {
    const monthlyData: { [key: string]: any } = {};

    products.forEach(product => {
      if (!product.date || product.date === "Invalid Date") return;
      
      try {
        const date = new Date(product.date);
        if (isNaN(date.getTime())) return;

        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!monthlyData[key]) {
          monthlyData[key] = {
            name: key,
            totalStock: 0,
            totalProducts: 0,
            totalSellPrice: 0,
            year: year,
            month: date.getMonth()
          };
        }

        // Convert formatted values back to numbers
        const stock = parseInt(product.stock.replace(/,/g, '')) || 0;
        const sellPrice = parseFloat(product.sellPrice.replace(/[^0-9.]/g, '')) || 0;

        monthlyData[key].totalStock += stock;
        monthlyData[key].totalSellPrice += sellPrice;
        monthlyData[key].totalProducts += 1;
      } catch (error) {
        console.error("Error processing product:", product);
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .map(item => ({
        ...item,
        averageSellPrice: item.totalSellPrice / item.totalProducts
      }))
      .sort((a, b) => a.year - b.year || a.month - b.month);
  };

  const chartData = processChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">التقارير</h1>
        <div className="space-y-6">
          {/* Product Data Chart */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h2 className="text-xl font-medium text-gray-800 mb-4">تحليلات المنتجات</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'averageSellPrice') 
                        return `${value.toFixed(2)} $`;
                      return value.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalStock" 
                    stroke="#8884d8" 
                    name="إجمالي المخزون"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averageSellPrice" 
                    stroke="#82ca9d" 
                    name="متوسط سعر البيع"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا توجد بيانات منتجات متاحة. قم برفع المنتجات لعرض التحليلات.
              </div>
            )}
          </div>

          {/* Additional Reports Section */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h2 className="text-xl font-medium text-gray-800 mb-4">الوصول السريع</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/Reports/monthlyStock" className="text-blue-500 hover:underline">
                  تقرير المخزون الشهري
                </Link>
              </li>
              <li>
                <Link href="/Reports/priceDistribution" className="text-blue-500 hover:underline">
                  تحليل توزيع الأسعار
                </Link>
              </li>
              <li>
                <Link href="/Reports/productStatus" className="text-blue-500 hover:underline">
                  نظرة عامة على حالة المنتجات
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;