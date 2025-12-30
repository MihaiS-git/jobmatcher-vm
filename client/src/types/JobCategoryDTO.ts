export type JobSubcategoryDTO = {
    id: number;
    name: string;
    description: string; 
}

export type JobCategoryDTO = {
    id: number;
    name: string;
    description: string;
    subcategories: JobSubcategoryDTO[]; 
};