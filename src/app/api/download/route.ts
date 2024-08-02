import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), "public", "cv.pdf");

  try {
    const data = await fs.promises.readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="Sebastian Boehler CV.pdf"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }
}
