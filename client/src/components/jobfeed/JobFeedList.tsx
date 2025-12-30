import {
  useGetJobFeedProjectsQuery,
} from "@/features/projects/projectsApi";
import { useCategoryOptions } from "@/hooks/useCategoryOptions";
import { useSubcategoryByCategoryOptions } from "@/hooks/useSubcategoryByCategoryOptions";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import SortButton from "../ProjectsSortButtonJobFeed";
import PagePagination from "../PagePagination";
import {
  ProjectStatusLabels,
} from "@/types/formLabels/projectLabels";
import { useEffect } from "react";
import { PaymentTypeLabels } from "@/types/formLabels/paymentLabels";

const JobFeedList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);
  
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;
  const subcategoryId = searchParams.get("subcategoryId")
    ? Number(searchParams.get("subcategoryId"))
    : undefined;
  const searchTerm = searchParams.get("searchTerm") ?? "";

  const sortStateDefaultValues: Record<
    "title" | "budget" | "paymentType" | "deadline" | "category",
    "asc" | "desc" | null
  > = {
    title: null,
    budget: null,
    paymentType: null,
    deadline: null,
    category: null,
  };

  const sortParam = searchParams.getAll("sort");
  const sortState: Record<
    keyof typeof sortStateDefaultValues,
    "asc" | "desc" | null
  > = {
    ...sortStateDefaultValues,
  };
  sortParam.forEach((s) => {
    const [col, dir] = s.split(",");
    if (col in sortState && (dir === "asc" || dir === "desc")) {
      sortState[col as keyof typeof sortState] = dir;
    }
  });

  const sortArray = Object.entries(sortState)
    .filter(([, dir]) => dir !== null)
    .map(([col, dir]) => `${col},${dir}`);

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useGetJobFeedProjectsQuery({
    page,
    size,
    categoryId,
    subcategoryId,
    searchTerm,
    sort: sortArray,
  });

  const categoryOptions = useCategoryOptions();
  const subcategoryOptions = useSubcategoryByCategoryOptions(categoryId);

  type ProjectListSearchParams = {
    page?: number;
    size?: number;
    categoryId?: number | null;
    subcategoryId?: number | null;
    searchTerm?: string;
    sortState?: Record<string, "asc" | "desc" | null>;
  };

  const updateSearchParams = (newParams: ProjectListSearchParams) => {
    const params: Record<string, string | string[]> = {
      page: String(newParams.page ?? page),
      size: String(newParams.size ?? size),
      searchTerm: newParams.searchTerm ?? searchTerm,
    };

    // Category
    if (newParams.categoryId !== undefined) {
      if (newParams.categoryId === null) {
        delete params.categoryId;
        delete params.subcategoryId;
      } else {
        params.categoryId = String(newParams.categoryId);
        if (
          subcategoryId &&
          !subcategoryOptions.some((s) => s.id === subcategoryId)
        ) {
          delete params.subcategoryId;
        }
      }
    } else if (categoryId !== undefined) params.categoryId = String(categoryId);

    // Subcategory
    if (newParams.subcategoryId !== undefined) {
      if (newParams.subcategoryId === null) {
        delete params.subcategoryId;
      } else {
        params.subcategoryId = String(newParams.subcategoryId);
      }
    } else if (subcategoryId !== undefined)
      params.subcategoryId = String(subcategoryId);

    // Sorting single-column
    const mergedSort = newParams.sortState ?? sortState;
    const sortParams: string[] = [];
    for (const [col, dir] of Object.entries(mergedSort)) {
      if (dir) {
        sortParams.push(`${col},${dir}`);
        break;
      }
    }
    if (sortParams.length > 0) params.sort = sortParams;

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    updateSearchParams({
      page: 0,
      size: 10,
      categoryId: null,
      subcategoryId: null,
      searchTerm: "",
      sortState: { ...sortStateDefaultValues },
    });
  };

  const toggleSort = (
    column: keyof typeof sortState,
    direction: "asc" | "desc"
  ) => {
    const current = sortState[column];
    const next = current === direction ? null : direction;

    // Only keep clicked column
    const newSortState: typeof sortState = {
      title: null,
      budget: null,
      paymentType: null,
      deadline: null,
      category: null,
      [column]: next,
    };

    updateSearchParams({ page: 0, sortState: newSortState });
  };

  useEffect(() => {
    updateSearchParams({
      page,
      size,
      categoryId,
      subcategoryId,
      searchTerm,
      sortState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleProjectClick(id: string) {
    navigate(`/projects/${id}`);
  }
  
  return (
    <div className="flex flex-col items-center p-0 m-0 w-full gap-2">
      <section className="w-full bg-gray-200 dark:bg-gray-900 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 w-full">
          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs">General</legend>
            <div className="flex flex-col">
              <label htmlFor="searchTerm" className="text-sm">
                Search:
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) =>
                  updateSearchParams({ searchTerm: e.target.value })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-auto"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="size" className="text-sm">
                Page size:
              </label>
              <select
                name="size"
                id="size"
                value={size}
                onChange={(e) =>
                  updateSearchParams({ size: Number(e.target.value) })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs">Project</legend>
            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm">
                Category:
              </label>
              <select
                name="category"
                id="category"
                onChange={(e) =>
                  updateSearchParams({
                    categoryId: e.target.value ? Number(e.target.value) : null,
                    subcategoryId: null,
                    page: 0,
                  })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={categoryId ?? ""}
              >
                <option value={""}>All Categories</option>

                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="subcategory" className="text-sm">
                Subcategory:
              </label>
              <select
                name="subcategory"
                id="subcategory"
                onChange={(e) =>
                  updateSearchParams({
                    subcategoryId: e.target.value
                      ? Number(e.target.value)
                      : null,
                    page: 0,
                  })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={subcategoryId ?? ""}
                disabled={!categoryId}
              >
                <option value={""}>All Subcategories</option>

                {subcategoryOptions.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded py-1 px-4 cursor-pointer text-sm min-w-[200px]"
          >
            Reset filters
          </button>
        </div>
      </section>

      {isLoadingProjects && <LoadingSpinner fullScreen={false} size={36} />}

      {projects && projects.totalElements > 0 && !projectsError ? (
        <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
          <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800">
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Title</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="title"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownAZ}
                      />
                      <SortButton
                        column="title"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpAZ}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Description</span>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Status</span>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Budget</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="budget"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDown01}
                      />
                      <SortButton
                        column="budget"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUp01}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Payment</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="paymentType"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="paymentType"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Deadline</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="deadline"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="deadline"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Category</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="category"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="category"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-center relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Subcategories</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="text-center gap-2 p-2">
              {projects?.content?.map((project) => (
                <tr
                  key={project.id}
                  className="h-12 bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.title}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.description}
                  </td>
                  <td className="truncate max-w-[110px] xl:max-w-[150px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.status
                      ? ProjectStatusLabels[project.status]
                      : "N/A"}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.budget}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.paymentType
                      ? PaymentTypeLabels[project.paymentType]
                      : "N/A"}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.deadline ? (
                      new Date(project.deadline).toLocaleDateString()
                    ) : (
                      <span>No Deadline</span>
                    )}
                  </td>
                  <td className=" truncate max-w-[110px] xl:max-w-[250px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.category ? (
                      project.category.name
                    ) : (
                      <span>No Category</span>
                    )}
                  </td>

                  <td className=" max-w-[110px] xl:max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis mx-auto">
                    {project.subcategories &&
                    project.subcategories.length > 0 ? (
                      <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {project.subcategories
                          .map((sub) => sub.name)
                          .join(", ")}
                      </div>
                    ) : (
                      <div>No Subcategories</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <PagePagination
              currentPage={page}
              onPageChange={(newPage) => updateSearchParams({ page: newPage })}
              totalPages={projects.totalPages}
              size={size}
              totalElements={projects.totalElements}
            />
          </div>
        </section>
      ) : (
        !isLoadingProjects && (
          <div className="mt-24 text-sm text-gray-500">
            No projects found for the selected filters.
          </div>
        )
      )}
    </div>
  );
};

export default JobFeedList;