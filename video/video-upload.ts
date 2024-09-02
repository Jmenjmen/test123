import busboy from "busboy";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { Request, Response } from "express";
import { videoModel } from "../utils/schema/user-video-schema";

const mimeTypes = ['video/mp4', 'video/mov'];

export class uploadVideoHandller {

    public async upload(req: Request, res: Response) {
        try {
            const user = res.locals.user;
            
            const bb = busboy({ headers: req.headers, limits: { files: 1 } });
            const videoId = v4();
            
            const filePromise = this.getAndSaveVideo(bb, res, user, videoId);
            const formDataPromise = this.getFieldsFromFromData(bb);

            bb.on('close', async () => {
                const [filePath, videoFormData] = await Promise.all([filePromise, formDataPromise]);
                try {
                    const newVideo = new videoModel({ title: videoFormData.title, description: videoFormData.description ?? "", owner: user.user, videoId: videoId });
                    await newVideo.save();
                    return res.status(202).send('Video seccesfully uploaded\n');
                } catch (e) {
                    uploadVideoHandller.ifVideoIsWritedWithoutTitle(filePath);
                    return res.status(505).send('Title is required');
                }
            })

            req.pipe(bb);
        } catch(e) {
            console.log(e);
            res.status(505).send('Something gone wrong');
        }
    }

    private getAndSaveVideo(bb: busboy.Busboy, res: Response, user: any, videoId: string): Promise<string> {
        return new Promise(async (resolve) => {
            bb.on('file', async (name, file, info) => {
                console.log(info);
                if (!mimeTypes.includes(info.mimeType)) {
                    return res.status(409).send('File has to be a video type');
                }

                const saveTo = await this.checkAndCreateUserDirectory(user.user, videoId, info.mimeType.split('/')[1]); 
                const stream = fs.createWriteStream(saveTo);
                file.pipe(stream);
                
                stream.on('finish', () => resolve(saveTo));
                stream.on('error', () => res.status(505).send('busboy xueta'))
            });
        });
    }

    private checkAndCreateUserDirectory(user: string, videoId: string, extension: string): Promise<string> {
        const folderPath = path.join(__dirname, '..', 'user-videos', user.toString());
        if(!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        return new Promise((resolve) => {
            resolve(`${folderPath}/${videoId}.${extension}`);
        });
    }

    private getFieldsFromFromData(bb: busboy.Busboy): Promise<Record<string, string>> {
        return new Promise((resolve, reject) => {
            const videoFormData: Record<string, string> = {};

            bb.on('field', (name, value) => {
                videoFormData[name] = value;
            });

            bb.on('finish', () => resolve(videoFormData));
            bb.on('error', (err) => reject(err));
        });
    }

    private static ifVideoIsWritedWithoutTitle(filePath: string): void {
        try {
            fs.unlinkSync(filePath);
        } catch(e) {
            console.log(e);
        }
    }
}