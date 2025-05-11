'use client';

import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast"
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";


const schema = z.object({
    file: z.instanceof(File, {message: 'Invalid file'})
    .refine((file) => file.size <= 20 * 1024 * 1024, 'File size must be less than 20MB')
    .refine((file) => file.type.startsWith('application/pdf'), 'File must be a PDf')
});

export default function UploadForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null)
    const[isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { startUpload, routeConfig } = useUploadThing('pdfUploader', {
        onClientUploadComplete: () => {
            console.log('uploaded successfully!');
        },
        onUploadError: (err) => {
            console.error('error occured while uploading', err);
            toast({
                title: 'Error occurred while uploading',
                description: err.message,
            });
        },
        onUploadBegin: (file) => {
            console.log('upload has begun for', file)
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            setIsLoading(true);
            const formData = new FormData(e.currentTarget);
            const file = formData.get('file') as File;
            //validating the fields
            const validatedFields = schema.safeParse({ file })
            if(!validatedFields.success){
                toast({
                    title: '❌ Something went wrong',
                    variant: 'destructive',
                    description:
                      validatedFields.error.flatten().fieldErrors.file?.[0] ??
                      'Invalid file',
                });
                setIsLoading(false);
                return;
            }
            toast({
                title: '📄 Uploading PDF...',
                description: 'We are uploading your PDF! ',
            });
    
            //upload the file to uploadthing
            const resp = await startUpload([file]);
            if(!resp) {
                toast({
                    title: 'Something went wrong',
                    description: 'Please use a different file',
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }
            toast({
                title: '📄 Processing PDF',
                description: 'Hang tight! Our AI is reading through your document! ✨',
            });
    
            //parse the pdf using langchain
            const result = await generatePdfSummary(resp);
    
            //summarize the pdf using AI
            const{ data = null, message = null } = result || {};
            if(data){
                let storeResult: any;
                toast({
                    title: '📄 Saving PDF...',
                    description: 'Hang tight! We are saving your summary! ✨'
                })

                //Save the summary to the database
                if(data.summary){
                    storeResult = await storePdfSummaryAction({
                        fileUrl: resp[0].serverData.file.url,
                        summary: data.summary,
                        title: data.title,
                        fileName: file.name,
                     })
                     toast({
                        title: '✨ Summary Generated!',
                        description: 'Your PDF has been successfully summarized and saved!'
                     });
                     formRef.current?.reset();
                     //redirect to the [id] summary page
                     router.push(`/summaries/${storeResult.data.id}`)

                }
            }
        }
        catch(error){
            setIsLoading(false);
            console.error('Error occured', error)
            formRef.current?.reset();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto mt-2">
            <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-background px-3 text-muted-foreground text-sm">
                Upload PDF
                </span>
            </div>
            </div>
            <UploadFormInput
            isLoading={isLoading}
            ref={formRef}
            onSubmit={handleSubmit}
            />
            {isLoading && (
            <>
                <div className="relative">
                <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                >
                    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-muted-foreground text-sm">
                    Processing
                    </span>
                </div>
                </div>
                <LoadingSkeleton />
            </>
            )}
        </div>
        );
    }