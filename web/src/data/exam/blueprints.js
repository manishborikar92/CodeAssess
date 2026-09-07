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
  x: "x1Y06LIQ9EfnmjTnruxeUNXRjntLEULadCXPKk8kM5s",
  y: "6gErODKQnh3b1aD5nqJg1V3sD3zxNLyPSI97C-jtzl4",
  crv: "P-256",
};

export const SAMPLE_INVITATION_TOKEN =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkNBSVQifQ.eyJibHVlcHJpbnRJZCI6InB5dGhvbi1zY3JlZW5pbmctdjEiLCJpbnZpdGF0aW9uSWQiOiJpbnZpdGUtZGVtby0wMDEiLCJleHBpcmVzQXQiOiIyMDM1LTAxLTAxVDAwOjAwOjAwLjAwMFoifQ.KWuCe73VdAscb70xgbysfKk3r76yc_WkDT4cADh_75duRUf1SAyxwMaLli3YQNHygYUFRW9UQ1c_brA7RQWLiw";
