import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { loginProcedure } from "./routes/admin/login/route";
import { checkDbProcedure } from "./routes/admin/check-db/route";
import { signupProcedure } from "./routes/auth/signup/route";
import { userLoginProcedure } from "./routes/auth/login/route";
import { listProductsProcedure } from "./routes/products/list/route";
import { getProductProcedure } from "./routes/products/get/route";
import { createProductProcedure } from "./routes/products/create/route";
import { updateProductProcedure } from "./routes/products/update/route";
import { deleteProductProcedure } from "./routes/products/delete/route";
import { bulkUploadDiamondsProcedure } from "./routes/diamonds/bulk-upload/route";
import { listDiamondsProcedure } from "./routes/diamonds/list/route";
import { getDiamondProcedure } from "./routes/diamonds/get/route";
import { chatProcedure } from "./routes/ai/chat/route";
import { generateImageProcedure } from "./routes/ai/generate-image/route";
import { getChatProcedure } from "./routes/ai/get-chat/route";
import { listChatsProcedure } from "./routes/ai/list-chats/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  auth: createTRPCRouter({
    signup: signupProcedure,
    login: userLoginProcedure,
  }),
  admin: createTRPCRouter({
    login: loginProcedure,
    checkDb: checkDbProcedure,
  }),
  products: createTRPCRouter({
    list: listProductsProcedure,
    get: getProductProcedure,
    create: createProductProcedure,
    update: updateProductProcedure,
    delete: deleteProductProcedure,
  }),
  diamonds: createTRPCRouter({
    list: listDiamondsProcedure,
    get: getDiamondProcedure,
    bulkUpload: bulkUploadDiamondsProcedure,
  }),
  ai: createTRPCRouter({
    chat: chatProcedure,
    generateImage: generateImageProcedure,
    getChat: getChatProcedure,
    listChats: listChatsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
