#!/usr/bin/env node
'use strict'; /*jslint node:true es9:true*/

import { FastMCP } from 'fastmcp';
import { NaverSearchClient } from "./clients/naver-search.client.js";
import { createSearchTools } from "./tools/search.tools.js";
import { createDatalabTools } from "./tools/datalab.tools.js";
import { createUtilityTools } from "./tools/utility.tools.js";
import { createCategoryTools } from "./tools/category.tools.js";

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Bundle-safe way to get package.json
let package_json: any;
try {
  if (typeof import.meta.url !== 'undefined') {
    const require = createRequire(import.meta.url);
    package_json = require('../../package.json');
  } else {
    // Fallback for bundled environments
    package_json = { version: '1.0.4' };
  }
} catch {
  // Fallback if package.json can't be loaded
  package_json = { version: '1.0.4' };
}

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

// Create all tools using the modular structure
const searchTools = createSearchTools(tool_fn);
const datalabTools = createDatalabTools(tool_fn);
const utilityTools = createUtilityTools(tool_fn, debug_stats);
const categoryTools = createCategoryTools(tool_fn);

// Export all tools as array
export const tools = [
    ...searchTools,
    ...datalabTools,
    ...utilityTools,
    ...categoryTools,
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