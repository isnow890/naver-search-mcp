import { SearchArgsSchema, NaverLocalSearchParamsSchema } from "../schemas/search.schemas.js";
import { searchToolHandlers } from "../handlers/search.handlers.js";

// Tool function wrapper type
type ToolFunction = (name: string, fn: any) => any;

export function createSearchTools(tool_fn: ToolFunction) {
    return [
        {
            name: 'search_webkr',
            description: 'Perform a search on Naver Web Documents. (네이버 웹문서 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_webkr', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_webkr({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_news',
            description: 'Perform a search on Naver News. (네이버 뉴스 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_news', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_news({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_blog',
            description: 'Perform a search on Naver Blog. (네이버 블로그 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_blog', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_blog({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_shop',
            description: 'Perform a search on Naver Shopping. (네이버 쇼핑 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_shop', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_shop({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_image',
            description: 'Perform a search on Naver Image. (네이버 이미지 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_image', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_image({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_kin',
            description: 'Perform a search on Naver KnowledgeiN. (네이버 지식iN 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_kin', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_kin({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_book',
            description: 'Perform a search on Naver Book. (네이버 책 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_book', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_book({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_encyc',
            description: 'Perform a search on Naver Encyclopedia. (네이버 지식백과 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_encyc', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_encyc({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_academic',
            description: 'Perform a search on Naver Academic. (네이버 전문자료 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_academic', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_academic({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_local',
            description: 'Perform a search on Naver Local. (네이버 지역 검색)',
            parameters: NaverLocalSearchParamsSchema,
            execute: tool_fn('search_local', async (args: any) => {
                const result = await searchToolHandlers.search_local(args);
                return JSON.stringify(result, null, 2);
            }),
        },
        {
            name: 'search_cafearticle',
            description: 'Perform a search on Naver Cafe Articles. (네이버 카페글 검색)',
            parameters: SearchArgsSchema,
            execute: tool_fn('search_cafearticle', async ({ query, display = 10, start = 1, sort = "sim" }: any) => {
                const result = await searchToolHandlers.search_cafearticle({ query, display, start, sort });
                return JSON.stringify(result, null, 2);
            }),
        }
    ];
}