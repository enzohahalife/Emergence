import { RSWEntry } from '../types';

// 从Notion数据库导出的真实数据作为缓存
// 最后更新时间: 2026-01-30T18:42:25.919Z
// 数据条数: 4
export const FALLBACK_ENTRIES: RSWEntry[] = [
  {
    "id": 4,
    "url": "https://www.notion.so/enzohahalife/TypeScript-5-0-Release-2efa710dca428193898ef786548bd528?v=2efa710dca4281969c64000c9ae3713f&source=copy_link",
    "title": "重新理解你我",
    "content": null,
    "screenshot": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "og_image": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "publication_date": "2024-01-05",
    "author_name": "enzowei",
    "author_twitter_screen_name": null,
    "recommender_name": null,
    "recommender_twitter_screen_name": null,
    "gradient_start": null,
    "gradient_end": null,
    "seo_title": "品牌运营操作体系",
    "seo_description": "这是一本人生答案书",
    "keywords": [
      "人生答案",
      "快消品品牌"
    ]
  },
  {
    "id": 3,
    "url": "https://www.notion.so/enzohahalife/TypeScript-5-0-Release-2efa710dca428193898ef786548bd528?v=2efa710dca4281969c64000c9ae3713f&source=copy_link",
    "title": "重新理解得失",
    "content": null,
    "screenshot": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "og_image": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "publication_date": "2024-01-05",
    "author_name": "enzo",
    "author_twitter_screen_name": null,
    "recommender_name": null,
    "recommender_twitter_screen_name": null,
    "gradient_start": null,
    "gradient_end": null,
    "seo_title": "新品牌搭建指南",
    "seo_description": "x新品牌体系",
    "keywords": [
      "品牌",
      "新品牌"
    ]
  },
  {
    "id": 2,
    "url": "https://www.notion.so/enzohahalife/TypeScript-5-0-Release-2efa710dca428193898ef786548bd528?v=2efa710dca4281969c64000c9ae3713f&source=copy_link",
    "title": "重新理解人心",
    "content": null,
    "screenshot": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "og_image": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "publication_date": "2024-01-05",
    "author_name": "eenzowei",
    "author_twitter_screen_name": null,
    "recommender_name": null,
    "recommender_twitter_screen_name": null,
    "gradient_start": null,
    "gradient_end": null,
    "seo_title": "本品牌体系搭建",
    "seo_description": "pinput体系",
    "keywords": [
      "品牌"
    ]
  },
  {
    "id": 1,
    "url": "https://www.notion.so/enzohahalife/TypeScript-5-0-Release-2efa710dca428193898ef786548bd528?v=2efa710dca4281969c64000c9ae3713f&source=copy_link",
    "title": "重新开始读书",
    "content": null,
    "screenshot": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "og_image": "https://prod-files-secure.s3.us-west-2.amazonaws.com/60b56b43-a9ff-4fea-a8df-ef6fc288b8c1/f892140b-6a35-40a3-8ee6-fc149a2b5f81/333.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRNT2E4F%2F20260130%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260130T184225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjC6UGDdb9Y2AumMQLAPmF0fsql3BDPsYuh8yyra%2BaYAiBzF2hj1%2F0ZMyEhv120TFz4MKY%2FE1Nn1rofkPfV80GBriqIBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqI6bEyg6GF%2Fd5gM6KtwDIhCughCbQ60t8LL4czUm%2BxPdjn0Q2taQIjfhJvgRPofxdYDPaL8Y26kPW0oCBIsK4bT4uHAA2fV8QJQYBNqa8c37EUZz3yZUdO4FyoRHcCxrZHhQ30k1QKz8ySOV32jCspJx7aeMl5W4OMbQBLfcLCbBK854FxudUzENTYl%2BRPYVLww%2B1%2BHlLm2x6eb6Kj8POPP9czA58a5cSNJO454V0Pe0spjiT1Nd0S%2BZ9Vbqt9rvtHPrTlVGk6Wpcd%2ByT3dkHBaD3PSjgsVYF79Z1bgFEJEMWnAl91D7%2BmdqJ4RGLFDNwTQ%2FMqB5ZkVZ2fIOeyj%2BvXLpU3o8Ik1Vtqmdgz0WgR5z4TGBb3IWkq73%2F6kiDhQ5rhzhmTPnEyaFWWABhnckwQnDRFCMpH9lQAGKHiUGcCuVEHD1FuYUE0EdnU2g7Btu7fu4Fep3Rt%2FEdqEyqq%2F8PyGvCr3pfDUWEDYsZSH%2F%2B%2BoxCYBnGJO0yvc6VVJrLlWPYBu9CN7Dmu20%2FqUR6fe%2Fhzmocp073ZdfEggP%2F2a60LY1tGgpPnlYVEF95m7pGWxULi1Ct64NukPjN6I7egsYB2deCNcJylfsGsIXJsFk9nITrkpgcJTcHRFhIFZbPDBkuE31DWD6DC7xgG8wv%2BzzywY6pgFoJXjrBQL282bQoyJ6lYp2xcIT8abTwe1ZGXQkeCgIC4%2Fx%2FX%2BmEB9BiCrc8S4%2FFl1KrFQzvWamDsMfYYtAT05ClZetckoIe3vdXn2FlrDSJO9cgffqhh3%2BmTCrDVHIJlKxOf0ZrfeQWnudHTDjh7L9q%2F4cfwvOSoohPnlEVpMd%2BrrMpy%2BhYeJW4Q2wRsDXRGop4jrZhwmNCXGdHGwR0G9uiBqZ%2FlRp&X-Amz-Signature=6ecb9ce90add22ba00a58e7cbd1de94ef4f489121baba708e68928c0e34517cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "publication_date": "2024-01-05",
    "author_name": "enzo",
    "author_twitter_screen_name": null,
    "recommender_name": null,
    "recommender_twitter_screen_name": null,
    "gradient_start": null,
    "gradient_end": null,
    "seo_title": "b本文最快分析",
    "seo_description": "如何构建品牌体系",
    "keywords": [
      "新品牌",
      "快消品品牌"
    ]
  }
];