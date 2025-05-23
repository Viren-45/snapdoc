'use server';

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

export async function generatePdfSummary({ fileUrl, fileName } : { fileUrl: string; fileName: string }) {
    if(!fileUrl) {
        return{
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }
    if(!fileUrl) {
        return{
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }

    let summary;
    try {
        const pdfText = await fetchAndExtractPdfText(fileUrl);
        console.log({ pdfText });

        try {
            summary = await generateSummaryFromOpenAI(pdfText);
            console.log({ summary });
        } catch (error) {
            console.log(error);

            if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
                try {
                    summary = await generateSummaryFromGemini(pdfText);
                    console.log({ summary });
                } catch (geminiError) {
                    console.error('Gemini API failed after OpenAI quota exceeded', geminiError);
                    return {
                        success: false,
                        message: 'Failed to generate summary with available AI providers',
                        data: null,
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Failed to generate summary',
                    data: null,
                };
            }
        }

        if (!summary) {
            return {
                success: false,
                message: 'Failed to generate summary',
                data: null,
            };
        }

        const formattedFileName = formatFileNameAsTitle(fileName);
        return {
            success: true,
            message: 'Summary generated successfully',
            data: {
                title: formattedFileName,
                summary,
            }
        };
    } catch (err) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        };
    }
}

async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    try {
        const sql = await getDbConnection();
        const [savedSummary] = await sql`
        INSERT INTO pdf_summaries(
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
        ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName} 
        ) RETURNING id, summary_text`;
        return savedSummary;
    } catch (error) {
        console.log('Error saving PDF summary', error);
        throw error;
    }
}

export async function storePdfSummaryAction({ fileUrl, summary, title, fileName }: PdfSummaryType) {
    let savedSummary: any;
    try {
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        savedSummary = await savePdfSummary({ userId, fileUrl, summary, title, fileName });

        if (!savedSummary) {
            return {
                success: false,
                message: 'Failed to save PDF summary, please try again.'
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error saving PDF summary',
        }
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
        success: true,
        message: 'PDF summary saved successfully.',
        data: {
            id: savedSummary.id
        }
    }
}
