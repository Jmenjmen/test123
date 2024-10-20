import bodyParser from "body-parser";
import express from "express";
import router from "./route/route";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(1456, () => {
    console.log('server is started on localhost:1456')
})