export function getPracticeRouteState(segment, hasQuestion) {
  if (!segment) {
    return {
      view: "index",
      questionId: null,
    };
  }

  if (segment === "progress") {
    return {
      view: "progress",
      questionId: null,
    };
  }

  const questionId = Number(segment);

  if (
    !Number.isInteger(questionId) ||
    questionId <= 0 ||
    typeof hasQuestion !== "function" ||
    !hasQuestion(questionId)
  ) {
    return {
      view: "unknown",
      questionId: null,
    };
  }

  return {
    view: "question",
    questionId,
  };
}
