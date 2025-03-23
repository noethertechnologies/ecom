# Use Node 20 on Alpine 3.20
FROM node:20.14.0-alpine3.20

# Install required system dependency for sharp (vips-dev)
RUN apk add --no-cache vips-dev

# Define build-time arguments for environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Set environment variables in the container
ENV DATABASE_URL=${DATABASE_URL}

ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}

ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Set working directory
WORKDIR /app

# Copy package files and Prisma schema folder first
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (this will run any postinstall scripts like prisma generate)
RUN npm install

RUN npx prisma generate

# Rebuild sharp to ensure native binaries work on Alpine
RUN npm rebuild sharp

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port the app listens on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]