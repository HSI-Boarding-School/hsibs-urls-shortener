import {
  notFoundError,
  parseRequestBody,
  serverError,
  succesResponse,
  validationError,
} from "@/lib/api-utils";
import { db } from "@/lib/db";
import { isValidUrl, normalizeUrl, sanitizeInput } from "@/lib/utils";
import { UpdateUrlDto } from "@/types/database";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // find by ID
    const url = await db.urls.findById(id);

    if (!url) {
      return notFoundError("URL not found");
    }

    return succesResponse(url);
  } catch (error) {
    console.error("GET api/urls/[id] error: ", error);
    return serverError();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // check if url exist
    const existingUrl = db.urls.findById(id);
    if (!existingUrl) {
      return notFoundError("URL not found");
    }

    // parse request body
    const { data: body, error: parseError } =
      await parseRequestBody<UpdateUrlDto>(request);

    if (parseError || !body) {
      return validationError(parseError || "Invalid request body");
    }

    // validate new URL if provided
    if (body.original_url) {
      const normalizedUrl = normalizeUrl(sanitizeInput(body.original_url));
      if (!isValidUrl(normalizedUrl)) {
        return validationError("URL is not valid!");
      }
      body.original_url = normalizedUrl;
    }

    // update database
    const updated = await db.urls.update(id, body);

    if (!updated) {
      return serverError("Failed to updated URL");
    }

    return succesResponse(updated, "URL Updated successfully");
  } catch (error) {
    console.error("PATCH api/urls/[id] error : ", error);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = params

    // check if exist 
    const exist = await db.urls.findById(id)
    if (!exist) {
      return notFoundError('URL not found')
    }

    // delete 
    const deleted = await db.urls.delete(id)

    if (!deleted) {
      return serverError('Failed to delete url')
    }

    return succesResponse(
      {id},
      'URL deleted successfully'
    )
  } catch (error) {
    console.error('DELETE api/urls/[id] error : ', error)
    return serverError()
  }
}
