import type { LogEntry } from "./types";

// Helper function to generate a random IP address
function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
    ".",
  );
}

// Helper function to generate a random date within the last 30 days
function generateRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime =
    thirtyDaysAgo.getTime() +
    Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString();
}

// Helper function to generate a random URL
function generateRandomURL() {
  const paths = [
    "/",
    "/about",
    "/contact",
    "/products",
    "/services",
    "/blog",
    "/blog/post-1",
    "/blog/post-2",
    "/api/users",
    "/api/products",
    "/images/banner.jpg",
    "/images/logo.png",
    "/css/styles.css",
    "/js/main.js",
    "/login",
    "/register",
    "/dashboard",
    "/profile",
    "/settings",
    "/checkout",
  ];

  return paths[Math.floor(Math.random() * paths.length)];
}

// Helper function to generate a random status code
function generateRandomStatusCode() {
  const statusCodes = [
    // 2xx - Success
    200, 201, 204,
    // 3xx - Redirection
    301, 302, 304,
    // 4xx - Client Error
    400, 401, 403, 404, 429,
    // 5xx - Server Error
    500, 502, 503,
  ];

  // Weight towards successful responses
  const weights = [
    70, // 200
    5, // 201
    5, // 204
    5, // 301
    5, // 302
    5, // 304
    1, // 400
    1, // 401
    1, // 403
    5, // 404
    1, // 429
    1, // 500
    1, // 502
    1, // 503
  ];

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < statusCodes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return statusCodes[i];
    }
  }

  return 200; // Default fallback
}

// Helper function to generate a random user agent
function generateRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Helper function to determine bot type from user agent
function getBotTypeFromUserAgent(userAgent: string) {
  if (userAgent.includes("Googlebot")) return "Googlebot";
  if (userAgent.includes("Bingbot")) return "Bingbot";
  if (userAgent.includes("YandexBot")) return "YandexBot";
  if (userAgent.includes("AhrefsBot")) return "AhrefsBot";
  return null;
}

// Helper function to determine content type from URL
function getContentTypeFromURL(url: string) {
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "jpg";
  if (url.endsWith(".png")) return "png";
  if (url.endsWith(".webp")) return "webp";
  if (url.endsWith(".css")) return "css";
  if (url.endsWith(".js")) return "js";
  if (url.endsWith(".php")) return "php";
  if (url.includes("/api/")) return "json";
  return "html";
}

export function generateDummyData(count: number): LogEntry[] {
  return Array.from({ length: count }, () => {
    const userAgent = generateRandomUserAgent();
    const url = generateRandomURL();

    return {
      timestamp: generateRandomDate(),
      ip: generateRandomIP(),
      userAgent,
      url,
      statusCode: generateRandomStatusCode(),
      botType: getBotTypeFromUserAgent(userAgent),
      contentType: getContentTypeFromURL(url),
    };
  });
}

// Add this new function to generate time-series data with patterns
export function generateTimeSeriesData(days = 30) {
  const now = new Date();
  const result = [];

  // Generate data for each day
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Create hourly data for the last day
    if (i === 0) {
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(date);
        hourDate.setHours(hour);

        // Create a traffic pattern with morning and evening peaks
        let requestMultiplier = 1;
        if (hour >= 8 && hour <= 11) requestMultiplier = 2.5; // Morning peak
        if (hour >= 13 && hour <= 17) requestMultiplier = 3; // Afternoon peak
        if (hour >= 19 && hour <= 22) requestMultiplier = 2; // Evening peak
        if (hour >= 0 && hour <= 5) requestMultiplier = 0.3; // Night lull

        const requests =
          Math.floor(Math.random() * 50 * requestMultiplier) + 10;
        const errors = Math.floor(Math.random() * (requests * 0.1)); // ~10% error rate
        const bots = Math.floor(Math.random() * (requests * 0.15)); // ~15% bot traffic

        result.push({
          time: hourDate.toISOString(),
          requests,
          errors,
          bots,
        });
      }
    } else {
      // Create daily data for previous days
      // Add some weekly patterns (weekends have less traffic)
      const dayOfWeek = date.getDay();
      let dayMultiplier = 1;
      if (dayOfWeek === 0 || dayOfWeek === 6) dayMultiplier = 0.7; // Weekend

      // Add some randomness but maintain a general trend
      const baseRequests = 500 + Math.floor(Math.random() * 300);
      const requests = Math.floor(baseRequests * dayMultiplier);
      const errors = Math.floor(Math.random() * (requests * 0.08)); // ~8% error rate
      const bots = Math.floor(Math.random() * (requests * 0.2)); // ~20% bot traffic

      result.push({
        time: date.toISOString(),
        requests,
        errors,
        bots,
      });
    }
  }

  return result;
}

// Add this function to generate status code distribution
export function generateStatusCodeDistribution(count = 1000) {
  const distribution = {
    "2xx (Success)": 0,
    "3xx (Redirect)": 0,
    "4xx (Client Error)": 0,
    "5xx (Server Error)": 0,
  };

  for (let i = 0; i < count; i++) {
    const statusCode = generateRandomStatusCode();
    if (statusCode >= 200 && statusCode < 300) {
      distribution["2xx (Success)"]++;
    } else if (statusCode >= 300 && statusCode < 400) {
      distribution["3xx (Redirect)"]++;
    } else if (statusCode >= 400 && statusCode < 500) {
      distribution["4xx (Client Error)"]++;
    } else if (statusCode >= 500) {
      distribution["5xx (Server Error)"]++;
    }
  }

  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

// Add this function to generate content type distribution
export function generateContentTypeDistribution(count = 1000) {
  const contentTypes = {
    html: 0,
    json: 0,
    jpg: 0,
    png: 0,
    css: 0,
    js: 0,
    webp: 0,
    php: 0,
  };

  // Set realistic distribution
  const weights = {
    html: 45,
    json: 20,
    jpg: 15,
    png: 8,
    css: 5,
    js: 5,
    webp: 1,
    php: 1,
  };

  for (let i = 0; i < count; i++) {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;

    for (const [type, weight] of Object.entries(weights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        contentTypes[type]++;
        break;
      }
    }
  }

  return Object.entries(contentTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
