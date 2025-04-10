// Sample log data for demonstration
const sampleLogData = [
  // Morning hours - mostly HTML and CSS, some bots
  {
    ip: "192.168.1.1",
    timestamp: new Date("2023-04-10T08:00:00"),
    method: "GET",
    path: "/index.html",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://google.com",
    fileType: "html",
  },
  {
    ip: "192.168.1.2",
    timestamp: new Date("2023-04-10T08:15:00"),
    method: "GET",
    path: "/about",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com",
    fileType: "html",
  },
  {
    ip: "192.168.1.3",
    timestamp: new Date("2023-04-10T08:30:00"),
    method: "GET",
    path: "/styles.css",
    statusCode: 200,
    size: 512,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "css",
  },
  {
    ip: "192.168.1.9",
    timestamp: new Date("2023-04-10T08:45:00"),
    method: "GET",
    path: "/robots.txt",
    statusCode: 200,
    size: 128,
    userAgent: "Googlebot/2.1",
    referer: "",
    fileType: "txt",
  },

  // Mid-morning - mix of content types
  {
    ip: "192.168.1.4",
    timestamp: new Date("2023-04-10T10:00:00"),
    method: "GET",
    path: "/api/data",
    statusCode: 404,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/about",
    fileType: "api",
  },
  {
    ip: "192.168.1.5",
    timestamp: new Date("2023-04-10T10:15:00"),
    method: "POST",
    path: "/login",
    statusCode: 401,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/login",
    fileType: "html",
  },
  {
    ip: "192.168.1.6",
    timestamp: new Date("2023-04-10T10:30:00"),
    method: "GET",
    path: "/images/logo.png",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "image",
  },
  {
    ip: "192.168.1.7",
    timestamp: new Date("2023-04-10T10:45:00"),
    method: "GET",
    path: "/scripts.js",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "js",
  },

  // Noon - peak traffic time
  {
    ip: "192.168.1.8",
    timestamp: new Date("2023-04-10T12:00:00"),
    method: "GET",
    path: "/api/users",
    statusCode: 500,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/admin",
    fileType: "api",
  },
  {
    ip: "192.168.1.10",
    timestamp: new Date("2023-04-10T12:15:00"),
    method: "GET",
    path: "/sitemap.xml",
    statusCode: 200,
    size: 2048,
    userAgent: "Bingbot/2.0",
    referer: "",
    fileType: "xml",
  },
  {
    ip: "192.168.1.11",
    timestamp: new Date("2023-04-10T12:30:00"),
    method: "GET",
    path: "/index.html",
    statusCode: 304,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://google.com",
    fileType: "html",
  },
  {
    ip: "192.168.1.12",
    timestamp: new Date("2023-04-10T12:45:00"),
    method: "GET",
    path: "/products",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "html",
  },

  // Afternoon - more API and image traffic
  {
    ip: "192.168.1.13",
    timestamp: new Date("2023-04-10T14:00:00"),
    method: "GET",
    path: "/products/1",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products",
    fileType: "html",
  },
  {
    ip: "192.168.1.14",
    timestamp: new Date("2023-04-10T14:15:00"),
    method: "GET",
    path: "/favicon.ico",
    statusCode: 404,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products/1",
    fileType: "ico",
  },
  {
    ip: "192.168.1.15",
    timestamp: new Date("2023-04-10T14:30:00"),
    method: "GET",
    path: "/images/product1.jpg",
    statusCode: 200,
    size: 8192,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products/1",
    fileType: "image",
  },
  {
    ip: "192.168.1.16",
    timestamp: new Date("2023-04-10T14:45:00"),
    method: "GET",
    path: "/api/products/1",
    statusCode: 200,
    size: 512,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products/1",
    fileType: "api",
  },

  // Late afternoon - blog traffic
  {
    ip: "192.168.1.17",
    timestamp: new Date("2023-04-10T16:00:00"),
    method: "GET",
    path: "/contact",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products/1",
    fileType: "html",
  },
  {
    ip: "192.168.1.18",
    timestamp: new Date("2023-04-10T16:15:00"),
    method: "POST",
    path: "/contact/submit",
    statusCode: 302,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/contact",
    fileType: "html",
  },
  {
    ip: "192.168.1.19",
    timestamp: new Date("2023-04-10T16:30:00"),
    method: "GET",
    path: "/thank-you",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/contact/submit",
    fileType: "html",
  },
  {
    ip: "192.168.1.20",
    timestamp: new Date("2023-04-10T16:45:00"),
    method: "GET",
    path: "/blog",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "html",
  },

  // Evening - more blog and resource traffic, bot activity increases
  {
    ip: "192.168.1.21",
    timestamp: new Date("2023-04-10T18:00:00"),
    method: "GET",
    path: "/blog/post1",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog",
    fileType: "html",
  },
  {
    ip: "192.168.1.22",
    timestamp: new Date("2023-04-10T18:15:00"),
    method: "GET",
    path: "/images/blog1.jpg",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog/post1",
    fileType: "image",
  },
  {
    ip: "192.168.1.23",
    timestamp: new Date("2023-04-10T18:30:00"),
    method: "GET",
    path: "/blog/post2",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog",
    fileType: "html",
  },
  {
    ip: "192.168.1.24",
    timestamp: new Date("2023-04-10T18:45:00"),
    method: "GET",
    path: "/images/blog2.jpg",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog/post2",
    fileType: "image",
  },

  // Night - API and resource downloads, more bot activity
  {
    ip: "192.168.1.25",
    timestamp: new Date("2023-04-10T20:00:00"),
    method: "GET",
    path: "/api/comments/post2",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog/post2",
    fileType: "api",
  },
  {
    ip: "192.168.1.26",
    timestamp: new Date("2023-04-10T20:15:00"),
    method: "POST",
    path: "/api/comments/post2",
    statusCode: 201,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog/post2",
    fileType: "api",
  },
  {
    ip: "192.168.1.27",
    timestamp: new Date("2023-04-10T20:30:00"),
    method: "GET",
    path: "/download/whitepaper.pdf",
    statusCode: 200,
    size: 10240,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/resources",
    fileType: "pdf",
  },
  {
    ip: "192.168.1.28",
    timestamp: new Date("2023-04-10T20:45:00"),
    method: "GET",
    path: "/resources",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "html",
  },

  // Late night - mostly bots
  {
    ip: "192.168.1.29",
    timestamp: new Date("2023-04-10T22:00:00"),
    method: "GET",
    path: "/download/brochure.pdf",
    statusCode: 200,
    size: 8192,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/resources",
    fileType: "pdf",
  },
  {
    ip: "192.168.1.30",
    timestamp: new Date("2023-04-10T22:15:00"),
    method: "GET",
    path: "/",
    statusCode: 200,
    size: 1024,
    userAgent: "YandexBot/3.0",
    referer: "",
    fileType: "html",
  },

  // Next day - early morning
  {
    ip: "192.168.1.31",
    timestamp: new Date("2023-04-11T06:00:00"),
    method: "GET",
    path: "/sitemap.xml",
    statusCode: 200,
    size: 2048,
    userAgent: "Googlebot/2.1",
    referer: "",
    fileType: "xml",
  },
  {
    ip: "192.168.1.32",
    timestamp: new Date("2023-04-11T07:00:00"),
    method: "GET",
    path: "/robots.txt",
    statusCode: 200,
    size: 128,
    userAgent: "Bingbot/2.0",
    referer: "",
    fileType: "txt",
  },

  // Next day - morning
  {
    ip: "192.168.1.33",
    timestamp: new Date("2023-04-11T09:00:00"),
    method: "GET",
    path: "/index.html",
    statusCode: 200,
    size: 1024,
    userAgent: "Mozilla/5.0",
    referer: "https://google.com",
    fileType: "html",
  },
  {
    ip: "192.168.1.34",
    timestamp: new Date("2023-04-11T10:00:00"),
    method: "GET",
    path: "/about",
    statusCode: 200,
    size: 2048,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com",
    fileType: "html",
  },

  // Next day - afternoon
  {
    ip: "192.168.1.35",
    timestamp: new Date("2023-04-11T14:00:00"),
    method: "GET",
    path: "/products",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "html",
  },
  {
    ip: "192.168.1.36",
    timestamp: new Date("2023-04-11T15:00:00"),
    method: "GET",
    path: "/images/product2.jpg",
    statusCode: 200,
    size: 8192,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/products",
    fileType: "image",
  },

  // Next day - evening
  {
    ip: "192.168.1.37",
    timestamp: new Date("2023-04-11T18:00:00"),
    method: "GET",
    path: "/blog",
    statusCode: 200,
    size: 4096,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/index.html",
    fileType: "html",
  },
  {
    ip: "192.168.1.38",
    timestamp: new Date("2023-04-11T20:00:00"),
    method: "GET",
    path: "/api/newsletter/subscribe",
    statusCode: 201,
    size: 0,
    userAgent: "Mozilla/5.0",
    referer: "https://example.com/blog",
    fileType: "api",
  },
];

export default sampleLogData;
