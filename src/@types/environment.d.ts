declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    C_KEY: string
    JWT_SECRET: string
  }
}
