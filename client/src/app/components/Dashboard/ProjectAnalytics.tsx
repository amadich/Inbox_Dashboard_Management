"use client";
import LoadingShow from '@/components/LoadingShow';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        { name: 'Monday', Tasks: totalStateCards.totalTasks },
        { name: 'Tuesday', Tasks: totalStateCards.doneTasks },
        { name: 'Wednesday', Tasks: totalStateCards.todoTasks },
        { name: 'Thursday', Tasks: totalStateCards.inProgressTasks },
        { name: 'Friday', Tasks: totalStateCards.inReviewTasks },
      ]);
      setLoading(false); // Set loading to false after data is loaded
    }, 2000); // 2 seconds delay to simulate loading
  }, [totalStateCards]); // Effect depends on totalStateCards

  return (
    <>
      {/* Show loading message if data is still being fetched */}
      {loading ? (
        <div className="w-full m-auto table">
          <LoadingShow msg="Loading project analytics..." />
        </div>
      ) : (
        <div className="mt-10 w-96">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Tasks" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default ProjectAnalytics;
