interface Permission {
  admin: boolean;
  pull: boolean;
  triage?: boolean | undefined;
  push: boolean;
  maintain?: boolean | undefined;
}

export type { Permission };
