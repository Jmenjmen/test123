import express from "express";
import { MongoDBConnect } from "./mongodb-connector";
import router from "./route/route";
import morgan from "morgan";
import cors from "cors";

const port = '1234' || process.env.PORT;

const app = express();
MongoDBConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});