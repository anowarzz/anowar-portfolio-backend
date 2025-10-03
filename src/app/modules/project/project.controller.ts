import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import cloudinary from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { projectServices } from "./project.service";

// add a Project
const addProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectData = req.body.data || req.body;

    const files = req.files as {
      coverImage?: Express.Multer.File[];
      galleryImages?: Express.Multer.File[];
    };

    const coverImage = files.coverImage?.[0];
    const galleryImages = files.galleryImages || [];

    let coverImageUrl = "";
    if (coverImage) {
      coverImageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "anowarzz-portfolio/projects/cover-images",
            },
            (error, result) => {
              if (error) reject(new AppError(500, "Cover image upload failed"));
              else resolve(result?.secure_url || "");
            }
          )
          .end(coverImage.buffer);
      });
    }

    const galleryImageUrls = [];
    for (const file of galleryImages) {
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "anowarzz-portfolio/projects/gallery-images",
            },
            (error, result) => {
              if (error)
                reject(new AppError(500, "Gallery image upload failed"));
              else resolve(result?.secure_url);
            }
          )
          .end(file.buffer);
      });
      galleryImageUrls.push(url);
    }

    // Parse JSON string arrays to actual arrays
    const parsedProjectData = {
      ...projectData,
      technologies:
        typeof projectData.technologies === "string"
          ? JSON.parse(projectData.technologies)
          : projectData.technologies,
      details:
        typeof projectData.details === "string"
          ? JSON.parse(projectData.details)
          : projectData.details,
    };

    const project = await projectServices.addProject({
      image: coverImageUrl,
      images: galleryImageUrls,
      ...parsedProjectData,
    });

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
