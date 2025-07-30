"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_USERS } from '@/app/graphql/projectMutation';
import { GET_ALL_TASKS_STATUS } from '@/app/graphql/Taskqueries';
import ProjectAnalyticsTasks from "@/app/components/Dashboard/ProjectAnalyticsTasks";
import SideProjects from "@/app/components/Dashboard/SideProjects";
import StatsCards from "@/app/components/Dashboard/StatsCards";
import TeamCollaboration from "@/app/components/Dashboard/TeamCollaboration";
import { PlusIcon } from "@heroicons/react/24/outline";
import LoadingShow from '@/components/LoadingShow';
import Link from 'next/link';

export default function DashboardPage() {
  const [total, setTotal] = useState({ 
    totalProjects: 0, 
    totalUsers: 0, 
    totalTasks: 0, 
    doneTasks: 0, 
    todoTasks: 0, 
    inProgressTasks: 0, 
    inReviewTasks: 0 
  });

  // Get data from the GET_PROJECTS and GET_USERS queries
  const { loading: projectsLoading, error, data: projectsData } = useQuery(GET_PROJECTS);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: tasksData, loading: tasksLoading } = useQuery(GET_ALL_TASKS_STATUS);


  // Combine loading states
  const loading = projectsLoading || usersLoading || tasksLoading;

  useEffect(() => {
    if (projectsData && usersData && tasksData) {
      const totalProjects = projectsData.projects.length;
      const totalUsers = usersData.users.length;
  
      // Count tasks by status
      const tasks = tasksData.tasks;
      const statusCounts = tasks.reduce((acc: any, task: any) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
  
      setTotal({
        totalProjects,
        totalUsers,
        totalTasks: tasks.length,
        doneTasks: statusCounts['DONE'] || 0,
        todoTasks: statusCounts['TODO'] || 0,
        inProgressTasks: statusCounts['IN_PROGRESS'] || 0,
        inReviewTasks: statusCounts['IN_REVIEW'] || 0,
      });
    }
  }, [projectsData, usersData, tasksData]);
  

  // Handle loading and error states
  if (loading) return <LoadingShow msg="Loading Projects..." />;
  if (error) return <LoadingShow msg={`Error! ${error.message}`} />;

  // Extract projects data from GraphQL response
  const projects = projectsData ? projectsData.projects : [];

  return (
    <div className="p-6 bg-transparent rounded-lg">
      {/* Dashboard Contents */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-black font-semibold">لوحة القيادة</h1>
          <p className="text-sm text-gray-600">خطط، قم بالأولويات، وأنجز مهامك بسهولة.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/Projects/CreateProject">
            <button className="flex items-center justify-around btn bg-gradient-to-br from-cyan-950 to-cyan-700 text-white">
              <PlusIcon className="w-4 h-4" /> إضافة مشروع
            </button>
          </Link>
          <Link href="/Products">
            <button className="btn bg-transparent text-cyan-950 border border-cyan-950 duration-150 hover:bg-slate-50">
              استيراد البيانات
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards totalStateCards={total} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Project Analytics */}
        <ProjectAnalyticsTasks totalStateCards={total} />
        {/* Side Projects */}
        <SideProjects projects={projects} />
        {/* Team Collaboration */}
        <TeamCollaboration />
      </div>
    </div>
  );
}
