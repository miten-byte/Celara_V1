import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { loginProcedure } from "./routes/admin/login/route";
import { listProductsProcedure } from "./routes/products/list/route";
import { getProductProcedure } from "./routes/products/get/route";
import { createProductProcedure } from "./routes/products/create/route";
import { updateProductProcedure } from "./routes/products/update/route";
import { deleteProductProcedure } from "./routes/products/delete/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  admin: createTRPCRouter({
    login: loginProcedure,
  }),
  products: createTRPCRouter({
    list: listProductsProcedure,
    get: getProductProcedure,
    create: createProductProcedure,
    update: updateProductProcedure,
    delete: deleteProductProcedure,
  }),
});

export type AppRouter = typeof appRouter;
