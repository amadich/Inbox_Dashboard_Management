"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const priceRanges = [
  { name: '0 - 50 دولار', min: 0, max: 50, color: '#8884d8' },
  { name: '50 - 100 دولار', min: 50, max: 100, color: '#82ca9d' },
  { name: '100 - 200 دولار', min: 100, max: 200, color: '#ffc658' },
  { name: '200 دولار فأكثر', min: 200, max: Infinity, color: '#ff8042' },
];

export default function PriceDistributionAnalysis() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("productsData");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const processData = () => {
    const distribution = priceRanges.map(range => ({
      ...range,
      count: 0
    }));

    products.forEach(product => {
      const price = parseFloat(product.sellPrice.replace(/[^0-9.]/g, '')) || 0;
      const range = distribution.find(r => price >= r.min && price < r.max);
      if (range) range.count++;
    });

    return distribution.filter(r => r.count > 0);
  };

  const chartData = processData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">تحليل توزيع الأسعار</h1>
        
        <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">توزيع نطاق الأسعار</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد بيانات أسعار متاحة. قم برفع المنتجات لإنشاء التقارير.
            </div>
          )}
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg">
          <h2 className="text-xl font-medium text-gray-800 mb-4">الوصول السريع</h2>
          <ul className="space-y-2">
            <li><Link href="/Reports/monthlyStock" className="text-blue-500 hover:underline">تقرير المخزون الشهري</Link></li>
            <li><Link href="/Reports/productStatus" className="text-blue-500 hover:underline">نظرة عامة على حالة المنتجات</Link></li>
            <li><Link href="/Reports" className="text-blue-500 hover:underline">لوحة تقارير الرئيسية</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}