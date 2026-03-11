import { prisma } from "./db/prisma";
import index from "./index.html";
import Elysia, { t } from "elysia";
import { swagger } from "@elysiajs/swagger";
const PORT = process.env.PORT || 3000;

const Swagger = new Elysia()
  .use(swagger({
    path: "/docs",
  }))

const Api = new Elysia({
  prefix: "/api",
})
  .use(Swagger)
  .post("/path/create", async ({ body, query }) => {
    if (query?.force) {
      const path = await prisma.path.upsert({
        where: {
          from: body.from,

        },
        create: {
          from: body.from,
          to: body.to,
        },
        update: {
          to: body.to,
        },
      });
      return {
        success: true,
        path,
      };
    }

    const selectPath = await prisma.path.findUnique({
      where: {
        from: body.from,
      },
    });

    if (selectPath) {
      return {
        success: false,
        message: "Path already exists",
      };
    }

    const path = await prisma.path.create({
      data: {
        from: body.from,
        to: body.to,
      },
    });

    return {
      success: true,
      path,
    };
  }, {
    query: t.Object({
      force: t.Optional(t.Boolean()),
    }),
    body: t.Object({
      from: t.String(),
      to: t.String(),
    })
  })
  .get("/path/get", async ({ query }) => {
    if (query.id) {
      const path = await prisma.path.findUnique({
        where: {
          id: query.id,
        },
      });
      return {
        data: path,
      };
    }

    if (query.from) {
      const path = await prisma.path.findUnique({
        where: {
          from: query.from,
        },
      });
      return {
        data: path,
      };
    }

    return {
      data: null,
      error: "path or from is required",
    };
  }, {
    query: t.Object({
      id: t.Optional(t.String()),
      from: t.Optional(t.String())
    })
  })
  .get("/path/list", async ({ query }) => {
    const paths = await prisma.path.findMany({
      skip: (Number(query.page) - 1) * Number(query.limit),
      take: Number(query.limit),
    });
    return {
      data: paths,
    };
  }, {
    query: t.Object({
      page: t.Optional(t.String({ default: "1" })),
      limit: t.Optional(t.String({ default: "10" })),
    })
  })
  .delete("/path/remove", async ({ query }) => {
    const path = await prisma.path.delete({
      where: {
        id: query.id,
      },
    });
    return {
      success: true,
      path,
    };
  }, {
    query: t.Object({
      id: t.String(),
    })
  })
  .patch("/path/update", async ({ query }) => {
    const path = await prisma.path.update({
      where: {
        id: query.id,
      },
      data: {
        to: query.to,
      },
    });
    return {
      success: true,
      path,
    };
  }, {
    query: t.Object({
      id: t.String(),
      to: t.String(),
    })
  })
  .put("/path/replace", async ({ query }) => {
    const path = await prisma.path.update({
      where: {
        id: query.id,
      },
      data: {
        to: query.to,
        from: query.from,
      },
    });
    return {
      success: true,
      path,
    };
  }, {
    query: t.Object({
      id: t.String(),
      to: t.String(),
      from: t.String(),
    })
  })

const ServerApp = new Elysia()
  .get("/:path", async ({ params }) => {
    const path = await prisma.path.findUnique({
      where: {
        from: params.path,
      },
    });

    if (path) {
      // HTTP redirect ke tujuan
      return Response.redirect(path.to, 302);
    }

    return new Response("Path not found", { status: 404 });
  }, {
    params: t.Object({
      path: t.String(),
    })
  })
  .use(Api)
  .get("*", index)
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

export type AppServer = typeof ServerApp;

