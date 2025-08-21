import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { FindCategorySchema } from '../schemas/category.schemas.js';

// Bundle-safe directory resolution
let __dirname: string;
try {
  if (typeof import.meta.url !== 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  } else {
    // Fallback for bundled environments
    __dirname = path.join(process.cwd(), 'dist', 'src', 'tools');
  }
} catch {
  // Final fallback
  __dirname = path.join(process.cwd(), 'dist', 'src', 'tools');
}

// Tool function wrapper type
type ToolFunction = (name: string, fn: any) => any;

// Category data structure
interface CategoryData {
  code: string;
  level1: string; // 대분류
  level2: string; // 중분류  
  level3: string; // 소분류
  level4: string; // 세분류
}

// Cache management
let categoryCache: CategoryData[] | null = null;
let cacheTimestamp: number = 0;

/**
 * Load and cache category data from Excel file
 */
function loadCategoryData(): CategoryData[] {
  // Use __dirname to get the directory of the current module, then go to data folder
  const dataPath = path.resolve(__dirname, '..', '..', 'data');
  
  // Find any Excel file in data directory
  const files = fs.readdirSync(dataPath);
  const excelFiles = files.filter(file => 
    file.endsWith('.xlsx') || file.endsWith('.xls')
  );
  
  if (excelFiles.length === 0) {
    throw new Error(`카테고리 Excel 파일을 찾을 수 없습니다. data 폴더에 .xlsx 또는 .xls 파일을 넣어주세요: ${dataPath}`);
  }
  
  // Use the first Excel file found
  const filePath = path.join(dataPath, excelFiles[0]);
  console.error(`Using Excel file: ${excelFiles[0]}`);
  
  // Check if file exists (redundant but safe)
  if (!fs.existsSync(filePath)) {
    throw new Error(`카테고리 파일을 찾을 수 없습니다: ${filePath}`);
  }
  
  const fileStats = fs.statSync(filePath);
  
  // Return cached data if file hasn't changed
  if (categoryCache && fileStats.mtime.getTime() <= cacheTimestamp) {
    return categoryCache;
  }
  
  console.error('Loading category data from Excel file...');
  
  // Read Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON (skip header row)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const dataRows = rawData.slice(1) as string[][]; // Skip header row
  
  // Parse data
  categoryCache = dataRows
    .filter(row => row.length >= 2 && row[0]) // Filter out empty rows
    .map(row => ({
      code: String(row[0] || '').trim(),
      level1: String(row[1] || '').trim(),
      level2: String(row[2] || '').trim(),
      level3: String(row[3] || '').trim(),
      level4: String(row[4] || '').trim(),
    }))
    .filter(item => item.code); // Only include rows with valid codes
  
  cacheTimestamp = fileStats.mtime.getTime();
  
  console.error(`Loaded ${categoryCache.length} categories from Excel file`);
  return categoryCache;
}

/**
 * Smart category search with fuzzy matching and ranking
 */
function smartCategorySearch(query: string, maxResults: number = 10): Array<CategoryData & { score: number, matchType: string }> {
  const categories = loadCategoryData();
  const searchQuery = query.toLowerCase().trim();
  const results: Array<CategoryData & { score: number, matchType: string }> = [];
  
  for (const category of categories) {
    let bestScore = 0;
    let bestMatchType = '';
    
    // Check all levels for matches
    const levels = [
      { value: category.level1, name: '대분류' },
      { value: category.level2, name: '중분류' },
      { value: category.level3, name: '소분류' },
      { value: category.level4, name: '세분류' }
    ];
    
    for (const level of levels) {
      if (!level.value) continue;
      
      const levelText = level.value.toLowerCase();
      let score = 0;
      let matchType = '';
      
      // Level-based bonus (대분류 우선)
      let levelBonus = 0;
      if (level.name === '대분류') levelBonus = 50;
      else if (level.name === '중분류') levelBonus = 30;
      else if (level.name === '소분류') levelBonus = 20;
      else if (level.name === '세분류') levelBonus = 10;
      
      // Exact match (highest priority)
      if (levelText === searchQuery) {
        score = 100 + levelBonus;
        matchType = `정확일치(${level.name})`;
      }
      // Starts with (high priority)
      else if (levelText.startsWith(searchQuery)) {
        score = 80 + levelBonus;
        matchType = `시작일치(${level.name})`;
      }
      // Contains (medium priority)
      else if (levelText.includes(searchQuery)) {
        score = 60 + levelBonus;
        matchType = `포함일치(${level.name})`;
      }
      // Fuzzy match for similar terms
      else {
        const similarity = calculateSimilarity(searchQuery, levelText);
        if (similarity > 0.6) {
          score = Math.floor(similarity * 40) + levelBonus; // 0.6-1.0 -> 24-40 points + level bonus
          matchType = `유사일치(${level.name})`;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatchType = matchType;
      }
    }
    
    if (bestScore > 0) {
      results.push({
        ...category,
        score: bestScore,
        matchType: bestMatchType
      });
    }
  }
  
  // Sort by score (descending), then by category code (ascending for 대분류 priority)
  return results
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      // If same score, prioritize by category code (대분류 codes are typically smaller)
      return a.code.localeCompare(b.code);
    })
    .slice(0, maxResults);
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}


export function createCategoryTools(tool_fn: ToolFunction) {
  return [
    {
      name: 'find_category',
      description: '🚀 ONE-STOP CATEGORY SEARCH: Find categories with smart fuzzy matching, ranking, and direct analysis workflow. Perfect for quick category discovery and trend analysis! (스마트 카테고리 통합 검색: 퍼지 매칭과 랭킹으로 카테고리를 찾고 바로 트렌드 분석까지! 빠른 카테고리 발견과 분석에 최적)',
      parameters: FindCategorySchema,
      execute: tool_fn('find_category', async ({ query, max_results = 10 }: any) => {
        try {
          const results = smartCategorySearch(query, max_results);
          
          if (results.length === 0) {
            return JSON.stringify({
              message: `"${query}"와 관련된 카테고리를 찾을 수 없습니다. 다른 검색어를 시도해보세요.`,
              suggestions: ["패션", "화장품", "가구", "스마트폰", "가전제품", "스포츠", "도서", "자동차", "식품", "뷰티"]
            }, null, 2);
          }
          
          const responseData: any = {
            message: `"${query}" 검색 결과 (${results.length}개, 관련도순 정렬)`,
            total_found: results.length,
            categories: results.map(cat => ({
              code: cat.code,
              category: [cat.level1, cat.level2, cat.level3, cat.level4].filter(Boolean).join(' > '),
              match_type: cat.matchType,
              score: cat.score,
              levels: {
                대분류: cat.level1 || '',
                중분류: cat.level2 || '',
                소분류: cat.level3 || '',
                세분류: cat.level4 || ''
              }
            })),
            next_steps: {
              trend_analysis: `이제 datalab_shopping_category 도구로 각 카테고리의 트렌드 분석이 가능합니다`,
              age_analysis: `datalab_shopping_age 도구로 연령별 쇼핑 패턴을 분석할 수 있습니다`,
              gender_analysis: `datalab_shopping_gender 도구로 성별 쇼핑 패턴을 분석할 수 있습니다`,
              device_analysis: `datalab_shopping_device 도구로 디바이스별 쇼핑 패턴을 분석할 수 있습니다`
            }
          };
          
          
          return JSON.stringify(responseData, null, 2);
        } catch (error: any) {
          throw new Error(`카테고리 검색 중 오류 발생: ${error.message}`);
        }
      }),
    }
  ];
}