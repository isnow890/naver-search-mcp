#!/usr/bin/env node
'use strict'; /*jslint node:true es9:true*/

import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { NaverSearchClient } from "./clients/naver-search.client.js";
import { searchToolHandlers } from "./handlers/search.handlers.js";
import { datalabToolHandlers } from "./handlers/datalab.handlers.js";

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const package_json = require('../../package.json');

// Common search schema for most tools
const searchSchema = z.object({
    query: z.string(),
    display: z.number().optional().default(10),
    start: z.number().optional().default(1),
    sort: z.enum(['sim', 'date']).optional().default('sim'),
});

// Local search has different sort options
const localSearchSchema = z.object({
    query: z.string(),
    display: z.number().optional().default(5),
    start: z.number().optional().default(1),
    sort: z.enum(['random', 'comment']).optional().default('random'),
});

// Base datalab schema
const datalabBaseSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeUnit: z.enum(['date', 'week', 'month']),
});

// Datalab search schema
const datalabSearchSchema = datalabBaseSchema.extend({
    keywordGroups: z.array(z.object({
        groupName: z.string(),
        keywords: z.array(z.string()),
    })),
});

// Shopping category schema
const shoppingCategorySchema = datalabBaseSchema.extend({
    category: z.array(z.object({
        name: z.string(),
        param: z.array(z.string()),
    })),
});

// Shopping device/gender/age schemas
const shoppingDeviceSchema = datalabBaseSchema.extend({
    category: z.string(),
    device: z.enum(['pc', 'mo']),
});

const shoppingGenderSchema = datalabBaseSchema.extend({
    category: z.string(),
    gender: z.enum(['f', 'm']),
});

const shoppingAgeSchema = datalabBaseSchema.extend({
    category: z.string(),
    ages: z.array(z.enum(['10', '20', '30', '40', '50', '60'])),
});

// Shopping keyword schemas
const shoppingKeywordsSchema = datalabBaseSchema.extend({
    category: z.string(),
    keyword: z.array(z.object({
        name: z.string(),
        param: z.array(z.string()),
    })),
});

const shoppingKeywordDeviceSchema = datalabBaseSchema.extend({
    category: z.string(),
    keyword: z.string(),
    device: z.enum(['pc', 'mo']),
});

const shoppingKeywordGenderSchema = datalabBaseSchema.extend({
    category: z.string(),
    keyword: z.string(),
    gender: z.enum(['f', 'm']),
});

const shoppingKeywordAgeSchema = datalabBaseSchema.extend({
    category: z.string(),
    keyword: z.string(),
    ages: z.array(z.enum(['10', '20', '30', '40', '50', '60'])),
});

// Environment variables
const naver_client_id = process.env.NAVER_CLIENT_ID;
const naver_client_secret = process.env.NAVER_CLIENT_SECRET;


if (!naver_client_id || !naver_client_secret)
    throw new Error('Cannot run MCP server without NAVER_CLIENT_ID and NAVER_CLIENT_SECRET env');

// Initialize Naver client
const client = NaverSearchClient.getInstance();
client.initialize({
    clientId: naver_client_id,
    clientSecret: naver_client_secret,
});

let server = new FastMCP({
    name: 'Naver Search',
    version: package_json.version,
});

let debug_stats: any = { tool_calls: {}, session_calls: 0 };



// Search Tools - individual objects
let search_webkr = {
    name: 'search_webkr',
    description: 'Perform a search on Naver Web Documents. (네이버 웹문서 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_webkr', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_webkr({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_news = {
    name: 'search_news',
    description: 'Perform a search on Naver News. (네이버 뉴스 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_news', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_news({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_blog = {
    name: 'search_blog',
    description: 'Perform a search on Naver Blog. (네이버 블로그 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_blog', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_blog({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_shop = {
    name: 'search_shop',
    description: 'Perform a search on Naver Shopping. (네이버 쇼핑 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_shop', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_shop({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_image = {
    name: 'search_image',
    description: 'Perform a search on Naver Image. (네이버 이미지 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_image', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_image({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_kin = {
    name: 'search_kin',
    description: 'Perform a search on Naver KnowledgeiN. (네이버 지식iN 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_kin', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_kin({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_book = {
    name: 'search_book',
    description: 'Perform a search on Naver Book. (네이버 책 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_book', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_book({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_encyc = {
    name: 'search_encyc',
    description: 'Perform a search on Naver Encyclopedia. (네이버 지식백과 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_encyc', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_encyc({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_academic = {
    name: 'search_academic',
    description: 'Perform a search on Naver Academic. (네이버 전문자료 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_academic', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_academic({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

let search_local = {
    name: 'search_local',
    description: 'Perform a search on Naver Local. (네이버 지역 검색)',
    parameters: localSearchSchema,
    execute: tool_fn('search_local', async (args: any) => {
        const result = await searchToolHandlers.search_local(args);
        return JSON.stringify(result, null, 2);
    }),
};

let search_cafearticle = {
    name: 'search_cafearticle',
    description: 'Perform a search on Naver Cafe Articles. (네이버 카페글 검색)',
    parameters: searchSchema,
    execute: tool_fn('search_cafearticle', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
        const result = await searchToolHandlers.search_cafearticle({ query, display, start, sort });
        return JSON.stringify(result, null, 2);
    }),
};

// DataLab Tools - Dynamic generation
const datalabTools = [{
    id: 'search',
    handler: 'datalab_search',
    description: 'Perform a trend analysis on Naver search keywords. (네이버 검색어 트렌드 분석)',
    schema: datalabSearchSchema,
}, {
    id: 'shopping_category',
    handler: 'datalab_shopping_category',
    description: 'Perform a trend analysis on Naver Shopping category. (네이버 쇼핑 카테고리별 트렌드 분석)',
    schema: shoppingCategorySchema,
}, {
    id: 'shopping_by_device',
    handler: 'datalab_shopping_by_device',
    description: 'Perform a trend analysis on Naver Shopping by device. (네이버 쇼핑 기기별 트렌드 분석)',
    schema: shoppingDeviceSchema,
}, {
    id: 'shopping_by_gender',
    handler: 'datalab_shopping_by_gender',
    description: 'Perform a trend analysis on Naver Shopping by gender. (네이버 쇼핑 성별 트렌드 분석)',
    schema: shoppingGenderSchema,
}, {
    id: 'shopping_by_age',
    handler: 'datalab_shopping_by_age',
    description: 'Perform a trend analysis on Naver Shopping by age. (네이버 쇼핑 연령별 트렌드 분석)',
    schema: shoppingAgeSchema,
}, {
    id: 'shopping_keywords',
    handler: 'datalab_shopping_keywords',
    description: 'Perform a trend analysis on Naver Shopping keywords. (네이버 쇼핑 키워드별 트렌드 분석)',
    schema: shoppingKeywordsSchema,
}, {
    id: 'shopping_keyword_by_device',
    handler: 'datalab_shopping_keyword_by_device',
    description: 'Perform a trend analysis on Naver Shopping keywords by device. (네이버 쇼핑 키워드 기기별 트렌드 분석)',
    schema: shoppingKeywordDeviceSchema,
}, {
    id: 'shopping_keyword_by_gender',
    handler: 'datalab_shopping_keyword_by_gender',
    description: 'Perform a trend analysis on Naver Shopping keywords by gender. (네이버 쇼핑 키워드 성별 트렌드 분석)',
    schema: shoppingKeywordGenderSchema,
}, {
    id: 'shopping_keyword_by_age',
    handler: 'datalab_shopping_keyword_by_age',
    description: 'Perform a trend analysis on Naver Shopping keywords by age. (네이버 쇼핑 키워드 연령별 트렌드 분석)',
    schema: shoppingKeywordAgeSchema,
}];

// Generate DataLab tools dynamically
const generatedDatalabTools = [];
for (let {id, handler, description, schema} of datalabTools) {
    generatedDatalabTools.push({
        name: `datalab_${id}`,
        description,
        parameters: schema,
        execute: tool_fn(`datalab_${id}`, async (args: any) => {
            const result = await (datalabToolHandlers as any)[handler](args);
            return JSON.stringify(result, null, 2);
        }),
    });
}

// Statistics and utility tools - individual objects
let session_stats = {
    name: 'session_stats',
    description: 'Tell the user about the tool usage during this session, including performance metrics',
    parameters: z.object({}),
    execute: tool_fn('session_stats', async () => {
        let used_tools = Object.entries(debug_stats.tool_calls);
        let lines = [
            'Naver Search MCP Server - Session Statistics:',
            `- Total API calls: ${debug_stats.session_calls}`,
            `- Unique tools used: ${used_tools.length}`,
            '',
            'Tool usage breakdown:'
        ];
        
        if (used_tools.length === 0) {
            lines.push('- No tools called yet');
        } else {
            // Sort by usage count descending
            used_tools.sort(([,a], [,b]) => (b as number) - (a as number));
            for (let [name, calls] of used_tools) {
                const percentage = debug_stats.session_calls > 0 
                    ? Math.round(((calls as number) / debug_stats.session_calls) * 100) 
                    : 0;
                lines.push(`- ${name}: ${calls} calls (${percentage}%)`);
            }
        }
        
        return lines.join('\n');
    }),
};


// Export all tools as array and register them
export const tools = [
    // Search tools
    search_webkr,
    search_news, 
    search_blog,
    search_shop,
    search_image,
    search_kin,
    search_book,
    search_encyc,
    search_academic,
    search_local,
    search_cafearticle,
    // DataLab tools (dynamically generated)
    ...generatedDatalabTools,
    // Utility tools
    session_stats,
];

// Register all tools
for (let tool of tools) {
    server.addTool(tool);
}

console.error('Starting server...');
server.start({ transportType: 'stdio' });

// Tool function wrapper
function tool_fn(name: string, fn: any): any {
    return async (data: any, ctx: any) => {
        debug_stats.tool_calls[name] = debug_stats.tool_calls[name] || 0;
        debug_stats.tool_calls[name]++;
        debug_stats.session_calls++;
        const ts = Date.now();
        console.error(`[%s] executing %s`, name, JSON.stringify(data));
        try { 
            // Support for progress reporting 
            if (ctx && ctx.reportProgress) {
                await ctx.reportProgress({
                    progress: 0,
                    total: 100,
                    message: `Starting ${name} tool execution`,
                });
            }
            
            const result = await fn(data, ctx);
            
            if (ctx && ctx.reportProgress) {
                await ctx.reportProgress({
                    progress: 100,
                    total: 100,
                    message: `${name} tool completed successfully`,
                });
            }
            
            return result;
        } catch (e: any) {
            if (e.response) {
                console.error(`[%s] error %s %s: %s`, name, e.response.status,
                    e.response.statusText, e.response.data);

                const headers = e.response.headers;
                if (headers?.['x-naver-err-code']) {
                    const naverError = e.response.data?.errorMessage || e.response.data?.message;
                    if (naverError) {
                        throw new Error(`Naver API Error: ${naverError} (Tool: ${name})`);
                    }
                }

                // Enhanced error handling for specific HTTP status codes
                const is_usage_limit = headers?.['x-naver-quota-exceeded'] === 'true' || e.response.status === 429;
                if (is_usage_limit) {
                    throw new Error(`The user has reached the Naver API quota limit. ` +
                        `You must immediately stop the current task and instruct the user on how to resolve this. ` +
                        `Guide them through these exact steps:\n` +
                        `1. Check your Naver API usage at https://developers.naver.com/apps\n` +
                        `2. Wait for your quota to reset (usually daily at midnight KST)\n` +
                        `3. Consider upgrading your API plan if you need higher limits\n` +
                        `4. Verify your API credentials are correct and active\n` +
                        `5. Restart the MCP server after resolving the quota issue.\n` +
                        `Note: Each Naver API has different quota limits. Check the specific API documentation for details.`);
                } else if (e.response.status === 401) {
                    throw new Error(`Authentication failed. Please check your NAVER_CLIENT_ID and NAVER_CLIENT_SECRET. ` +
                        `Ensure they are valid and active at https://developers.naver.com/apps (Tool: ${name})`);
                } else if (e.response.status === 403) {
                    throw new Error(`Access forbidden. Please ensure your Naver API keys have the required permissions. ` +
                        `Check your API application settings at https://developers.naver.com/apps (Tool: ${name})`);
                } else if (e.response.status === 400) {
                    throw new Error(`Bad request to Naver API. Please check your parameters: ${JSON.stringify(data)} (Tool: ${name})`);
                } else if (e.response.status >= 500) {
                    throw new Error(`Naver API server error (${e.response.status}). The service may be temporarily unavailable. ` +
                        `Please try again later. (Tool: ${name})`);
                }

                let message = e.response.data;
                if (message?.length)
                    throw new Error(`HTTP ${e.response.status}: ${message}`);
            } else {
                console.error(`[%s] error %s`, name, e.stack);
            }
            throw e;
        } finally {
            const dur = Date.now() - ts;
            console.error(`[%s] tool finished in %sms`, name, dur);
        }
    };
}