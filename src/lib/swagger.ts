import type { Express, Request, Response } from "express"
import swaggerJsdoc, { type OAS3Options } from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import responses from "../docs/components/responses.json"
import schemas from "../docs/components/schemas.json"
import campgroundPaths from "../docs/paths/campgrounds.json"
import reviewPaths from "../docs/paths/reviews.json"

const options: OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      license: {
        name: "MIT",
        url: "https://github.com/tariqs26/yelpcamp-server/blob/main/LICENSE",
      },
      version: "2.0.0",
    },
    paths: {
      ...campgroundPaths,
      ...reviewPaths,
    },
    components: {
      schemas,
      responses,
    },
  },
  apis: ["./src/routers/*.ts"],
}

const specs = swaggerJsdoc(options)

const swaggerDocs = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
  app.get("/api-docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })
}

export default swaggerDocs
