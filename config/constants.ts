const config = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/financial_management',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  };
  
  export default config;