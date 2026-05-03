import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DocumentType = "resume" | "cover_letter" | "other";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDocuments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface CreateDocumentPayload {
  name: string;
  type: DocumentType;
  file: File;
}

export interface UpdateDocumentPayload {
  name?: string;
  type?: DocumentType;
}

// ─── Documents API ────────────────────────────────────────────────────────────

export const documentsApi = {
  /** GET /api/jobs/documents/ */
  list: (params?: { type?: DocumentType; page?: number }) =>
    apiClient
      .get<PaginatedDocuments>("/api/jobs/documents/", { params })
      .then((r) => r.data),

  /** GET /api/jobs/documents/<id>/ */
  get: (id: string) =>
    apiClient.get<Document>(`/api/jobs/documents/${id}/`).then((r) => r.data),

  /** POST /api/jobs/documents/ — multipart upload */
  create: (data: CreateDocumentPayload) => {
    const form = new FormData();
    form.append("name", data.name);
    form.append("type", data.type);
    form.append("file", data.file);
    return apiClient
      .post<Document>("/api/jobs/documents/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  /** PATCH /api/jobs/documents/<id>/ */
  patch: (id: string, data: UpdateDocumentPayload) =>
    apiClient
      .patch<Document>(`/api/jobs/documents/${id}/`, data)
      .then((r) => r.data),

  /** DELETE /api/jobs/documents/<id>/ */
  delete: (id: string) =>
    apiClient.delete(`/api/jobs/documents/${id}/`).then((r) => r.data),
};
