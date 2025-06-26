import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Vocabulary, UploadResponse } from '@/types';
import { generateId, getAudioUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'No file uploaded'
      }, { status: 400 });
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'Please upload an Excel file (.xlsx or .xls)'
      }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
    
    if (jsonData.length < 2) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'Excel file must contain at least a header row and one data row'
      }, { status: 400 });
    }

    // Extract vocabulary data (assuming first column is English, second is Chinese)
    const vocabulary: Vocabulary[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row[0] && row[1]) { // Both English and Chinese must exist
        const english = String(row[0]).trim();
        const chinese = String(row[1]).trim();
        
        if (english && chinese) {
          vocabulary.push({
            id: generateId(),
            english,
            chinese,
            audioUrl: getAudioUrl(english, 'en')
          });
        }
      }
    }

    if (vocabulary.length === 0) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'No valid vocabulary entries found. Ensure your Excel has English in column A and Chinese in column B.'
      }, { status: 400 });
    }

    // Store in session/memory (in a real app, you'd store in database)
    // For this demo, we'll return the data to be stored client-side
    
    return NextResponse.json<UploadResponse>({
      success: true,
      message: `Successfully processed ${vocabulary.length} vocabulary entries`,
      vocabularyCount: vocabulary.length,
      vocabulary
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<UploadResponse>({
      success: false,
      message: 'Error processing file. Please check the file format.'
    }, { status: 500 });
  }
}