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

// get single Project by ID
const getSingleProject = async (id: number) => {
  const result = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  return result;
};

// update Project
const updateProject = async (
  id: number,
  projectData: Prisma.ProjectUpdateInput
) => {
  const result = await prisma.project.update({
    where: {
      id,
    },
    data: projectData,
  });
  return result;
};

// delete Project
const deleteProject = async (id: number) => {
  const result = await prisma.project.delete({
    where: {
      id,
    },
  });
  return result;
};

export const projectServices = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
