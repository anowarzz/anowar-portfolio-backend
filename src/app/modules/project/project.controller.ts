import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { projectServices } from "./project.service";

// add a Project
const addProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectData = req.body;
    const project = await projectServices.addProject(projectData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Project added Successfully",
      data: project,
    });
  }
);

// get all Projects
const getAllProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await projectServices.getAllProjects();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Projects retrieved Successfully",
      data: projects,
    });
  }
);

// get single Project
const getSingleProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await projectServices.getSingleProject(Number(id));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project retrieved Successfully",
      data: project,
    });
  }
);

// update Project
const updateProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const projectData = req.body;
    const project = await projectServices.updateProject(
      Number(id),
      projectData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project updated Successfully",
      data: project,
    });
  }
);

// delete Project
const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await projectServices.deleteProject(Number(id));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project deleted Successfully",
      data: project,
    });
  }
);

export const ProjectController = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
