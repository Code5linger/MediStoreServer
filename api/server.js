// src/app.ts
import express2 from "express";

// src/modules/medicine/medicine.router.ts
import { Router } from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// ========================\n// Prisma Client Generator\n// ========================\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\n// ========================\n// Datasource\n// ========================\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ========================\n// Auth Models (Better Auth)\n// ========================\n\nmodel User {\n  id            String   @id @default(cuid())\n  name          String\n  email         String   @unique\n  emailVerified Boolean  @default(false)\n  image         String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n\n  // Seller relations\n  medicines Medicine[] @relation("SellerMedicines")\n\n  // Customer relations\n  orders  Order[]  @relation("CustomerOrders")\n  reviews Review[]\n\n  role   String  @default("CUSTOMER")\n  phone  String?\n  status String? @default("ACTIVE")\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id         String @id\n  accountId  String\n  providerId String\n  userId     String\n  user       User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// ========================\n// Enums\n// ========================\n\n// \u{1F916}\n// enum ROLE {\n//   CUSTOMER\n//   SELLER\n//   ADMIN\n// }\n\nenum ORDER_STATUS {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\n// ========================\n// Business Models\n// ========================\n\nmodel Category {\n  id        Int      @id @default(autoincrement())\n  name      String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  medicines Medicine[]\n}\n\nmodel Medicine {\n  id          Int      @id @default(autoincrement())\n  name        String\n  description String?\n  price       Float\n  stock       Int\n  image       String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // Seller\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])\n\n  // Category\n  categoryId Int\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  reviews    Review[]\n  orderItems OrderItem[]\n}\n\nmodel Order {\n  id              Int          @id @default(autoincrement())\n  totalAmount     Float\n  status          ORDER_STATUS @default(PLACED)\n  shippingAddress String\n  createdAt       DateTime     @default(now())\n  updatedAt       DateTime     @updatedAt\n\n  // Customer\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  items OrderItem[]\n}\n\nmodel OrderItem {\n  id       Int   @id @default(autoincrement())\n  quantity Int\n  price    Float\n\n  orderId Int\n  order   Order @relation(fields: [orderId], references: [id])\n\n  medicineId Int\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n}\n\nmodel Review {\n  id        Int      @id @default(autoincrement())\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id])\n\n  medicineId Int\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"ORDER_STATUS"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"Int"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"Int"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/medicine/medicine.service.ts
var createMedicine = async (data, userId) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const medicine = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId
    }
  });
  return medicine;
};
var getAllMedicine = async (payload) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    sellerId,
    sortBy = "newest"
  } = payload;
  const whereClause = {};
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (sellerId) {
    whereClause.sellerId = sellerId;
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    whereClause.price = {};
    if (minPrice !== void 0) {
      whereClause.price.gte = minPrice;
    }
    if (maxPrice !== void 0) {
      whereClause.price.lte = maxPrice;
    }
  }
  let orderBy = {};
  switch (sortBy) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "name_asc":
      orderBy = { name: "asc" };
      break;
    case "name_desc":
      orderBy = { name: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }
  const allMedicine = await prisma.medicine.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : void 0,
    orderBy,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return allMedicine;
};
var getAllSellers = async () => {
  const sellers = await prisma.user.findMany({
    where: {
      role: "SELLER",
      medicines: {
        some: {}
        // Only sellers who have medicines
      }
    },
    select: {
      id: true,
      name: true
    }
  });
  return sellers;
};
var updateMedicine = async (id, data, userId) => {
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error("Medicine not found");
    err.status = 404;
    throw err;
  }
  if (existing.sellerId !== userId) {
    const err = new Error("You can only update your own medicines");
    err.status = 403;
    throw err;
  }
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) {
      throw new Error("Category not found");
    }
  }
  const updated = await prisma.medicine.update({
    where: { id },
    data
  });
  return updated;
};
var deleteMedicine = async (id, userId) => {
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error("Medicine not found");
    err.status = 404;
    throw err;
  }
  if (existing.sellerId !== userId) {
    const err = new Error("You can only delete your own medicines");
    err.status = 403;
    throw err;
  }
  await prisma.medicine.delete({ where: { id } });
};
var VALID_STATUSES = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];
var ALLOWED_TRANSITIONS = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};
var getSellerOrders = async (sellerId, statusFilter) => {
  if (statusFilter && !VALID_STATUSES.includes(statusFilter)) {
    const err = new Error("Invalid status filter");
    err.status = 400;
    throw err;
  }
  const orders = await prisma.order.findMany({
    where: {
      // order must have at least one item whose medicine belongs to this seller
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      },
      // optionally filter by status
      ...statusFilter && { status: statusFilter }
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, email: true }
      },
      items: {
        // only include items that belong to THIS seller's medicines
        where: {
          medicine: {
            sellerId
          }
        },
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true }
          }
        }
      }
    }
  });
  return orders;
};
var updateSellerOrderStatus = async (orderId, newStatus, sellerId) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    const err = new Error("Invalid status");
    err.status = 400;
    throw err;
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { medicine: { select: { sellerId: true } } }
      }
    }
  });
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
  const sellerOwnsItem = order.items.some(
    (item) => item.medicine.sellerId === sellerId
  );
  if (!sellerOwnsItem) {
    const err = new Error(
      "You can only update orders containing your medicines"
    );
    err.status = 403;
    throw err;
  }
  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    const err = new Error(
      `Cannot transition from ${order.status} to ${newStatus}`
    );
    err.status = 400;
    throw err;
  }
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      customer: {
        select: { id: true, name: true, email: true }
      },
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true }
          }
        }
      }
    }
  });
  return updated;
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return medicine;
};
var MedicineService = {
  createMedicine,
  getAllMedicine,
  getAllSellers,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  getMedicineById
};

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized"
      });
    }
    const result = await MedicineService.createMedicine(
      req.body,
      user.id
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error
    });
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { search, categoryId, minPrice, maxPrice, sellerId, sortBy } = req.query;
    const result = await MedicineService.getAllMedicine({
      search: typeof search === "string" ? search : void 0,
      categoryId: categoryId ? Number(categoryId) : void 0,
      minPrice: minPrice ? Number(minPrice) : void 0,
      maxPrice: maxPrice ? Number(maxPrice) : void 0,
      sellerId: typeof sellerId === "string" ? sellerId : void 0,
      sortBy
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};
var getAllSellers2 = async (req, res) => {
  try {
    const result = await MedicineService.getAllSellers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }
    const result = await MedicineService.updateMedicine(id, req.body, user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }
    await MedicineService.deleteMedicine(id, user.id);
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }
    const result = await MedicineService.getMedicineById(id);
    if (!result) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};
var MedicineController = {
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getAllMedicine: getAllMedicine2,
  getAllSellers: getAllSellers2,
  getMedicineById: getMedicineById2
};

// src/middleware/auth.ts
import "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // Google
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    // autoSignIn: false,
    autoSignIn: true,
    // requireEmailVerification: true,
    requireEmailVerification: false
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(user, url, token);
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const html = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Email Verification</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2>Email Verification</h2>
                <p>Hi ${user.name || "there"},</p>
                <p>
                  Thank you for signing up. Please verify your email address by clicking the link below:
                </p>
                <p>
                  <a href="${verificationUrl}">
                    Verify Email
                  </a>
                </p>
                <p>
                  If you did not create this account, you can safely ignore this email.
                </p>
                <p>
                  Thanks,<br />
                  MEDISTORE Team
                </p>
              </body>
            </html>
`;
        const info = await transporter.sendMail({
          from: '"PH-MODULE-24" <maddison53@ethereal.email>',
          to: user.email,
          subject: "Verify your email",
          html
          // HTML version of the message
        });
        console.log("Message sent: ", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  // 🤖
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "medistore",
    // useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    }
  }
});

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        // role: session.user.role as string,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! O_o"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/medicine/medicine.router.ts
var router = Router();
router.post("/", auth_default("SELLER" /* SELLER */), MedicineController.createMedicine);
router.get("/", MedicineController.getAllMedicine);
router.get("/sellers", MedicineController.getAllSellers);
router.get("/:id", MedicineController.getMedicineById);
router.put("/:id", auth_default("SELLER" /* SELLER */), MedicineController.updateMedicine);
router.delete("/:id", auth_default("SELLER" /* SELLER */), MedicineController.deleteMedicine);
var MedicineRouter = router;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/modules/category/category.router.ts
import express from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  return prisma.category.create({
    data: payload
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var CategoryService = {
  createCategory,
  getAllCategories
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};
var getAllCategories2 = async (_req, res) => {
  try {
    const result = await CategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2
};

// src/modules/category/category.router.ts
var router2 = express.Router();
router2.post("/", auth_default("ADMIN" /* ADMIN */), CategoryController.createCategory);
router2.get("/", CategoryController.getAllCategories);
var CategoryRouter = router2;

// src/modules/order/order.router.ts
import { Router as Router2 } from "express";

// src/modules/order/order.service.ts
var createOrder = async (data, customerId) => {
  let totalAmount = 0;
  const orderItems = [];
  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId }
    });
    if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
    if (medicine.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${medicine.name}`);
    }
    totalAmount += medicine.price * item.quantity;
    orderItems.push({
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price
    });
  }
  const order = await prisma.order.create({
    data: {
      customerId,
      totalAmount,
      shippingAddress: data.shippingAddress,
      status: "PLACED",
      // or 'PENDING'
      items: {
        create: orderItems
      }
    },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  for (const item of data.items) {
    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    });
  }
  return order;
};
var getMyOrders = async (customerId) => {
  console.log("OrderService.getMyOrders - customerId:", customerId);
  const orders = await prisma.order.findMany({
    where: {
      customerId
      // This should match
    },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  console.log("OrderService.getMyOrders - found:", orders.length);
  return orders;
};
var getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          medicine: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (orderId, customerId) => {
  const orderIdNumber = parseInt(orderId);
  if (isNaN(orderIdNumber)) {
    throw new Error("Invalid order ID");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderIdNumber,
      customerId
    },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};
var updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
};
var VALID_STATUSES2 = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];
var ALLOWED_TRANSITIONS2 = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};
var getSellerOrders2 = async (sellerId, statusFilter) => {
  if (statusFilter && !VALID_STATUSES2.includes(statusFilter)) {
    const err = new Error("Invalid status filter");
    err.status = 400;
    throw err;
  }
  const orders = await prisma.order.findMany({
    where: {
      // order must have at least one item whose medicine belongs to this seller
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      },
      // optionally filter by status
      ...statusFilter && { status: statusFilter }
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, email: true }
      },
      items: {
        // only include items that belong to THIS seller's medicines
        where: {
          medicine: {
            sellerId
          }
        },
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true }
          }
        }
      }
    }
  });
  return orders;
};
var updateSellerOrderStatus2 = async (orderId, newStatus, sellerId) => {
  if (!VALID_STATUSES2.includes(newStatus)) {
    const err = new Error("Invalid status");
    err.status = 400;
    throw err;
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { medicine: { select: { sellerId: true } } }
      }
    }
  });
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
  const sellerOwnsItem = order.items.some(
    (item) => item.medicine.sellerId === sellerId
  );
  if (!sellerOwnsItem) {
    const err = new Error(
      "You can only update orders containing your medicines"
    );
    err.status = 403;
    throw err;
  }
  const allowed = ALLOWED_TRANSITIONS2[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    const err = new Error(
      `Cannot transition from ${order.status} to ${newStatus}`
    );
    err.status = 400;
    throw err;
  }
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      customer: {
        select: { id: true, name: true, email: true }
      },
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true }
          }
        }
      }
    }
  });
  return updated;
};
var OrderService = {
  createOrder,
  getMyOrders,
  // Returns all orders for a customer
  getAllOrders,
  // Returns all orders (admin)
  getOrderById,
  // Returns single order
  updateOrderStatus,
  getSellerOrders: getSellerOrders2,
  updateSellerOrderStatus: updateSellerOrderStatus2
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await OrderService.createOrder(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getMyOrders2 = async (req, res) => {
  try {
    const user = req.user;
    console.log("Getting orders for user:", user.id);
    const orders = await OrderService.getMyOrders(user.id);
    console.log("Found orders:", orders.length);
    res.json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    res.status(400).json({ error: error.message || error });
  }
};
var getAllOrders2 = async (_req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const user = req.user;
    const orderId = req.params.id;
    const order = await OrderService.getOrderById(orderId, user.id);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "PLACED"
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const result = await OrderService.updateOrderStatus(orderId, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getSellerOrders3 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { status } = req.query;
    const orders = await OrderService.getSellerOrders(
      user.id,
      typeof status === "string" ? status : void 0
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};
var updateSellerOrderStatus3 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const updated = await OrderService.updateSellerOrderStatus(
      id,
      status,
      user.id
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};
var OrderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  // This should call OrderService.getMyOrders
  getAllOrders: getAllOrders2,
  getOrderById: getOrderById2,
  // This should call OrderService.getOrderById
  updateOrderStatus: updateOrderStatus2,
  getSellerOrders: getSellerOrders3,
  updateSellerOrderStatus: updateSellerOrderStatus3
};

// src/modules/order/order.router.ts
var router3 = Router2();
router3.post("/", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.createOrder);
router3.get("/me", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.getMyOrders);
router3.get("/me/:id", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.getOrderById);
router3.get("/", auth_default("ADMIN" /* ADMIN */), OrderController.getAllOrders);
router3.patch(
  "/:id/status",
  auth_default("ADMIN" /* ADMIN */),
  OrderController.updateOrderStatus
);
router3.get(
  "/seller/orders",
  auth_default("SELLER" /* SELLER */),
  OrderController.getSellerOrders
);
router3.patch(
  "/seller/orders/:id/status",
  auth_default("SELLER" /* SELLER */),
  OrderController.updateSellerOrderStatus
);
var OrderRouter = router3;

// src/modules/review/review.router.ts
import { Router as Router3 } from "express";

// src/modules/review/review.service.ts
var createReview = async (data, customerId) => {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: { items: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.customerId !== customerId) throw new Error("Not your order");
  if (order.status !== "DELIVERED") throw new Error("Order not delivered yet");
  const orderedItem = order.items.find(
    (item) => item.medicineId === data.medicineId
  );
  if (!orderedItem) throw new Error("Medicine not in order");
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      medicineId: data.medicineId
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }
  const review = await prisma.review.create({
    data: {
      customerId,
      medicineId: data.medicineId,
      rating: data.rating,
      comment: data.comment ?? null
    }
  });
  return review;
};
var getAllReviews = async (filters) => {
  const where = filters?.medicineId ? { medicineId: filters.medicineId } : {};
  return prisma.review.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true
        }
      },
      medicine: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getMyReviews = async (customerId) => {
  return prisma.review.findMany({
    where: { customerId },
    include: { medicine: true },
    orderBy: { createdAt: "desc" }
  });
};
var getReviewsByCustomer = async (customerId) => {
  return prisma.review.findMany({
    where: { customerId },
    include: { medicine: true },
    orderBy: { createdAt: "desc" }
  });
};
var getReviewById = async (reviewId, customerId) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId }
  });
  if (!review) throw new Error("Review not found");
  return review;
};
var updateReview = async (reviewId, data, customerId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found");
  if (review.customerId !== customerId) throw new Error("Not your review");
  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: data.rating ?? review.rating,
      comment: data.comment ?? review.comment
    }
  });
};
var deleteReview = async (reviewId, customerId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found");
  if (review.customerId !== customerId) throw new Error("Not your review");
  return prisma.review.delete({ where: { id: reviewId } });
};
var getAverageRating = async (medicineId) => {
  const result = await prisma.review.aggregate({
    where: { medicineId },
    _avg: { rating: true },
    _count: true
  });
  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count
  };
};
var ReviewService = {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewsByCustomer,
  updateReview,
  deleteReview,
  getReviewById,
  getAverageRating
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await ReviewService.createReview(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const { medicineId } = req.query;
    const filters = medicineId ? { medicineId: parseInt(medicineId) } : void 0;
    const reviews = await ReviewService.getAllReviews(filters);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getMyReviews2 = async (req, res) => {
  try {
    const user = req.user;
    const reviews = await ReviewService.getReviewsByCustomer(user.id);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getReviewById2 = async (req, res) => {
  try {
    const user = req.user;
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({ error: "Review ID is required" });
    }
    const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
    const reviewId = parseInt(idStr, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }
    const review = await ReviewService.getReviewById(reviewId, user.id);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const user = req.user;
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!idParam) return res.status(400).json({ error: "Review ID required" });
    const reviewId = parseInt(idParam, 10);
    if (isNaN(reviewId))
      return res.status(400).json({ error: "Invalid Review ID" });
    const result = await ReviewService.updateReview(
      reviewId,
      req.body,
      user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const user = req.user;
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!idParam) return res.status(400).json({ error: "Review ID required" });
    const reviewId = parseInt(idParam, 10);
    if (isNaN(reviewId))
      return res.status(400).json({ error: "Invalid Review ID" });
    const result = await ReviewService.deleteReview(reviewId, user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getAverageRating2 = async (req, res) => {
  try {
    const medicineId = parseInt(req.params.medicineId);
    if (isNaN(medicineId)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }
    const result = await ReviewService.getAverageRating(medicineId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var ReviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getMyReviews: getMyReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  getReviewById: getReviewById2,
  getAverageRating: getAverageRating2
};

// src/modules/review/review.router.ts
var router4 = Router3();
router4.get("/", ReviewController.getAllReviews);
router4.get("/medicine/:medicineId/average", ReviewController.getAverageRating);
router4.post("/", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.createReview);
router4.get("/me", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.getMyReviews);
router4.get("/:id", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.getReviewById);
router4.patch("/:id", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.updateReview);
router4.delete("/:id", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.deleteReview);
var ReviewRouter = router4;

// src/modules/admin/admin.router.ts
import { Router as Router4 } from "express";

// src/modules/admin/admin.service.ts
var getUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var toggleUserStatus = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
  return prisma.user.update({
    where: { id: userId },
    data: { status: newStatus }
  });
};
var getAllOrders3 = async () => {
  return prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" }
  });
};
var manageCategory = async (data) => {
  const { action, categoryId, name } = data;
  if (action === "create") {
    if (!name) throw new Error("Name is required");
    return prisma.category.create({ data: { name } });
  }
  if (action === "update") {
    if (!categoryId || !name) throw new Error("Category ID and name required");
    return prisma.category.update({
      where: { id: categoryId },
      data: { name }
    });
  }
  if (action === "delete") {
    if (!categoryId) throw new Error("Category ID required");
    return prisma.category.delete({ where: { id: categoryId } });
  }
  throw new Error("Invalid action");
};
var AdminService = {
  getUsers,
  toggleUserStatus,
  getAllOrders: getAllOrders3,
  manageCategory
};

// src/modules/admin/admin.controller.ts
var getUsers2 = async (req, res) => {
  try {
    const users = await AdminService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var toggleUserStatus2 = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await AdminService.toggleUserStatus(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var getAllOrders4 = async (req, res) => {
  try {
    const orders = await AdminService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var manageCategory2 = async (req, res) => {
  try {
    const { action, categoryId, name } = req.body;
    const result = await AdminService.manageCategory({
      action,
      categoryId,
      name
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || error });
  }
};
var AdminController = {
  getUsers: getUsers2,
  toggleUserStatus: toggleUserStatus2,
  getAllOrders: getAllOrders4,
  manageCategory: manageCategory2
};

// src/modules/admin/admin.router.ts
var router5 = Router4();
router5.get("/users", auth_default("ADMIN" /* ADMIN */), AdminController.getUsers);
router5.patch(
  "/users/:id/toggle",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.toggleUserStatus
);
router5.get("/orders", auth_default("ADMIN" /* ADMIN */), AdminController.getAllOrders);
router5.post(
  "/categories/manage",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.manageCategory
);
var AdminRouter = router5;

// src/app.ts
var app = express2();
app.use(express2.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
    // CRITICAL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/medicine", MedicineRouter);
app.use("/categories", CategoryRouter);
app.use("/orders", OrderRouter);
app.use("/reviews", ReviewRouter);
app.use("/admin", AdminRouter);
app.get("/", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    app_default.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
