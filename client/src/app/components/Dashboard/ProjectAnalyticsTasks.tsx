"use client";
import LoadingShow from '@/components/LoadingShow';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the type for props to be received by the ProjectAnalytics component
interface ProjectAnalyticsProps {
  totalStateCards: {
    totalProjects: number;
    totalUsers: number;
    totalTasks: number;
    doneTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
  };
}

const ProjectAnalytics = ({ totalStateCards }: ProjectAnalyticsProps) => {
  // State to manage loading state and data
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; Tasks: number }[]>([]);

  // Simulate data loading after 2 seconds
  useEffect(() => {
    setTimeout(() => {
      // Populate chart data using the totalTasks and task information
      setData([
        { name: 'المهام القادمة', Tasks: totalStateCards.todoTasks },
        { name: 'قيد التنفيذ', Tasks: totalStateCards.inProgressTasks },
        { name: 'قيد المراجعة', Tasks: totalStateCards.inReviewTasks },
        { name: 'منجز', Tasks: totalStateCards.doneTasks },
      ]);
      setLoading(false); // Set loading to false after data is loaded
    }, 2000); // 2 seconds delay to simulate loading
  }, [totalStateCards]); // Effect depends on totalStateCards

  return (
    <>
      {/* Show loading message if data is still being fetched */}
      {loading ? (
        <div className="w-full m-auto table">
          <LoadingShow msg="جاري تحميل تحليلات المشاريع..." />
        </div>
      ) : (
        <div className="mt-10 w-96">
          <ResponsiveContainer width="100%" height={350} >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tasks" fill="#12556a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default ProjectAnalytics;
