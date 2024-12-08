import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'storage', 'project');

export async function deleteFiles(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
        const filePath = path.join(UPLOAD_DIR, fileName);
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Failed to delete file ${filePath}: ${err.message}`);
        }
    }
}

export async function saveFiles(files: File[]): Promise<string[]> {
    const imageUrl: string[] = [];
    for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await new Promise<void>((resolve, reject) => {
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    reject(err);
                } else {
                    imageUrl.push(fileName);
                    resolve();
                }
            });
        });
    }
    return imageUrl;
}

export function extractFormData(formData: FormData) {
    const title = formData.get("title") as string;
    const job = formData.get("job") as string;
    const stacks = formData.get("stacks") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const describe = formData.get("describe") as string;
    const highlight = formData.get("highlight") as string;
    const createdById = Number(formData.get("createdBy"));
    const files = formData.getAll("images[]").filter(item => item instanceof File) as File[];
    return {
        title,
        job,
        stacks,
        startTime,
        endTime,
        describe,
        highlight,
        createdById,
        files,
    };
}