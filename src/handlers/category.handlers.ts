// Import JSON data - bundle-safe approach
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// 메모리 누수 방지를 위한 지연 로딩 캐시
let categoriesCache: any[] | null = null;

const moduleDir = dirname(fileURLToPath(import.meta.url));

// Load categories data with fallback paths for different environments
function getCategoriesData(): any[] {
  // 캐시된 데이터가 있으면 반환 (메모리 효율성)
  if (categoriesCache !== null) {
    return categoriesCache;
  }

  try {
    const candidatePaths = [
      // Package-relative path. Works when launched by npx from any cwd.
      join(moduleDir, '..', '..', 'data', 'categories.json'),
      // Local development fallbacks.
      join(process.cwd(), 'dist', 'data', 'categories.json'),
      join(process.cwd(), 'data', 'categories.json'),
    ];

    for (const categoryPath of candidatePaths) {
      if (existsSync(categoryPath)) {
        const categoryJson = readFileSync(categoryPath, 'utf8').toString();
        categoriesCache = JSON.parse(categoryJson);
        return categoriesCache!;
      }
    }

    throw new Error(
      `카테고리 데이터 파일을 찾을 수 없습니다. Tried: ${candidatePaths.join(', ')}`
    );
  } catch (error) {
    console.error('카테고리 데이터 로딩 실패:', error);
    return [];
  }
}

/**
 * 캐시 정리 함수 (메모리 누수 방지)
 */
export function clearCategoriesCache(): void {
  categoriesCache = null;
}

// Category data structure
interface CategoryData {
  code: string;
  level1: string; // 대분류
  level2: string; // 중분류
  level3: string; // 소분류
  level4: string; // 세분류
}

/**
 * Load category data from bundled JSON file
 */
async function loadCategoryData(): Promise<CategoryData[]> {
  // 지연 로딩된 캐시 데이터 사용
  const data = getCategoriesData();
  console.error(`Loaded ${data.length} categories from bundled JSON data`);
  return data as CategoryData[];
}

/**
 * Smart category search with fuzzy matching and ranking
 */
// 검색 결과 한 건. matchedLevel/matchedValue는 검색어와 일치한 단계와 그 이름이다.
// isSubcategory는 일치한 단계가 이 행 자체가 아니라 상위 단계라는 뜻이다
// (예: "여성의류"로 찾은 "패션의류 > 여성의류 > 코디세트"). 이때 code는 상위 분류 전체가 아니라
// 코디세트 하나만 가리킨다.
type CategoryMatch = CategoryData & {
  score: number;
  matchType: string;
  matchedLevel: string;
  matchedValue: string;
  isSubcategory: boolean;
};

async function smartCategorySearch(query: string, maxResults: number = 10): Promise<CategoryMatch[]> {
  const categories = await loadCategoryData();
  const searchQuery = query.toLowerCase().trim();
  const results: CategoryMatch[] = [];
  
  for (const category of categories) {
    let bestScore = 0;
    let bestMatchType = '';
    let bestLevel = '';
    let bestValue = '';
    let bestIsSubcategory = false;
    
    // Check all levels for matches
    const levels = [
      { value: category.level1, name: '대분류' },
      { value: category.level2, name: '중분류' },
      { value: category.level3, name: '소분류' },
      { value: category.level4, name: '세분류' }
    ];
    // 이 행의 코드가 실제로 가리키는 단계 (비어 있지 않은 가장 깊은 단계)
    const ownLevel = [...levels].reverse().find(level => level.value)?.name;
    
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
      
      const isSubcategory = level.name !== ownLevel;
      if (score > bestScore || (score > 0 && score === bestScore && !isSubcategory)) {
        bestScore = score;
        // 상위 단계로 일치한 행은 그 단계 자체가 아니라 하위 분류이므로 표시를 구분한다.
        bestMatchType = isSubcategory
          ? matchType.replace(')', '의 하위 분류)')
          : matchType;
        bestLevel = level.name;
        bestValue = level.value;
        bestIsSubcategory = isSubcategory;
      }
    }
    
    if (bestScore > 0) {
      results.push({
        ...category,
        score: bestScore,
        matchType: bestMatchType,
        matchedLevel: bestLevel,
        matchedValue: bestValue,
        isSubcategory: bestIsSubcategory
      });
    }
  }
  
  // Sort by score (descending), then the category's own match before its subcategories,
  // then by category code (ascending for 대분류 priority)
  return results
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      if (a.isSubcategory !== b.isSubcategory) {
        return a.isSubcategory ? 1 : -1;
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

/**
 * 카테고리 검색 핸들러
 */
export const findCategoryHandler = async ({ query, max_results = 10 }: any) => {
  try {
    const results = await smartCategorySearch(query, max_results);
    
    if (results.length === 0) {
      return {
        message: `"${query}"와 관련된 카테고리를 찾을 수 없습니다. 다른 검색어를 시도해보세요.`,
        suggestions: ["패션", "화장품", "가구", "스마트폰", "가전제품", "스포츠", "도서", "자동차", "식품", "뷰티"]
      };
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
        age_analysis: `datalab_shopping_by_age 도구로 연령별 쇼핑 패턴을 분석할 수 있습니다`,
        gender_analysis: `datalab_shopping_by_gender 도구로 성별 쇼핑 패턴을 분석할 수 있습니다`,
        device_analysis: `datalab_shopping_by_device 도구로 디바이스별 쇼핑 패턴을 분석할 수 있습니다`
      }
    };
    
    // 검색어와 정확히 일치한 분류가 자체 코드 없이 하위 분류로만 나오면 그 사실을 알린다.
    // 알리지 않으면 하위 분류 하나의 코드를 검색한 분류 전체로 오해해 분석하게 된다.
    const top = results[0];
    if (top.isSubcategory && top.matchedValue.toLowerCase() === query.toLowerCase().trim()) {
      const depth = ['대분류', '중분류', '소분류', '세분류'].indexOf(top.matchedLevel) + 1;
      const path = [top.level1, top.level2, top.level3, top.level4].slice(0, depth).join(' > ');
      const parentCode = (await loadCategoryData()).find(
        c => c.level1 === top.level1 && !c.level2
      )?.code;
      responseData.note =
        `현재 데이터에는 "${path}" 경로 자체의 카테고리 코드가 없습니다. ` +
        `이 경로 아래의 검색 결과는 각각 개별 하위 분류를 가리킵니다.` +
        (parentCode && top.matchedLevel !== '대분류'
          ? ` 더 넓은 범위가 필요하면 대분류 코드 ${parentCode}(${top.level1})도 사용할 수 있습니다.`
          : '');
    }
    
    return responseData;
  } catch (error: any) {
    throw new Error(`카테고리 검색 중 오류 발생: ${error.message}`);
  }
};

export const categoryToolHandlers: Record<string, (args: any) => Promise<any>> = {
  find_category: findCategoryHandler,
};
