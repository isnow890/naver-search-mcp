import { zodToJsonSchema } from "zod-to-json-schema";
import {
  DatalabShoppingKeywordDeviceSchema,
  DatalabShoppingKeywordGenderSchema,
  DatalabShoppingKeywordAgeSchema,
} from "../schemas/datalab.schemas.js";

/**
 * 데이터랩 관련 도구 정의
 */
export const datalabTools = [
  {
    name: "datalab_unified",
    description: `Analyze multiple Naver Datalab metrics at once.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "results": {
    "search": { /* Search trends results */ },
    "shopping_category": { /* Shopping category trends */ },
    "shopping_by_device": { /* Device usage trends */ },
    "shopping_by_gender": { /* Gender trends */ },
    "shopping_by_age": { /* Age group trends */ },
    "shopping_keywords": { /* Shopping keyword trends */ },
    "shopping_keyword_by_device": { /* Keyword device trends */ },
    "shopping_keyword_by_gender": { /* Keyword gender trends */ },
    "shopping_keyword_by_age": { /* Keyword age trends */ }
  }
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        types: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "search",
              "shopping_category",
              "shopping_by_device",
              "shopping_by_gender",
              "shopping_by_age",
              "shopping_keywords",
              "shopping_keyword_by_device",
              "shopping_keyword_by_gender",
              "shopping_keyword_by_age",
            ],
          },
          description: "Types of analysis to perform",
          default: ["search", "shopping_category"],
        },
        keywordGroups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              groupName: {
                type: "string",
                description: "Name for the keyword group",
              },
              keywords: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of keywords to analyze",
              },
            },
            required: ["groupName", "keywords"],
          },
          description:
            "Groups of keywords to analyze trends for (required for search type)",
        },
        category: {
          type: "string",
          description: "Category code (required for shopping_* types)",
        },
        device: {
          type: "string",
          enum: ["pc", "mo"],
          description:
            "Device type for shopping_by_device and shopping_keyword_by_device analysis",
        },
        gender: {
          type: "string",
          enum: ["f", "m"],
          description:
            "Gender for shopping_by_gender and shopping_keyword_by_gender analysis",
        },
        ages: {
          type: "array",
          items: {
            type: "string",
            enum: ["10", "20", "30", "40", "50", "60"],
          },
          description:
            "Age groups for shopping_by_age and shopping_keyword_by_age analysis",
        },
        keyword: {
          type: "string",
          description: "Single keyword for shopping_keyword_by_* analysis",
        },
      },
      required: ["startDate", "endDate", "timeUnit"],
    },
  },
  {
    name: "datalab_search",
    description: `Analyze search term trends on Naver.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "results": [
    {
      "title": "Group name specified in request",
      "keywords": ["Keywords in this group"],
      "data": [
        {
          "period": "Time period (format depends on timeUnit)",
          "ratio": "Relative search volume (1-100)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        keywordGroups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              groupName: {
                type: "string",
                description: "Name for the keyword group",
              },
              keywords: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of keywords to analyze",
              },
            },
            required: ["groupName", "keywords"],
          },
          description: "Groups of keywords to analyze trends for",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "keywordGroups"],
    },
  },
  {
    name: "datalab_shopping_category",
    description: `Analyze shopping trends by category.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "results": [
    {
      "title": "Category name",
      "category": ["Category codes"],
      "data": [
        {
          "period": "Time period",
          "ratio": "Relative shopping interest (1-100)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        category: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Category name",
              },
              param: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Category codes",
              },
            },
            required: ["name", "param"],
          },
          description: "Shopping categories to analyze",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "category"],
    },
  },
  {
    name: "datalab_shopping_by_device",
    description: `Analyze shopping trends by device type (PC/Mobile).
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "device": "Device type (pc/mo)",
  "results": [
    {
      "category": "Category code",
      "data": [
        {
          "period": "Time period",
          "ratio": "Relative device usage ratio (1-100)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        category: {
          type: "string",
          description: "Category code",
        },
        device: {
          type: "string",
          enum: ["pc", "mo"],
          description: "Device type (pc: PC, mo: Mobile)",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "category", "device"],
    },
  },
  {
    name: "datalab_shopping_by_gender",
    description: `Analyze shopping trends by gender.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "gender": "Gender (f/m)",
  "results": [
    {
      "category": "Category code",
      "data": [
        {
          "period": "Time period",
          "ratio": "Relative gender ratio (1-100)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        category: {
          type: "string",
          description: "Category code",
        },
        gender: {
          type: "string",
          enum: ["f", "m"],
          description: "Gender (f: Female, m: Male)",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "category", "gender"],
    },
  },
  {
    name: "datalab_shopping_by_age",
    description: `Analyze shopping trends by age groups.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "results": [
    {
      "category": "Category code",
      "data": [
        {
          "period": "Time period",
          "ratio": "Relative ratio by age group (1-100)",
          "group": "Age group (10/20/30/40/50/60)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        category: {
          type: "string",
          description: "Category code",
        },
        ages: {
          type: "array",
          items: {
            type: "string",
            enum: ["10", "20", "30", "40", "50", "60"],
          },
          description: "Age groups to analyze",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "category", "ages"],
    },
  },
  {
    name: "datalab_shopping_keywords",
    description: `Analyze shopping keyword trends.
Response format:
{
  "startDate": "Start date of analysis (yyyy-mm-dd)",
  "endDate": "End date of analysis (yyyy-mm-dd)",
  "timeUnit": "Time unit for analysis (date/week/month)",
  "results": [
    {
      "title": "Keyword group name",
      "keywords": ["Keywords in this group"],
      "data": [
        {
          "period": "Time period",
          "ratio": "Relative keyword search ratio (1-100)"
        }
      ]
    }
  ]
}`,
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (yyyy-mm-dd)",
        },
        endDate: {
          type: "string",
          description: "End date (yyyy-mm-dd)",
        },
        timeUnit: {
          type: "string",
          enum: ["date", "week", "month"],
          description: "Time unit for analysis",
        },
        category: {
          type: "string",
          description: "Category code",
        },
        keyword: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Keyword group name",
              },
              param: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Keywords to analyze",
              },
            },
            required: ["name", "param"],
          },
          description: "Groups of keywords to analyze",
        },
      },
      required: ["startDate", "endDate", "timeUnit", "category", "keyword"],
    },
  },
  {
    name: "datalab_shopping_keyword_by_device",
    description:
      "Perform a trend analysis on Naver Shopping keywords by device. (네이버 쇼핑 키워드 기기별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordDeviceSchema),
  },
  {
    name: "datalab_shopping_keyword_by_gender",
    description:
      "Perform a trend analysis on Naver Shopping keywords by gender. (네이버 쇼핑 키워드 성별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordGenderSchema),
  },
  {
    name: "datalab_shopping_keyword_by_age",
    description:
      "Perform a trend analysis on Naver Shopping keywords by age. (네이버 쇼핑 키워드 연령별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordAgeSchema),
  },
];
