// add a Project

import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const addProject = async (projectData: Prisma.ProjectCreateInput) => {
  const result = await prisma.project.create({
    data: projectData,
  });
  return result;
};

export const projectServices = {
  addProject,
};
