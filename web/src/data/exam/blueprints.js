export const EXAM_BLUEPRINTS = [
  {
    id: "python-screening-v1",
    title: "Python Screening Assessment",
    subtitle:
      "Secure coding session with randomly assigned questions revealed at start.",
    language: "python",
    durationSeconds: 90 * 60,
    questionSelection: {
      count: 2,
      mode: "random-subset",
      hiddenUntilStart: true,
    },
    integrityPolicy: {
      requireFullscreen: true,
      detectTabSwitch: true,
      blockClipboard: true,
      blockContextMenu: true,
      warnBeforeUnload: true,
      maxViolations: 3,
    },
  },
];

export const DEFAULT_EXAM_BLUEPRINT_ID = EXAM_BLUEPRINTS[0].id;

export const INVITATION_PUBLIC_KEY = {
  kty: "EC",
  x: "OjjybmChyRK00SxV32fi6fC9E5zIxadp7t3qUcNGsH8",
  y: "2HV4TBnIAepQg8TJGJL7WCBRneoA-3Hl8asQHYsKyu4",
  crv: "P-256",
};

export const SAMPLE_INVITATION_TOKEN =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkNBSVQifQ.eyJibHVlcHJpbnRJZCI6ImZyb250ZW5kLXNjcmVlbmluZy12MSIsImludml0YXRpb25JZCI6Imludml0ZS1kZW1vLTAwMSIsImV4cGlyZXNBdCI6IjIwMzUtMDEtMDFUMDA6MDA6MDAuMDAwWiJ9.MhxmODO-tsLx2Rt1R7W1X7F9RGKumR61mIw859MhteOCnanCNxRmuRQDI6ktype67ATv7rsjy1AwYH1dPuVy_g";
