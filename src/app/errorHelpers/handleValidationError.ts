/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handlePrismaValidationError = (
  err: any
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  let message = "Validation Error";
  let statusCode = 400;

  //  prisma validation errors
  switch (err.code) {
    case "P2001":
      message = "Record not found";
      statusCode = 404;
      errorSources.push({
        path: "record",
        message: "The requested record does not exist",
      });
      break;

    case "P2011":
      // required field missing
      message = "Required field missing";
      statusCode = 400;
      const fieldName = err.meta?.constraint?.split("_").pop() || "field";
      errorSources.push({
        path: fieldName,
        message: `${fieldName} is required`,
      });
      break;

    case "P2025":
      // update/delete not found
      message = "Record not found";
      statusCode = 404;
      errorSources.push({
        path: "record",
        message: "Record not found for update or delete operation",
      });
      break;

    default:
      // validation error
      message = "Database validation error";
      statusCode = 400;
      errorSources.push({
        path: "validation",
        message: err.message || "A validation error occurred",
      });
      break;
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

// missing required fields, invalid arguments
export const handlePrismaClientValidationError = (
  err: any
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  let message = "Validation Error";

  // Extract field name from error message
  const missingFieldMatch = err.message.match(/Argument `(\w+)` is missing/);
  const invalidFieldMatch = err.message.match(/Argument `(\w+)`.*is invalid/);

  if (missingFieldMatch) {
    const fieldName = missingFieldMatch[1];
    message = "Required field missing";
    errorSources.push({
      path: fieldName,
      message: `${fieldName} is required`,
    });
  } else if (invalidFieldMatch) {
    const fieldName = invalidFieldMatch[1];
    message = "Invalid field value";
    errorSources.push({
      path: fieldName,
      message: `Invalid value provided for ${fieldName}`,
    });
  } else {
    // generic  validation error
    message = "Invalid request data";
    errorSources.push({
      path: "request",
      message: "Please check your request data and try again",
    });
  }

  return {
    statusCode: 400,
    message,
    errorSources,
  };
};
