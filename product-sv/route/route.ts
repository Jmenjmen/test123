import { Router } from "express";
import { productSellFn } from "../controller/product-sell/product-sell";

export const router = Router();

router.get("/product/buy/:id", productSellFn);