// pages/api/images/[id].js
import fs from 'fs';
import path from 'path';

// export default function handler(req, res) {
//     const { id } = req.query;
//     const imagePath = path.join(process.cwd(), 'private/images', `${id}.jpg`);
//
//     // 从私有文件夹中读取图片，并返回给前端
//     const imageData = fs.readFileSync(imagePath);
//     res.setHeader('Content-Type', 'image/jpeg');
//     res.end(imageData);
// }