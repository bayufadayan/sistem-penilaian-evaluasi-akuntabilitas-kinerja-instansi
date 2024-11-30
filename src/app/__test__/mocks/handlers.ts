import { http, HttpResponse } from "msw";

export const handlers = [
  // Mocking API response for counts
  http.get("/api/users/count", () => {
    return HttpResponse.json({ userCount: 100 });
  }),

  http.get("/api/teams/count", () => {
    return HttpResponse.json({ teamCount: 50 });
  }),

  http.get("/api/evaluations/count", () => {
    return HttpResponse.json({ evaluationSheetCount: 75 });
  }),

  http.get("/api/evidence/count", () => {
    return HttpResponse.json({ evidenceCount: 10 });
  }),

  http.get("/api/components/count", () => {
    return HttpResponse.json({ componentCount: 20 });
  }),

  http.get("/api/subcomponents/count", () => {
    return HttpResponse.json({ subComponentScoreCount: 40 });
  }),

  http.get("/api/criterias/count", () => {
    return HttpResponse.json({ criteriaCount: 60 });
  }),

  http.get("/api/evaluations/countbystatus", () => {
    return HttpResponse.json({
      COMPLETED: 10,
      IN_PROGRESS: 5,
      PENDING: 2,
      CANCELLED: 3,
    });
  }),
];
