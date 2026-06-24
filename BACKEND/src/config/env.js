import dotenv from 'dotenv';
dotenv.config();

const required = (key) => {
  const value = process.env[key];

  if (value !== undefined && value !== "") {
    return value;
  }

  throw new Error(`${key} not defined in .env`);
};

const optional = (key, defaultValue) => {
  const value = process.env[key];

  return value !== undefined && value !== "" ? value : defaultValue;
};

export const ENV = {
  // Required
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),

  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),

  // Optional
  FRONTEND_URL: optional("FRONTEND_URL", "http://localhost:3000"),

  PORT: Number(optional("PORT", 5000)),
  NODE_ENV: optional("NODE_ENV", "development"),
};
