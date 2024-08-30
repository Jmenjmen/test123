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
            
            uploadVideoHandller.getAndSaveVideo(bb, res, user, videoId);

            let videoFormData = uploadVideoHandller.getFieldsFromFromData(bb);
            console.log(videoFormData);

            bb.on('close', async () => {
                try {
                    const newVideo = new videoModel({ title: videoFormData.title, description: videoFormData.description ?? "", owner: user.user, videoId: videoId });
                    await newVideo.save();
                    return res.status(202).send('Video seccesfully uploaded\n' + newVideo);
                } catch (e) {
                    res.status(505).send('ebaniy busboy');
                }
            })

            req.pipe(bb);
        } catch(e) {
            console.log(e);
            res.status(505).send('Something gone wrong');
        }
    }

    private static getAndSaveVideo(bb: busboy.Busboy, res: Response, user: any, videoId: string) {
        bb.on('file', async (name, file, info) => {
            console.log(info);
            if (!mimeTypes.includes(info.mimeType)) {
                res.status(409).send('File has to be a video type');
            }
            
            const saveTo = uploadVideoHandller.checkAndCreateUserDirectory(user.user, videoId, info.mimeType.split('/')[1]);
            file.pipe(fs.createWriteStream(saveTo));
        });
    }

    private static checkAndCreateUserDirectory(user: string, videoId: string, extension: string): string {
        const folderPath = path.join(__dirname, '..', 'user-videos', user.toString());
        if(!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        console.log(`${folderPath}/${videoId}.${extension}`)
        return `${folderPath}/${videoId}.${extension}`;
    }

    private static getFieldsFromFromData(bb: busboy.Busboy) {
        const videoFormData: Record<string, string> = {};
        bb.on('field', (name, value, info) => {
            console.log(name, value); 
            videoFormData[name] = value;
        })
        return videoFormData;
            

    }
}