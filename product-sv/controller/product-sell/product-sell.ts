import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Product } from "../../kafka/producer/kafka-producer";

export async function productSellFn(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const data = fs.readFileSync(path.join(__dirname, '..', 'product-schedule/products.json'), 'utf8');
        const jsonData: ReadonlyArray<Product> = JSON.parse(data);
        const product = jsonData.filter(prod  => prod.id == id);
        return res.status(201).send(product);
    } catch (e) {
        console.log(e);
        res.status(404).send("product not found")
    }
}