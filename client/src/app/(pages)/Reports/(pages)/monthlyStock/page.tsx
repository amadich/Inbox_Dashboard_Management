"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyStockReport() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("productsData");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const processData = () => {
    const monthlyData: { [key: string]: { month: string; totalStock: number } } = {};

    products.forEach(product => {
      if (!product.date || product.date === "Invalid Date") return;
      
      const date = new Date(product.date);
      if (isNaN(date.getTime())) return;

      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      const stock = parseInt(product.stock.replace(/,/g, '')) || 0;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, totalStock: 0 };
      }
      
      monthlyData[monthYear].totalStock += stock;
    });

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  };

  const chartData = processData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">تقرير المخزون الشهري</h1>
        
        <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">نظرة عامة على المخزون</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalStock" fill="#8884d8" name="إجمالي المخزون" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد بيانات مخزون متاحة. قم برفع المنتجات لإنشاء التقارير.
            </div>
          )}
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg">
          <h2 className="text-xl font-medium text-gray-800 mb-4">الوصول السريع</h2>
          <ul className="space-y-2">
            <li><Link href="/Reports/priceDistribution" className="text-blue-500 hover:underline">تحليل توزيع الأسعار</Link></li>
            <li><Link href="/Reports/productStatus" className="text-blue-500 hover:underline">نظرة عامة على حالة المنتجات</Link></li>
            <li><Link href="/Reports" className="text-blue-500 hover:underline">لوحة تقارير الرئيسية</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}