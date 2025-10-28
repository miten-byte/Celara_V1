# Diamond Bulk Upload Guide

This guide explains how to bulk upload diamonds to the system using Excel data.

## API Endpoint

**Endpoint:** `/api/trpc/diamonds.bulkUpload`  
**Method:** POST (tRPC Mutation)  
**Authentication:** Public (no authentication required)

## Excel Format

Your Excel file should contain the following columns:

### Required Fields
- `stoneId` - Unique identifier for the diamond (e.g., "#R0024630")
- `shape` - Diamond shape: RD, PR, CUS, EM, HRT, PS, MQ, LR, OVAL, Other
- `carat` - Weight in carats (e.g., 0.52)
- `color` - Color grade: D, E, F, G, H, I, J, K, L, M, N, O-P, P, Q, Q-R, S-T, W-X, Y-Z
- `clarity` - Clarity grade: FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3
- `cut` - Cut grade: ID, EX, VG, GD, FR
- `polish` - Polish grade: EX, VG, GD, FR
- `symmetry` - Symmetry grade: EX, VG, GD, FR
- `fluorescence` - Fluorescence: NON, FNT, MED, STG, VST
- `lab` - Certification lab: GIA, IGI, HRD, AGS, Other
- `certificateNumber` - Certificate number
- `rap` - Rapaport price
- `discount` - Discount percentage (negative number)
- `pricePerCarat` - Price per carat
- `totalPrice` - Total price

### Optional Fields
- `length` - Length in mm
- `width` - Width in mm
- `depth` - Depth in mm
- `depthPercent` - Depth percentage
- `tablePercent` - Table percentage
- `shade` - Shade description
- `milky` - Milky description
- `images` - Array of image URLs (JSON array as string)
- `videoUrl` - Video URL
- `certificateUrl` - Certificate URL
- `available` - Availability status (true/false, default: true)

## Example Excel Data

| stoneId | shape | carat | color | clarity | cut | polish | symmetry | fluorescence | lab | certificateNumber | rap | discount | pricePerCarat | totalPrice |
|---------|-------|-------|-------|---------|-----|--------|----------|--------------|-----|-------------------|-----|----------|---------------|------------|
| #R0024630 | RD | 0.52 | D | IF | EX | EX | VG | NON | GIA | 0512617 | 7264.57 | -31.58 | 467.90 | 243.31 |
| #R0024631 | PR | 0.75 | E | VVS1 | EX | EX | EX | FNT | IGI | 0512618 | 8500.00 | -25.00 | 6375.00 | 4781.25 |

## Using the API with JavaScript/TypeScript

### Convert Excel to JSON

First, convert your Excel file to JSON format. You can use libraries like `xlsx` or `exceljs`:

```typescript
import * as XLSX from 'xlsx';

function excelToJson(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      resolve(json);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}
```

### Upload via tRPC

```typescript
import { trpcClient } from '@/lib/trpc';

async function uploadDiamonds(excelFile: File) {
  // Convert Excel to JSON
  const diamondsData = await excelToJson(excelFile);
  
  // Transform data to match API schema
  const diamonds = diamondsData.map(row => ({
    stoneId: row.stoneId,
    shape: row.shape,
    carat: parseFloat(row.carat),
    color: row.color,
    clarity: row.clarity,
    cut: row.cut,
    polish: row.polish,
    symmetry: row.symmetry,
    fluorescence: row.fluorescence,
    lab: row.lab,
    certificateNumber: row.certificateNumber,
    rap: parseFloat(row.rap),
    discount: parseFloat(row.discount),
    pricePerCarat: parseFloat(row.pricePerCarat),
    totalPrice: parseFloat(row.totalPrice),
    // Optional fields
    length: row.length ? parseFloat(row.length) : undefined,
    width: row.width ? parseFloat(row.width) : undefined,
    depth: row.depth ? parseFloat(row.depth) : undefined,
    depthPercent: row.depthPercent ? parseFloat(row.depthPercent) : undefined,
    tablePercent: row.tablePercent ? parseFloat(row.tablePercent) : undefined,
    shade: row.shade,
    milky: row.milky,
    available: row.available !== false,
  }));
  
  // Upload to backend
  const result = await trpcClient.diamonds.bulkUpload.mutate({
    diamonds: diamonds,
  });
  
  console.log(`Uploaded ${result.insertedCount} diamonds`);
  return result;
}
```

### React Component Example

```tsx
import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { trpcClient } from '@/lib/trpc';

export function DiamondBulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleFileSelect = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setResult('');

    try {
      const uploadResult = await uploadDiamonds(file);
      setResult(`Success! Uploaded ${uploadResult.insertedCount} diamonds`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <ActivityIndicator />}
      {result && <Text>{result}</Text>}
    </View>
  );
}
```

## Response Format

```typescript
{
  success: true,
  insertedCount: 100,
  insertedIds: ["64f5a...", "64f5b...", ...]
}
```

## Error Handling

The API will return an error if:
- Required fields are missing
- Data types don't match (e.g., string instead of number)
- Invalid enum values (e.g., invalid shape or clarity)
- Database connection issues

Make sure to validate your Excel data before uploading!

## Tips

1. **Batch Size**: For large datasets, consider splitting into batches of 100-500 diamonds
2. **Validation**: Validate data in Excel before uploading to catch errors early
3. **Unique IDs**: Ensure stoneId values are unique to avoid conflicts
4. **Images**: If including images, use publicly accessible URLs
5. **Testing**: Test with a small batch first to ensure your data format is correct

## Database Collection

Diamonds are stored in the `diamonds` collection in MongoDB with the following structure:

```typescript
{
  _id: ObjectId,
  stoneId: string,
  shape: string,
  carat: number,
  color: string,
  clarity: string,
  cut: string,
  polish: string,
  symmetry: string,
  fluorescence: string,
  lab: string,
  certificateNumber: string,
  rap: number,
  discount: number,
  pricePerCarat: number,
  totalPrice: number,
  available: boolean,
  createdAt: Date,
  updatedAt: Date,
  // ... optional fields
}
```
