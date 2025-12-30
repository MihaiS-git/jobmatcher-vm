import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { ProjectDetailDTO, ProjectRequestDTO, ProjectStatusRequestDTO, ProjectSummaryDTO } from "@/types/ProjectDTO";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query<
      {
        content: ProjectSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        status?: string;
        categoryId?: number;
        subcategoryId?: number;
        searchTerm?: string;
        sort?: string[]; // <- single sort string like "title,asc"
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/projects",
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc", // default if nothing selected
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((project) => ({
                type: "Project" as const,
                id: project.id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getJobFeedProjects: builder.query<
      {
        content: ProjectSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        status?: string;
        categoryId?: number;
        subcategoryId?: number;
        searchTerm?: string;
        sort?: string[]; // <- single sort string like "title,asc"
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/projects/job-feed",
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc", // default if nothing selected
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((project) => ({
                type: "Project" as const,
                id: project.id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getProjectById: builder.query<ProjectDetailDTO, string>({
      query: (id) => ({
        url: `/projects/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
      keepUnusedDataFor: 300,
    }),
    createProject: builder.mutation<ProjectDetailDTO, ProjectRequestDTO>({
      query: (newProject) => ({
        url: "/projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation<
      ProjectDetailDTO,
      { id: string; data: ProjectRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
        updateProjectStatus: builder.mutation<
      ProjectDetailDTO,
      { id: string; data: ProjectStatusRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/projects/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetJobFeedProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectStatusMutation,
  useDeleteProjectMutation,
} = projectsApi;
