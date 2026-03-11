declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    PORT?: string;
    BUN_PUBLIC_BASE_URL?: string;
  }
}
