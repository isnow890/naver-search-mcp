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
    description: 'Perform a trend analysis on Naver Shopping category. (네이버 쇼핑 카테고리별 트렌드 분석)',
    schema: DatalabShoppingSchema,
}, {
    id: 'shopping_by_device',
    handler: 'datalab_shopping_by_device',
    description: 'Perform a trend analysis on Naver Shopping by device. (네이버 쇼핑 기기별 트렌드 분석)',
    schema: DatalabShoppingDeviceSchema,
}, {
    id: 'shopping_by_gender',
    handler: 'datalab_shopping_by_gender',
    description: 'Perform a trend analysis on Naver Shopping by gender. (네이버 쇼핑 성별 트렌드 분석)',
    schema: DatalabShoppingGenderSchema,
}, {
    id: 'shopping_by_age',
    handler: 'datalab_shopping_by_age',
    description: 'Perform a trend analysis on Naver Shopping by age. (네이버 쇼핑 연령별 트렌드 분석)',
    schema: DatalabShoppingAgeSchema,
}, {
    id: 'shopping_keywords',
    handler: 'datalab_shopping_keywords',
    description: 'Perform a trend analysis on Naver Shopping keywords. (네이버 쇼핑 키워드별 트렌드 분석)',
    schema: DatalabShoppingKeywordsSchema,
}, {
    id: 'shopping_keyword_by_device',
    handler: 'datalab_shopping_keyword_by_device',
    description: 'Perform a trend analysis on Naver Shopping keywords by device. (네이버 쇼핑 키워드 기기별 트렌드 분석)',
    schema: DatalabShoppingKeywordDeviceSchema,
}, {
    id: 'shopping_keyword_by_gender',
    handler: 'datalab_shopping_keyword_by_gender',
    description: 'Perform a trend analysis on Naver Shopping keywords by gender. (네이버 쇼핑 키워드 성별 트렌드 분석)',
    schema: DatalabShoppingKeywordGenderSchema,
}, {
    id: 'shopping_keyword_by_age',
    handler: 'datalab_shopping_keyword_by_age',
    description: 'Perform a trend analysis on Naver Shopping keywords by age. (네이버 쇼핑 키워드 연령별 트렌드 분석)',
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