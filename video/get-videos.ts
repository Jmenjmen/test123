import { Request, Response } from "express";
import { videoDocument, videoModel } from "../utils/schema/user-video-schema";
import { userDocument, userModel } from "../utils/schema/user-schema";
import fs from "fs";
import path from "path";

export class getVideo {

    public async getVideoStream(req: Request, res: Response) {
        const range = req.headers.range;
        const {username, videoId} = req.params;

        const user = await userModel.findOne({ username: username });
        const video = await this.findVideoById(videoId);

        const filePath = this.checkAllInstance(res, user, video, range);
        if(typeof filePath !== 'string') {
            return filePath;
        }

        const fileSizeInBytes = fs.statSync(filePath).size;

        const { chunkStart, chunkEnd, contentLength } = this.getStreamChunks(range!, fileSizeInBytes);

        const headers = {
            'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
            'Accept-Ranges': 'bytes',
            'Content-length': contentLength,
            'Content-type': `video/${video!.extension}`
        }

        res.writeHead(206, headers)

        const videoStream = fs.createReadStream(filePath, {start: chunkStart, end: chunkEnd});
        videoStream.pipe(res);
    }

    private getStreamChunks(range: string, fz: number) {
        const chunkStart = Number(range.replace(/\D/g, ''));
        const chunkEnd = Math.min(chunkStart + 1000000, fz - 1);
        const contentLength = chunkEnd - chunkStart + 1;
        return { chunkStart, chunkEnd, contentLength };
    }

    private checkAllInstance(res: Response, user: userDocument | null, video: videoDocument | null, range: string | undefined): Response | string {
        if(!range) {
            return res.status(404).send('Range is not found');
        }
        if(!user) {
            return res.status(404).send('User not found');
        }
        if(!video) {
            return res.status(404).send('Video not found');
        }
        const filePath = `${path.join(__dirname, '..', 'user-videos', user._id.toString())}/${video.videoId}.${video.extension}`;
        if(!fs.existsSync(filePath)) {
            return res.status(404).send('File is not exists');
        }
        return filePath;
    }

    private async findVideoById(videoId: string): Promise<videoDocument | null> {
        return await videoModel.findOne({ videoId: videoId });
    }

    public async findVideosByUserId(res: Response, req: Request){
        const {username} = req.params;

        const user = await userModel.findOne({ username: username });
        return await videoModel.find({ owner: user?._id }).exec();
    }
}