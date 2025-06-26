import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Vocabulary, UploadResponse } from '@/types';
import { generateId, getAudioUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  
  try {
    // Get form data
    const formData = await request.formData();
    console.log('Form data received');
    
    const file = formData.get('file') as File;
    console.log('File from form data:', file?.name, file?.size, file?.type);

    if (!file) {
      console.error('No file in form data');
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'No file uploaded'
      }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      console.error('Invalid file type:', fileName);
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'Please upload an Excel file (.xlsx or .xls)'
      }, { status: 400 });
    }

    console.log('File validation passed');

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('File converted to buffer, size:', buffer.length);
    
    // Parse Excel file
    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
      console.log('Workbook created, sheets:', workbook.SheetNames);
    } catch (xlsxError) {
      console.error('XLSX parsing error:', xlsxError);
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'Error reading Excel file. Please ensure it\'s a valid Excel file.'
      }, { status: 400 });
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log('Using sheet:', sheetName);
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
    console.log('Data rows found:', jsonData.length);
    console.log('First few rows:', jsonData.slice(0, 3));
    
    if (jsonData.length < 2) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'Excel file must contain at least a header row and one data row'
      }, { status: 400 });
    }

    // Extract vocabulary data
    const vocabulary: Vocabulary[] = [];
    
    // Skip header row (index 0), start from index 1
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      console.log(`Processing row ${i}:`, row);
      
      if (row && row.length >= 2 && row[0] && row[1]) {
        const english = String(row[0]).trim();
        const chinese = String(row[1]).trim();
        
        if (english && chinese) {
          const vocabItem: Vocabulary = {
            id: generateId(),
            english,
            chinese,
            audioUrl: getAudioUrl(english, 'en')
          };
          
          vocabulary.push(vocabItem);
          console.log(`Added vocabulary item:`, vocabItem);
        }
      }
    }

    console.log('Total vocabulary items processed:', vocabulary.length);

    if (vocabulary.length === 0) {
      return NextResponse.json<UploadResponse>({
        success: false,
        message: 'No valid vocabulary entries found. Ensure your Excel has English in column A and Chinese in column B.'
      }, { status: 400 });
    }

    console.log('Upload successful, returning data');
    
    return NextResponse.json<UploadResponse>({
      success: true,
      message: `Successfully processed ${vocabulary.length} vocabulary entries`,
      vocabularyCount: vocabulary.length,
      vocabulary
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json<UploadResponse>({
      success: false,
      message: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Upload API - Use POST method' }, { status: 405 });
}