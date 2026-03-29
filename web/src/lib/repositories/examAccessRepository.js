import {
  INVITATION_PUBLIC_KEY,
  SAMPLE_INVITATION_TOKEN,
} from "../../data/exam/blueprints.js";
import { questionRepository } from "./questionRepository.js";
import { verifyInvitationToken } from "../tokens/invitationToken.js";

export { SAMPLE_INVITATION_TOKEN };

function normalizeTimestamp(now) {
  if (typeof now === "string") {
    return new Date(now).getTime();
  }

  if (typeof now === "number") {
    return now;
  }

  return Date.now();
}

export function createExamAccessRepository({
  questions = questionRepository,
  publicKey = INVITATION_PUBLIC_KEY,
} = {}) {
  return {
    async resolveToken(token, now = Date.now()) {
      const payload = await verifyInvitationToken(token, publicKey);
      const expiresAt = new Date(payload.expiresAt).getTime();

      if (!Number.isFinite(expiresAt) || normalizeTimestamp(now) > expiresAt) {
        throw new Error("Invitation token has expired.");
      }

      const blueprint = questions.getExamBlueprintById(payload.blueprintId);
      if (!blueprint) {
        throw new Error("Invitation token references an unknown exam blueprint.");
      }

      return {
        blueprint,
        invitation: {
          id: payload.invitationId,
          token,
          entryType: "join",
          expiresAt: payload.expiresAt,
        },
      };
    },
  };
}

export const examAccessRepository = createExamAccessRepository();
