# nest-simple-transactional-example

This repository serves as an example and test runner for the [`nest-simple-transactional`](https://github.com/tomohirohiratsuka/nest-simple-transactional) package.  
It demonstrates how to locally build and test the transactional manager within a NestJS project using Docker.

---

## 🚀 Getting Started

### 1. Build and Pack `nest-simple-transactional`

Make sure the `nest-simple-transactional` project is located alongside this example project.
https://github.com/tomohirohiratsuka/nest-simple-transactional

```bash
npm install           # Install dependencies if needed
npm run build         # Compile TypeScript into dist/
npm pack              # Creates nest-simple-transactional-1.0.0.tgz
```

### 2. Copy the `.tgz` File into This Project

```bash
cp nest-simple-transactional-1.0.0.tgz ../nest-simple-transactional-example/
```

---

## 📦 Local Package Reference in `package.json`

In `nest-simple-transactional-example/package.json`, reference the local tarball file:

```json
"dependencies": {
  ...
  "nest-simple-transactional": "file:nest-simple-transactional-1.0.0.tgz"
}
```

Then install the dependencies:

```bash
npm install
```

---

## 🐳 Running with Docker

### 1. Start the Container

```bash
docker-compose up -d --build
```

This will start:
- A `nest` container using the app defined in `infra/nest/Dockerfile`
- A `postgres` container for database integration

> The tarball (`.tgz`) must be present inside the app directory and referenced properly in `package.json`.

### 2. Enter the Container

```bash
docker exec -it nest bash
```

### 3. Run the Tests

Inside the container:

```bash
npm run test
```