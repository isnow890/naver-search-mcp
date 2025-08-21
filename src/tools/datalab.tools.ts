import { z } from 'zod';
import {
    DatalabSearchSchema,
    DatalabShoppingSchema,
    DatalabShoppingDeviceSchema,
    DatalabShoppingGenderSchema,
    DatalabShoppingAgeSchema,
    DatalabShoppingKeywordsSchema,
    DatalabShoppingKeywordDeviceSchema,
    DatalabShoppingKeywordGenderSchema,
    DatalabShoppingKeywordAgeSchema
} from "../schemas/datalab.schemas.js";
import { datalabToolHandlers } from "../handlers/datalab.handlers.js";

// Tool function wrapper type
type ToolFunction = (name: string, fn: any) => any;

// DataLab tool configuration schema
const DatalabToolConfigSchema = z.object({
    id: z.string(),
    handler: z.string(),
    description: z.string(),
    schema: z.any() // Zod schema object
});

const DatalabToolsConfigSchema = z.array(DatalabToolConfigSchema);

type DatalabToolConfig = z.infer<typeof DatalabToolConfigSchema>;

// DataLab tool definitions with Zod schema validation
const datalabToolsConfigRaw = [{
    id: 'search',
    handler: 'datalab_search',
    description: 'Perform a trend analysis on Naver search keywords. (네이버 검색어 트렌드 분석)',
    schema: DatalabSearchSchema,
}, {
    id: 'shopping_category',
    handler: 'datalab_shopping_category',
    description: 'STEP 2: Analyze shopping category trends over time. Use find_category first to get category codes. BUSINESS CASES: Market size analysis, seasonal trend identification, category performance comparison. EXAMPLE: Compare "패션의류" vs "화장품" trends over 6 months. (네이버 쇼핑 카테고리별 트렌드 분석 - 시장 규모, 계절성 분석)',
    schema: DatalabShoppingSchema,
}, {
    id: 'shopping_by_device',
    handler: 'datalab_shopping_by_device',
    description: 'Analyze shopping trends by device (PC vs Mobile). Use find_category first. BUSINESS CASES: Mobile commerce strategy, responsive design priority, device-specific campaigns. EXAMPLE: "PC 사용자가 더 많이 구매하는 카테고리는?" (기기별 쇼핑 트렌드 분석 - 모바일 커머스 전략)',
    schema: DatalabShoppingDeviceSchema,
}, {
    id: 'shopping_by_gender',
    handler: 'datalab_shopping_by_gender',
    description: 'Analyze shopping trends by gender (Male vs Female). Use find_category first. BUSINESS CASES: Gender-targeted marketing, product positioning, demographic analysis. EXAMPLE: "화장품 쇼핑에서 남녀 비율은?" (성별 쇼핑 트렌드 분석 - 타겟 마케팅)',
    schema: DatalabShoppingGenderSchema,
}, {
    id: 'shopping_by_age',
    handler: 'datalab_shopping_by_age',
    description: 'Analyze shopping trends by age groups (10s, 20s, 30s, 40s, 50s, 60s+). Use find_category first. BUSINESS CASES: Age-targeted products, generational preferences, lifecycle marketing. EXAMPLE: "개발 도구는 어느 연령대가 많이 구매하나?" (연령별 쇼핑 트렌드 - 세대별 마케팅)',
    schema: DatalabShoppingAgeSchema,
}, {
    id: 'shopping_keywords',
    handler: 'datalab_shopping_keywords',
    description: 'Compare specific keywords within a shopping category. Use find_category first. BUSINESS CASES: Product keyword optimization, competitor analysis, search trend identification. EXAMPLE: Within "패션" category, compare "원피스" vs "자켓" vs "드레스" trends. (카테고리 내 키워드 비교 - SEO 최적화)',
    schema: DatalabShoppingKeywordsSchema,
}, {
    id: 'shopping_keyword_by_device',
    handler: 'datalab_shopping_keyword_by_device',
    description: 'Perform a trend analysis on Naver Shopping keywords by device. Use find_category tool first to find category codes. (네이버 쇼핑 키워드 기기별 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)',
    schema: DatalabShoppingKeywordDeviceSchema,
}, {
    id: 'shopping_keyword_by_gender',
    handler: 'datalab_shopping_keyword_by_gender',
    description: 'Perform a trend analysis on Naver Shopping keywords by gender. Use find_category tool first to find category codes. (네이버 쇼핑 키워드 성별 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)',
    schema: DatalabShoppingKeywordGenderSchema,
}, {
    id: 'shopping_keyword_by_age',
    handler: 'datalab_shopping_keyword_by_age',
    description: 'Perform a trend analysis on Naver Shopping keywords by age. Use find_category tool first to find category codes. (네이버 쇼핑 키워드 연령별 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)',
    schema: DatalabShoppingKeywordAgeSchema,
}];

// Validate the configuration at startup
const datalabToolsConfig: DatalabToolConfig[] = DatalabToolsConfigSchema.parse(datalabToolsConfigRaw);

export function createDatalabTools(tool_fn: ToolFunction) {
    const tools = [];
    
    for (let {id, handler, description, schema} of datalabToolsConfig) {
        tools.push({
            name: `datalab_${id}`,
            description,
            parameters: schema,
            execute: tool_fn(`datalab_${id}`, async (args: any) => {
                // Validation is handled in the datalab.handlers.ts
                const result = await (datalabToolHandlers as any)[handler](args);
                return JSON.stringify(result, null, 2);
            }),
        });
    }
    
    return tools;
}