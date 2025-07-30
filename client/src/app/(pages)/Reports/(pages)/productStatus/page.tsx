"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cell, PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statusColors: { [key: string]: string } = {
  Published: '#94fcae',
  'Out Stock': '#fae52a',
  'Draft List': '#8c77fc',
  Inactive: '#fc1fa0'
};

export default function ProductStatusOverview() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("productsData");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const processData = () => {
    const statusCounts: { [key: string]: number } = {};

    products.forEach(product => {
      const status = product.status || 'غير معروف';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#cccccc'
    }));
  };

  const chartData = processData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">نظرة عامة على حالة المنتجات</h1>
        
        <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">توزيع الحالات</h2>
          {chartData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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

              <div className="space-y-3">
                {chartData.map((status, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span>{status.name}:</span>
                    <span className="font-semibold">{status.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد بيانات حالة متاحة. قم برفع المنتجات لإنشاء التقارير.
            </div>
          )}
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg">
          <h2 className="text-xl font-medium text-gray-800 mb-4">الوصول السريع</h2>
          <ul className="space-y-2">
            <li><Link href="/Reports/monthlyStock" className="text-blue-500 hover:underline">تقرير المخزون الشهري</Link></li>
            <li><Link href="/Reports/priceDistribution" className="text-blue-500 hover:underline">تحليل توزيع الأسعار</Link></li>
            <li><Link href="/Reports" className="text-blue-500 hover:underline">لوحة تقارير الرئيسية</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}