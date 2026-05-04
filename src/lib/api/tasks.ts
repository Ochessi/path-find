import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaskStatus = "PENDING" | "STARTED" | "SUCCESS" | "FAILURE" | "RETRY" | "REVOKED";

export interface TaskResult<T = unknown> {
  task_id: string;
  status: TaskStatus;
  result: T | null;
  error?: string;
}

// ─── Task API ────────────────────────────────────────────────────────────────

export const tasksApi = {
  /** GET /api/jobs/tasks/<task_id>/ */
  getStatus: <T = unknown>(taskId: string) =>
    apiClient
      .get<TaskResult<T>>(`/api/jobs/tasks/${taskId}/`)
      .then((r) => r.data),
};

// ─── Polling Helper ───────────────────────────────────────────────────────────

/**
 * Polls a Celery task until it reaches SUCCESS or FAILURE.
 * @param taskId          - The task_id returned by the 202 Accepted response
 * @param interval        - Milliseconds between polls (default: 2000)
 * @param maxRetries      - Maximum poll attempts before giving up (default: 60 = 2 min)
 * @param onStatusChange  - Optional callback called whenever the task status changes
 * @returns               - Resolves with the final TaskResult
 */
export async function pollTask<T = unknown>(
  taskId: string,
  interval = 2000,
  maxRetries = 60,
  onStatusChange?: (status: TaskStatus) => void
): Promise<TaskResult<T>> {
  let attempts = 0;
  let lastStatus: TaskStatus | null = null;

  return new Promise<TaskResult<T>>((resolve, reject) => {
    const tick = async () => {
      attempts++;
      try {
        const result = await tasksApi.getStatus<T>(taskId);

        // Fire callback on status transitions
        if (onStatusChange && result.status !== lastStatus) {
          lastStatus = result.status;
          onStatusChange(result.status);
        }

        if (result.status === "SUCCESS" || result.status === "FAILURE") {
          resolve(result);
          return;
        }

        if (attempts >= maxRetries) {
          reject(new Error(`Task ${taskId} timed out after ${maxRetries} polls.`));
          return;
        }

        setTimeout(tick, interval);
      } catch (err) {
        reject(err);
      }
    };

    tick();
  });
}

