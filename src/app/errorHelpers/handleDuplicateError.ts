/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  let fieldName = "Field";
  const errorSources: TErrorSources[] = [];

  if (err.meta && err.meta.target && Array.isArray(err.meta.target)) {
    // Get all duplicate fields
    err.meta.target.forEach((field: string) => {
      const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
      errorSources.push({
        path: field,
        message: `${capitalizedField} already exists`,
      });
    });

    fieldName = err.meta.target[0];
    fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  return {
    statusCode: 409,
    message: `${fieldName} already exists`,
    errorSources,
  };
};
