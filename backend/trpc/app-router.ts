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
import { searchKnowledgeProcedure } from "./routes/ai/knowledge/search/route";
import { addKnowledgeProcedure } from "./routes/ai/knowledge/add/route";
import { listKnowledgeProcedure } from "./routes/ai/knowledge/list/route";
import { updateKnowledgeProcedure } from "./routes/ai/knowledge/update/route";
import { saveConversationProcedure } from "./routes/ai/conversation/save/route";
import { addFeedbackProcedure } from "./routes/ai/conversation/feedback/route";
import { requestImageGenerationProcedure } from "./routes/ai/image/request/route";
import { getImageStatusProcedure } from "./routes/ai/image/status/route";

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
    knowledge: createTRPCRouter({
      search: searchKnowledgeProcedure,
      add: addKnowledgeProcedure,
      list: listKnowledgeProcedure,
      update: updateKnowledgeProcedure,
    }),
    conversation: createTRPCRouter({
      save: saveConversationProcedure,
      feedback: addFeedbackProcedure,
    }),
    image: createTRPCRouter({
      request: requestImageGenerationProcedure,
      status: getImageStatusProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;
