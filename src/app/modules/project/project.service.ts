import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

// add a Project
const addProject = async (projectData: Prisma.ProjectCreateInput) => {
  const result = await prisma.project.create({
    data: projectData,
  });
  return result;
};

// get all Projects
const getAllProjects = async () => {
  const result = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const projectServices = {
  addProject,
  getAllProjects,
};
