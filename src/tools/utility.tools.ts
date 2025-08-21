import { z } from 'zod';

// Tool function wrapper type
type ToolFunction = (name: string, fn: any) => any;

export function createUtilityTools(tool_fn: ToolFunction, debug_stats: any) {
    return [
        {
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
        }
    ];
}