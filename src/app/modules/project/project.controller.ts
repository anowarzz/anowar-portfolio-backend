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

export const ProjectController = {
  addProject,
};
